function sentryEscape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sentryDsnToHtml(dsn) {
  console.log(dsn);
  var match = dsn.match(/^(.*?\/)(.*?):(.*?)@(.*?)(\/.*?)$/);
  return '<span class="dsn">' +
    sentryEscape(match[1]) +
    '<span class="dsn-key">' + sentryEscape(match[2]) + '</span>' +
    ':' +
    '<span class="dsn-secret" title="Secret is hidden for security reasons, ' +
      ' but you can copy paste the entire DSN and it will be included.">' +
      sentryEscape(match[3]) + '</span>' +
    '@' +
    sentryEscape(match[4]) +
    sentryEscape(match[5]) +
  '</span>';
}

function sentryRewriteCodeBlocks(initialDsn) {
  var blocks = [];

  function rewriteCodeBlock(block) {
    var originalContents = block.innerHTML;

    function setDsn(dsn) {
      var replaced = false;
      var contents = originalContents.replace(/\$\$\$DSN\$\$\$/, function(match) {
        replaced = true;
        return sentryDsnToHtml(dsn);
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

  $('div.highlight pre').each(function() {
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
  $('header div.container').prepend(bar);

  projects.forEach(function(proj) {
    selectBox.append($('<option></option>')
      .attr('value', proj.dsn)
      .text(proj.name));
  });

  return {
    onDsnSelect: function(callback) {
      onDsnChangeFunc = callback;
    }
  };
}


$(function() {
  // XXX: grab from other domain and remember selection somewhere (cookie?)
  var projects = [
    {
      dsn: 'https://<key>:<secret>@app.getsentry.com/<project>',
      name: 'DSN for Examples'
    },
    {
      dsn: 'https://f99d4658379541d7bb7e29a5a28909d2:ca359f0cadc4ef6aeb7b3087232473a3@app.getsentry.com/12345',
      name: 'foo/example'
    }
  ];
  var dsnSelectBar = sentryCreateDsnBar(projects);
  dsnSelectBar.onDsnSelect(sentryRewriteCodeBlocks(projects[0].dsn));
});
