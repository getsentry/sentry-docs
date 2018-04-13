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
    // TODO: test that this renders correctly
    'secret-key': secretKey,
    'api-url': `${scheme}${host}/api`,
    'minidump-url': `${scheme}${host}/api${pathSection}/minidump?sentry_key=${publicKey}`
  };
};

export default class User {
  constructor() {
    this.dsnList = [];
    this.keyList = [];
    this.user = null;

    this.onFetchSuccess = this.onFetchSuccess.bind(this);
    this.init = this.init.bind(this);
  }

  init() {
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

  onFetchSuccess({ projects, api_keys, user }) {
    // Transform the Project values into the forms we'll need
    this.dsnList = projects.map(project => {
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
    if (this.dsnList.length === 0) {
      this.dsnList = [
        Object.assign(
          {},
          {
            id: '-1',
            kind: 'dsn',
            group: 'Example Org',
            'project-name': 'Example DSN',
            'project-id': 'your-project',
            'org-name': 'your-org'
          },
          dataFromDSN('https://<key>:<secret>@sentry.io/<project>')
        )
      ];
    }
    if (!localStorage.getItem(`dsnPreference`)) {
      localStorage.setItem('dsnPreference', this.dsnList[0].id);
    }

    // Transform the API key into the forms we'll need
    this.keyList = (api_keys || []).map(apiKey => ({
      id: apiKey.id,
      kind: 'key',
      group: apiKey.organizationName,
      'project-name': apiKey.label,
      'encoded-api-key': apiKey.base64Key
    }));
    if (this.keyList.length === 0) {
      this.keyList = [
        {
          id: '-1',
          kind: 'key',
          group: 'Example Org',
          'project-name': 'Example Key',
          'encoded-api-key': '{base64-encoded-key-here}'
        }
      ];
    }
    if (!localStorage.getItem(`keyPreference`)) {
      localStorage.setItem('keyPreference', this.keyList[0].id);
    }

    this.user = user;
  }
}
