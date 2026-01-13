# Agent Guidelines for Developer Documentation

This file contains guidelines for AI agents working with the Sentry developer documentation (`develop-docs/`).

## Writing Requirements

1. **Use RFC 2119 Keywords**: When writing requirements, use the key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt). These keywords **MUST** be written in uppercase and bold, for example: **MUST**, **SHOULD**, **MAY**.

2. **Add RFC 2119 Alert**: When creating a new documentation file with requirements, or when adding requirements to an existing file, consider using RFC 2119 keywords. If doing so, ensure the file has an Alert at the top (after the frontmatter) to clarify the use of RFC 2119 keywords. If the Alert is missing, add it:

   ```mdx
   <Alert>
     This document uses key words such as "MUST", "SHOULD", and "MAY" as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) to indicate requirement levels.
   </Alert>
   ```
