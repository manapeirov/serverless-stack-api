// import { expect, matchTemplate, MatchStyle } from "@aws-cdk/assert";
// import * as sst from "@serverless-stack/resources";
// import MyStack from "../lib/MyStack";

// test('Test Stack', () => {
//   const app = new sst.App();
//   // WHEN
//   const stack = new MyStack(app, 'test-stack');
//   // THEN
//   expect(stack).to(matchTemplate({
//     "Resources": {}
//   }, MatchStyle.EXACT))
// });


import { expect, haveResource } from "@aws-cdk/assert";
import * as sst from "@serverless-stack/resources";
import DynamoDBStack from "../lib/DynamoDBStack"


// test DynamoDBStack class is creating a DynamoDB table with the BillingMode set to PAY_PER_REQUEST.
test("Test Stack", () => {
  const app = new sst.App

  const stack = new DynamoDBStack(app, "test-stack")

  expect(stack).to(
    haveResource("AWS::DynamoDB::Table", {
      BillingMode: "PAY_PER_REQUEST"
    })
  )
})

// run tests using npx sst test