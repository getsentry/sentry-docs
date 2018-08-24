$(document).on('change', '[data-feedback-toggle]', function(event) {
  event.preventDefault();
  const $el = $(event.currentTarget);
  const $selected = $el.find('input:checked');
  window.ra.event('docs.feedback-sent', {
    useful: $selected.val()
  });
});
