const ORIGIN = process.env.JEKYLL_GETSENTRY_ORIGIN || 'https://sentry.io';

export default class User {
  constructor() {
    this.namespace = 'docsUserDataV1';
    this.userData = {
      projects: [constructDSNObject()],
      projectPref: -1
    };

    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
  }

  update(newData = {}) {
    this.userData = Object.assign({}, this.userData, newData);
    localStorage.setItem(this.namespace, JSON.stringify(this.userData));
    $(document).trigger('user.didUpdate', [this]);
  }

  init() {
    const cached = JSON.parse(localStorage.getItem(this.namespace));
    if (cached) this.update(cached);

    return $.ajax({
      type: 'GET',
      url: ORIGIN + '/docs/api/user/',
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    })
      .done(({ projects, api_keys, user }) => {
        window.ra.identify(user.id);
        const userData = { ...this.userData };
        if (projects && projects.length) {
          userData.projects = projects.map(constructDSNObject);
          if (userData.projectPref === -1)
            userData.projectPref = projects[0].id;
        }
        $('[data-hide-when-logged-in]').toggleClass(
          'd-none',
          user.isAuthenticated
        );
        this.update(userData);
      })
      .fail(() => {
        this.update();
      })
      .always(() => {
        window.ra.page();
      });
  }
}

const formatDsn = function(
  { publicKey, secretKey, scheme, host, pathSection, project },
  opts = { public: false }
) {
  const auth = opts.public ? publicKey : `${publicKey}:${secretKey}`;
  return `${scheme}${auth}@${host}${pathSection}${project}`;
};

const formatMinidumpURL = function(dsn) {
  const { scheme, host, pathSection, publicKey } = dsn;
  return `${scheme}${host}/api${pathSection}/minidump?sentry_key=${publicKey}`;
};

const formatAPIURL = function(dsn) {
  return `${dsn.scheme}${dsn.host}/api`;
};

const formatProjectLabel = function(project = {}) {
  const { projectName, teamName } = project;
  if (!projectName && !teamName) return null;

  return projectName.indexOf(teamName) === -1
    ? `${teamName} / ${projectName}`
    : projectName;
};

const constructDSNObject = function(project = {}) {
  let dsn;
  if (project.dsn) {
    // Transform the dsn into useful values
    const match = project.dsn.match(/^(.*?\/\/)(.*?):(.*?)@(.*?)(\/.*?)$/);
    const urlPieces = match[5].split(/\?/, 2);
    dsn = {
      scheme: escape(match[1]),
      publicKey: escape(match[2]),
      secretKey: `${escape(match[3])}`,
      host: escape(match[4]),
      pathSection: escape(match[5]),
      project: parseInt(urlPieces[0].substring(1), 10) || 1
    };
  } else {
    dsn = {
      scheme: 'https://',
      publicKey: '&lt;key&gt;',
      secretKey: '&lt;secret&gt;',
      host: 'sentry.io',
      pathSection: '/',
      project: '&lt;project&gt;'
    };
  }

  return {
    id: project.id || -1,
    group: project.organizationName || 'Example',
    PROJECT_NAME: formatProjectLabel(project) || 'Your Project',
    PROJECT_ID: project.projectSlug || 'your-project',
    ORG_NAME: project.organizationSlug || 'your-org',
    DSN: formatDsn(dsn, { public: false }),
    PUBLIC_DSN: formatDsn(dsn, { public: true }),
    PUBLIC_KEY: dsn.publicKey,
    SECRET_KEY: dsn.secretKey,
    API_URL: formatAPIURL(dsn),
    MINIDUMP_URL: formatMinidumpURL(dsn)
  };
};
