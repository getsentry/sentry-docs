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
 * Creates a `ensureData` function that fetches from a URL only once. Subsequent
 * calls will used the already fetched data.
 */
export function makeFetchCache<DataType>({dataUrl, name}: Options) {
  let activeFetch: Promise<any> | null = null;
  let data: DataType | null = null;

  async function ensureData() {
    if (data) {
      return data;
    }

    async function fetchData() {
      try {
        const result = await fetch(dataUrl);
        data = await result.json();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Unable to fetch for ${name}: ${err.message}`);
        data = null;

        throw err;
      }

      activeFetch = null;
    }

    // If we're not already making a request do so now
    if (activeFetch === null) {
      activeFetch = fetchData();
    }

    await activeFetch;

    return data;
  }

  return ensureData;
}
