const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      // target: "http://121.40.176.38:8088/",
      target: "http://192.168.0.114:8080",
      changeOrigin: true
    })
  );
};