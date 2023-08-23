const AWS = require("aws-sdk");
const sqs = new AWS.SQS();
const sns = new AWS.SNS();
const queueUrl = "sqs-url";
const topicArn = "topic-arn";

exports.handler = async (event, context) => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10, // Fetch up to 10 messages at a time
    WaitTimeSeconds: 0,
  };

  try {
    for (let i = 0; i < 10; i++) {
      const data = await sqs.receiveMessage(params).promise();
      if (data.Messages && data.Messages.length > 0) {
        const orderPromises = data.Messages.map(async (message) => {
          const orderDetails = message.Body;

          // Publish the order details to the SNS topic
          const snsParams = {
            Message: orderDetails,
            Subject: "New Car Delivery Order",
            TopicArn: topicArn,
          };
          await sns.publish(snsParams).promise();
          console.log("Email sent");
          // Delete the message from the queue
          const deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          };
          await sqs.deleteMessage(deleteParams).promise();
        });

        await Promise.all(orderPromises); // Wait for all messages to be processed
      } else {
        break;
      }
    }
  } catch (error) {
    console.error("Error receiving or processing messages:", error);
  }
};
