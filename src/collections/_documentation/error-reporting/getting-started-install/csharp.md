Install the **NuGet** package:

Package Manager:
```shell
Install-Package Sentry -Version {% sdk_version sentry.dotnet %}
```

.NET Core CLI:
```shell
dotnet add package Sentry -v {% sdk_version sentry.dotnet %}
```

{% include components/alert.html
  title="Using .NET Framework prior to 4.6.1?"
  content="[Our legacy SDK](https://docs.sentry.io/clients/csharp/) supports .NET Framework as early as 3.5."
  level="info"
%}
