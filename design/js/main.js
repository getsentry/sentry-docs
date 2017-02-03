var $ = require("jquery");
var bootstrap = require("bootstrap");
var qs = require("query-string");

var dsnList = [];
var apiKeyList = [];
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
      '<span class="dsn-auth" title="Copy paste includes key/secret" data-toggle="tooltip">' +
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

function tagInteractiveBlocks(parent) {
  parent.find('div.highlight pre').each(function() {
    var hasVariables = /___(DSN|PUBLIC_DSN|PUBLIC_KEY|SECRET_KEY|API_URL|ENCODED_API_KEY|PROJECT_ID|ORG_NAME|PROJECT_NAME)___/g.test(this.innerHTML);
    if (!hasVariables) {
      return;
    }
    var isApiKeySection = false;
    var contents = this.innerHTML.replace(/___(DSN|PUBLIC_DSN|PUBLIC_KEY|SECRET_KEY|API_URL|ENCODED_API_KEY|PROJECT_ID|ORG_NAME|PROJECT_NAME)___/g, function(match) {
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
      } else if (match === '___ENCODED_API_KEY___') {
        isApiKeySection = true;
        return '<span class="rewrite-dsn" data-value="encoded-api-key">' + match + '</span>';
      } else if (match === '___PROJECT_ID___') {
        return '<span class="rewrite-dsn" data-value="project-id">' + match + '</span>';
      } else if (match === '___PROJECT_NAME___') {
        return '<span class="rewrite-dsn" data-value="project-slug">' + match + '</span>';
      } else if (match === '___ORG_NAME___') {
        return '<span class="rewrite-dsn" data-value="org-slug">' + match + '</span>';
      }
    });
    var title = isApiKeySection ? 'API Key for Request' : 'Showing configuration for';
    var wrapper = $('<div class="project-selector-wrapper"></div>');
    var header = $('<div class="project-selector-header">' +
      '<div class="project-label">' + title + ':</div>' +
      '<div class="project-selector"></div>' +
    '</div>');
    $(this).html(contents).wrap(wrapper);
    $(this).parent().prepend(header);

    renderProjectSelector(header.find('.project-selector'),
                          isApiKeySection ? 'apikey' : 'dsn');
  });
}

function selectItem(item, section) {
  if (!item) return;

  var parsedDsn;

  if (section == 'dsn') {
    parsedDsn = parseDsn(item.dsn);
  }

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
        if (section == 'apikey') {
          // XXX: configurable
          newValue = 'https://sentry.io/api/';
        } else {
          newValue = escape(parsedDsn.scheme + parsedDsn.host);
        }
        break;
      case "project-slug":
        newValue = escape(item.projectSlug);
        break;
      case "org-slug":
        newValue = escape(item.organizationSlug);
        break;
      case "encoded-api-key":
        newValue = item.encodedKey;
        break;
      case "item-id":
        newValue = escape('' + parsedDsn.item);
        break;
    }

    if (newValue) {
      $this.html(newValue).hide().fadeIn();
      $this.find('[data-toggle="tooltip"]').tooltip();
    }
  });

  document.cookie = section + 'id=' + item.id;

  $('.project-selector .dropdown-label').text(item.name);
  $('.project-selector li').each(function(){
    var $this = $(this);
    var thisItem = $this.data('item');
    if (!thisItem) return;
    if (thisItem.id === item.id) {
      $this.addClass('active');
    } else {
      $this.removeClass('active');
    }
  });
}

function renderProjectSelector(element, section) {
  var source, selectionId;
  var m = document.cookie.match(section + 'id=(\\d+)');
  var selectionId = m ? parseInt(m[1]) : null;

  if (section == 'dsn') {
    source = dsnList;
  } else if (section == 'apikey') {
    source = apiKeyList;
  }

  var currentSelection = null;

  var selectionsByGroup = {};
  source.forEach(function(item) {
    if (selectionsByGroup[item.group] === undefined) {
      selectionsByGroup[item.group] = [];
    }
    selectionsByGroup[item.group].push(item);
    if (item.id === selectionId) {
      currentSelection = item;
    }
  });

  if (!currentSelection) {
    currentSelection = source[0];
  }

  var $dropdown = $('<div class="dropdown">' +
    '<a class="dropdown-toggle" data-toggle="dropdown">' +
      '<span class="dropdown-label">' + escape(currentSelection.name) + '</span>' +
      '<span class="caret"></span>' +
    '</a>' +
    '<ul class="dropdown-menu">' +
    '</ul>' +
  '</div>');
  $(element).append($dropdown);

  var $menu = $dropdown.find('.dropdown-menu');
  for (var group in selectionsByGroup) {
    $menu.append($('<li class="nav-header"></li>').append($('<h6></h6>').text(group)));

    selectionsByGroup[group].forEach(function(item) {
      var className = (currentSelection.id === item.id ? 'active': '');
      var $link = $('<a></a>').text(item.name);
      $link.on('click', function(){
        selectItem(item, section);
      });
      $menu.append($('<li class="' + className + '"></li>').data('item', item).append($link));
    });
  }

  $dropdown.find('.dropdown-toggle').dropdown();

  selectItem(currentSelection, section);
}

function renderHeader(user) {
  var userNav = $(
    '<ul class="user-nav">' +
      '<li class="hidden-xs"><a href="https://sentry.io/pricing/" class="pricing-link">Pricing</a></li>' +
      '<li class="active hidden-xs"><a href="https://docs.sentry.io">Documentation</a></li>' +
      '<li class="hidden-xs"><a href="http://blog.sentry.io">Blog</a></li>' +
    '</ul>'
  );
  if (user.isAuthenticated) {
    userNav.append($(
      '<li class="dropdown">' +
        '<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
          '<img src="' + user.avatarUrl + '" class="avatar"> <b class="caret"></b>' +
        '</a>' +
        '<ul class="dropdown-menu">' +
          '<li><a href="https://sentry.io">Dashboard</a>' +
          '<li class="divider"></li>' +
          '<li><a href="mailto:support@sentry.io" class="support-link">Support</a></li>' +
          '<li class="divider"></li>' +
          '<li><a href="https://sentry.io/logout/">Logout</a>' +
        '</ul>' +
      '</li>'
    ));
  } else {
      userNav.append($('<li class="hidden-xs"><a href="https://sentry.io/auth/login/">Sign in</a></li>'));
      userNav.append($('<li class="divider hidden-xs"></li>'));
      userNav.append($('<li><a class="cta" href="https://sentry.io/signup/">Start for free</a></li>'));
  }
  $('#user_nav').html(userNav).fadeIn();
}

function initRigidSearch() {
  var form = $('form.rigidsearch-form');
  if (form.length === 0) {
    return;
  }

  var params = qs.parse(location.search);
  var urlBase = document.location.pathname.match(/^(.*)\/search(\.html|\/?)$/)[1];

  function makeUrl(path) {
    if (path === 'index') {
      return urlBase;
    }
    // Handle a url fragment from search result
    var bits = path.split('#');
    var url = urlBase + '/' + bits[0] + '/';
    if (bits.length === 2) {
        url += '#' + bits[1];
    }
    return url;
  }

  function getSearchUrl(newParams) {
    newParams = newParams || {};
    var currentParams = {
      q: params.q,
      page: params.page,
    };
    Object.keys(newParams).forEach(function(key) {
      currentParams[key] = newParams[key];
    });
    return document.location.pathname + '?' + qs.stringify(currentParams);
  }

  function renderPath(path) {
    var el = $('<span class="path"></span>');
    path.split(/[#\/]/g).forEach(function (item) {
      el.append($('<span class="seg"></span>').text(item));
    });
    return el;
  }

  function renderPagination(results) {
    var el = $('<div class="pagination"></div>');

    function addButton(delta, text) {
      var otherPage = results.page + delta;
      if (otherPage >= 1 && otherPage < results.pages) {
        el.append($('<a></a>')
          .attr('href', getSearchUrl({page: otherPage}))
          .text(text));
      } else {
        el.append($('<span class="disabled"></span>')
          .text(text));
      }
    }

    addButton(-1, '« Previous');
    el.append($('<em></em>').text(results.page));
    addButton(+1, 'Next »');
    return el;
  }

  if (params.q) {
    $('input[name="q"]').val(params.q);
    $.ajax({
      type: 'GET',
      url: 'https://rigidsearch.getsentry.net/api/search',
      data: {
        q: params.q,
        page: params.page || 1,
        section: form.data('section')
      },
      crossDomain: true,
      success: function(resp) {
        var results = $('div.results', form).html('');
        resp.items.forEach(function(item) {
          $('<div class="result"></div>')
            .append($('<h3></h3>')
              .append($('<a class="link"></a>')
                .attr('href', makeUrl(item.path))
                .text(item.title))
              .append(renderPath(item.path)))
            .append($('<p class="excerpt"></p>')
              .html(item.excerpt))
            .appendTo(results);
        });
        results.append(renderPagination(resp));
      },
      error: function() {
        console.error('Failed to search :(');
      }
    });
  }
}

$(function() {
  if (document.location.host === "localhost:9000") {
    var API = 'http://dev.getsentry.net:8000/docs/api';
  } else {
    var API = 'https://sentry.io/docs/api';
  }

  var dummyDsn = {
    id: '-1',
    dsn: 'https://<key>:<secret>@sentry.io/<project>',
    name: 'Example DSN',
    group: 'Example',
    projectSlug: 'your-project',
    organizationSlug: 'your-org'
  };

  var dummyApiKey = {
    id: '-1',
    encodedKey: '{base64-encoded-key-here}',
    name: 'Example Key',
    group: 'Example'
  };

  var user = null;

  var $pageContent = $('.page-content');
  var $sidebar = $('.sidebar-content');

  var currentPathName = document.location.pathname;

  var initInterface = function() {
    tagInteractiveBlocks($pageContent);
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
    var sidebar = body.find('.sidebar-content').children();
    if (!content || !sidebar) {
      throw new Error('Could not find required child elements in html');
    }
    $sidebar.html(sidebar);
    $pageContent.hide().html(content);
    tagInteractiveBlocks($pageContent);
    $('body').on('dblclick', 'span.dsn', function(evt) {
      evt.preventDefault();
      var rng = document.createRange();
      rng.selectNode(this);
      window.getSelection().addRange(rng);
    });
    $pageContent.fadeIn();
    $('.page a.internal').click(linkHandler);
    document.title = getTitle(html);
    hookNavigation();
  };

  var hookNavigation = function() {
    $('.toggle-navigation').click(function(e) {
      var $this = $(this);
      var $nav = $('#nav');
      if ($nav.is('.active')) {
        $nav.removeClass('active');
      } else {
        $nav.addClass('active');
      }
    });
  };

  hookNavigation();

  var linkHandler = function(e) {
    var here = window.location;

    if (e.ctrlKey || e.metaKey) {
      return;
    }

    if (!isSameDomain(here, this)) return;

    e.preventDefault();

    loadDynamically(this.pathname, this.hash, true);

    $('#nav').removeClass('active');
  };

  var loadDynamically = function(target, hash, pushState) {
    var fullTarget = (target || currentPathName) + (hash || '');

    if (pushState) {
      window.scrollTo(0, 0);
    }

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

  // $('a').each(rewriteLink);

  // $('a.internal').click(linkHandler);

  $.ajax({
    type: 'GET',
    url: API + '/user/',
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success: function(resp) {
      dsnList = resp.projects.map(function(project) {
        var projectLabel = project.projectName;
        if (project.projectName.indexOf(project.teamName) === -1) {
          projectLabel = project.teamName + ' / ' + projectLabel;
        }

        return {
          id: project.id,
          dsn: project.dsn,
          name: projectLabel,
          group: project.organizationName,
          projectSlug: project.projectSlug,
          organizationSlug: project.organizationSlug
        };
      });
      if (dsnList.length === 0) {
        dsnList.unshift(dummyDsn);
      }

      apiKeyList = (resp.api_keys || []).map(function(apiKey) {
        return {
          id: apiKey.id,
          encodedKey: apiKey.base64Key,
          name: apiKey.label,
          group: apiKey.organizationName
        }
      });
      if (apiKeyList.length === 0) {
        apiKeyList.unshift(dummyApiKey);
      }

      user = resp.user;
      initInterface();

      ra.identify(user.id);
      ra.page();

      analytics.identify(user.id);
      var orgIdList = resp.projects.map(function(project) { return project.organizationId });
      analytics.group(orgIdList.filter(function(value, index, self) {return self.indexOf(value) === index}));
      analytics.page();
    },
    error: function() {
      console.error('Failed to load user data from Sentry');
      dsnList = [dummyDsn];
      apiKeyList = [dummyApiKey];
      user = {isAuthenticated: false};
      initInterface();
      ra.page();
      analytics.page()
    }
  });

  $('[data-toggle="tooltip"]').tooltip();

  initRigidSearch();
});
