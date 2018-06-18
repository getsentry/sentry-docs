import qs from 'query-string';

const init = function() {
  const params = qs.parse(location.search);
  $('input[name="q"]').val(params.q);

  //
  //
  // TODO: $.ajax here
  //
  //
};

export default { init };
