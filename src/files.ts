import {readdir} from 'fs/promises';
import path from 'path';

/**
 * @returns Array of file paths
 */
const getAllFilesRecursively = async (folder: string): Promise<string[]> => {
  return (await readdir(folder, {withFileTypes: true, recursive: true}))
    .filter(dirent => dirent.isFile())
    .map(dirent => path.join(dirent.parentPath || dirent.path, dirent.name));
};

export default getAllFilesRecursively;
