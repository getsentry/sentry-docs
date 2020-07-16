const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const PORT = parseInt(process.env.PORT, 10) || 3000;

const app = express();

const routes = [
  {
    // this should match what's in nginx.conf
    routes: [
      "/assets",
      "/platforms",
      "/clients",
      "/error-reporting",
      "/performance-monitoring",
      "/api",
      "/guides",
      "/support",
      "/sdks",
      "/ssl",
      "/_platforms"
    ],
    address: "http://localhost:9001"
  },
  {
    routes: ["/"],
    address: "http://localhost:9002"
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
  console.log("\x1b[32m%s\x1b[0m", `-----------------------------------------`);
  console.log("\x1b[32m%s\x1b[0m", `-----------------------------------------`);
  console.log("\x1b[32m%s\x1b[0m", `-----------------------------------------`);
  console.log("\x1b[32m%s\x1b[0m", `-----------------------------------------`);
  console.log(
    "\x1b[32m%s\x1b[0m",
    `Open to see the docs http://localhost:${PORT}`
  );
  console.log(
    "\x1b[32m%s\x1b[0m",
    `Open to see the docs http://localhost:${PORT}`
  );
  console.log(
    "\x1b[32m%s\x1b[0m",
    `Open to see the docs http://localhost:${PORT}`
  );
  console.log(
    "\x1b[32m%s\x1b[0m",
    `Open to see the docs http://localhost:${PORT}`
  );
  console.log("\x1b[32m%s\x1b[0m", `-----------------------------------------`);
  console.log("\x1b[32m%s\x1b[0m", `-----------------------------------------`);
  console.log("\x1b[32m%s\x1b[0m", `-----------------------------------------`);
  console.log("\x1b[32m%s\x1b[0m", `-----------------------------------------`);
});
