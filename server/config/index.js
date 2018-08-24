import path from 'path'

let PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === 'test') {
  PORT = 3500
}

// Default configuations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs () {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production'
    }
  },

  version: require('../../package.json').version,
  root: path.normalize(__dirname, '/../../../..'),
  port: PORT,
  ip: process.env.IP || '0.0.0.0',
  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true
      }
    }
  },

  S3Bucket: process.env.S3_BUCKET,

  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.JWT_SECRET || 'i-am-the-secret-key',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60, // 60 * 60 * 24 * 7, // 1 week
    saltRounds: process.env.SALT_ROUNDS || 12
  },

  // Content Security Policy (CSP)
  // @see server/middleware/security for more info.
  cspExtensions: {
    childSrc: [
      'https://player.vimeo.com',
      'js.stripe.com',
      'https://www.google.com/recaptcha/api.js',
      'https://www.gstatic.com'
    ],
    connectSrc: [],
    defaultSrc: [],
    fontSrc: ['fonts.googleapis.com/css', 'fonts.gstatic.com'],
    imgSrc: [
      'data:',
      'dxpdcvj89hnue.cloudfront.net',
      'https://s3-us-west-2.amazonaws.com'
    ],
    mediaSrc: [
      'dxpdcvj89hnue.cloudfront.net',
      'https://player.vimeo.com'
    ],
    manifestSrc: [],
    objectSrc: [],
    scriptSrc: [
      // Allow scripts from cdn.polyfill.io so that we can import the
      // polyfill.
      'js.stripe.com',
      'cdn.polyfill.io',
      'www.google.com/recaptcha/api.js',
      'www.gstatic.com'
    ],
    frameSrc: [
      'https://www.google.com/',
      'https://js.stripe.com/',
      'https://player.vimeo.com'
    ],
    styleSrc: [
      'cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css',
      'fonts.googleapis.com/css'
    ]
  }
}

// Environment specific overrides
const environmentConfigs = {
  development: {
    mongo: {
      uri: process.env.MONGO_URI_DEV
    },
    security: {
      sessionSecret: process.env.JWT_SECRET,
      sessionExpiration: 60 * 60 * 24 * 7,
      saltRounds: 4
    },
    // Configuracion de pagos stripe
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY
    },
    reCaptcha: {
      publicKey: process.env.RECAPTCHA_PUBLIC_KEY,
      secretKey: process.env.RECAPTCHA_SECRET_KEY
    }
  },
  test: {
    port: 5678,
    mongo: {
      uri: process.env.MONGO_URI_TEST
    },
    security: {
      sessionSecret: process.env.JWT_SECRET,
      sessionExpiration: 60 * 60 * 24 * 7,
      saltRounds: 4
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY
    },
    reCaptcha: {
      publicKey: process.env.RECAPTCHA_PUBLIC_KEY,
      secretKey: process.env.RECAPTCHA_SECRET_KEY
    }
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGO_URI_PRODUCTION
    },
    security: {
      sessionSecret: process.env.JWT_SECRET,
      sessionExpiration: 60 * 60 * 24 * 7,
      saltRounds: 4
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY
    },
    reCaptcha: {
      publicKey: process.env.RECAPTCHA_PUBLIC_KEY,
      secretKey: process.env.RECAPTCHA_SECRET_KEY
    }
  }
}

// Recursively merge configurations
export default Object.assign(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {})
