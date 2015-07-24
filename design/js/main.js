var $ = require("jquery");

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
      '<span class="dsn-auth" title="Copy paste includes key and secret.">' +
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
  parent.find('div.highlight pre,code').each(function() {
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
    this.innerHTML = contents;
  });
}

function updateDsnTemplates(dsn) {
  if (!dsn) return;
  var parsedDsn = parseDsn(dsn);

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
    }
  });
}

function rememberLastDsn(dsns, currentDsn) {
  dsns.forEach(function(dsn) {
    if (dsn.dsn === currentDsn) {
      document.cookie = 'dsnid=' + dsn.id;
    }
  });
}

function createDsnBar(element, projects) {
  var onDsnChangeFunc = function(dsn) {};

  var m = document.cookie.match(/dsnid=(\d+)/);
  var dsnId = m ? parseInt(m[1]) : null;
  var currentDsn = null;

  var selectBox = $('<select class="dsn-select"></select>')
    .on('change', function() {
      rememberLastDsn(projects, this.value);
      currentDsn = this.value;
      onDsnChangeFunc(this.value);
    });
  var bar = $('<div class="dsn"></div>')
    .append(selectBox);
  $(element).append(bar);

  var projectsByGroup = {};
  projects.forEach(function(proj) {
    if (typeof projectsByGroup[proj.group] === "undefined") {
      projectsByGroup[proj.group] = [];
    }
    projectsByGroup[proj.group].push(proj);
  });

  for (var group in projectsByGroup) {
    var optgroup = $('<optgroup></optgroup>')
      .attr('label', group);

    projectsByGroup[group].forEach(function(proj) {
      optgroup.append($('<option></option>')
        .attr('value', proj.dsn)
        .text(proj.name));
      if (proj.id === dsnId) {
        currentDsn = proj.dsn;
      }
    });
    selectBox.append(optgroup);
  }

  if (!currentDsn) {
    currentDsn = projects[0].dsn;
  }

  if (currentDsn) {
    selectBox.val(currentDsn);
  }

  return {
    selectBox: selectBox.selectize(),
    currentDsn: currentDsn,
    onDsnSelect: function(callback) {
      onDsnChangeFunc = callback;
    },
    sync: function() {
      onDsnChangeFunc(currentDsn);
    }
  };
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

function renderDsnSelector(dsnContainer, projects) {
  var dsnSelectBar = createDsnBar(dsnContainer, projects);

  dsnSelectBar.onDsnSelect(updateDsnTemplates);
  $('body').on('dblclick', 'span.dsn', function(evt) {
    evt.preventDefault();
    var rng = document.createRange();
    rng.selectNode(this);
    window.getSelection().addRange(rng);
  });

  if (projects.length &&
      DOCUMENTATION_OPTIONS.SENTRY_DOC_VARIANT == 'hosted') {
    dsnContainer.fadeIn();
  }

  dsnSelectBar.sync();

  return dsnSelectBar;
}

$(function() {
  //var API = 'http://www.dev.getsentry.net:8000/docs/api';
  var API = 'https://www.getsentry.com/docs/api';

  var dummyDsn = {
    dsn: 'https://<key>:<secret>@app.getsentry.com/<project>',
    name: 'Example DSN',
    group: 'Example'
  };

  var projects = null;
  var user = null;
  var dsnSelectBar = null;

  var $dsnContainer = $('.dsn-container');
  var $pageContent = $('.page-content');
  var $sidebar = $('.sidebar');

  var initInterface = function() {
    tagDsnBlocks($pageContent);
    dsnSelectBar = renderDsnSelector($dsnContainer, projects);
    renderHeader(user);
  };

  var getBody = function(html) {
    return $('<div' +  html.match(/<body([^>]*>[\S\s]*)<\/body>/)[1] + '</div>');
  };

  var getTitle = function(html) {
    return html.match(/<title>([^<]+)<\/title>/)[1];
  };

  var linkHandler = function(e) {
    var target = this.pathname;
    loadDynamically(target, true);
    e.preventDefault();
  };

  var loadDynamically = function(target, pushState) {
    $pageContent.html('<div class="loading"><div class="loading-indicator"></div></div>');
    $dsnContainer.hide();
    if (pushState) {
      window.scrollTo(0, 0);
    }

    $.ajax(target, {
      success: function(html) {
        try {
          var body = getBody(html);
          var content = body.find('.page-content').children();
          var sidebar = body.find('.sidebar').children();
          if (!content || !sidebar) {
            window.location.href = target;
          } else {
            $sidebar.html(sidebar);
            $pageContent.hide().html(content);
            tagDsnBlocks($pageContent);
            if (dsnSelectBar) dsnSelectBar.sync();
            $pageContent.fadeIn();
            $('.page a.internal').click(linkHandler);
            $pageContent.find('select').selectize();
            $dsnContainer.show();
            document.title = getTitle(html);
            if (pushState) {
              window.history.pushState({}, window.title, target);
            }
          }
        } catch (ex) {
          console.error(ex);
          window.location.href = target;
        }
      },
      error: function() {
        window.location.href = target;
      }
    });
  };

  $(window).on('popstate', function(e){
    loadDynamically(document.location.pathname);
  });

  // make all links external so that when we do our content switcheroo
  // they do not break.
  $('a').each(function() {
    this.href = this.href;
  });

  $('a.internal').click(linkHandler);
  $('.page-content select').selectize();

  $.ajax({
    type: 'GET',
    url: API + '/user/',
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success: function(resp) {
      projects = resp.projects.map(function(proj) {
        return {
          id: proj.id,
          dsn: proj.dsn,
          name: proj.teamName + ' / ' + proj.projectName,
          group: proj.organizationName
        };
      });
      projects.unshift(dummyDsn);
      user = resp.user;
      initInterface();
    },
    error: function() {
      console.error('Failed to load user data from Sentry');
      projects = [dummyDsn];
      user = {isAuthenticated: false};
      initInterface();
    }
  });
});
