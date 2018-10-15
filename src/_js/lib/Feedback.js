var obj = document.getElementsByClassName('feedback-footer')[0];

// Send an event to reload whenever a feedback button is clicked
$(document).on('change', '[data-feedback-toggle]', function(event) {
  event.preventDefault();
  const $el = $(event.currentTarget);
  const $selected = $el.find('input:checked');
  window.ra.event('docs.feedback-sent', {
    useful: parseInt($selected.val(), 10)
  });
  obj.style.display="none";
});

// Send an event to reload whenever a feedback button is dismissed
$(document).on('click', '[feedback-close]', function(event) {
  event.preventDefault();
  window.ra.event('docs.feedback-dismissed');
  obj.style.display="none";
  dismissFeedback()
});

// Reset the feedback widget for the new page
$(document).on('page.didUpdate', function(event) {
	const dismissFeedback = window.localStorage.getItem('dismissFeedback');

	if(dismissFeedback === 'true'){
		obj.style.display = "none";
	 } else {
		obj.style.display = "";
		$('[data-feedback-toggle] label').removeClass('active');
	 }
});

var dismissFeedback = function() {
	window.localStorage.setItem('dismissFeedback', 'true')
};
