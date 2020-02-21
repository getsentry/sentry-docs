---
title: 'Adding GitHub Integration'
sidebar_order: 1
---

## Create a GitHub App

1. Follow GitHub's [official guide on creating a GitHub App](https://developer.github.com/apps/building-github-apps/creating-a-github-app/)
2. Using the following values when configuring your app:

    | Setting | Value |
    | ---- | ---- |
    | Homepage URL | ${urlPrefix} |
    | User authorization callback URL | ${urlPrefix}/auth/sso/ |
    | Setup URL (optional) | ${urlPrefix}/extensions/github/setup/ |
    | Webhook URL | ${urlPrefix}/extensions/github/webhook/ |

3. These are the permissions required by Sentry:

    | Permission | Setting |
    |---|---|
    | Repository administration | Read-only |
    | Repository contents | Read-only |
    | Issues | Read & write |
    | Pull requests | Read & write |
    | Repository webhooks | Read & write |

4. Sentry also supports these events:
  - Push
  - Pull Requests
  
5. Take note of the following values after you have created your app:
  - App ID (`GITHUB_APP_ID`)
  - App Name (`GITHUB_APP_NAME`)
  - Client ID (`GITHUB_CLIENT_ID`)
  - Client Secret (`GITHUB_CLIENT_SECRET`)

6. Generate and download a private key for your app.


## Configure your `config.yml`

Add the following values to your `config.yml` file

```yml
github-app.id: GITHUB_APP_ID
github-app.name: 'GITHUB_APP_NAME'
github-app.webhook-secret: 'GITHUB_WEBHOOK_SECRET' # Use only if configured in GitHub
github-app.private-key: "GITHUB_APP_SECRET" # Replace new lines with \n to preserve them.
github-app.client-id: 'GITHUB_CLIENT_ID'
github-app.client-secret: 'GITHUB_CLIENT_SECRET'
```

{% include components/alert.html
    content="Make sure to replace these values with the ones you noted in step 5."
    level="warning"
  %}

**YML Tip:** `github-app.private-key` can span multiple lines as seen below

```yml
github-app.private-key: |
  -----BEGIN RSA PRIVATE KEY-----
  privatekeyprivatekeyprivatekeyprivatekey
  privatekeyprivatekeyprivatekeyprivatekey
  privatekeyprivatekeyprivatekeyprivatekey
  privatekeyprivatekeyprivatekeyprivatekey
  privatekeyprivatekeyprivatekeyprivatekey
  -----END RSA PRIVATE KEY-----
```

## Redeploy your Sentry Instance

### Docker

Run the following commands to rebuild your Docker images and restart your containers.

```bash
docker-compose build
docker-compose run --rm web upgrade
docker-compose up -d
```

## Installing

1. Navigate to your organization's settings pages, and find the integrations section.
  - `${urlPrefix}/settings/${organization}/integrations`
2. If GitHub is already installed, remove it.
3. Click Install next to GitHub
