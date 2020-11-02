import AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

export default {
  get: (params) => client.get(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
  update: (params) => client.update(params).promise(),
  delete: (params) => client.delete(params).promise(),
};

// Using the promise form of the DynamoDB methods
// Promises are a method for managing asynchronous code that serve as an alternative to the standard callback function syntax
// Exposing the DynamoDB client methods that we are going to need
