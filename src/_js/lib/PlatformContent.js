const init = function() {
  const KEY = 'preferredPlatform';
  const showPreferredPlatform = function() {
    const preferredPlatform = localStorage.getItem(KEY);
    if (preferredPlatform) {
      $('[data-platform="' + preferredPlatform + '"]').click();
    }
  };

  const $dropdownItems = $('.js-platform-specific-content .dropdown-item');
  $dropdownItems.on('click', function(event) {
    const $target = $(event.target);
    const $parent = $target.closest('.js-platform-specific-content');
    const platform = $target.data('platform');
    localStorage.setItem(KEY, platform);
    $parent.find('.dropdown-toggle').text(platform);
  });

  showPreferredPlatform();
};

export default { init };
