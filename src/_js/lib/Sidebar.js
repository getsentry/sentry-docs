const filterDepth = depth => {
  return (i, el) => {
    const $parents = $(el).parentsUntil(
      '[data-sidebar-root]',
      '[data-sidebar-branch]'
    );
    return $parents.length === depth;
  };
};

$(document).on('page.didUpdate', function(event) {
  const $links = $('[data-sidebar-link]');
  let $active = $links.filter(`[href="${location.pathname}"]`).last();
  const $categoryTree = $('[data-sidebar-tree]').filter(filterDepth(1));
  $active = !!$active.length
    ? $active
    : $categoryTree.first().siblings('[data-sidebar-link]');
  $links.each((i, el) => {
    const $el = $(el);
    $el.toggleClass('active', $el.is($active));
  });
  const $sectionTree = $('[data-sidebar-branch]').filter(filterDepth(0));
  const $activeBranch = $active.closest('[data-sidebar-branch]');
  $('[data-sidebar-branch]').each((i, el) => {
    const $branch = $(el);
    const $link = $branch.find('> [data-sidebar-link]');
    const $tree = $branch.find('> [data-sidebar-tree]');
    const hideWhenNoActiveChild =
      $branch.data('hide-when-inactive') !== undefined;
    const containsActive = !!$tree.has($active).length;
    const isActive = $branch.is($activeBranch);
    const isSiblingOfActive = !!$branch.siblings().is($activeBranch);
    const isChildOfActive = $branch
      .parent()
      .closest('[data-sidebar-branch]')
      .is($activeBranch);
    const isSection = $sectionTree.is($branch);
    const leaveVisble =
      (isSection && !hideWhenNoActiveChild) ||
      isActive ||
      isSiblingOfActive ||
      isChildOfActive ||
      containsActive;
    $branch.toggleClass('collapse', !leaveVisble);
  });
});
