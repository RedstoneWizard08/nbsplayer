const fs = require("fs");

const g = (f) => {
  const ext = g.split(".")[g.split(".").length - 1];

  switch(ext.toLowerCase()) {
    case "png":
      return "image/png";
    
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    
    case "gif":
      return "image/gif";

    case "svg":
      return "image/svg+xml";
    
    case "ogg":
      return "audio/ogg";
    
    case "mp3":
      return "audio/mpeg";

    case "mp4":
      return "video/mp4";
  }
};

/**
 * @type {import("@vue/cli-service").ProjectOptions}
 */
module.exports = {
  publicPath: ".",

  chainWebpack: (conf) => {
    conf.optimization.minimize(false);

    conf.module.rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader");
    
    conf.module.rule("svg")
      .use("svg-inline-loader")
      .loader("svg-inline-loader");
    
    // conf.module.rule("ogg")
    //   .test(/\.ogg$/i)
    //   // .include.add(/src\/assets\/instruments\/audio\/.*/)
    //   .use("url-loader")
    //   .loader("url-loader")
    //   .options({
    //     limit: 102400,
    //     fallback: {
    //       loader: 'file-loader',
    //       options: { name: 'img/pdf/[name].[hash].[ext]' },
    //     },
    //   });
    conf.module.rule("media").use("url-loader").options({
      limit: 32768,
      fallback: {
        loader: 'file-loader',
        options: {
          name: 'media/[name].[hash:8].[ext]'
        }
      }
    });

    return conf;
  },
};
