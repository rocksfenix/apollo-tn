require('dotenv').config()

console.log('RUN NOW')
const webpack = require('webpack')
const withCSS = require('@zeit/next-css')

// const dev = process.env.NODE_ENV !== 'production'

module.exports = withCSS({
  // cssModules: true,
  webpack: config => {
    config.plugins.push(
      // new MonacoWebpackPlugin(),
      new webpack.EnvironmentPlugin(['SAFE_ENV'])
    )

    // config.worker = 'monaco-editor/esm/vs/editor/editor.worker.js'
    return config
  }
})
