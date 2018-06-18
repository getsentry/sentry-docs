import 'bootstrap';
import PlatformContent from './lib/PlatformContent';
import InteractiveContent from './lib/InteractiveContent';
import User from './lib/User';
import Search from './lib/Search';

$(function() {
  PlatformContent.init();
  InteractiveContent.init();
  Search.init();
  window.User = new User();
  window.User.init();
  $('[data-toggle="tooltip"]').tooltip();
});
