const formatDate = date => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };
  const now = new Date(date).toLocaleDateString('en-EN', options);

  return now;
};

const DateComponent = ({date}) => {
  return <time dateTime={date}>{formatDate(date)}</time>;
};

export default DateComponent;
