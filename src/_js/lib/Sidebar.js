$(document).on('page.didUpdate', function(event) {
  const $links = $('[data-sidebar-link]');
  const $sections = $('[data-sidebar-root] > [data-sidebar-tree]').find(
    '> [data-sidebar-branch]'
  );

  let $active = $links.filter(`[href="${location.pathname}"]`).last();

  if (!$active.length) {
    $active = $sections
      .first()
      .find('> [data-sidebar-tree]')
      .find('> [data-sidebar-branch]')
      .first()
      .find('> [data-sidebar-link]');
  }

  $links.each((i, el) => {
    const $el = $(el);
    $el.toggleClass('active', $el.is($active));
  });

  $('[data-sidebar-branch]').each((i, el) => {
    const $branch = $(el);
    const $parentBranch = $branch
      .parent()
      .closest('[data-sidebar-branch],[data-sidebar-root]');
    const hideWhenNoActiveChild =
      $branch.data('hide-when-inactive') !== undefined;
    const parentTreeContainsActive = $parentBranch
      .find('[data-sidebar-link]')
      .is($active);

    const containsActive = $branch.find('[data-sidebar-link]').is($active);

    const leaveVisble =
      containsActive || (parentTreeContainsActive && !hideWhenNoActiveChild);
    $branch.toggleClass('collapse', !leaveVisble);
  });
});
