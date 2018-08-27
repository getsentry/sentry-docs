import lunr from 'lunr';

class Lunr {
  constructor({ cacheUrl, indexUrl, maxLength }) {
    this.cacheUrl = cacheUrl;
    this.indexUrl = indexUrl;
    this.maxLength = maxLength || 300;
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

  // Truncate the document to a given length, placing the top matching term at
  // the center, or as close to it as possible if the match is near the
  // beginning or end of the string.
  createExcerpt(str, rawMatches) {
    // rawMatches is ordered by score so the first match is the best. The first
    // value is the start position in the string and the second is the length

    // Create some brain friendly variables
    const termStart = rawMatches[0][0];
    const termLength = rawMatches[0][1];
    const termEnd = termStart + termLength;

    // Exact text of the matched item
    const term = str.substr(termStart, termLength);

    // Distance from the term from the beginning or end of the string
    const margin = Math.round(this.maxLength - termLength / 2);

    // First we determine where the start and end point is exactly
    const excerptStart = margin < termStart ? termStart - margin : 0;
    const excerptEnd =
      str.length > termEnd + margin ? termEnd + margin : str.length;

    const prefix = excerptStart > 0 ? '…' : '';
    const suffix = excerptEnd < str.length ? '…' : '';

    const highlighted = rawMatches
      // Copy the array
      .slice(0)
      // Sort it by start location, in reverse so we can safely iterate
      .sort((a, b) => b[0] - a[0])
      // Filter out the terms that don't fall within the excerpt
      .filter(([i, length]) => excerptStart < i && i + length < excerptEnd)
      // Make replacements
      .reduce((excerpt, [i, length]) => {
        // Account for the offset caused by trimming
        const start = i - excerptStart;
        const end = start + length;
        const before = excerpt.substring(0, start);
        const term = excerpt.substring(start, end);
        const after = excerpt.substring(end);

        return `${before}<strong>${term}</strong>${after}`;
      }, str.substring(excerptStart, excerptEnd));

    return `${prefix}${highlighted}${suffix}`;
  }
}

export default Lunr;
