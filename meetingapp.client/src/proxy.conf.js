const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(';')[0]
    : 'http://localhost:5226';  // Changed to HTTP instead of HTTPS

const PROXY_CONFIG = [
  {
    context: [
      "/api",  // Proxy all API routes
    ],
    target: target,
    secure: false,  // Set to false to avoid SSL issues during development
    changeOrigin: true,  // Necessary for some backend setups
    logLevel: "debug"  // Optional: useful for debugging the proxy configuration
  }
];

module.exports = PROXY_CONFIG;
