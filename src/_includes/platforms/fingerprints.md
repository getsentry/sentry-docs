Sentry uses a fingerprint to decide how to group errors into issues.

For some very advanced use cases, you can override the Sentry default grouping
using the `fingerprint` attribute. In supported SDKs, this attribute can be
passed with the event information and should be an array of strings. 

{% raw %}
If you wish to append information, thus making the grouping slightly less
aggressive, you can do that as well by adding the special
string `{{default}}` as one of the items.
{% endraw %}

For code samples, see [Grouping & Fingerprints](/data-management/event-grouping/?platform=python#use-cases).

For more information, see [Aggregate Errors with Custom
Fingerprints](https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints).
