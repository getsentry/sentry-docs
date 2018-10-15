// Send an event to reload whenever a feedback button is clicked
$(document).on('change', '[data-feedback-toggle]', function(event) {
  event.preventDefault();
  const $el = $(event.currentTarget);
  const $selected = $el.find('input:checked');
  window.ra.event('docs.feedback-sent', {
    useful: parseInt($selected.val(), 10)
  });
  dismissFeedback()
});

// Reset the feedback widget for the new page
$(document).on('page.didUpdate', function(event) {
	const showFeedback = window.localStorage.getItem('showFeedback');
	if(!showFeedback){
		$(".feedback-footer").remove();
	} else{
		$('[data-feedback-toggle] label').removeClass('active');
  }
});

// dismiss the footer if they send feedback or close it out
var dismissFeedback = function() {
	window.localStorage.setItem('showFeedback', 'false')
	$(".feedback-footer").remove();
};
