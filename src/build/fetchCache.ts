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
        console.warn(`failed to fetch \`${url}\`. Retrying for ${retry} more times`);
        retry -= 1;
        continue;
      }

      throw e;
    }
  }

  return null;
}

interface Options<DataType> {
  /**
   * URL to fetch the data from
   */
  dataUrl: string;
  /**
   * The name of the registry, used for logging messages
   */
  name: string;
  parseResponse?: (response: Response) => Promise<DataType>;
}

/**
 * Creates a `ensureData` function that fetches from a URL only once. Subsequent
 * calls will used the already fetched data.
 */
export function makeFetchCache<DataType>({
  dataUrl,
  name,
  parseResponse = response => response.json() as Promise<DataType>,
}: Options<DataType>) {
  let activeFetch: Promise<any> | null = null;
  let data: DataType | null = null;

  async function ensureData() {
    if (data) {
      return data;
    }

    async function fetchData() {
      try {
        console.log(`Fetching registry ${name} (${dataUrl})`);
        const result = await fetchRetry(dataUrl, {retry: 5});
        data = result ? await parseResponse(result) : null;

        console.log(`Got data for registry ${name} (${dataUrl})`);
      } catch (err) {
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
