import instantsearch from 'instantsearch.js';
import { connectHits } from 'instantsearch.js/es/connectors';
import { searchBox } from 'instantsearch.js/es/widgets';
$(function() {
  const search = instantsearch({
    ...(window.ALGOLIA || {}),
    searchFunction: function(helper) {
      var $hits = $('#hits');
      if (helper.state.query === '') {
        $hits.addClass('d-none');
        $('#search-clickplate').addClass('d-none');
      } else {
        helper.search();
        $hits.removeClass('d-none');
        $('#search-clickplate').removeClass('d-none');
      }
    }
  });

  const escapeHtml = unsafe => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const renderHit = hit => {
    const categories = hit.categories.length
      ? hit.categories.map(
          category =>
            `<span class="badge badge-secondary">${escapeHtml(category)}</span>`
        )
      : '';
    // TODO(dcramer): switch to instantsearch.{highlight,snippet}
    return `
      <a href="${escapeHtml(
        hit.url
      )}" class="list-group-item list-group-item-action">
      <h6 class="mb-1">
        ${hit._highlightResult?.title?.value || ''}
        ${categories}
      </h6>
      ${hit._snippetResult?.content?.value || ''}
      </a>
    `;
  };

  const renderHits = (renderOptions, isFirstRender) => {
    const { hits, widgetParams } = renderOptions;
    if (!hits.length) {
      widgetParams.container.innerHTML =
        '<div class="list-group search-results"><div class="list-group-item">No results</div></div>';
    } else {
      widgetParams.container.innerHTML = `<div class="list-group search-results">${hits
        .map(renderHit)
        .join('')}</div>`;
    }
  };

  const customHits = connectHits(renderHits);

  search.addWidget(
    searchBox({
      container: document.querySelector('#search-box'),
      placeholder: 'Search the docs',
      magnifier: false,
      reset: false,
      cssClasses: {
        input: 'form-control'
      }
    })
  );

  search.addWidget(
    customHits({
      container: document.querySelector('#hits')
    })
  );

  search.start();
});

$(document).on('click', '#search-clickplate', function(event) {
  $('#search-clickplate, #hits').addClass('d-none');
});
