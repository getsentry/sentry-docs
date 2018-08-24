import lunr from 'lunr';

class Lunr {
  constructor({ cacheUrl, indexUrl }) {
    this.cacheUrl = cacheUrl;
    this.indexUrl = indexUrl;
    this.data = null;
    this.index = null;
    this.cacheKey = null;

    this.fetchData = this.fetchData.bind(this);
    this.loadIndex = this.loadIndex.bind(this);
    this.buildIndex = this.buildIndex.bind(this);
    this.assembleResults = this.assembleResults.bind(this);
    this.search = this.search.bind(this);
    this.createExcerpt = this.createExcerpt.bind(this);
    this.fetchCacheKey = this.fetchCacheKey.bind(this);
  }

  search(query) {
    return this.fetchCacheKey()
      .then(this.loadIndex)
      .then(index => this.assembleResults(index, query));
  }

  fetchCacheKey() {
    if (this.cacheKey) return Promise.resolve(this.cacheKey);

    return $.ajax({
      type: 'GET',
      url: this.cacheUrl,
      dataType: 'json'
    }).then(({ key }) => {
      this.cacheKey = key;
      return key;
    });
  }

  fetchData() {
    return $.ajax({
      type: 'GET',
      url: this.indexUrl,
      dataType: 'json'
    }).then(({ index }) =>
      index.map(i => {
        i.body = i.body.replace(/\s+/g, ' ');
        return i;
      })
    );
  }

  loadIndex(key) {
    if (!key) return null;
    const lsCacheKey = 'searchCacheKeyV1';
    const lsDataKey = 'searchDataKeyV1';
    const lsIndexKey = 'searchIndexV1';

    const currentKey = localStorage.getItem(lsCacheKey);
    const currentData = localStorage.getItem(lsDataKey);
    const currentIndex = localStorage.getItem(lsIndexKey);

    if (currentKey === key && currentData && currentIndex) {
      this.data = JSON.parse(currentData);
      this.index = lunr.Index.load(JSON.parse(currentIndex));
      return this.index;
    } else {
      return this.fetchData().then(data => {
        this.data = data;
        this.index = this.buildIndex(data);
        try {
          localStorage.setItem(lsCacheKey, key);
          localStorage.setItem(lsDataKey, JSON.stringify(this.data));
          localStorage.setItem(lsIndexKey, JSON.stringify(this.index));
        } finally {
          return this.index;
        }
      });
    }
  }

  assembleResults(index, query) {
    if (!index) [];
    return index.search(query).map(results => {
      const data = this.data.find(x => x.id === results.ref);

      const { metadata } = results.matchData;

      const bodyMatches = Object.keys(metadata)
        .map(k => metadata[k].body)
        .reduce((arr, el) => {
          arr = arr.concat(el.position);
          return arr;
        }, []);

      return {
        path: data.id,
        title: data.title,
        excerpt: this.createExcerpt(data.body, bodyMatches)
      };
    });
  }

  buildIndex(documents) {
    return lunr(function() {
      this.ref('id');
      this.field('body');
      this.metadataWhitelist = ['position'];

      documents.forEach(function(doc) {
        this.add(doc);
      }, this);
    });
  }

  createExcerpt(str, matches) {
    const maxLength = 300;
    const firstMatch = matches[0];

    const term = str.substr(firstMatch[0] - 1, firstMatch[1]);
    const termHalf = Math.round(term.length / 2);
    const start = firstMatch[0] - (termHalf - Math.round(maxLength / 2));
    const end = start + maxLength;

    let modified = start > 0 ? '…' : '';
    modified += str.substr(start, maxLength);
    modified += end < str.length - 1 ? '…' : '';
    matches.sort((a, b) => b[0] - a[0]);
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const first = match[0] - start + 1;
      const last = first + match[1];
      if (first < 0 || modified.length < last) continue;
      const before = modified.substring(0, first);
      const term = modified.substring(first, last);
      const after = modified.substring(last);
      modified = `${before}<strong>${term}</strong>${after}`;
    }

    return modified;
  }
}

export default Lunr;
