Users consist of a few critical pieces of information which are used to
construct a unique identity in Sentry. Each of these is optional, but
one **must** be present for the Sentry SDK to capture the user:

`id`

: Your internal identifier for the user.

`username`

: The user's username. Generally used as a better label than the internal ID.

`email`

: An alternative, or addition, to a username. Sentry is aware of email addresses
  and can show things like Gravatars, unlock messaging capabilities, and more.

`ip_address`

: The IP address of the user. If the user is unauthenticated, providing the IP
  address will suggest that this is unique to that IP. If available, we will
  attempt to pull this from the HTTP request data.

Additionally, you can provide arbitrary key/value pairs beyond the reserved
names, and the Sentry SDK will store those with the user.
