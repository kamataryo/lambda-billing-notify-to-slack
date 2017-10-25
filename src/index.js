// modified from https://qiita.com/ishikun/items/90b766e5555421970e9f#%E3%81%AA%E3%82%93%E3%81%98%E3%82%83%E3%81%93%E3%82%89%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88
const aws = require('aws-sdk')

const cloudwatch = new aws.CloudWatch({
  region: 'us-east-1',
  endpoint: 'https://monitoring.us-east-1.amazonaws.com',
})

// the channel to send notify
const channel = process.env.SLACK_CHANNEL

// Slack Incoming Webhook URL
const incommingWebhookURL = process.env.SLACK_INCOMMING_WEBHOOK

// using services
const serviceNames = [
  'AmazonDynamoDB',
  'AmazonEC2',
  'AmazonRDS',
  'AmazonRoute53',
  'AmazonS3',
  'AmazonSNS',
  'AWSCloudWatch',
  'AWSDataTransfer',
  'AWSLambda',
  'AWSQueueService',
]

const now = new Date()
const [year, month, date] = [
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 1,
]
const startTime = new Date(year, month, date, 0, 0, 0)
const endTime = new Date(year, month, date, 23, 59, 59)

/**
 * format float number
 * @param  {number} number formatting number
 * @param  {number} n      exponentation
 * @return {number}        formatted number
 */
const floatFormat = (number, n) => {
  const pow = Math.pow(10, n)
  return Math.round(number * pow) / pow
}

const cwparams = {
  MetricName: 'EstimatedCharges',
  Namespace: 'AWS/Billing',
  Period: 86400,
  StartTime: startTime,
  EndTime: endTime,
  Statistics: ['Average'],
  Dimensions: [
    {
      Name: 'Currency',
      Value: 'USD',
    },
  ],
}

exports.handler = (event, context) => {
  cloudwatch.getMetricStatistics(cwparams, (err, data) => {
    if (err) {
      console.log(err) || context.fail()
    }
    console.log(data) || context.success()
  })
}

// const datapoints = data.Datapoints
// if (datapoints.length < 1) {
//   billings.Total = 0
// } else {
//   billings.Total = datapoints[datapoints.length - 1].Average
// }

//   return Promise.all(
//     serviceNames.map(serviceName =>
//       cloudwatch.getMetricStatistics({
//         MetricName: 'EstimatedCharges',
//         Namespace: 'AWS/Billing',
//         Period: 86400,
//         StartTime: startTime,
//         EndTime: endTime,
//         Statistics: ['Average'],
//         Dimensions: [
//           {
//             Name: 'Currency',
//             Value: 'USD',
//           },
//           {
//             Name: 'ServiceName',
//             Value: serviceName,
//           },
//         ],
//       })
//     )
//   )
// })
//
//   const getEachServiceBilling = serviceName => {
//     const params =
//
//     cloudwatch.getMetricStatistics(params, (err, data) => {
//       if (err) {
//         console.error(err, err.stack)
//       } else {
//         const datapoints = data['Datapoints']
//         if (datapoints.length < 1) {
//           billings[serviceName] = 0
//         } else {
//           billings[serviceName] = datapoints[datapoints.length - 1]['Average']
//         }
//         if (serviceNames.length > 0) {
//           serviceName = serviceNames.shift()
//           getEachServiceBilling(serviceName)
//         } else {
//             const fields = Object.keys(billings).map(serviceName => ({
//               title: serviceName,
//               value: floatFormat(billings[serviceName], 2) + ' USD',
//               short: true,
//             }))
//
//             /**
//              * message
//              * @type {{channel: string, attachments: array<object>}}
//              */
//             const message = {
//               channel,
//               attachments: [
//                 {
//                   fallback:
//                     '今月のAWSの利用費は、' + floatFormat(billings['Total'], 2) + ' USDです。',
//                   pretext: '今月のAWSの利用費は…',
//                   color: 'good',
//                   fields,
//                 },
//               ],
//             }
//
//             fetch(incommingWebhookURL, {
//               method: 'POST',
//               body: JSON.stringify(message),
//             })
//               .then(res => {
//                 if (res.status >= 400) {
//                   console.log('Bad response from slack server.')
//                   context.fail()
//                 } else {
//                   context.succeed()
//                 }
//               })
//               .catch(err => console.log(err) || context.fail())
//         }
//       }
//     }
//   }
// }
