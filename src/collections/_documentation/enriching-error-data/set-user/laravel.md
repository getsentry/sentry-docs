Starting with Laravel 5.3 we can automatically add the authenticated user id to the scope if [`send_default_pii`]({%- link _documentation/error-reporting/configuration/index.md -%}?platform=php#send-default-pii) option is set to `true` in your `config/sentry.php`.

The mechanism to add more user context to the scope will vary depending on which version of Laravel you're using, but the general approach is the same. Find a good entry point to your application in which the context you want to add is available, ideally early in the process.

In the following example, we'll use a middleware to add the user information if a user is logged in:

```php
namespace App\Http\Middleware;

use Closure;
use Sentry\State\Scope;

class SentryContext
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (auth()->check() && app()->bound('sentry')) {
            \Sentry\configureScope(function (Scope $scope): void {
                $scope->setUser([
                    'id' => auth()->user()->id,
                    'email' => auth()->user()->email,
                ]);
            });
        }

        return $next($request);
    }
}
```
