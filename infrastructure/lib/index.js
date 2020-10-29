import DynamoDBStack from "./DynamoDBStack";
import S3Stack from "./S3Stack"
import CognitoStack from "./CognitoStack"

export default function main(app) {
  new DynamoDBStack(app, "dynamodb");

  const s3 = new S3Stack(app, "s3")

  // Taking the bucket property of the S3Stack and passing it in as the bucketArn to CognitoStack
  new CognitoStack(app, "cognito", { bucketArn: s3.bucket.bucketArn });

  // Add more stacks
}

