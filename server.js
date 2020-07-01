const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = parseInt(process.env.PORT, 10) || 3000;

const app = express();

const routes = [
  {
    // this should match what's in nginx.conf
    routes: [
      '/assets',
      '/platforms',
      '/clients',
      '/error-reporting',
      '/enriching-error-data',
      '/performance-monitoring',
      '/workflow',
      '/data-management',
      '/accounts',
      '/cli',
      '/api',
      '/guides',
      '/support',
      '/sdks',
      '/ssl',
      '/_platforms'
    ],
    address: 'http://localhost:9001'
  },
  {
    routes: ['/'],
    address: 'http://localhost:9002'
  }
];

for (route of routes) {
  app.use(
    route.routes,
    createProxyMiddleware({
      target: route.address
    })
  );
}

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
