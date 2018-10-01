// These are the variables that can be replaced in the document
export const tokens = [
  'DSN',
  'PUBLIC_DSN',
  'PUBLIC_KEY',
  'SECRET_KEY',
  'API_URL',
  'PROJECT_ID',
  'ORG_NAME',
  'PROJECT_NAME',
  'MINIDUMP_URL'
];

// Helper to generate a regex from the approved tokens
const tokenRegex = function() {
  var str = `___(${tokens.join('|')})___`;
  var re = new RegExp(str, 'g');
  return re;
};

const renderDropdownItem = function(item) {
  return `<a href="#" class="dropdown-item" data-interactive-content-item data-id="${
    item.id
  }">${item.ORG_NAME} / ${item.PROJECT_NAME}</a>`;
};

const renderDropdownHeader = function(item) {
  return `<h6 class="dropdown-header">${item}</h6>`;
};

const renderDropdown = function(list, selected) {
  if (!list) return;
  let current = preferredProject();
  const grouped = list.reduce((obj, item) => {
    if (obj[item.group] === undefined) obj[item.group] = [];
    obj[item.group].push(item);
    return obj;
  }, {});

  return `
    <div class="dropdown">
      <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-not-dynamic>
        ${current.ORG_NAME} / ${current.PROJECT_NAME}
      </a>

      <div class="dropdown-menu" aria-hidden="true">${Object.keys(grouped)
        .map(key => {
          return `${renderDropdownHeader(key)}${grouped[key]
            .map(renderDropdownItem)
            .join('')}`;
        })
        .join('')}</div>
    </div>
  `;
};

const preferredProject = function() {
  const { projectPref, projects } = User.userData;
  return projects.find(({ id }) => id === projectPref);
};

// Updates all tokens to show values based on the values stored in localStorage
const updateTokens = function() {
  $('[data-user-content]').each(function(i, el) {
    const $el = $(el);
    const key = $el.data('user-content');
    const data = preferredProject();
    if (data) $el.html(unescape(data[key]));
  });

  $('[data-user-content-switcher-mount]').each(function(i, el) {
    const $el = $(el);
    $el.html(renderDropdown(User.userData.projects, User.userData.projectPref));
  });

  $(document).trigger('userContent.didLoad');
};

const wrapTokens = function() {
  // Update UI with our widgets
  $('main pre').each(function(i, el) {
    const $el = $(el);

    if (!tokenRegex().test($el.html())) return true;

    // Wrap all tokens with an element that can be used for updating
    if (tokenRegex().test($el.html())) {
      const content = $el.html().replace(tokenRegex(), function(match) {
        const token = match.replace(/___/g, '');
        return `<span data-user-content="${token}"></span>`;
      });
      $el.html(content);
    }

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
  // Update tokens whenever the User data updates
  $(document).on('user.didUpdate', function(event) {
    wrapTokens();
    updateTokens();

    $(document).on('page.didUpdate', function() {
      wrapTokens();
      updateTokens();
    });
  });

  const ucSelector = '[data-user-content-switcher] .dropdown-item';
  $(document).on('click', ucSelector, function(event) {
    event.preventDefault();
    const id = $(event.target).data('id');
    if (id) User.update({ projectPref: id });
  });
};

export default { init };
