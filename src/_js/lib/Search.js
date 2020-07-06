import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { connectHits } from 'instantsearch.js/es/connectors';
import { index, searchBox } from 'instantsearch.js/es/widgets';

$(function() {
  const config = window.ALGOLIA || {};

  const searchClient = algoliasearch(config.appId, config.apiKey);

  const search = instantsearch({
    indexName: config.indexName,
    searchClient,
    searchFunction: function(helper) {
      var $hits = $('#hits > div');
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
    const categories = hit.categories?.length
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

  const renderGatsbyHit = hit => {
    const categories = hit.categories?.length
      ? hit.categories.map(
          category =>
            `<span class="badge badge-secondary">${escapeHtml(category)}</span>`
        )
      : '';
    return `
      <a href="${escapeHtml(
        hit.fields.slug
      )}" class="list-group-item list-group-item-action">
      <h6 class="mb-1">
        ${hit._highlightResult?.title?.value || ''}
        ${categories}
      </h6>
      ${hit._snippetResult?.excerpt?.value || ''}
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

  // hardcode to gatsby production index
  const renderGatsbyHits = (renderOptions, isFirstRender) => {
    const { hits, widgetParams } = renderOptions;
    if (!hits.length) {
      widgetParams.container.innerHTML = '';
    } else {
      widgetParams.container.innerHTML = `<div class="list-group search-results">${hits
        .map(renderGatsbyHit)
        .join('')}</div>`;
    }
  };

  search.addWidgets([
    searchBox({
      container: document.querySelector('#search-box'),
      placeholder: 'Search the docs',
      showSubmit: false,
      showReset: false,
      cssClasses: {
        input: 'form-control'
      }
    }),
    index({ indexName: 'sentry-gatsby-docs' }).addWidgets([
      connectHits(renderGatsbyHits)({
        container: document.querySelector('#hits_gatsby')
      })
    ]),
    connectHits(renderHits)({
      container: document.querySelector('#hits_jekyll')
    })
  ]);

  search.start();
});

$(document).on('click', '#search-clickplate', function(event) {
  $('#search-clickplate, #hits > div').addClass('d-none');
});
