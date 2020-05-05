---
title: Envelopes
sidebar_order: 7
---

This document defines the Envelope and Item formats used by Sentry for data
ingestion, forwarding, and offline storage. The target audience of this document
is Sentry SDK developers and maintainers of the ingestion pipeline.

*Envelopes* are a data format similar to HTTP form data, comprising common
*Headers* and a set of *Items* with their own headers and payloads. Envelopes
are optimized for fast parsing and human readability. They support a combination
of multiple Items in a single payload, such as:

- Submit events with large binary attachments.
- Enable communication between hops, for instance, between different SDKs
  (Native and Mobile, ReactNative and Android) and between Relays.
- Allow batching of certain Items into a single submission.
- Offline storage for deferred sending after connection issues.

Sentry specifies a dedicated endpoint at for ingesting Envelopes:

```
POST /api/<project_id>/envelope/
```

## Terminology

- *required*: The implementation may emit an error if this field is missing.
- *recommended*: This field should be emitted when writing, but can be missing
  during a read.
- *optional*: Can be omitted freely during writing and can be missing during a
  read.

## Serialization Format

This section defines the Envelope data format and serialization. For details on
data integrity and a list of valid Item types refer to the next section [Data
Model](#data-model).

### Prerequisites

These definitions apply to all parts of the Envelope data format:

1. Newlines are defined as UNIX newlines, represented by `\n` and ASCII code 10.
   If newlines are preceded with `\r`, this character is considered part of the
   previous line or payload and may emit an error.
2. UUIDs are declared as 36 character strings and must contain
   dashes:`"12c2d058-d584-4270-9aa2-eca08bf20986"`. It is recommended to use
   UUID v4 in all cases.
3. Envelopes do not offer a mechanism for compression. However, an entire
   Envelope may be compressed or decompressed in an implementation defined way
   by any component handling Envelopes. For example, [Ingestion](#ingestion)
   allows compression via content encoding.

### Headers

Envelopes contain Headers in several places. Headers are JSON-encoded objects
(key-value mappings) that follow these rules:

- Always encoded in UTF-8
- Must be valid JSON
- Must be declared in a single line; no newlines
- Always followed by a newling (`\n`) or the end of the file
- Must not be padded by leading or trailing whitespace
- Should be serialized in their most compact form without additional white
  space. Whitespace within the JSON headers is permitted, though discouraged.
- Unknown attributes are allowed and should be retained by all implementations;
  however, attributes not covered in this spec must not be actively emitted by
  any implementation.
- All known headers and their data types can be validated by an implementation;
  if validation fails, the Envelope may be rejected as malformed.
- Empty headers `{}` are technically valid

Header-only Example:

```json
{"event_id":"12c2d058-d584-4270-9aa2-eca08bf20986"}
```

### Envelopes

The full grammar for an Envelope is:

```
Envelope = Headers { "\n" Item } [ "\n" ] ;
Item = Headers "\n" Payload ;
Payload = { * } ;
```

- **Headers** are a single line containing a JSON object, as defined in the
  [Headers](#headers) section. Attributes defined in the Envelope header scope
  the contents of the Envelope and can be thought of as applying to all Items.
- Based on the contents of the Envelope, certain header attributes may be
  required. See [Data Model](#data-model) for a specification of required
  attributes.
- **Items** comprise their own headers and a payload. There can be
  an arbitrary number of **Items** in an Envelope separated by a newline. An
  implementation should consume Items until the file ends. 
- Envelopes should be terminated with a trailing newline. This newline is
  optional. After the final newline, no whitespace is allowed.
- Envelopes may be empty, terminating immediately after the headers.
- The end of file (EOF) does not implicitly terminate an Envelope if more data
  is expected, such as a Payload.

### Items

Items supply the data of an Envelope. Without Items, an Envelope is considered
*empty* and can safely be discarded.

There are two generic headers for every Item:

`type`

: **String, required.** Specifies the type of this Item and its contents. Based
  on the Item type, more headers may be required. See Data Integrity for a list
  of all Item types.

`length`

: *int, recommended.* The length of the payload in bytes. If no `length` is
  specified, the payload implicitly goes to the next newline. For payloads
  containing newline characters, the `length` must be specified.

{% capture __alert_content -%} 
By default, always declare the payload length to enable faster parsing of an
Envelope.

If the Envelope contains a large number of very small Items, omitting the length
can be beneficial for compression. This is the case for sessions.

The implementor should assess this on a per-case basis and explicitly argue
about the decision.
{%- endcapture -%}
{%- include components/alert.html
  title="On omitting `length`"
  content=__alert_content
  level="warning"
%}

Notes for implementors:

- Implementations **must gracefully skip and retain** Items of unknown type,
  along with their payload.
- Unknown attributes must be forwarded to the upstream.
- Length-prefixed payloads must terminate with `\n` or EOF. The newline is not
  considered part of the payload. Any other character, including whitespace,
  means the Envelope is malformed.
- If `length` cannot be consumed, that is, the Envelope is EOF before the number
  of bytes has been consumed, then the Envelope is malformed.
- If an Item with implicit length is terminated by `\r\n`, then `\r` is
  considered an arbitrary character not part of the newline, and thus part of
  the payload.

Item-only example without Envelope headers:

```
{"type":"attachment","length":10}\n
helloworld
```

### Full Examples

These examples contain full Envelope payloads. Newlines are explicitly marked
with `\n`, unprintable characters are escaped with `\x<><>`. all other
characters are literal.

**Envelope with 2 Items:**

Note that the attachment contains a Windows newline at the end of its
payload which is included in `length`:

```
{"event_id":"9ec79c33ec9942ab8353589fcb2e04dc","dsn":"https://e12d836b15bb49d7bbf99e64295d995b:@sentry.io/42"}\n
{"type":"attachment","length":10,"content_type":"text/plain","filename":"hello.txt"}\n
\xef\xbb\xbfHello\r\n\n
{"type":"event","length":41,"content_type":"application/json","filename":"application.log"}\n
{"message":"hello world","level":"error"}\n
```

**Empty Envelope without Items, last newline omitted:**

Note that the attachment contains a Windows newline at the end of its
payload which is included in `length`:

```
{"event_id":"9ec79c33ec9942ab8353589fcb2e04dc","dsn":"https://e12d836b15bb49d7bbf99e64295d995b:@sentry.io/42"}\n
{"type":"attachment","length":10,"content_type":"text/plain","filename":"hello.txt"}\n
\xef\xbb\xbfHello\r\n\n
{"type":"event","length":41,"content_type":"application/json","filename":"application.log"}\n
{"message":"hello world","level":"error"}
```

**Envelope with 2 empty attachments:**

```
{"event_id":"9ec79c33ec9942ab8353589fcb2e04dc"}\n
{"type":"attachment","length":0}\n
\n
{"type":"attachment","length":0}\n
\n
```

**Envelope with 2 empty attachments, last newline omitted:**

```
{"event_id":"9ec79c33ec9942ab8353589fcb2e04dc"}\n
{"type":"attachment","length":0}\n
\n
{"type":"attachment","length":0}\n
```

**Item with implicit length, terminated by newline:**

```
{"event_id":"9ec79c33ec9942ab8353589fcb2e04dc"}\n
{"type":"attachment"}\n
helloworld\n
```

**Item with implicit length, last newline omitted, terminated by EOF:**

```
{"event_id":"9ec79c33ec9942ab8353589fcb2e04dc"}\n
{"type":"attachment"}\n
helloworld
```

**Envelope without headers, implicit length, last newline omitted, terminated by
EOF:**

```
{}\n
{"type":"session"}\n
{"started": "2020-02-07T14:16:00Z","attrs":{"release":"sentry-test@1.0.0"}}
```

## Data Model

Each Envelope consists of headers and a potentially empty list of Items, each
with their own headers. Which Headers are required depends on the Items in an
Envelope. This section describes all Item types and their respective required
headers.

The type of an Item is declared in the `type` header, as well as the payload
size in `length`. See Serialization Format for a list of common Item headers.
The headers described in this section are **in addition to the common headers**.

### Event

Item type `"event"`. This Item contains an error or default event payload
encoded in JSON.

**Constraints:**

- This Item may occur at most once per Envelope.
- This Item is mutually exclusive with `"transaction"` Items.

**Envelope Headers:**

`event_id`

: **UUID String, required.** Corresponds to the `event_id` field of the event
  payload. Clients are required to generate an event identifier ahead of time
  and set it at least in the Envelope headers. If the identifier mismatches
  between the Envelope and payload, the Envelope header takes precedence.
  
`sent_at`

: *String, recommended.* The timestamp when the event was sent from the SDK as
  [RFC 3339](https://tools.ietf.org/html/rfc3339) string. Used for clock drift
  correction of the event timestamp. Timezone must be UTC.

**Additional Item Headers:**

*None*

### Transaction

Item type `"transaction"`. This Item contains a transaction payload encoded
in JSON.

**Constraints:**

- This Item may occur at most once per Envelope.
- This Item is mutually exclusive with `"event"` Items.

**Envelope Headers:**

`event_id`

: **UUID String, required.** Corresponds to the `event_id` field of the
  transaction payload. Clients are required to generate an event identifier
  ahead of time and set it at least in the Envelope headers. If the identifier
  mismatches between the Envelope and payload, the Envelope header takes
  precedence.

`sent_at`

: *String, recommended.* The timestamp when the event was sent from the SDK as
  [RFC 3339](https://tools.ietf.org/html/rfc3339) string. Used for clock drift
  correction of the event timestamp. Timezone must be UTC.

**Additional Item Headers:**

*None*

### Attachment

Item type `"attachment"`. This Item contains a raw payload of an attachment
file. It is always associated to an event or transaction.

**Constraints:**

- This Item may occur multiple times per Envelope.
- For **minidump** and **apple crash report** attachments, the corresponding
  `"event"` Item must be sent within the same Envelope.
- Generic attachments can be ingested separately from their events. We recommend
  sending them in the same Envelope, which allows for more efficient rate
  limiting and filtering.
- Generic attachments sent in separate Envelopes can be dropped independently of
  an event. To ensure consistent handling, consider sending them in the same
  request.
- The Sentry server supports special attachments to ingest event payloads for
  backwards compatibility. These are not part of the official public API and the
  behavior should not be relied upon.

**Envelope Headers:**

`event_id`

: **UUID String, required.** The identifier of the event or transaction.

**Additional Item Headers:**

`attachment_type`

: *String, optional.* The special type of this attachment. Possible values are:

  - **`event.attachment` (default)**: A standard attachment without special
    meaning.
  - `event.minidump`: A minidump file that creates an error event and is
    symbolicated. The file should start with the `MDMP` magic bytes.
  - `event.applecrashreport`: An Apple crash report file that creates an error
    event and is symbolicated.
  - `unreal.context`: An XML file containing UE4 crash meta data. During event
    ingestion, event contexts and extra fields are extracted from this file.
  - `unreal.logs`: A plain-text log file obtained from UE4 crashes. During
    event ingestion, the last logs are extracted into event breadcrumbs.

`content_type`

: *String, optional.* The content type of the attachment payload. Defaults to
  `application/octet-stream`.

`filename`

: *String, optional.* The name of the uploaded file without a path component.

### Session

Item type `"session"`. This Item contains a single session initialization or
update to an existing session for Release Health.

**Constraints:**

- This Item may occur multiple times per Envelope.
- Ingestion may limit the maximum number of Items per Envelope, see *Ingestion*.

**Envelope Headers:**

`sent_at`

: *String, recommended.* The timestamp when the event was sent from the SDK as
  [RFC 3339](https://tools.ietf.org/html/rfc3339) string. Used for clock drift
  correction of the event timestamp. Timezone must be UTC.

**Additional Item Headers:**

*None*

### UserReport

Item type `"user_report"`. This Item contains a user report JSON payload.

**Constraints:**

- This Item may occur once per Envelope.
- User Reports can be ingested separately from their events. We recommended to
  send them in the same Envelope.

**Envelope Headers:**

`event_id`

: **UUID String, required.** The identifier of the event or transaction.

**Additional Item Headers:**

*None*

### Reserved Types

Reserved types may not be written by any implementation. They are reserved for
future or internal use. This is the exhaustive list of reserved Item types:

- `security`
- `unreal_report`
- `form_data`

## Ingestion

This section describes how to ingest Envelopes into Relay or Sentry. The main
ingestion endpoint for Envelopes is:

```
POST /api/<project_id>/envelope/
```

### HTTP Headers

Envelope requests may contain all headers as regular store requests. The only
accepted `content-type` is `application/x-sentry-envelope`, which is implied if
it is missing.

### Authentication

In addition to regular HTTP header- and querystring authentication, the Envelope
endpoint allows to authenticate via an Envelope header. To choose this
authentication method, set the `"dsn"` Envelope header to the full DSN string.

If multiple forms of authentication are given, the endpoint validates that the
information matches and otherwise rejects the request. If both are missing, the
Envelope is rejected with status code `403 Forbidden`.

### Size Limits

Event ingestion imposes limits on the size and number of Items in Envelopes.
These limits are subject to future change and defined currently as:

- *20MB* for a compressed Envelope request
- *50MB* for a full Envelope after decompression
- *50MB* for all attachments combined
- *50MB* for each attachment Item
- *1MB* for event and transaction Items
- *100 sessions* per Envelope

## External References

- [Multi Part Form Data](https://tools.ietf.org/html/rfc7578)
- [Chunked Transfer Encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)
