import qs from 'query-string';
import Lunr from './Lunr';

const renderResult = function(data) {
  const relativePath = data.path.replace(/^\/|\/$/g, '');

  const url = `${window.location.origin}/${relativePath}`;
  const path = relativePath
    .split(/[#\/]/)
    .map(segment => {
      return `<span class="path-segment">${segment}</span>`;
    })
    .join('');
  return $(`
    <div class="mb-3">
      <h3 class="h5 mb-0"><a href="${url}">${data.title}</a></h3>
      <div class="pl-2">
        <aside>(${path})</aside>
        <p class="mb-0">${data.excerpt}</p>
      </div>
    </div>
  `);
};

const renderResults = function(results, query) {
  const $results = $('[data-search-results]').clone();
  if (!results || !results.length) {
    const msg = `No results${!!results ? `matching "${query}"` : ''}`;
    console.log(msg);
    $results.append(`<p>${msg}</p>`);
  }
  $.each(results, function(i, result) {
    $results.append(renderResult(result));
  });
  return $results;
};

class Search {
  constructor($target) {
    this.data;
    this.results = {};
    this.pageTemplate = $('html').html();

    this.init = this.init.bind(this);
    this.loader = this.loader.bind(this);

    this.$target = $target;
    this.Lunr = new Lunr({
      cacheUrl: '/search/cache.json',
      indexUrl: '/search/index.json'
    });
  }

  // Fetch search results and attach the results
  init() {
    const params = qs.parse(location.search);

    if (!params.q) {
      return Promise.resolve().then(() => {
        $('[data-search-results]').append(renderResults());
      });
    }
    $('input[name="q"]').val(params.q);

    return this.Lunr.search(params.q).then(results => {
      $('[data-search-results]').append(renderResults(results, params.q));
    });
  }

  // This is a loader for DynamicLoader. It generates a full HTML page that
  // DynamicLoader can parse.
  loader(url) {
    const { search } = url;
    const params = qs.parse(search);
    return fetchResults(params).then(res => {
      const $page = $(this.pageTemplate);
      return $page
        .find('[data-search-results]')
        .append(renderResults(res, params))
        .html();
    });
  }
}

export default new Search();
