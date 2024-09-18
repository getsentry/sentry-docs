const formatDate = (date: string | Date) => {
  const now = new Date(date).toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

  return now;
};

export function DateComponent({date}: {date: string | Date}) {
  return <time dateTime={formatDate(date)}>{formatDate(date)}</time>;
}
