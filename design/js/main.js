var $ = require("jquery");
var bootstrap = require("bootstrap");

var projectList = [];

function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseDsn(dsn) {
  var match = dsn.match(/^(.*?\/\/)(.*?):(.*?)@(.*?)(\/.*?)$/);
  var urlPieces = match[5].split(/\?/, 2);
  return {
    scheme: match[1],
    publicKey: match[2],
    secretKey: match[3],
    host: match[4],
    pathSection: match[5],
    // XXX: support path here
    project: parseInt(urlPieces[0].substring(1), 10) || 1,
    query: urlPieces[1] || ''
  };
}

function dsnToHtml(parsedDsn, pub) {
  var auth;
  if (pub) {
    auth = escape(parsedDsn.publicKey);
  } else {
    auth =
      '<span class="dsn-auth" title="Copy paste includes key and secret." data-toggle="tooltip">' +
      escape(parsedDsn.publicKey) + ':' +
      escape(parsedDsn.secretKey) + '</span>';
  }

  return '<span class="dsn">' +
    escape(parsedDsn.scheme) +
    auth + '@' +
    escape(parsedDsn.host) +
    escape(parsedDsn.pathSection) +
  '</span>';
}

function tagDsnBlocks(parent) {
  parent.find('div.highlight pre').each(function() {
    var hasVariables = /___(DSN|PUBLIC_DSN|PUBLIC_KEY|SECRET_KEY|API_URL|PROJECT_ID)___/g.test(this.innerHTML);
    if (!hasVariables) {
      return;
    }
    var contents = this.innerHTML.replace(/___(DSN|PUBLIC_DSN|PUBLIC_KEY|SECRET_KEY|API_URL|PROJECT_ID)___/g, function(match) {
      if (match === '___DSN___') {
        return '<span class="rewrite-dsn" data-value="dsn">' + match + '</span>';
      } else if (match === '___PUBLIC_DSN___') {
        return '<span class="rewrite-dsn" data-value="dsn-public">' + match + '</span>';
      } else if (match === '___PUBLIC_KEY___') {
        return '<span class="rewrite-dsn" data-value="public-key">' + match + '</span>';
      } else if (match === '___SECRET_KEY___') {
        return '<span class="rewrite-dsn" data-value="secret-key">' + match + '</span>';
      } else if (match === '___API_URL___') {
        return '<span class="rewrite-dsn" data-value="api-url">' + match + '</span>';
      } else if (match === '___PROJECT_ID___') {
        return '<span class="rewrite-dsn" data-value="project-id">' + match + '</span>';
      }
    });
    var wrapper = $('<div class="project-selector-wrapper"></div>');
    var header = $('<div class="project-selector-header">' +
      '<div class="project-label">Showing configuration for:</div>' +
      '<div class="project-selector"></div>' +
    '</div>');
    $(this).html(contents).wrap(wrapper);
    $(this).parent().prepend(header);
    renderProjectSelector(header.find('.project-selector'));
  });
}

function selectProject(project) {
  if (!project) return;
  var parsedDsn = parseDsn(project.dsn);

  $('.rewrite-dsn').each(function(){
    var $this = $(this);
    var value = $this.data('value');
    var newValue;

    switch (value) {
      case "dsn":
        newValue = dsnToHtml(parsedDsn);
        break;
      case "dsn-public":
        newValue = dsnToHtml(parsedDsn, true);
        break;
      case "public-key":
        newValue = escape(parsedDsn.publicKey);
        break;
      case "secret-key":
        newValue = '<span class="dsn-secret-key">' + escape(parsedDsn.secretKey) + '</span>';
        break;
      case "api-url":
        newValue = escape(parsedDsn.scheme + parsedDsn.host);
        break;
      case "project-id":
        newValue = escape('' + parsedDsn.project);
        break;
    }

    if (newValue) {
      $this.html(newValue);
      $this.find('[data-toggle="tooltip"]').tooltip();
    }
  });

  rememberLastProject(project);

  $('.project-selector .dropdown-label').text(project.name);
  $('.project-selector li').each(function(){
    var $this = $(this);
    var thisProject = $this.data('project');
    if (!thisProject) return;
    if (thisProject.id === project.id) {
      $this.addClass('active');
    } else {
      $this.removeClass('active');
    }
  });
}

function rememberLastProject(project) {
  document.cookie = 'dsnid=' + project.id;
}

function renderProjectSelector(element) {
  var m = document.cookie.match(/dsnid=(\d+)/);
  var dsnId = m ? parseInt(m[1]) : null;
  var currentProject = null;

  var projectsByGroup = {};
  projectList.forEach(function(project) {
    if (typeof projectsByGroup[project.group] === "undefined") {
      projectsByGroup[project.group] = [];
    }
    projectsByGroup[project.group].push(project);
    if (project.id === dsnId) {
      currentProject = project;
    }
  });

  if (!currentProject) {
    currentProject = projectList[0];
  }
  var $dropdown = $('<div class="dropdown">' +
    '<a class="dropdown-toggle" data-toggle="dropdown">' +
      '<span class="dropdown-label">' + currentProject.name + '</span>' +
      '<span class="caret"></span>' +
    '</a>' +
    '<ul class="dropdown-menu">' +
    '</ul>' +
  '</div>');
  $(element).append($dropdown);

  var $menu = $dropdown.find('.dropdown-menu');
  for (var group in projectsByGroup) {
    $menu.append($('<li class="nav-header"></li>').append($('<h6></h6>').text(group)));

    projectsByGroup[group].forEach(function(project) {
      var className = (currentProject.id === project.id ? 'active': '');
      var $link = $('<a></a>').text(project.name);
      $link.on('click', function(){
        selectProject(project);
      });
      $menu.append($('<li class="' + className + '"></li>').data('project', project).append($link));
    });
  }

  $dropdown.find('.dropdown-toggle').dropdown();

  selectProject(currentProject);
}

function renderHeader(user) {
  var userNav = $(
    '<ul class="user-nav">' +
      '<li class="hidden-xs"><a href="https://www.getsentry.com/pricing/" class="pricing-link">Pricing</a></li>' +
      '<li class="active hidden-xs"><a href="https://docs.getsentry.com">Documentation</a></li>' +
      '<li class="hidden-xs"><a href="http://blog.getsentry.com">Blog</a></li>' +
    '</ul>'
  );
  if (user.isAuthenticated) {
    userNav.append($(
      '<li class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
          '<img src="' + user.avatarUrl + '" class="avatar"> <b class="caret"></b>' +
        '</a>' +
        '<ul class="dropdown-menu">' +
          '<li><a href="https://app.getsentry.com">Dashboard</a>' +
          '<li class="divider"></li>' +
          '<li><a href="mailto:support@getsentry.com" class="support-link">Support</a></li>' +
          '<li class="divider"></li>' +
          '<li><a href="https://www.getsentry.com/logout/">Logout</a>' +
        '</ul>' +
      '</li>'
    ));
  } else {
      userNav.append($('<li class="hidden-xs"><a href="https://app.getsentry.com/auth/login/">Sign in</a></li>'));
      userNav.append($('<li class="divider hidden-xs"></li>'));
      userNav.append($('<li><a class="cta" href="https://www.getsentry.com/signup/">Start for free</a></li>'));
  }
  $('#user_nav').html(userNav).fadeIn();
}

$(function() {
  if (document.location.host === "localhost:9000") {
    var API = 'http://www.dev.getsentry.net:8000/docs/api';
  } else {
    var API = 'https://www.getsentry.com/docs/api';
  }

  var dummyDsn = {
    id: '-1',
    dsn: 'https://<key>:<secret>@app.getsentry.com/<project>',
    name: 'Example DSN',
    group: 'Example'
  };

  var user = null;
  var dsnSelectBar = null;

  var $dsnContainer = $('.dsn-container');
  var $pageContent = $('.page-content');
  var $sidebar = $('.sidebar');

  var currentPathName = document.location.pathname;

  var initInterface = function() {
    tagDsnBlocks($pageContent);
    renderHeader(user);
  };

  var getBody = function(html) {
    return $('<div' +  html.match(/<body([^>]*>[\S\s]*)<\/body>/)[1] + '</div>');
  };

  var getTitle = function(html) {
    return $('<div>' + html.match(/<title>([^<]+)<\/title>/)[1] + '</div>').text();
  };

  var isSameDomain = function(here, there) {
    return here.protocol === there.protocol && here.host === there.host;
  };

  // make all links external so that when we do our content switcheroo
  // they do not break.
  var rewriteLink = function() {
    var url = this.getAttribute('href');
    if (url && url.substr(0, 1) !== '#') {
      this.href = this.href;
    }
  };

  var loadContent = function(html) {
    var body = getBody(html);
    var content = body.find('.page-content').children();
    var sidebar = body.find('.sidebar').children();
    if (!content || !sidebar) {
      throw new Error('Could not find required child elements in html');
    }
    $sidebar.html(sidebar);
    $pageContent.hide().html(content);
    tagDsnBlocks($pageContent);
    $('body').on('dblclick', 'span.dsn', function(evt) {
      evt.preventDefault();
      var rng = document.createRange();
      rng.selectNode(this);
      window.getSelection().addRange(rng);
    });
    $pageContent.fadeIn();
    $('.page a.internal').click(linkHandler);
    $dsnContainer.show();
    document.title = getTitle(html);
  };

  var linkHandler = function(e) {
    var here = window.location;

    if (!isSameDomain(here, this)) return;

    e.preventDefault();

    loadDynamically(this.pathname, this.hash, true);
  };

  var loadDynamically = function(target, hash, pushState) {
    var fullTarget = (target || currentPathName) + (hash || '');

    window.scrollTo(0, 0);

    var done = function() {
      if (pushState) {
        window.history.pushState(null, document.title, fullTarget);
      }
      if (hash) {
        $(document.body).scrollTop($(hash).offset().top);
      }
      currentPathName = target;
    };

    if (target !== currentPathName) {
      console.log('Fetching content for ' + fullTarget);

      $pageContent.html('<div class="loading"><div class="loading-indicator"></div></div>');

      $dsnContainer.hide();

      $.ajax(target, {
        success: function(html) {
          try {
            loadContent(html);
            done();
          } catch (ex) {
            console.error(ex);
            window.location.href = target;
          }
        },
        error: function() {
          window.location.href = target;
        }
      });
    } else {
      console.log('Jumping to ' + fullTarget);
      done();
    }
  };

  $(window).on('popstate', function(e){
    loadDynamically(document.location.pathname, document.location.hash, false);
  });

  $('a').each(rewriteLink);

  $('a.internal').click(linkHandler);

  $.ajax({
    type: 'GET',
    url: API + '/user/',
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success: function(resp) {
      projectList = resp.projects.map(function(proj) {
        return {
          id: proj.id,
          dsn: proj.dsn,
          name: proj.teamName + ' / ' + proj.projectName,
          group: proj.organizationName
        };
      });
      if (projectList.length === 0) {
        projectList.unshift(dummyDsn);
      }
      user = resp.user;
      initInterface();
    },
    error: function() {
      console.error('Failed to load user data from Sentry');
      projectList = [dummyDsn];
      user = {isAuthenticated: false};
      initInterface();
    }
  });

  $('[data-toggle="tooltip"]').tooltip();
});
