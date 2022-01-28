const path = require("path");

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: path.resolve(__dirname,
    "dist"),
  indexPath: 'html/dashboard/index.html',
  css: {
    extract: {
      filename: 'css/dashboard/[name].[hash:8].css',
      chunkFilename: 'css/dashboard/[name].[hash:8].css'
    }
  },
  configureWebpack: {
    output: {
      filename: 'js/dashboard/[name].[hash:8].js',
      chunkFilename: 'js/dashboard/[name].[hash:8].js'
    }
  }
}
