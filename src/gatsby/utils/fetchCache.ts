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
        const result = await fetch(dataUrl, {
          headers: {'Content-Type': 'application/json'},
          keepalive: true,
        });
        dataCache = await result.json();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Unable to fetch for ${name}: ${err.message}`);
        dataCache = null;
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
