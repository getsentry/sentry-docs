const formatDate = date => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString('en-EN', options);

  return now;
};

function DateComponent({date}) {
  return <time dateTime={date}>{formatDate(date)}</time>;
}

export default DateComponent;
