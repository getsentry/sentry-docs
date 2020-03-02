One way to verify your setup is by intentionally sending an event that breaks your application.

Raise an unhandled Python exception by inserting a divide by zero expression
into your application:

```py
division_by_zero = 1 / 0
```
