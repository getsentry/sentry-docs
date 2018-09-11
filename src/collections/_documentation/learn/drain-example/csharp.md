The .NET SDK automatically shuts down and waits `ShutdownTimeout` seconds before that happens
when the `Init`'s return value is disposed:

```csharp
using (SentrySdk.Init(...))
{
    // App code
}
```
