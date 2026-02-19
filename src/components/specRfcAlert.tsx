import {Alert} from './alert';

export function SpecRfcAlert() {
  return (
    <Alert>
      This document uses key words such as "MUST", "SHOULD", and "MAY" as defined
      in <a href="https://www.ietf.org/rfc/rfc2119.txt">RFC 2119</a> to indicate
      requirement levels.
    </Alert>
  );
}
