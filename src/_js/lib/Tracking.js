import { google, twitter, facebook, linkedin, bing, hubspot, amplitude } from './Trackers';

const init = function() {
  const namespace = 'trackersOk';

  loadIfTrackersOk.push(google);
  loadIfTrackersOk.push(facebook);
  loadIfTrackersOk.push(hubspot);
  loadIfTrackersOk.push(amplitude);

  // If we've been given permission to track, set a cookie that we can check
  // later to hide the banner, then load all of the trackers we have deferred.
  //
  // Returns nothing
  const acceptTrackers = function() {
    if (!localStorage.getItem(namespace)) {
      localStorage.setItem(namespace, true);
      $('[data-tracking-widget]').addClass('d-none');
    }

    while (loadIfTrackersOk.length > 0) {
      loadIfTrackersOk.shift()();
    }
    window.ra.event('docs.cookie_consent', {
      consent: 'yes',
    });
  };

  const rejectTrackers = function() {
    if (!localStorage.getItem(namespace)) {
      localStorage.setItem(namespace, false);
      $('[data-tracking-widget]').addClass('d-none');
    }
    window.ra.event('docs.cookie_consent', {
      consent: 'no',
    });
  };

  // If we have not been given permission to track yet, show the banner.
  //
  // Returns nothing
  const showWidget = function() {
    $('[data-tracking-widget]').removeClass('d-none');
  };

  switch (localStorage.getItem(namespace)) {
    case 'true':
      acceptTrackers();
      break;
    case 'false':
      break;
    default:
      showWidget();
  }

  $('[data-tracking-widget]').on('click', '[data-accept]', acceptTrackers);
  $('[data-tracking-widget]').on('click', '[data-reject]', rejectTrackers);
};

export default { init };
