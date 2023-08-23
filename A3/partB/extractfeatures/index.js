const AWS = require("aws-sdk");
const natural = require("natural");
const fs = require("fs");

const s3 = new AWS.S3();

// Function to extract named entities from text
//[6]	Natural, “Natural”, Natural. [Online]. Available: https://naturalnode.github.io/natural/ [Accessed: July 24, 2023].
function extractNamedEntities(text) {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text);
  const regex = /\b[A-Z]\w*\b/g;
  const namedEntities = words.filter((word) => regex.test(word));
  return namedEntities;
}

// Function to calculate the frequency of named entities
function calculateEntityFrequency(namedEntities) {
  const frequencyMap = {};
  namedEntities.forEach((entity) => {
    frequencyMap[entity] = frequencyMap[entity] ? frequencyMap[entity] + 1 : 1;
  });
  return frequencyMap;
}

exports.handler = async (event) => {
  try {
    const sourceBucket = event.Records[0].s3.bucket.name;
    const sourceKey = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    const fileData = await s3
      .getObject({ Bucket: sourceBucket, Key: sourceKey })
      .promise();
    const textContent = fileData.Body.toString();

    // Extract named entities from the text content
    const namedEntities = extractNamedEntities(textContent);

    // Calculate the frequency of named entities
    const frequencyMap = calculateEntityFrequency(namedEntities);

    // Create the final JSON object with the sourceKey and the named entities frequencies
    const jsonResult = {};
    jsonResult[
      `${sourceKey
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "")}ne`
    ] = frequencyMap;

    // Convert the JSON object to a JSON string
    const jsonString = JSON.stringify(jsonResult, null, 2);

    // Save the JSON string to a text file
    const tempFilePath = "/tmp/named_entities.txt";
    fs.writeFileSync(tempFilePath, jsonString);

    // Upload the text file to the S3 bucket
    const destinationBucket = "tagsb00934514";
    const destinationKey = `${sourceKey
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "")}ne.txt`; // [5]   Stack Overflow, “How to trim a file extension from a String in JavaScript?”, Stack Overflow. [Online]. Available: https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript. [Accessed: July 24, 2023].

    await s3
      .upload({
        Bucket: destinationBucket,
        Key: destinationKey,
        Body: fs.createReadStream(tempFilePath),
      })
      .promise();

    return {
      statusCode: 200,
      body: "File processed successfully!",
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: "An error occurred while processing the file.",
    };
  }
};
