---
title: 'Rollups & Grouping'
sidebar_order: 0
---

An important part of Sentry is how it aggregates similar events together and creates rollups. This turns out to be a pretty complex issue and it can be confusing for users about why some information might not be grouped correctly.

The structured data of an event dictates how a rollup is created. This varies depending on the data available as well as the language.

## Grouping Priorities

The grouping switches behavior based on the interfaces ([_Interfaces_]({%- link _documentation/development/sdk-dev/interfaces.md -%})) that are available within an event.

-   If the interfaces used in an event differ, then those events will not be grouped together.
-   If a stack trace or exception is involved in a report, then grouping will only consider this information.
-   If a template is involved, then grouping will consider the template.
-   As a fallback, the message of the event will be used for grouping.

### Grouping by Stacktrace

When Sentry detects a stack trace in the event data (either directly or as part of an exception), the grouping effectively is based entirely on the stack trace. This grouping is fairly involved but easy enough to understand.

The first and most important part is that Sentry only groups by stack trace frames reported in the application. Not all SDKs might report this, but if that information is provided, it’s used for grouping. This means that if the stack trace is modified from one event to another exclusively in parts of the stack that is not related to the application, it still groups the same.

Depending on the information the following data can be used for each stack trace frame:

-   Module name
-   Normalized filename (removed from revision hashes etc.)
-   Normalized context line (essentially a cleaned up version of the sourcecode of the affected line if provided)

This grouping usually works well, but causes two annoying artifacts if not dealt with:

-   Minimized JavaScript sourcecode will destroy the grouping in really bad ways. Because of this you should ensure Sentry can access your [Source Maps]({%- link _documentation/clients/javascript/sourcemaps.md -%}#raven-js-sourcemaps).
-   If you modify your stack trace by introducing a new level through the use of decorators, your stack trace will change and so will the grouping. For this matter many SDKs support hiding irrelevant stack trace frames. For instance the Python SDK will skip all stack frames with a local variable called `__traceback_hide__` set to _True_).

### Grouping By Exception

If no stack trace is available but exception info is, then the grouping will consider the `type` and `value` of the exception. If either does not exist it’s skipped. This grouping is a lot less reliable because of changing error messages.

### Fallback Grouping

If everything else fails, grouping falls back to messages. Hereby ideally the grouping only uses the message without the parameters, but if that is not available, it uses the message attribute.

## Customize Grouping with Fingerprints {#custom-grouping}

For some very advanced use cases you can override the Sentry default grouping using the `fingerprint` attribute. In supported SDKs, this attribute can be passed with the event information, and should be an array of strings. 

If you wish to append information, thus making the grouping slightly less aggressive, you can do that as well by adding the special string `{% raw %}{{ default }}{% endraw %}` as one of the items (note that the double braces are important).

### Minimal example

This minimal example will put all exceptions of the current scope into the same issue/group:

{% include components/platform_content.html content_dir='set-fingerprint' %}

There are two common real-world use cases for the `fingerprint` attribute:

### Example: Split up a group into more groups (groups are too big)

Your application queries an RPC interface or external API service, so the stack trace is generally the same (even if the outgoing request is very different).

The following example will split up the default group Sentry would create (represented by `{% raw %}{{ default }}{% endraw %}`) further, taking some attributes on the error object into account:

{% include components/platform_content.html content_dir='fingerprint-rpc-example' %}

### Example: Merge a lot of groups into one group (groups are too small)

A generic error, such as a database connection error, has many different stack traces and never groups together.

The following example will just completely overwrite Sentry's grouping by omitting `{% raw %}{{ default }}{% endraw %}` from the array:

{% include components/platform_content.html content_dir='fingerprint-database-connection-example' %}

## Grouping Algorithm Versioning

When a Sentry project is created the latest and greatest version of the grouping algorithm is automatically selected.  However we will improve the grouping system going forward but only new projects will see these improvements not to create new groups for you.  If you do want to upgrade an existing project to a new grouping algorithm version you can do so in the project settings.  Note that you can only upgrade.  To downgrade you will need to contract customer support.

## Grouping Enhancements and Server Side Fingerprinting

When the default grouping does not yield satisfying results there are ways in which grouping can be influenced from the server through grouping enhancements and server side fingerprinting.

### Grouping Enhancements

Grouping enhancements are used to improve the stack trace based grouping. If
stack traces are used for grouping the enhancements rules are used to influence
what data is used.

Enhancements are rules written in a pretty straightforward way. Each line is a
single enhancement rule. It's one or multiple match expressions followed by one
or multiple actions to be executed when all expressions match. All rules are
executed from top to bottom on all frames in the stack trace.

The syntax for grouping enhancements is roughly like this:

```
matcher-name:expression other-matcher:expression ... action1 action2 ...
```

#### Rules

the following **matchers** exist. Multiple matchers can be defined in a line:

- `family`: matches on the general platform family. Right now there are `javascript`, `native`
  and `other`. To make a rule apply to multiple platforms you can comma separate them.
  Eg: `family:native,javascript` applies to both javascript and native.
- `path`: this matches case insensitive with unix glob behavior on a path. The path
  separators are normalized to `/`. As a special rule if the filename is relative it
  still matches on `**/`. Examples:
  - `path:**/project/**.c`: matches on all files under `project` with a `.c` extension
  - `path:**/vendor/foo/*.c`: matches on vendor/foo without sub folders
  - `path:**/*.c`: matches on `foo.c` as well as `foo/bar.c`.
- `module`: is similar to `path` but matches on the module. This is not used for native
  but for instance for javascript, python and similar platforms. Matches are
  case sensitive and normal globbing is available.
- `function`: matches on a function, case sensitive with normal globbing.
- `function:myproject_*` matches all functions starting with `myproject_`
- `function:malloc` matches on the malloc function
- `package`: matches on a package. The package is the container a function or module is
  contained in. This is a `.jar`, a `.dylib` or similar. The same matching rules as for
  `path` apply (eg: this is an absolute path typically).
- `app`: matches on the current state of the in-app flag. `yes` means the frame is in app, `no` means it's not.
- An expression can be quoted if necessary (eg: spaces are included)

There are two types of **actions**: flag setting and setting variables.

- **flag**: flags are what is to be done if all matchers match. a flag needs to be prefixed with `+` to set
  it or `-` to unset it. If this expression is prefixed with a `^` it applies to frames above (eg:
  towards the crash) the frame, if prefixed with `v` it applies to frames below
  (eg: away from the crash). For instance `-group ^-group` removes the matching frame
  and all frames above from the grouping.
  - `app`: marks or unmarks a frame in-app
  - `group`: adds or removes a frame from grouping
- **variables**: additionally variables can be set (`variable=value`). Currently there is just one:
  - `max-frames`: sets the total number of frames to be considered for grouping.
    The default is `0` which means "all frames". If set to `3` only the top
    3 frames are considered.

If a line is prefixed with a hash (`#`) it's a comment and ignored

#### Examples

```
path:**/node_modules/** -group
path:**/app/utils/requestError.jsx -group
path:**src/getsentry/src/getsentry/** +app

family:native max-frames=3

function:fetchSavedSearches v-group
path:**/app/views/**.jsx function:fetchData ^-group

family:native function:SpawnThread v-app -app
family:native function:_NSRaiseError ^-group -app
family:native function:std::* -app
family:native function:core::* -app
```

#### Recommendations

There are some general recommendations we have to greatly improve the out of the box grouping experience.

**Mark in-app Frames**

The highest quality of life improvement one can receive is to help Sentry
determine which frames in your stack trace are "in app" (part of your own
application) and which ones are not. The default rules are defined by the SDK
but in many cases this can be improved on the server as well. In particular for
languages where server side processing is necessary (eg: native C, C++ or
JavaScript) it's better to override this on the server.

For instance the following marks all frames in-app that are below a certain C++
namespace:

```
function:myapplication::* +app
```

You can also achieve the inverse by just marking all frames "not in app". In that case however
you should ensure that first all frames are set to in-app to override the defaults:

```
app:no             +app
function:std::*    -app
function:boost::*  -app
```

Forcing all frames to be in-app first might be necessary as there might already have
been some defaults set by the client SDK or earlier processing.

**Cut Stack Traces**

Additionally in many cases you want to chop off the top or bottom of the stack trace. For instance
many code bases use a common function to generate an error in which case the error machinery will
appear as part of the stack trace. For instance if you use Rust you are likely to want to
remove some frames that are related to panic handling:

```
function:std::panicking::begin_panic       ^-app -app ^-group
function:core::panicking::begin_panic      ^-app -app ^-group
```

Here we tell the system that all frames from begin-panic to the crash location are not part
of the application (including the panic frame itself) and that all frames above are also
in all cases irrelevant for grouping.

Likewise you can also chop off the base of a stack trace. This is particularly useful if
you have different main loops that drive an application:

```
function:myapp::LinuxMainLoop         v-group -group
function:myapp::MacMainLoop           v-group -group
function:myapp::WinMainLoop           v-group -group
```

**Stack Trace Frame Limits**

This is something that is not useful for *all* projects but can work well for
large applications with many crashes. The default strategy is to consider most
of the stack trace relevant for grouping. This means that every different stack
trace that leads to a crashing function will cause a different group to be
created. If you do not want that, you can alternatively force the groups to be
much larger by limiting how many frames should be considered.

For instance you could tell the system to only consider the top N frames if any
of the frames in the stack trace refer to a common external library:

```
# always only consider the top 1 frame for all native events
family:native max-frames=1

# if the bug is in proprietarymodule.so, only consider top 2 frames
family:native package:**/proprietarymodule.so  max-frames=2

# these are functions we want to consider much more of the stacktrace for
family:native function:KnownBadFunction1  max-frames=5
family:native function:KnownBadFunction2  max-frames=5
```

### Server Side Fingerprinting

Server side fingerprinting is also configured with a config similar to grouping enhancements
but the syntax is slightly different. The matchers are the same but instead of
flipping flags a fingerprint is assigned that overrides the default grouping entirely.

```
(matcher:expression)+ -> list, of, values
```

All values are matched against and in case of stacktraces all frames are considered.
If all matches in a line match then the fingerprint is applied.

The matchers are the same as for grouping enhancements but some extra ones are available:

- `type`: matches on an exception type
- `value`: matches on an exception value
- `message`: matches on a log message

#### Examples

```
# force all errors of the same type to have the same fingerprint
type:DatabaseUnavailable -> system-down

# force all memory allocation errors to be grouped together
family:native function:malloc -> memory-allocation-error
# force all events with a certain message to be matched together

message:"unexpected i/o error: *" -> io-error
```
