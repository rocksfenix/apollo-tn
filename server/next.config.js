const webpack = require('webpack')
require('dotenv').config()

module.exports = {
  webpack: config => {
    config.plugins.push(
      new webpack.EnvironmentPlugin(['SAFE_ENV'])
    )
    return config
  }
}
