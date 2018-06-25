// TODO: point this at the production url
const API = 'http://dev.getsentry.net:8000/docs/api';

export default class User {
  constructor() {
    this.namespace = 'docsUserDataV1';
    this.userData = {
      projects: [constructDSNObject()],
      projectPref: -1
    };

    this.onFetchSuccess = this.onFetchSuccess.bind(this);
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
      url: API + '/user/',
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    })
      .done(this.onFetchSuccess)
      .fail(function() {});
  }

  onFetchSuccess({ projects, api_keys, user }) {
    const userData = { ...this.userData };
    if (projects) {
      userData.projects = projects.map(constructDSNObject);
      if (userData.projectPref === -1) userData.projectPref = projects[0].id;
    }
    this.update(userData);
  }
}

const formatDsn = function(
  { publicKey, secretKey, scheme, host, pathSection },
  opts = { public: false }
) {
  const auth = opts.public ? publicKey : `${publicKey}:${secretKey}`;
  return `${scheme}${auth}@${host}${pathSection}`;
};

const dataFromDSN = function(dsn) {
  const { host, scheme, pathSection, publicKey, secretKey } = dsn;
  return {
    dsn: formatDsn(dsn, { public: false }),
    'public-dsn': formatDsn(dsn, { public: true }),
    'public-key': publicKey,
    'secret-key': secretKey,
    'api-url': `${scheme}${host}/api`,
    'minidump-url': `${scheme}${host}/api${pathSection}/minidump?sentry_key=${publicKey}`
  };
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
      secretKey: `<span className="dsn-secret-key">${escape(match[3])}</span>`,
      host: escape(match[4]),
      pathSection: escape(match[5]),
      project: parseInt(urlPieces[0].substring(1), 10) || 1
    };
  } else {
    dsn = {
      scheme: 'https://',
      publicKey: '<key>',
      secretKey: '<secret>',
      host: 'sentry.io',
      pathSection: '/',
      project: '<project>'
    };
  }

  return {
    id: project.id || '-1',
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
