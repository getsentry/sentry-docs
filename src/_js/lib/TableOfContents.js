$(() => {
  let lastMatch = null;
  const updateLocation = () => {
    const scrollTop = $('.main-scroll').scrollTop();
    let curMatch;
    $(':header').each(function() {
      const id = $(this).attr('id');
      if (
        id &&
        scrollTop >= $(this).position().top &&
        $(`.doc-toc a[href="#${id}"]`).length
      ) {
        curMatch = id;
      }
    });
    if (curMatch !== lastMatch) {
      lastMatch = curMatch;
      $('.doc-toc a').each(function() {
        if ($(this).attr('href') === `#${curMatch}`) {
          $(this)
            .parent()
            .addClass('active');
        } else {
          $(this)
            .parent()
            .removeClass('active');
        }
      });
    }
  };
  $('.main-scroll').scroll(updateLocation);
  $(window).on('hashchange', () => updateLocation);
  $(window).on('popstate', () => updateLocation);
});
