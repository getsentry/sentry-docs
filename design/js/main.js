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

function processCodeBlocks(initialDsn) {
  var blocks = [];

  function rewriteCodeBlock(block) {
    var originalContents = block.innerHTML;

    function setDsn(dsn) {
      var parsedDsn = parseDsn(dsn);
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

    if (setDsn(initialDsn)) {
      blocks.push(setDsn);
    }
  }

  $('div.highlight pre,code').each(function() {
    rewriteCodeBlock(this);
  });

  return function(dsn) {
    blocks.forEach(function(setter) {
      setter(dsn);
    });
  };
}

function rememberLastDsn(dsns, currentDsn) {
  dsns.forEach(function(dsn) {
    if (dsn.dsn === currentDsn) {
      document.cookie = 'dsnid=' + dsn.id;
    }
  });
}

function createDsnBar(projects) {
  var onDsnChangeFunc = function() {};

  var selectBox = $('<select class="dsn-select"></select>')
    .on('change', function() {
      rememberLastDsn(projects, this.value);
      currentDsn = this.value;
      onDsnChangeFunc(this.value);
    });
  var bar = $('<div class="dsn"></div>')
    .append(selectBox);
  $('.dsn-container').append(bar);

  var m = document.cookie.match(/dsnid=(\d+)/);
  var dsnId = m ? parseInt(m[1]) : null;
  var currentDsn = null;

  var projectsByOrg = {};
  projects.forEach(function(proj) {
    if (typeof projectsByOrg[proj.orgName] === "undefined") {
      projectsByOrg[proj.orgName] = [];
    }
    projectsByOrg[proj.orgName].push(proj);
  });

  for (var org in projectsByOrg) {
    var optgroup = $('<optgroup></optgroup>')
      .attr('label', org);

    projectsByOrg[org].forEach(function(proj) {
      optgroup.append($('<option></option>')
        .attr('value', proj.dsn)
        .text(proj.teamName + ' / ' + proj.name));
      if (proj.id === dsnId) {
        currentDsn = proj.dsn;
      }
    });
    selectBox.append(optgroup);
  }

  if (currentDsn) {
    selectBox.val(currentDsn);
  }

  return {
    selectBox: selectBox.selectize(),
    currentDsn: currentDsn ? currentDsn : projects[0].dsn,
    onDsnSelect: function(callback) {
      onDsnChangeFunc = callback;
    }
  };
}

$(function() {
  //var API = 'http://www.dev.getsentry.net:8000/docs/api';
  var API = 'https://www.getsentry.com/docs/api';

  var dummyDsn = {
    dsn: 'https://<key>:<secret>@app.getsentry.com/<project>',
    name: 'Example DSN'
  };

  function initInterface(projects) {
    var dsnSelectBar = createDsnBar(projects);
    dsnSelectBar.onDsnSelect(processCodeBlocks(dsnSelectBar.currentDsn));
    $('body').on('dblclick', 'span.dsn', function(evt) {
      evt.preventDefault();
      var rng = document.createRange();
      rng.selectNode(this);
      window.getSelection().addRange(rng);
    });

    if (projects.length > 1 &&
        DOCUMENTATION_OPTIONS.SENTRY_DOC_VARIANT == 'hosted') {
      $('.dsn-container').fadeIn();
    }
  }

  $.ajax({
    type: 'GET',
    url: API + '/header/',
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success: function(resp) {
      $('header ul.user-nav')[0].outerHTML = resp;
      $('header div.container').fadeIn();
    },
    error: function() {
      $('header div.container').fadeIn();
    }
  });

  $.ajax({
    type: 'GET',
    url: API + '/dsns/',
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success: function(resp) {
      var projects = resp.dsns;
      projects.unshift(dummyDsn);
      initInterface(projects);
    },
    error: function() {
      initInterface([dummyDsn]);
    }
  });

  $('select').selectize();
});
