import AWS from 'aws-sdk'

AWS.config.accessKeyId = process.env.AWS_KEY
AWS.config.secretAccessKey = process.env.AWS_SECRET

export default new AWS.S3()
