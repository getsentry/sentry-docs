import 'bootstrap';
import PlatformContent from './lib/PlatformContent';
import UserContent from './lib/UserContent';
import Tracking from './lib/Tracking';
import User from './lib/User';
import DynamicLoad from './lib/DynamicLoad';
import Search from './lib/Search';

$(document).on('page.didUpdate', function(event) {
  $('[data-toggle="tooltip"]').tooltip();
});

$(function() {
  PlatformContent.init();
  UserContent.init();
  Tracking.init();
  DynamicLoad.init();
  Search.init();

  window.User = new User();
  window.User.init();
  $(document).trigger('page.didUpdate');
});
