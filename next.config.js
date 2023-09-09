var ExportPathMap = require("next/dist/server/config-shared").ExportPathMap;
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  reactStrictMode: false,

  // route home / to auto chosen seller profile
  // exportPathMap: function (defaultMap, ctx) {
  //   return {
  //     '/': { page: '/seller/0' }
  //   }
  // },

  // - error "next export" does not work with App Router.
  // Please use "output: export" in next.config.js
  // https://nextjs.org/docs/advanced-features/static-html-export
  //
  // TLDR;
  // After running next build, Next.js will produce an `out` folder
  // which contains the HTML/CSS/JS assets for your application.
  // so we don't need `next export` anymore if we use this option
  output: "export",
}

module.exports = nextConfig
