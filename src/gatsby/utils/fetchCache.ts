/**
 * For some reason we sometimes see errors fetching from our registry, because
 * of that we retry the fetches
 *
 * The error was:
 *
 *   Client network socket disconnected before secure TLS connection was established
 */
async function fetchRetry(url: string, opts: RequestInit & {retry?: number}) {
  let retry = opts?.retry ?? 1;

  while (retry > 0) {
    try {
      return await fetch(url, opts);
    } catch (e) {
      if (retry !== 0) {
        // eslint-disable-next-line no-console
        console.warn(`failed to fetch \`${url}\`. Retrying for ${retry} more times`);
        retry = retry - 1;
        continue;
      }

      throw e;
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
        const result = await fetchRetry(dataUrl, {retry: 5});
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
