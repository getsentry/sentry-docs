import React from 'react';
import renderer from 'react-test-renderer';

import usePlatform from '../hooks/usePlatform';
import PlatformLink from '../platformLink';

jest.mock('../hooks/usePlatform');

describe('PlatformLink', () => {
  it('renders with to', () => {
    usePlatform.mockReturnValue([null, jest.fn(), false]);

    const tree = renderer.create(<PlatformLink to="/enriching-error-data/" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders without to', () => {
    usePlatform.mockReturnValue([null, jest.fn(), false]);

    const tree = renderer.create(<PlatformLink />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('uses platform context when available', () => {
    usePlatform.mockReturnValue([
      {
        key: 'ruby',
        caseStyle: 'snake_case',
        url: '/platforms/ruby/',
      },
      jest.fn(),
      false,
    ]);

    const tree = renderer.create(<PlatformLink to="/enriching-error-data/" />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
