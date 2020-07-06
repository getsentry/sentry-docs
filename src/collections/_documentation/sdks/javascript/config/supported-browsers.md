---
title: Supported Browsers
excerpt: ""
---
Sentry's JavaScript SDK supports the following browsers:

<table>
  <tbody>
    <tr>
      <td>
        <strong>Android</strong>
      </td>
      <td>
        <strong>Firefox</strong>
      </td>
      <td>
        <strong>Chrome</strong>
      </td>
      <td>
        <strong>IE</strong>
      </td>
      <td>
        <strong>iPhone</strong>
      </td>
      <td>
        <strong>Edge</strong>
      </td>
      <td>
        <strong>Safari</strong>
      </td>
    </tr>
    <tr>
      <td>4.4</td>
      <td>latest</td>
      <td>latest</td>
      <td>IE 10</td>
      <td>iOS12</td>
      <td>latest</td>
      <td>latest</td>
    </tr>
    <tr>
      <td>5.0</td>
      <td> </td>
      <td> </td>
      <td>IE 11</td>
      <td>iOS13</td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>6.0</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>7.1</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>8.1</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>9.0</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>10.0</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
  </tbody>
</table>

## Support for <= IE 11

Prior to version 5.7.0, our JavaScript SDK needed some polyfills for older browsers like IE 11 and lower. If you are using it, please upgrade to the latest version or add the script tag below before loading our SDK.

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"></script>
```

We need the following polyfill:
- `Promise`
- `Object.assign`
- `Number.isNaN` 
- `String.prototype.includes`

Additionally, remember to define a valid HTML doctype on top of your HTML page to make sure IE does not go into compatibility mode.