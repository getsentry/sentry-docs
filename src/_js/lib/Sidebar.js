const trimEndSlash = str => str.replace(/\/$/g, '');

$(document).on('page.didUpdate', function(event) {
  const $links = $('[data-sidebar-link]');
  const $sections = $('[data-sidebar-root] > [data-sidebar-tree]').find(
    '> [data-sidebar-branch]'
  );

  const pathname = trimEndSlash(location.pathname);

  let $active = $links
    .filter((i, l) => pathname === trimEndSlash($(l).attr('href')))
    .last();

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

    const isSection = $sections.is(el);

    switch (true) {
      case containsActive:
      case isSection:
      case parentTreeContainsActive && !hideWhenNoActiveChild:
        $branch.removeClass('collapse');
        break;
      default:
        $branch.addClass('collapse');
    }
  });
});
