---
title: 'Getting started'
sidebar_order: 1
---

The relay server is called "semaphore".  Binaries can be downloaded from the
[GitHub releases page](https://github.com/getsentry/semaphore/releases).  After
downloading place the binary somewhere on your `PATH` and make it executable.

The `config init` command is provided to initialize the initial config.  The
config will be created the folder it's run from in a hidden `.semaphore`
subdirectory:

    $ semaphore config init

The wizard will ask a few questions:

1. default vs custom config.  In the default config the relay will connect to
   sentry.io for sending and will generally use the defaults.  In the custom
   config a different upstream can be configured.
2. Relay internal crash reporting can be enabled or disabled.  When enabled the
   relay will report its own internal errors to sentry.io to help us debug it.
3. Lastly the relay will ask it should run authenticated with credentials or
   not.  Currently we do not yet support authenticated mode against sentry.io.

You now have a folder named `.semaphore` in your current working directory. To
launch the server, run:

    semaphore run

If you moved your config folder somewhere else, you can use the `-c` option:

    semaphore run -c ./my/custom/semaphore_folder/

## Setting up a Project

Right now Relay is only really usable in "simple proxy mode" (without
credentials), and as such calls the same exact endpoints on Sentry that an SDK
would.  That also means you have to configure each project individually in
Relay.

Create a new file in the form `project_id.json`:

```
.semaphore/projects/___PROJECT_ID___.json
```

With the following content:

```json
{
    "publicKeys": {"___PUBLIC_KEY___": true},
    "config": {
        "piiConfig": {},
        "allowedDomains": ["*"],
        "trustedRelays": []
    }
}
```

The relay has to know all public keys (i.e. the secret part of the DSN) that
will send events to it.  DSNs unknown for this project will be rejected.

## Sending a Test Event

Launch the server with `semaphore run`, and set up any SDK with the following DSN:

```
http://___PUBLIC_KEY___@127.0.0.1:3000/___PROJECT_ID___
```

As you can see we only changed the host and port of the DSN to point to your
Relay setup. You should be able to use the SDK normally at this point. Events
arrive at the Sentry instance that Relay is configured to use in
`.semaphore/config.yml`.

## PII Stripping

Now let's get to the entire point of this proxy setup: Stripping sensitive
data.

The easiest way to go about this is if you already have a raw JSON payload from some SDK. Go to our PII config editor [Piinguin](https://getsentry.github.io/piinguin/), and:

1. Paste in a raw event
2. Click on data you want eliminated
3. Paste in other payloads and see if they look fine, go to step **2** if necessary.

After iterating on the config, paste it back into the project config you created earlier:

```
.semaphore/projects/___PROJECT_ID___.json
```


For example:

```json
{
    "publicKeys": {
        "___PUBLIC_KEY___": true
    },
    "config": {
        "allowedDomains": ["*"],
        "trustedRelays": [],
        "piiConfig": {
            "rules": {
                "device_id": {
                    "type": "pattern",
                    "pattern": "d/[a-f0-9]{12}",
                    "redaction": {
                        "method": "hash"
                    }
                }
            },
            "applications": {
                "freeform": ["device_id"]
            }
        }
    }
}
```
