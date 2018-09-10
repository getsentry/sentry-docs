In C# you can capture any exception object that you caught:

```csharp
using Sentry;

try 
{
    AFunctionThatMightFail();
} 
catch (Exception err)
{
    SentrySdk.CaptureException(err);
}
```
