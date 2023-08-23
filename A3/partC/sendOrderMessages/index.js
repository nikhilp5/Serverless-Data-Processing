const AWS = require("aws-sdk");
const sqs = new AWS.SQS();
const queueUrl = "queue-url";

exports.handler = async (event, context) => {
  const CAR = ["Compact", "Mid-size Sedan", "SUV", "Luxury"];
  const ADDON = ["GPS", "Camera"];
  const CLIENT = [
    "6050 University Avenue",
    "123 Main Street",
    "456 Elm Street",
  ];

  for (let i = 0; i < 3; i++) {
    let carType = CAR[Math.floor(Math.random() * CAR.length)];
    let accessories = ADDON[Math.floor(Math.random() * ADDON.length)];
    let address = CLIENT[Math.floor(Math.random() * CLIENT.length)];

    const order = `Car Type: ${carType}, Accessories: ${accessories}, Address: ${address}`;
    const params = {
      MessageBody: order,
      QueueUrl: queueUrl,
    };

    try {
      const response = await sqs.sendMessage(params).promise();
      console.log(
        `Message sent successfully. MessageId: ${response.MessageId}`
      );
    } catch (error) {
      console.error("Error sending message to SQS:", error);
    }
  }
};
