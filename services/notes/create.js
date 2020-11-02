import handler from "./libs/handler-lib"
import * as uuid from "uuid"
import dynamoDb from "./libs/dynamodb-lib"

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body)
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  }
  // Simplify how we make calls to DynamoDB.
  // Don’t want to have to create a new AWS.DynamoDB.DocumentClient().
  // Also, use async/await when working with our database calls.
  await dynamoDb.put(params)
  // Make our Lambda functions async, and simply return the results.
  // Without having to call the callback method.
  return params.Item
})

// Since all of our Lambda functions will be handling API endpoints, handle HTTP responses in one place.

// import * as uuid from "uuid";
// import AWS from "aws-sdk";
//
// //The AWS JS SDK assumes the region based on the current region of the Lambda function. So if your DynamoDB table is in a different region, make sure to set it by calling AWS.config.update({ region: "my-region" }); before initializing the DynamoDB client.
//
// const dynamoDb = new AWS.DynamoDB.DocumentClient();
//
// export function main(event, context, callback) {
//   // Request body is passed in as a JSON encoded string in 'event.body'
//   // Parse then input from the event.body This represents the HTTP request parameters
//   const data = JSON.parse(event.body);
//
//   const params = {
//     // read the name of our DynamoDB table from the environment variable using process.env.tableName.
//     // This is set in serverless.yml
//     TableName: process.env.tableName,
//     // 'Item' contains the attributes of the item to be created
//     // - 'userId': user identities are federated through the
//     //             Cognito Identity Pool, we will use the identity id
//     //             as the user id of the authenticated user
//     // - 'noteId': a unique uuid
//     // - 'content': parsed from request body
//     // - 'attachment': parsed from request body
//     // - 'createdAt': current Unix timestamp
//
//     Item: {
//       // The userId is a Federated Identity id that comes in as a part of the request. This is set after our user has been authenticated via the User Pool.
//       userId: event.requestContext.identity.cognitoIdentityId,
//       noteId: uuid.v1(),
//       content: data.content,
//       attachment: data.attachment,
//       createdAt: Date.now()
//     }
//
//   };
//
//   // Make a call to DynamoDB to put a new object with a generated noteId and the current date as the createdAt
//
//   dynamoDb.put(params, (error, data) => {
//     // Set response headers to enable CORS (Cross-Origin Resource Sharing)
//     const headers = {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Credentials": true
//     };
//
//     // Upon success, return the newly created note object with the HTTP status code 200 and response headers to enable CORS (Cross-Origin Resource Sharing).
//     // And if the DynamoDB call fails then return an error with the HTTP status code 500.
//
//     // Return status code 500 on error
//     if (error) {
//       const response = {
//         statusCode: 500,
//         headers: headers,
//         body: JSON.stringify({ status: false })
//       };
//       callback(null, response);
//       return;
//     }
//
//     // Return status code 200 and the newly created item
//     const response =  {
//       statusCode: 200,
//       headers: headers,
//       body: JSON.stringify(params.Item)
//     };
//
//     callback(null, response);
//   });
//
// }
//
