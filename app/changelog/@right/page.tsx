import {Fragment} from 'react';

import Months from 'sentry-docs/components/changelog/months';

import {ChangelogSearchParams, queryData} from '../helpers';

export default async function Page({
  searchParams,
}: {
  searchParams: ChangelogSearchParams;
}) {
  const {allMonths} = await queryData(searchParams);

  return (
    <Fragment>
      <h3 className="text-1xl text-primary font-semibold mb-2">Jump to:</h3>
      <Months months={allMonths} />
    </Fragment>
  );
}
