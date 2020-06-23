import 'bootstrap';
import UserContentUI from './lib/UserContentUI';
import Tracking from './lib/Tracking';
import User from './lib/User';
// import DynamicLoad from './lib/DynamicLoad';
import './lib/PlatformContent';
import './lib/HeaderLinker';
import './lib/Search';
import './lib/Sidebar';
import './lib/TableOfContents';

$(document).on('page.willUpdate', function(event) {
  $('[data-toggle="tooltip"]').tooltip('dispose');
});

$(document).on('page.didUpdate', function(event) {
  $('[data-toggle="tooltip"]').tooltip();
});

$(function() {
  UserContentUI.init();
  Tracking.init();
  // new DynamicLoad().registerHandlers();

  window.User = new User();
  window.User.init();
  $(document).trigger('page.didUpdate');
});
