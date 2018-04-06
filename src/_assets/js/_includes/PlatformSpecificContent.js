$(function() {
  var KEY = 'preferredPlatform';
  var showPreferredPlatform = function() {
    var preferredPlatform = localStorage.getItem(KEY);
    if (preferredPlatform) {
      $('[data-platform="' + preferredPlatform + '"]').click();
    }
  };

  var $dropdownItems = $('.js-platform-specific-content .dropdown-item');
  $dropdownItems.on('click', function(event) {
    var $target = $(event.target);
    var $parent = $target.closest('.js-platform-specific-content');
    var platform = $target.data('platform');
    localStorage.setItem(KEY, platform);
    $parent.find('.dropdown-toggle').text(platform);
  });

  showPreferredPlatform();
});
