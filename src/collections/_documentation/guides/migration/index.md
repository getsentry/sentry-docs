---
title: Moving on Up - Migrating Sentry to Cloud
sidebar_order: 6
---

Sentry has both an open-source and a hosted cloud solution that are functionally the same. Despite open-source being a core value for us at Sentry, we don’t necessarily recommend it for everyone. As Sentry evolves, many customers are finding out that it can quickly become expensive to maintain, scale, and support, making our SaaS product, the better and less costly option. For more information take a look at our post on [Self Hosted or Cloud Sentry?](https://sentry.io/_/resources/about-sentry/self-hosted-vs-cloud/)

## Migrating to Cloud

many customers...

## Command Line

- If you've been hosting our open-source solution on-premise and decided that you'd like to move 
https://docs.sentry.io/server/cli/

- Run the following command in your terminal to start the export script and redirect the output that contains the transport JSON to a file:

`docker-compose run --rm web export > sentry_export.json`



## What gets exported:

- Project
    - General Settings
    - DSN Key
    - Teams (associated to the project)
    - Alert rules
    
- Teams
- Members (member email, role etc)




- Self-Hosted Migration Applications:

https://www.notion.so/sentry/Self-Hosted-Migration-Applications-9a22fa030b4144148a8354c3dc82c09c


- Install OnPrem
https://docs.sentry.io/server/installation/

https://sentry.io/from/self-hosted/


- sentry export [DEST]

https://docs.sentry.io/server/cli/export/
