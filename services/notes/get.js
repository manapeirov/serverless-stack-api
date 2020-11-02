import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

// Code to cause lambda timeout ()
// function allocateMemory() {
//   let bigList = Array(409600).fill(1);
//   return bigList.concat(allocateMemory());
// }

// Some faulty code outside of lambda function:
// dynamoDb_lib.notExist()

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id,
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // // Set a timeout
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  // allocateMemory();

  // Return the retrieved item
  return result.Item;
});
