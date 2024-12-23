import fs from 'fs';
import path from 'path';

// pipe two functions together
function pipe<T, U, V>(f: (x: T) => U, g: (y: U) => V): (x: T) => V;
// pipe three functions
function pipe<T, U, V, W>(f: (x: T) => U, g: (y: U) => V, h: (z: V) => W): (x: T) => W;
function pipe(...fns: Function[]) {
  return x => fns.reduce((v, f) => f(v), x);
}

const map =
  <T, U>(fn: (a: T) => U) =>
  (input: T[]) =>
    input.map(fn);

const walkDir = (fullPath: string) => {
  return fs.statSync(fullPath).isFile() ? fullPath : getAllFilesRecursively(fullPath);
};

const pathJoinPrefix = (prefix: string) => (extraPath: string) =>
  path.join(prefix, extraPath);

/**
 * @returns Array of file paths
 */
const getAllFilesRecursively = (folder: string): [string] => {
  return pipe(
    // yes, this arrow function is necessary to narrow down the readdirSync overload
    (x: string) => fs.readdirSync(x),
    map(pipe(pathJoinPrefix(folder), walkDir)),
    // flattenArray
    x => x.flat(Infinity)
  )(folder) as [string];
};

export default getAllFilesRecursively;
