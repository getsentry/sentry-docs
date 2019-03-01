```csharp
public class MyRpcException : Exception
{
    // The name of the RPC function that was called (e.g. "getAllBlogArticles")
    public string Function { get; set; }

    // For example a HTTP status code returned by the server.
    public HttpStatusCode Code { get; set; }
}

using (SentrySdk.Init(o =>
{
    o.BeforeSend = @event =>
    {
        if (@event.Exception is MyRpcException ex)
        {
            @event.SetFingerprint(
                new []
                {
                    "{% raw %}{{ default }}{% endraw %}",
                    ex.Function,
                    ex.Code.ToString(),
                }
            );
        }

        return @event;
    };
}
```
