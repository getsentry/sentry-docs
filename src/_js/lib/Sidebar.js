const filterDepth = depth => {
  return (i, el) => {
    const $parents = $(el).parentsUntil(
      '[data-sidebar-root]',
      '[data-sidebar-tree]'
    );
    return $parents.length === depth;
  };
};

$(document).on('page.didUpdate', function(event) {
  const $links = $('[data-sidebar-link]');
  let $active = $links.filter(`[href="${location.pathname}"]`);
  const $categoryTree = $('[data-sidebar-tree]').filter(filterDepth(1));
  $active = !!$active.length
    ? $active
    : $categoryTree.first().siblings('[data-sidebar-link]');

  $links.each((i, el) => {
    const $el = $(el);
    $el.toggleClass('active', $el.is($active));
  });

  const $sectionTree = $('[data-sidebar-tree]').filter(filterDepth(0));

  const $trees = $('[data-sidebar-tree]');
  $trees.each((i, el) => {
    const $el = $(el);
    const containsActive = !!$el.has($active.get(0)).length;
    const isChildOfActive = $el.parent().is($active.parent());
    const isSection = $sectionTree.is($el);
    const leaveVisble = containsActive || isChildOfActive || isSection;
    $el.toggleClass('collapse', !leaveVisble);
  });
});
