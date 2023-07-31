import {buildTocTree} from '../tableOfContents';

describe('buildTocTree', function () {
  it('constructs a simple TOC tree', function () {
    const headings = [
      {
        id: 'item-1',
        title: 'Item 1',
        level: 1,
      },
      {
        id: 'item-2',
        title: 'Item 2',
        level: 2,
      },
      {
        id: 'item-3',
        title: 'Item 3',
        level: 3,
      },
      {
        id: 'item-4',
        title: 'Item 4',
        level: 2,
      },
      {
        id: 'item-5',
        title: 'Item 5',
        level: 1,
      },
    ];

    const expectedTree = [
      {
        id: 'item-1',
        title: 'Item 1',
        level: 1,
        items: [
          {
            id: 'item-2',
            title: 'Item 2',
            level: 2,
            items: [
              {
                id: 'item-3',
                title: 'Item 3',
                level: 3,
                items: [],
              },
            ],
          },
          {
            id: 'item-4',
            title: 'Item 4',
            level: 2,
            items: [],
          },
        ],
      },
      {
        id: 'item-5',
        title: 'Item 5',
        level: 1,
        items: [],
      },
    ];

    expect(buildTocTree(headings)).toEqual(expectedTree);
  });

  it('handles out of order items', function () {
    const headings = [
      {
        id: 'item-1',
        title: 'Item 1',
        level: 3,
      },
      {
        id: 'item-2',
        title: 'Item 2',
        level: 2,
      },
      {
        id: 'item-3',
        title: 'Item 3',
        level: 1,
      },
    ];

    const expectedTree = [
      {
        id: 'item-1',
        title: 'Item 1',
        level: 3,
        items: [],
      },
      {
        id: 'item-2',
        title: 'Item 2',
        level: 2,
        items: [],
      },
      {
        id: 'item-3',
        title: 'Item 3',
        level: 1,
        items: [],
      },
    ];

    expect(buildTocTree(headings)).toEqual(expectedTree);
  });

  it('handles skipping levels', function () {
    const headings = [
      {
        id: 'item-1',
        title: 'Item 1',
        level: 1,
      },
      {
        id: 'item-2',
        title: 'Item 2',
        level: 3,
      },
      {
        id: 'item-3',
        title: 'Item 3',
        level: 2,
      },
    ];

    const expectedTree = [
      {
        id: 'item-1',
        title: 'Item 1',
        level: 1,
        items: [
          {
            id: 'item-2',
            title: 'Item 2',
            level: 3,
            items: [],
          },
          {
            id: 'item-3',
            title: 'Item 3',
            level: 2,
            items: [],
          },
        ],
      },
    ];

    expect(buildTocTree(headings)).toEqual(expectedTree);
  });
});
