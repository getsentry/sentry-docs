import qs from 'query-string';

const KEY = 'preferredPlatform';

const showPlatform = function(slug) {
  const platform = window.supportedPlatforms.find(p => p.slug === slug);
  if (!platform) return;

  const $contentBlocks = $('[data-platform-specific-content]');

  $contentBlocks.each((i, el) => {
    const $block = $(el);
    // Update dropdown target title
    $block.find('[data-toggle="dropdown"]').text(platform.name);

    // Update active state of dropdown items
    const $dropdownItems = $block.find('[data-toggle="platform"]');
    $dropdownItems.each((i, el) => {
      const $el = $(el);
      const isActive = $el.attr('data-platform') === platform.slug;
      $el.toggleClass('active', isActive);
      $el.attr('aria-selected', isActive);
    });

    // Update the active state of the tab panes
    const $activeItem = $dropdownItems.filter('.active');
    const activeID = $activeItem.attr('href').replace('#', '');
    const $tabPanes = $block.find('.tab-pane');
    $tabPanes.each((i, el) => {
      const $el = $(el);
      const isActive = $el.attr('id') === activeID;
      $el.toggleClass('show active', isActive);
    });
  });
};

const init = function() {
  $(document).on('click', '[data-toggle="platform"]', function(event) {
    event.preventDefault();
    const $target = $(event.target);
    const slug = $target.data('platform');
    localStorage.setItem(KEY, slug);
    showPlatform(slug);
  });

  const queryPlatform = qs.parse(location.search).platform;
  const preferredPlatform = localStorage.getItem(KEY);
  showPlatform(queryPlatform || preferredPlatform);
};

export default { init };
