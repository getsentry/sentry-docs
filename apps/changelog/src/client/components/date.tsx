const formatDate = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString('en-EN', options);

  return now;
};

function DateComponent({date}: {date: string | Date}) {
  return <time dateTime={formatDate(date)}>{formatDate(date)}</time>;
}

export default DateComponent;
