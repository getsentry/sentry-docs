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

function updateDsnTemplates(dsn) {
  if (!dsn) return;
  var parsedDsn = parseDsn(dsn);

  function setDsn(block) {
    var originalContents = block.innerHTML;
    var replaced = false;
    var contents = originalContents.replace(/___(DSN|PUBLIC_DSN|PUBLIC_KEY|SECRET_KEY|API_URL|PROJECT_ID)___/g, function(match) {
      replaced = true;
      if (match === '___DSN___') {
        return dsnToHtml(parsedDsn);
      } else if (match === '___PUBLIC_DSN___') {
        return dsnToHtml(parsedDsn, true);
      } else if (match === '___PUBLIC_KEY___') {
        return escape(parsedDsn.publicKey);
      } else if (match === '___SECRET_KEY___') {
        return '<span class="dsn-secret-key">' + escape(parsedDsn.secretKey) + '</span>';
      } else if (match === '___API_URL___') {
        return escape(parsedDsn.scheme + parsedDsn.host);
      } else if (match === '___PROJECT_ID___') {
        return escape('' + parsedDsn.project);
      }
    });
    if (!replaced) {
      return false;
    }
    block.innerHTML = contents;
    return true;
  }

  $('div.highlight pre,code').each(function() {
    setDsn(this, dsn);
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

  var selectBox = $('<select class="dsn-select"></select>')
    .on('change', function() {
      rememberLastDsn(projects, this.value);
      currentDsn = this.value;
      onDsnChangeFunc(this.value);
    });
  var bar = $('<div class="dsn"></div>')
    .append(selectBox);
  $(element).append(bar);

  var m = document.cookie.match(/dsnid=(\d+)/);
  var dsnId = m ? parseInt(m[1]) : null;
  var currentDsn = null;

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
    // TODO(dcramer): dsn selector doesnt need re-rendered repeatedly
    dsnSelectBar = renderDsnSelector($dsnContainer, projects);
    renderHeader(user);
  };

  var getBody = function(html) {
    return $('<div' +  html.match(/<body([^>]*>[\S\s]*)<\/body>/)[1] + '</div>');
  };

  var getTitle = function(html) {
    return html.match(/<title>([^<]+)<\/title>/)[1];
  };

  var loadDynamically = function(e) {
    var target = this.pathname;

    $pageContent.html('<div class="loading"><div class="loading-indicator"></div></div>');
    $dsnContainer.hide();

    e.preventDefault();

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
            dsnSelectBar.sync();
            $pageContent.fadeIn();
            $('.page a.internal').click(loadDynamically);
            $pageContent.find('select').selectize();
            $dsnContainer.show();
            document.title = getTitle(html);
            window.history.pushState({}, window.title, target);
          }
        } catch (ex) {
          window.error(ex);
          window.location.href = target;
        }
      },
      error: function() {
        window.location.href = target;
      }
    });
  };

  $('a.internal').click(loadDynamically);
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
