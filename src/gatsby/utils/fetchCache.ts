async function fetchRetry(url: string, opts: RequestInit & {retry?: number}) {
  let retry = (opts && opts.retry) || 3;

  while (retry > 0) {
    try {
      return await fetch(url, opts);
    } catch (e) {
      retry = retry - 1;
      if (retry === 0) {
        throw e;
      }
    }
  }

  return null;
}

interface Options {
  /**
   * URL to fetch the data from
   */
  dataUrl: string;
  /**
   * The name of the registry, used for logging messages
   */
  name: string;
}

/**
 * Creates a `getData` function that fetches with dataFetch only once.
 * Subsiquent calls will used the already fetched data.
 */
export function makeFetchCache<DataType>({dataUrl, name}: Options) {
  let activeFetch: Promise<any> | null = null;
  let dataCache: DataType | null = null;

  async function getData() {
    if (dataCache) {
      return dataCache;
    }

    async function fetchData() {
      try {
        const result = await fetchRetry(dataUrl, {retry: 5});
        dataCache = await result.json();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Unable to fetch for ${name}: ${err.message}`);
        dataCache = null;

        throw err;
      }

      activeFetch = null;
    }

    // If we're not already making a request do so now
    if (activeFetch === null) {
      activeFetch = fetchData();
    }

    await activeFetch;

    return dataCache;
  }

  return getData;
}
