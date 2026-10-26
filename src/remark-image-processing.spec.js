import {createHash} from 'node:crypto';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

import {bundleMDX} from 'mdx-bundler';
import remarkMdxImages from 'remark-mdx-images';
import sharp from 'sharp';
import {beforeAll, describe, expect, it} from 'vitest';

import remarkImageProcessing, {remarkImageSizeToSrc} from './remark-image-processing';

const createImage = (width, height, format) => {
  const image = sharp({
    create: {width, height, channels: 3, background: {r: 12, g: 34, b: 56}},
  });
  return image[format]().toBuffer();
};

const imageNode = url => ({type: 'image', url});

const tree = (...nodes) => ({type: 'root', children: nodes});

const md5 = buffer => createHash('md5').update(buffer).digest('hex').slice(0, 8);

describe('remarkImageProcessing', () => {
  let publicFolder;
  let sourceFolder;
  let transform;
  const hashes = {};

  beforeAll(async () => {
    const root = mkdtempSync(path.join(tmpdir(), 'remark-image-processing-'));
    publicFolder = path.join(root, 'public');
    sourceFolder = path.join(root, 'source');
    mkdirSync(path.join(publicFolder, 'img'), {recursive: true});
    mkdirSync(sourceFolder, {recursive: true});

    const fixtures = [
      [path.join(publicFolder, 'img', 'public.png'), await createImage(120, 80, 'png')],
      [path.join(sourceFolder, 'relative.png'), await createImage(200, 150, 'png')],
      [path.join(sourceFolder, 'photo.jpg'), await createImage(64, 48, 'jpeg')],
      [path.join(sourceFolder, 'animation.gif'), await createImage(30, 20, 'gif')],
      [path.join(sourceFolder, 'wide.png'), await createImage(2942, 1360, 'png')],
      [path.join(sourceFolder, 'boundary.png'), await createImage(900, 600, 'png')],
      [path.join(sourceFolder, 'thin.png'), await createImage(1801, 1, 'png')],
      [path.join(sourceFolder, 'portrait.png'), await createImage(600, 1200, 'png')],
      [
        path.join(sourceFolder, 'icon.svg'),
        Buffer.from(
          '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16"/></svg>'
        ),
      ],
    ];

    for (const [filePath, buffer] of fixtures) {
      writeFileSync(filePath, buffer);
      hashes[path.basename(filePath)] = md5(buffer);
    }

    transform = remarkImageProcessing({publicFolder, sourceFolder});

    return () => rmSync(root, {recursive: true, force: true});
  });

  it.each([
    ['./relative.png', 'relative.png', '200x150'],
    ['./photo.jpg', 'photo.jpg', '64x48'],
    ['./animation.gif', 'animation.gif', '30x20'],
    ['./icon.svg', 'icon.svg', '16x16'],
  ])('appends the hash and dimensions for %s', async (url, fixture, size) => {
    const node = imageNode(url);
    await transform(tree(node));

    expect(node.url).toBe(`${url}?v=${hashes[fixture]}#${size}`);
  });

  it('resolves absolute urls against the public folder', async () => {
    const node = imageNode('/img/public.png');
    await transform(tree(node));

    expect(node.url).toBe(`/img/public.png?v=${hashes['public.png']}#120x80`);
  });

  it.each([
    ['wide.png', '900x416'],
    ['boundary.png', '900x600'],
    ['thin.png', '900x1'],
    ['portrait.png', '600x1200'],
  ])(
    'caps width without upscaling and preserves the content hash for %s',
    async (fixture, size) => {
      const node = imageNode(`./${fixture}`);
      await transform(tree(node));

      expect(node.url).toBe(`./${fixture}?v=${hashes[fixture]}#${size}`);
    }
  );

  it.each(['https://example.com/img.png', 'http://example.com/img.png', '//cdn/img.png'])(
    'leaves the external image %s untouched',
    async url => {
      const node = imageNode(url);
      await transform(tree(node));

      expect(node.url).toBe(url);
    }
  );

  it('processes every image in the tree', async () => {
    const nodes = [imageNode('./photo.jpg'), imageNode('./icon.svg')];
    await transform(tree(...nodes, {type: 'paragraph', children: []}));

    expect(nodes.map(node => node.url)).toEqual([
      `./photo.jpg?v=${hashes['photo.jpg']}#64x48`,
      `./icon.svg?v=${hashes['icon.svg']}#16x16`,
    ]);
  });

  it('rejects when the image is missing', async () => {
    await expect(transform(tree(imageNode('./nope.png')))).rejects.toThrow(/ENOENT/);
  });
});

describe('remarkImageSizeToSrc', () => {
  it('keeps the size hash after esbuild bundles the image', async () => {
    const root = mkdtempSync(path.join(tmpdir(), 'remark-image-size-to-src-'));
    writeFileSync(path.join(root, 'wide.png'), await createImage(2942, 1360, 'png'));

    try {
      const {code} = await bundleMDX({
        source: '![wide](./wide.png)',
        cwd: root,
        mdxOptions(options) {
          options.remarkPlugins = [
            [remarkImageProcessing, {publicFolder: root, sourceFolder: root}],
            remarkMdxImages,
            remarkImageSizeToSrc,
          ];
          return options;
        },
        esbuildOptions(options) {
          options.loader = {...options.loader, '.png': 'file'};
          options.outdir = path.join(root, 'out');
          options.publicPath = '/mdx-images';
          options.write = true;
          return options;
        },
      });

      expect(code).toMatch(/"\/mdx-images\/wide-[A-Z0-9]+\.png"/);
      expect(code).toContain('"#900x416"');
    } finally {
      rmSync(root, {recursive: true, force: true});
    }
  });
});
