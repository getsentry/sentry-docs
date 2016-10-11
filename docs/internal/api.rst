Web API
=======

This document describes general guidelines for development within our REST API.

Error Responses
---------------

Errors should have an ``error`` attribute at the top level, with the following children:

.. describe:: code

    A string representing the type of error.

.. describe:: message

    An optional human readable error message.

.. describe:: params

    A mapping containing additional error information specific to parameters.

    Each value should be a mapping with a code (required) and message (optional).

An example general error:

.. code-block:: json

    {
        'error': {
            'message': 'You cannot adjust reserved capacity to the value chosen.',
            'code': 'invalid_param',
        },
    }

An example validation error:

.. code-block:: json

    {
        'error': {
            'code': 'invalid_param',
            'params': {
                'param_name': {
                    'code': 'invalid_param',
                    'message': 'This param must be a string',
                }
            }
        }
    }
