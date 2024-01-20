const formatDate = date => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString('en-EN', options);

  return now;
};

const DateComponent = ({date}) => {
  return <time dateTime={date}>{formatDate(date)}</time>;
};

export default DateComponent;
