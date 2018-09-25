You should initialize the SDK as early as possible, like in the `Main` method in `Program.cs`:

```csharp
using (SentrySdk.Init("___PUBLIC_DSN___"))
{
    // App code
}
```
