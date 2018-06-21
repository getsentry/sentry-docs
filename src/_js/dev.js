$(function() {
  const namespace = 'hidePeek';
  const $peek = $('[data-peek]');

  // Set a default if this has never been seent.
  if (!localStorage.getItem(namespace)) {
    localStorage.setItem(namespace, true);
  }

  // Restore Peek to its last state.
  $peek.toggleClass('d-none', localStorage.getItem(namespace) == 'true');

  // Toggle Peek when the ` key is pressed.
  $(document).on('keypress', function(event) {
    if (event.which === 96) {
      $peek.toggleClass('d-none');
      localStorage.setItem(namespace, $peek.hasClass('d-none'));
    }
  });
});
