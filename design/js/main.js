function sentryEscape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sentryParseDsn(dsn) {
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
  }
}

function sentryDsnToHtml(parsedDsn, pub) {
  var auth;
  if (pub) {
    auth = sentryEscape(parsedDsn.publicKey);
  } else {
    auth =
      '<span class="dsn-auth" title="Copy paste includes key and secret.">' +
      sentryEscape(parsedDsn.publicKey) + ':' +
      sentryEscape(parsedDsn.secretKey) + '</span>';
  }

  return '<span class="dsn">' +
    sentryEscape(parsedDsn.scheme) +
    auth + '@' +
    sentryEscape(parsedDsn.host) +
    sentryEscape(parsedDsn.pathSection) +
  '</span>';
}

function sentryRewriteCodeBlocks(initialDsn) {
  var blocks = [];

  function rewriteCodeBlock(block) {
    var originalContents = block.innerHTML;

    function setDsn(dsn) {
      var parsedDsn = sentryParseDsn(dsn);
      var replaced = false;
      var contents = originalContents.replace(/___(DSN|PUBLIC_DSN|PUBLIC_KEY|SECRET_KEY|API_URL|PROJECT_ID)___/g, function(match) {
        replaced = true;
        if (match === '___DSN___') {
          return sentryDsnToHtml(parsedDsn);
        } else if (match === '___PUBLIC_DSN___') {
          return sentryDsnToHtml(parsedDsn, true);
        } else if (match === '___PUBLIC_KEY___') {
          return sentryEscape(parsedDsn.publicKey);
        } else if (match === '___SECRET_KEY___') {
          return '<span class="dsn-secret-key">' + sentryEscape(parsedDsn.secretKey) + '</span>';
        } else if (match === '___API_URL___') {
          return sentryEscape(parsedDsn.scheme + parsedDsn.host);
        } else if (match === '___PROJECT_ID___') {
          return sentryEscape('' + parsedDsn.project);
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
  }
}

function sentryCreateDsnBar(projects) {
  var onDsnChangeFunc = function() {};

  var selectBox = $('<select class="dsn-select"></select>')
    .on('change', function() {
      onDsnChangeFunc(this.value);
    });
  var bar = $('<div class="dsn"></div>')
    .append(selectBox);
  $('.dsn-container').prepend(bar);

  projects.forEach(function(proj) {
    selectBox.append($('<option></option>')
      .attr('value', proj.dsn)
      .text(proj.name));
  });

  return {
    selectBox: selectBox,
    onDsnSelect: function(callback) {
      onDsnChangeFunc = callback;
    }
  };
}


$(function() {
  var dummyDsn = {
    dsn: 'https://<key>:<secret>@app.getsentry.com/<project>',
    name: 'Example DSN'
  };
  var lastBox = sentryCreateDsnBar([dummyDsn]).selectBox;

  function initInterface(projects) {
    var dsnSelectBar = sentryCreateDsnBar(projects);
    lastBox.remove();
    lastBox = dsnSelectBar.selectBox;
    dsnSelectBar.onDsnSelect(sentryRewriteCodeBlocks(projects[0].dsn));
    $('body').on('dblclick', 'span.dsn', function(evt) {
      evt.preventDefault();
      var rng = document.createRange();
      rng.selectNode(this);
      window.getSelection().addRange(rng);
    });
  }

  $.ajax({
    type: 'GET',
    url: 'https://www.getsentry.com/docs/api/dsns/',
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success: function(resp) {
      var projects = resp.dsns.map(function(item) {
        return {
          dsn: 'https://' + item.public_key + ':' + item.secret_key +
            '@app.getsentry.com/' + item.project_id,
          name: item.organization_name + '/' + item.project_name +
            (item.is_user_key ? ' (User Key)' : '')
        };
      });
      projects.unshift(dummyDsn);
      initInterface(projects);
    }
  });
});
