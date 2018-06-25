import { tokens as dynamicContentTokens } from './lib/InteractiveContent';

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

  // Load the list of dynamic tokens into the docs
  $(document).on('dynamicContent.didLoad', function(event) {
    $('[data-dynamic-token-list]').append(
      $('<ul></ul>').append(
        $.map(dynamicContentTokens, function(token) {
          return $(`<li><code>___${token}___</code></li>`);
        })
      )
    );
  });
});
