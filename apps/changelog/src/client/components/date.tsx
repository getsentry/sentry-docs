const formatDate = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  };
  const now = new Date(date).toLocaleDateString('en-EN', options);

  return now;
};

export function DateComponent({date}: {date: string | Date}) {
  return <time dateTime={formatDate(date)}>{formatDate(date)}</time>;
}
