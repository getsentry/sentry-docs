import 'bootstrap';
import PlatformContent from './lib/PlatformContent';
import InteractiveContent from './lib/InteractiveContent';
import Tracking from './lib/Tracking';
import User from './lib/User';

$(function() {
  PlatformContent.init();
  InteractiveContent.init();
  Tracking.init();
  window.User = new User();
  window.User.init();
  $('[data-toggle="tooltip"]').tooltip();
});
