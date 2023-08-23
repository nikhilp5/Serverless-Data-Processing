const AWS = require("aws-sdk");

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const sourceBucket = event.Records[0].s3.bucket.name;
    const sourceKey = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    const fileData = await s3
      .getObject({ Bucket: sourceBucket, Key: sourceKey })
      .promise();
    const jsonData = JSON.parse(fileData.Body.toString());

    // Update the DynamoDB table with the named entities and their frequencies
    await updateDynamoDB(jsonData);

    return {
      statusCode: 200,
      body: "DynamoDB updated successfully!",
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: "An error occurred while updating DynamoDB.",
    };
  }
};

// Function to update the DynamoDB table with named entities and their frequencies
async function updateDynamoDB(jsonData) {
  try {
    const tableName = "NamedEntitiesTable";

    for (const [sourceKey, entities] of Object.entries(jsonData)) {
      for (const entity in entities) {
        const frequency = entities[entity];

        // Check if the entity already exists in DynamoDB
        const existingItem = await dynamoDB
          .get({ TableName: tableName, Key: { key: entity } })
          .promise();

        if (existingItem.Item) {
          // Update the existing value by adding the new frequency
          const params = {
            TableName: tableName,
            Key: { key: entity },
            UpdateExpression: "SET #value = #value + :frequency",
            ExpressionAttributeNames: {
              "#value": "value",
            },
            ExpressionAttributeValues: {
              ":frequency": frequency,
            },
          };

          await dynamoDB.update(params).promise();
        } else {
          // Insert a new item for the entity in DynamoDB
          const params = {
            TableName: tableName,
            Item: {
              key: entity,
              value: frequency,
            },
          };

          await dynamoDB.put(params).promise();
        }
      }
    }
  } catch (err) {
    console.error("Error updating DynamoDB:", err);
    throw err;
  }
}
