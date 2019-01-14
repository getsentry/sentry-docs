const ORIGIN = process.env.JEKYLL_GETSENTRY_ORIGIN || 'https://sentry.io';
import { escape } from './Helpers';
import { logPageview } from './Page';

export default class User {
  constructor() {
    this.namespace = 'docsUserDataV1';
    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.setUserData = this.setUserData.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }

  update() {
    $(document).trigger('user.didUpdate', [this.getUserData()]);
  }

  setUserData(newData = {}) {
    let userData = {};

    try {
      userData = JSON.parse(localStorage.getItem(this.namespace)) || {};
    } catch (error) {
      // Don't worry about errors if localStorage is corrupt, we'll just discard
      // the object and start fresh.
    }

    const { projects: tmpProjects, preferred: tmpPref, user } = {
      ...userData,
      ...newData
    };

    const projects =
      tmpProjects && tmpProjects.length ? tmpProjects : [defaultProject];

    // Default to the first project
    let preferred = projects[0];
    if (tmpPref) {
      // If a preference is set, check it still exists, otherwise still use
      // the first project as the default.
      preferred = projects.find(({ id }) => id === tmpPref.id) || preferred;
    }

    const payload = { projects, preferred, user: user || defaultUser };
    localStorage.setItem(this.namespace, JSON.stringify(payload));
    return payload;
  }

  getUserData() {
    let data = null;
    try {
      data = JSON.parse(localStorage.getItem(this.namespace));
    } catch (error) {
      // If the parse failed, we'll just purge the data
    }

    const { preferred, projects, user } = data || this.setUserData();
    return {
      preferred: constructDSNObject(preferred),
      projects: projects.map(constructDSNObject),
      user
    };
  }

  setPreference(newID) {
    const { projects } = this.getUserData();
    const preferred = projects.find(({ id }) => id === newID);
    this.setUserData({ preferred });
    this.update();
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
      .then(({ projects, user }) => {
        window.ra.identify(user.id);
        window.amplitude.getInstance().setUserId(user.id);
        const { isAuthenticated } = user;
        $('[data-hide-when-logged-in]').toggleClass('d-none', isAuthenticated);
        this.setUserData({ projects, user });
        this.update();
      })
      .catch(error => {
        $('[data-hide-when-logged-in]').toggleClass('d-none', false);
        this.update();
      })
      .then(() => {
        logPageview();
      });
  }
}

const formatDsn = function(
  { publicKey, secretKey, scheme, host, pathSection },
  opts = { public: false }
) {
  const auth = opts.public ? publicKey : `${publicKey}:${secretKey}`;
  return `${scheme}${auth}@${host}${pathSection}`;
};

const formatMinidumpURL = function(dsn) {
  const { scheme, host, pathSection, publicKey } = dsn;
  return `${scheme}${host}/api${pathSection}/minidump/?sentry_key=${publicKey}`;
};

const formatUnrealEngineURL = function(dsn) {
  const { scheme, host, pathSection, publicKey } = dsn;
  return `${scheme}${host}/api${pathSection}/unreal/${publicKey}/`;
};

const formatAPIURL = function(dsn) {
  return `${dsn.scheme}${dsn.host}/api`;
};

export const defaultUser = {
  isAuthenticated: false
};

export const defaultProject = {
  projectName: 'your-project',
  secretKey: '<secret>',
  publicKey: '<key>',
  dsnPublic: 'https://<key>@sentry.io/<project>',
  id: -1,
  dsn: 'https://<key>:<secret>@sentry.io/<project>',
  organizationSlug: 'your-org',
  projectSlug: 'your-project'
};

export const constructDSNObject = function(project = {}) {
  project = { ...defaultProject, ...project };
  // Transform the dsn into useful values
  const match = project.dsn.match(/^(.*?\/\/)(.*?):(.*?)@(.*?)(\/.*?)$/);

  const dsn = {
    scheme: escape(match[1]),
    publicKey: escape(match[2]),
    secretKey: `${escape(match[3])}`,
    host: escape(match[4]),
    pathSection: escape(match[5])
  };

  return {
    id: project.id,
    group: escape(project.organizationSlug),
    PROJECT_NAME: escape(project.projectSlug),
    PROJECT_ID: project.id.toString(),
    ORG_NAME: escape(project.organizationSlug),
    DSN: formatDsn(dsn),
    PUBLIC_DSN: formatDsn(dsn, { public: true }),
    PUBLIC_KEY: dsn.publicKey,
    SECRET_KEY: dsn.secretKey,
    API_URL: formatAPIURL(dsn),
    MINIDUMP_URL: formatMinidumpURL(dsn),
    UNREAL_URL: formatUnrealEngineURL(dsn)
  };
};
