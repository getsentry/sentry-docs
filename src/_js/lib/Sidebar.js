const onlyCategories = (i, el) => {
  const $parents = $(el).parentsUntil(
    '[data-sidebar-root]',
    '[data-sidebar-tree]'
  );
  return $parents.length === 1;
};

$(document).on('page.didUpdate', function(event) {
  const $links = $('[data-sidebar-link]');
  let $active = $links.filter(`[href="${location.pathname}"]`);
  $active = !!$active.length
    ? $active
    : $('[data-sidebar-tree]')
        .filter(onlyCategories)
        .eq(0)
        .siblings('[data-sidebar-link]');

  $links.each((i, el) => {
    const $el = $(el);
    $el.toggleClass('active', $el.is($active));
  });

  const $trees = $('[data-sidebar-tree]');
  $trees.each((i, el) => {
    const $el = $(el);
    const containsActive = !!$el.has($active.get(0)).length;
    const isChildOfActive = $el.parent().is($active.parent());
    $el.toggleClass('collapse', !(containsActive || isChildOfActive));
  });
});
