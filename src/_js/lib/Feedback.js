// Send an event to reload whenever a feedback button is clicked
$(document).on('change', '[data-feedback-toggle]', function(event) {
  event.preventDefault();
  const $el = $(event.currentTarget);
  const $selected = $el.find('input:checked');
  window.ra.event('docs.feedback-sent', {
    useful: parseInt($selected.val(), 10)
  });
});

// Reset the feedback widget for the new page
$(document).on('page.didUpdate', function(event) {
  $('[data-feedback-toggle] label').removeClass('active');
});
