
// Send an event to reload whenever a feedback button is clicked
$(document).on('change', '[data-feedback-toggle]', function(event) {
  event.preventDefault();
  const $el = $(event.currentTarget);
  const $selected = $el.find('input:checked');
  window.ra.event('docs.feedback-sent', {
    useful: parseInt($selected.val(), 10)
  });
  $('.feedback-footer').addClass('d-none');
});

// Send an event to reload whenever a feedback button is dismissed
$(document).on('click', '[data-feedback-close]', function(event) {
  event.preventDefault();
  window.ra.event('docs.feedback-dismissed');
  $('.feedback-footer').addClass('d-none');
  dismissFeedback()
});

// Reset the feedback widget for the new page
$(document).on('page.didUpdate', function(event) {
  const dismissTimestamp = window.localStorage.getItem('dismissTimestamp');

  if(dismissTimestamp && !pastDismissWindow(dismissTimestamp)){
    $('.feedback-footer').addClass('d-none');
  } else {
    $('.feedback-footer').removeClass('d-none');
    $('[data-feedback-toggle] label').removeClass('active');
  }
});

var dismissFeedback = function() {
  window.localStorage.setItem('dismissTimestamp', Date.now())
};

// dismiss for 30mins
var pastDismissWindow = function(dismissTimestamp) {
  return ((Date.now() - dismissTimestamp)/ (1000*60)) > 30;
};