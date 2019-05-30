You can verify Sentry is capturing unhandled exceptions by raising an exception. For example, you can use the following snippet to raise a `DivideByZeroException`:

```csharp
using (SentrySdk.Init("___PUBLIC_DSN___"))
{
    Console.WriteLine(1 / 0);
}
```
