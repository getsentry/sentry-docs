import 'bootstrap';
import PlatformContent from './lib/PlatformContent';
import InteractiveContent from './lib/InteractiveContent';
import User from './lib/User';

$(function() {
  PlatformContent.init();
  InteractiveContent.init();
  window.User = new User();
  window.User.init();
  $('[data-toggle="tooltip"]').tooltip();
});
