import {readdir} from 'fs/promises';
import path from 'path';
import pLimit from 'p-limit';

/**
 * @returns Array of file paths
 */
const getAllFilesRecursively = async (folder: string): Promise<string[]> => {
  return (await readdir(folder, {withFileTypes: true, recursive: true}))
    .filter(dirent => dirent.isFile())
    .map(dirent => path.join(dirent.parentPath || dirent.path, dirent.name));
};

/**
 * Utility function to limit concurrency of async operations
 * @param fn - The async function to limit
 * @param options - Options including concurrency limit
 * @returns A limited version of the function
 */
export function limitFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {concurrency: number}
): T {
  const limit = pLimit(options.concurrency);
  return ((...args: Parameters<T>) => limit(() => fn(...args))) as T;
}

export default getAllFilesRecursively;
