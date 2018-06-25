// These are the variables that can be replaced in the document
export const tokens = [
  'DSN',
  'PUBLIC_DSN',
  'PUBLIC_KEY',
  'SECRET_KEY',
  'API_URL',
  'ENCODED_API_KEY',
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

const slugify = function(input) {
  return input
    .toLowerCase()
    .replace(/___/g, '')
    .replace(/_/g, '-');
};

// Wrap all instances of ___VARIABLE___ with a span we can use for easy updates
const wrapTokens = function($src) {
  const content = $src.html().replace(tokenRegex(), function(match) {
    const slug = slugify(match);
    const kind = slug === 'encoded-api-key' ? 'key' : 'dsn';
    const list = User.userData[`${kind}List`];
    const grouped = list.reduce((obj, item) => {
      if (obj[item.group] === undefined) obj[item.group] = [];
      obj[item.group].push(item);
      return obj;
    }, {});

    return `
      <span class="dropdown mb-1" data-toggle="tooltip" data-placement="left" title="Showing example configuration">
        ${renderDropdownTarget({ kind, slug, match })}

        <div class="dropdown-menu family-sans" aria-hidden="true">${Object.keys(
          grouped
        )
          .map(key => {
            return `${renderDropdownHeader(key)}${grouped[key]
              .map(renderDropdownItem)
              .join('|')}`;
          })
          .join('')}</div>
      </span>
    `.replace(/(\n|\s{2})/g, '');
  });
  $src.html(content);
  $('[data-toggle="tooltip"]').tooltip('enable');
};

const renderDropdownTarget = function({ kind, slug, value }) {
  return `<a data-interactive data-kind="${kind}" data-key="${slug}" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${value}</a>`;
};

const renderDropdownItem = function(item) {
  return `<a href="#" class="dropdown-item" data-interactive-content-item data-id="${
    item.id
  }" data-kind="${item.kind}">${item['project-name']}</a>`;
};

const renderDropdownHeader = function(item) {
  return `<h6 class="dropdown-header">${item}</h6>`;
};

const renderDropdown = function(list) {
  if (!list) return;
  let current = list[0];
  const grouped = list.reduce((obj, item) => {
    if (obj[item.group] === undefined) obj[item.group] = [];
    obj[item.group].push(item);
    return obj;
  }, {});

  return `
    <div class="dropdown mb-1">
      <a class="btn btn-sm btn-secondary dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        ${current.name}
      </a>

      <div class="dropdown-menu" aria-hidden="true">${Object.keys(grouped)
        .map(key => {
          return `${renderDropdownHeader(key)}${grouped[key]
            .map(renderDropdownItem)
            .join('|')}`;
        })
        .join('')}</div>
    </div>
  `;
};

const setActiveId = function(kind, id) {
  localStorage.setItem(`${kind}Preference`, id);
};

const getData = function(kind) {
  const id = localStorage.getItem(`${kind}Preference`) || -1;
  const list = User.userData[`${kind}List`];
  const data = list.find(obj => parseInt(obj.id) === parseInt(id));
  return data;
};

// Updates all tokens to show values based on the values stored in localStorage
const updateTokens = function() {
  $('[data-interactive]').each(function(i, el) {
    const $el = $(el);
    const key = $el.data('key');
    const kind = $el.data('kind');
    const data = getData(kind);
    $el.html(unescape(data[key]));
    $el.closest('.dropdown').attr('data-original-title', data['project-name']);
  });
};

const init = function() {
  $(document).on('user.ready', function(event) {
    const $main = $('main').eq(0);
    const hasInteractiveContent = tokenRegex().test($main.html());
    if (hasInteractiveContent) {
      wrapTokens($main);
      updateTokens();
    }

    $(document).on('click', '[data-interactive-content-item]', function(event) {
      const $el = $(event.target);
      setActiveId($el.data('kind'), $el.data('id'));
      updateTokens();
    });

    $(document).trigger('dynamicContent.didLoad');
  });
};

export default { init };
