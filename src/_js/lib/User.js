// TODO: point this at the production url
const API = 'http://dev.getsentry.net:8000/docs/api';

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

export default class User {
  constructor() {
    this.namespace = 'docsUserData';
    this.userData = null;

    this.onFetchSuccess = this.onFetchSuccess.bind(this);
    this.init = this.init.bind(this);
    this.loadCached = this.loadCached.bind(this);
  }

  init() {
    this.loadCached();

    return $.ajax({
      type: 'GET',
      url: API + '/user/',
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    })
      .done(this.onFetchSuccess)
      .fail(function() {})
      .always(res => {
        $(document).trigger('user.ready', [this]);
      });
  }

  loadCached() {
    const cached = localStorage.getItem(this.namespace);
    if (cached) {
      this.userData = JSON.parse(cached);
    } else {
      this.userData = {
        dsnList: [
          {
            id: '-1',
            kind: 'dsn',
            group: 'Example Org',
            'project-name': 'Example DSN',
            'project-id': 'your-project',
            'org-name': 'your-org',
            dsn: '{dsn-here}',
            'public-dsn': '{public-dsn-here}',
            'public-key': '{public-key-here}',
            'secret-key': '{secret-key-here}',
            'api-url': '{api-url-here}',
            'minidump-url': '{minidump-url-here}'
          }
        ],
        keyList: [
          {
            id: '-1',
            kind: 'key',
            group: 'Example Org',
            'project-name': 'Example Key',
            'encoded-api-key': '{base64-encoded-key-here}'
          }
        ]
      };

      localStorage.setItem(this.namespace, JSON.stringify(this.userData));
    }
    $(document).trigger('user.ready', [this]);
  }

  onFetchSuccess({ projects, api_keys, user }) {
    const userData = { ...this.userData };

    // Transform the Project values into the forms we'll need
    const dsnList = (projects || []).map(project => {
      let projectLabel = project.projectName;
      if (project.projectName.indexOf(project.teamName) === -1) {
        projectLabel = project.teamName + ' / ' + projectLabel;
      }

      // Transform the dsn into useful values
      const match = project.dsn.match(/^(.*?\/\/)(.*?):(.*?)@(.*?)(\/.*?)$/);
      const urlPieces = match[5].split(/\?/, 2);
      const dsn = {
        scheme: escape(match[1]),
        publicKey: escape(match[2]),
        secretKey: `<span className="dsn-secret-key">${escape(
          match[3]
        )}</span>`,
        host: escape(match[4]),
        pathSection: escape(match[5]),
        project: parseInt(urlPieces[0].substring(1), 10) || 1
      };

      return Object.assign(
        {},
        {
          id: project.id,
          kind: 'dsn',
          group: project.organizationName,
          'project-name': projectLabel,
          'project-id': project.projectSlug,
          'org-name': project.organizationSlug
        },
        dataFromDSN(dsn)
      );
    });

    if (dsnList.length > 0) {
      userData.dsnList = dsnList;

      if (!localStorage.getItem(`dsnPreference`)) {
        localStorage.setItem('dsnPreference', userData.dsnList[0].id);
      }
    }

    // Transform the API key into the forms we'll need
    const keyList = (api_keys || []).map(apiKey => ({
      id: apiKey.id,
      kind: 'key',
      group: apiKey.organizationName,
      'project-name': apiKey.label,
      'encoded-api-key': apiKey.base64Key
    }));

    if (keyList.length > 0) {
      userData.keyList = keyList;

      if (!localStorage.getItem(`keyPreference`)) {
        localStorage.setItem('keyPreference', userData.keyList[0].id);
      }
    }

    this.userData = userData;

    localStorage.setItem(this.namespace, JSON.stringify(this.userData));
  }
}
