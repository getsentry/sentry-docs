import Raven from 'raven-js';
import 'bootstrap';
import PlatformContent from './lib/PlatformContent';
import UserContent from './lib/UserContent';
import Tracking from './lib/Tracking';
import User from './lib/User';
import DynamicLoad from './lib/DynamicLoad';
import Search from './lib/Search';
import './lib/HeaderLinker';
import './lib/Feedback';
import './lib/Sidebar';

if (process.env.NODE_ENV === 'production') {
  const dsn = 'https://ad63ba38287245f2803dc220be959636@sentry.io/1267915';
  Raven.config(dsn).install();
}

$(document).on('page.willUpdate', function(event) {
  $('[data-toggle="tooltip"]').tooltip('dispose');
});

$(document).on('page.didUpdate', function(event) {
  $('[data-toggle="tooltip"]').tooltip();
});

$(function() {
  PlatformContent.init();
  UserContent.init();
  Tracking.init();
  Search.init();
  DynamicLoad.init();
  DynamicLoad.addLoader('^/search/', Search.loader);

  window.User = new User();
  window.User.init();
  $(document).trigger('page.didUpdate');
});
