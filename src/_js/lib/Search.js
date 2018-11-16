import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';
$(function() {
  const search = instantsearch({
    appId: 'OOK48W9UCL',
    apiKey: '2d64ec1106519cbc672d863b0d200782',
    indexName: 'sentry-docs',
    searchFunction: function(helper) {
      var $hits = $('#hits');
      if (helper.state.query === '') {
        $hits.addClass('d-none');
      } else {
        helper.search();
        $hits.removeClass('d-none');
      }
    }
  });

  search.addWidget(
    searchBox({
      container: '#search-box',
      placeholder: 'Search the docs',
      magnifier: false,
      reset: false,
      cssClasses: {
        input: 'form-control'
      }
    })
  );

  search.addWidget(
    hits({
      container: '#hits',
      cssClasses: {
        root: 'list-group search-results'
      },
      templates: {
        empty: '<div class="list-group-item">No results</div>',
        allItems:
          '{{#hits}}<a href="{{ url }}" class="list-group-item list-group-item-action"><h6 class="mb-1">{{{ _highlightResult.title.value }}}</h6>{{{ _snippetResult.content.value }}}</a>{{/hits}}'
      }
    })
  );

  search.start();
});
