import qs from 'query-string';

const renderResult = function(data) {
  const url = `${window.location.origin}/${data.path}`;
  const path = data.path
    .split(/[#\/]/)
    .map(segment => {
      return `<span class="path-segment">${segment}</span>`;
    })
    .join('');
  return $(`
    <div class="mb-3">
      <h3 class="h5 mb-0"><a href="${url}">${data.title}</a></h3>
      <div class="pl-2">
        <aside>${path}</aside>
        <p class="mb-0">${data.excerpt}</p>
      </div>
    </div>
  `);
};

const searchUrlFor = function({ q, page = 0, pages }) {
  return `${document.location.pathname}?${qs.stringify({ q, page, pages })}`;
};

const renderPagination = function({ q, page, pages }) {
  const prev = page > 1 ? searchUrlFor({ q, page: page - 1 }) : '';
  const prevDisabled = !prev ? ' disabled' : '';
  const next = page < pages ? searchUrlFor({ q, page: page + 1 }) : '';
  const nextDisabled = !next ? ' disabled' : '';

  return $(`
    <div class="row lined-top pt-3 pt-md-4">
      <div class="col-6 text-md-right">
        <a class="btn btn-lg btn-outline-dark d-inline-flex align-items-center py-2${prevDisabled}" role="button" href="${prev}">
          <svg aria-hidden="true" role="icon" width="16" height="16" viewBox="0 0 16 16" version="1.1">
            <path d="M9,15.6C8.4,15,2.8,9.1,2.8,9.1C2.5,8.8,2.3,8.4,2.3,8s0.2-0.8,0.5-1.1c0,0,5.6-5.9,6.2-6.5c0.6-0.6,1.6-0.6,2.2,0 c0.6,0.6,0.7,1.4,0,2.2L6,8l5.2,5.4c0.7,0.7,0.6,1.6,0,2.2C10.6,16.2,9.6,16.1,9,15.6L9,15.6z" fill="currentColor"></path>
          </svg>
          <span class="sr-only">Previous page</span>
        </a>
      </div>
      <div class="col-6 text-right text-md-left">
        <a class="btn btn-lg btn-outline-dark d-inline-flex align-items-center py-2${nextDisabled}" role="button" href="${next}">
          <svg aria-hidden="true" role="icon" width="16" height="16" viewBox="0 0 16 16" version="1.1">
            <path d="M7,0.4c0.6,0.6,6.2,6.5,6.2,6.5c0.3,0.3,0.5,0.7,0.5,1.1c0,0.4-0.2,0.8-0.5,1.1c0,0-5.6,5.9-6.2,6.5s-1.6,0.6-2.2,0 s-0.7-1.4,0-2.2L10,8L4.8,2.6C4.1,1.9,4.2,1,4.8,0.4S6.4-0.1,7,0.4L7,0.4z" fill="currentColor"></path>
          </svg>
          <span class="sr-only">Next page</span>
        </a>
      </div>
    </div>
  `);
};

const init = function() {
  const params = qs.parse(location.search);

  const rigidsearchUrl = RIGIDSEARCH_SERVER;

  if (params.q) {
    $('input[name="q"]').val(params.q);

    $.ajax({
      type: 'GET',
      // TODO: Ensure production config points this to the right place
      // Replaced by ProvidePlugin
      url: rigidsearchUrl,
      dataType: 'json',
      data: {
        q: params.q,
        page: params.page || 1,
        // TODO: make this work like before
        section: 'hosted'
      },
      crossDomain: true,
      success: function(res) {
        const $results = $('[data-search-results]');
        $.each(res.items, function(i, data) {
          $results.append(renderResult(data));
        });
        $results.append(renderPagination({ ...res, q: params.q }));
      },
      error: function() {
        console.error('Failed to search :(');
      }
    });
  }
};

export default { init };
