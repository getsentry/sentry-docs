// These are the variables that can be replaced in the document
export const tokens = [
  'DSN',
  'PUBLIC_DSN',
  'PUBLIC_KEY',
  'SECRET_KEY',
  'API_URL',
  'PROJECT_ID',
  'ORG_NAME',
  'ORG_ID',
  'PROJECT_NAME',
  'MINIDUMP_URL',
  'UNREAL_URL'
];

// Helper to generate a regex from the approved tokens
const tokenRegex = function() {
  var str = `___(${tokens.join('|')})___`;
  var re = new RegExp(str, 'g');
  return re;
};

const renderDropdownItem = function(item, selected) {
  return `<a href="#" class="dropdown-item${
    item.id === selected.id ? ' active' : ''
  }" data-id="${item.id}">${item.ORG_NAME} / ${item.PROJECT_NAME}</a>`;
};

const renderDropdownHeader = function(item) {
  return `<h6 class="dropdown-header">${item}</h6>`;
};

const renderDropdown = function(list, preferred) {
  // take list (which is a flat structure) and create an object of arrays,
  // keyed by org slug
  const grouped = list.reduce((obj, item) => {
    if (obj[item.group] === undefined) obj[item.group] = [];
    obj[item.group].push(item);
    return obj;
  }, {});

  return `
    <div class="dropdown">
      <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-not-dynamic>
        ${preferred.ORG_NAME} / ${preferred.PROJECT_NAME}
      </a>

      <div class="dropdown-menu user-content-menu" aria-hidden="true">
      ${Object.keys(grouped)
        .map(key => {
          return `${renderDropdownHeader(key)}${grouped[key]
            .map(item => renderDropdownItem(item, preferred))
            .join('')}`;
        })
        .join('')}
      </div>
    </div>
  `;
};

// Updates all tokens to show values based on the values stored in localStorage
const updateTokens = function({ projects, preferred }) {
  $('[data-user-content]').each(function(i, el) {
    const $el = $(el);
    const key = $el.data('user-content');
    $el.html(unescape(preferred[key]));
  });

  $('[data-user-content-switcher-mount]').each(function() {
    $(this).html(renderDropdown(projects, preferred));
  });

  $(document).trigger('userContent.didLoad');
};

const wrapTokens = function() {
  // Update UI with our widgets
  $('main pre').each(function(i, el) {
    const $el = $(el);

    if (!tokenRegex().test($el.html())) return true;

    // Wrap all tokens with an element that can be used for updating
    const content = $el.html().replace(tokenRegex(), function(match) {
      const token = match.replace(/___/g, '');
      return `<span data-user-content="${token}"></span>`;
    });
    $el.html(content);

    // Add a dropdown for switching the data.
    $el.before(`
      <div class="py-1 px-2 text-white" data-user-content-switcher>
        <small>Showing<span class="d-none d-sm-inline"> configuration for</span></small>
        <div data-user-content-switcher-mount></div>
      </div>
    `);
  });
};

const init = function() {
  $('[data-hide-when-logged-in]').addClass('d-none');

  // Update tokens whenever the User data updates
  $(document).on('user.didUpdate', function(event, userData) {
    wrapTokens();
    updateTokens(userData);

    $(document).on('page.didUpdate', function() {
      wrapTokens();
      updateTokens(userData);
    });
  });

  const ucSelector = '[data-user-content-switcher] .dropdown-item';
  $(document).on('click', ucSelector, function(event) {
    event.preventDefault();
    const id = $(event.target).data('id');
    User.setPreference(id);
  });
};

export default { init };
