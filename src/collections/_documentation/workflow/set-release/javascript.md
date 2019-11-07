```javascript
Sentry.init({
  release: '{{ page.release_identifier }}@{{ page.release_version }}'
});
```
A common way to do this with JavaScript would be to use the [`process.env.npm_package_version`](https://docs.npmjs.com/misc/scripts#packagejson-vars) like so:
```javascript
Sentry.init({
  release: '{{ page.release_identifier }}@' + process.env.npm_pacakage_version
});
```
