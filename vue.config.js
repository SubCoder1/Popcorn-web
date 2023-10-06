const { defineConfig } = require("@vue/cli-service");
module.exports = {
  transpileDependencies: true,
  pwa: {
    name: "Popcorn",
    themeColor: "#f18579",
    msTileColor: "#f18579",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",
    iconPaths: {
      favicon32: "favicon-32x32.png",
      favicon16: "favicon-16x16.png",
      appleTouchIcon: "apple-touch-icon.png",
      maskIcon: "safari-pinned-tab.svg",
      msTileImage: "mstile-150x150.png",
      faviconSVG: "safari-pinned-tab.svg",
    },
    manifestOptions: {
      icons: [
        {
          src: "android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          src: "favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          src: "mstile-150x150.png",
          sizes: "150x150",
          type: "image/png",
        },
      ]
    }
  },
};
