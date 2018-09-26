$(document).on('page.didUpdate', function() {
  $('h1,h2,h3,h4,h5,h6').each((i, el) => {
    const $el = $(el);
    const id = $el.attr('id');
    if(!id) {
      return;
    }

    // This event gets also fired whenever history.replaceState is called. In
    // that case we do not want to prepend multiple anchors.
    if ($('.anchor', $el).length > 0) {
      return;
    }

    const $link = $(`
      <a class="anchor" aria-hidden="true" href="#${id}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.879 6.05L15 1.93A5.001 5.001 0 0 1 22.071 9l-4.121 4.121a1 1 0 0 1-1.414-1.414l4.12-4.121a3 3 0 1 0-4.242-4.243l-4.121 4.121a1 1 0 1 1-1.414-1.414zm2.242 11.9L9 22.07A5 5 0 1 1 1.929 15l4.121-4.121a1 1 0 0 1 1.414 1.414l-4.12 4.121a3 3 0 1 0 4.242 4.243l4.121-4.121a1 1 0 1 1 1.414 1.414zm-8.364-.122l13.071-13.07a1 1 0 0 1 1.415 1.414L6.172 19.242a1 1 0 1 1-1.415-1.414z" fill="currentColor"/></svg>
      </a>
    `);
    $el.prepend($link);
  });
});
