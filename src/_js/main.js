import 'bootstrap';
import UserContent from './lib/UserContent';
import Tracking from './lib/Tracking';
import User from './lib/User';
import Search from './lib/Search';
import DynamicLoad from './lib/DynamicLoad';
import './lib/PlatformContent';
import './lib/HeaderLinker';
import './lib/Feedback';
import './lib/Sidebar';

$(document).on('page.willUpdate', function(event) {
  $('[data-toggle="tooltip"]').tooltip('dispose');
});

$(document).on('page.didUpdate', function(event) {
  $('[data-toggle="tooltip"]').tooltip();
});

$(function() {
  UserContent.init();
  Tracking.init();
  Search.init();
  new DynamicLoad().registerHandlers();

  window.User = new User();
  window.User.init();
  $(document).trigger('page.didUpdate');
});
