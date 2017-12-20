$(function(){
  var KEY = 'preferredPlatform'
  var showPreferredPlatform = function(){
    var preferredPlatform = localStorage.getItem(KEY)
    if(!preferredPlatform) return
    
    var $tabs = $('.js-platform-specific-content .nav-link')
    $tabs.removeClass('active')
    $tabs.filter('[data-slug=' + preferredPlatform + ']').addClass('active')

    var $tabPanes = $('.js-platform-specific-content .tab-pane')
    $tabPanes.removeClass('show active')
    $tabPanes.filter('[data-slug=' + preferredPlatform + ']').addClass('show active')
  }

  $('.js-platform-specific-content').on('shown.bs.tab', function(event){
    localStorage.setItem(KEY, $(event.target).data('slug'))
    showPreferredPlatform()
  })

  showPreferredPlatform()
})
