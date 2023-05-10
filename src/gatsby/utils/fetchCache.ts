interface Options {
  /**
   * Function that handles making the API request to fetch data
   */
  dataFetch: () => Promise<any>;
  /**
   * The name of the registry, used for logging messages
   */
  name: string;
}

/**
 * Creates a `getData` function that fetches with dataFetch only once.
 * Subsiquent calls will used the already fetched data.
 */
export function makeFetchCache<DataType>({dataFetch, name}: Options) {
  let activeFetch: Promise<any> | null = null;
  let dataCache: DataType | null = null;

  async function getData() {
    if (dataCache) {
      return dataCache;
    }

    async function fetchData() {
      try {
        const result = await dataFetch();
        dataCache = result.data;
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
