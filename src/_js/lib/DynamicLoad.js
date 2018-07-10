let currentPathName = document.location.pathname;

const linkHandler = function(event) {
  if (event.ctrlKey || event.metaKey) return;
  if (!isSameDomain(window.location, this)) return;
  event.preventDefault();
  loadDynamically(this.pathname, this.hash, true);
};

const replaceContent = function(html) {
  const $page = $(html.replace('<!DOCTYPE html>', ''));
  const $new = $page.find('[data-dynamic-load]');
  const $title = $page.filter('title').eq(0);
  $('head title').text($title.text());

  $new.each(function(i, el) {
    const $el = $(el);
    const slug = $el.data('dynamic-load');
    const content = $el.html();
    $(`[data-dynamic-load="${slug}"]`).html(content);
  });
};

const loadDynamically = function(target, hash, pushState) {
  const fullTarget = (target || currentPathName) + (hash || '');

  window.scrollTo(0, 0);

  const done = function() {
    if (pushState) {
      window.history.pushState(null, document.title, fullTarget);
    }
    if (hash) {
      $(hash)
        .get(0)
        .scrollIntoView();
    }
    currentPathName = target;
    $(document).trigger('page.didUpdate');
  };

  if (target !== currentPathName) {
    $('body').addClass('loading');
    return $.ajax({
      type: 'GET',
      url: target
    })
      .done(function(html) {
        replaceContent(html);
        done();
      })
      .fail(function() {
        window.location.href = target;
      })
      .always(function() {
        $('body').removeClass('loading');
      });
  } else {
    done();
  }
};

const isSameDomain = function(here, there) {
  return here.protocol === there.protocol && here.host === there.host;
};

const init = function() {
  $(document).on(
    'click',
    '[data-dynamic-load] a:not([data-not-dynamic])',
    linkHandler
  );

  $(window).on('popstate', function(event) {
    loadDynamically(document.location.pathname, document.location.hash, false);
  });
};

export default { init };
