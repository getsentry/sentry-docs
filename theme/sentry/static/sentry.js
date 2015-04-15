function sentryDsnToHtml(dsn) {
  return '<span class="dsn">' +
    dsn.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
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
      dsn: 'https://<auth>@app.getsentry.com/<project>',
      name: 'DSN for Examples'
    },
    {
      dsn: 'https://07296760-af31-4561-a31a-45bc3eeddaf6:84dae058-1f68-4950-b366-2fcb11787fa1@app.getsentry.com/42',
      name: 'foo/example'
    }
  ];
  var dsnSelectBar = sentryCreateDsnBar(projects);
  dsnSelectBar.onDsnSelect(sentryRewriteCodeBlocks(projects[0].dsn));
});
