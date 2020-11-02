import { CfnOutput } from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as sst from "@serverless-stack/resources";

export default class DynamoDBStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const app = this.node.root;

    const table = new dynamodb.Table(this, "Table", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      sortKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
    });
    // By default, CDK will generate a table name (table.tableName). To use the table name in the API,
    // use the CloudFormation export: the CfnOutput method with the exportName Option.
    // You can later import these values using cross-stack references.
    // The exportName needs to be unique for a given region in the AWS account.
    // To ensure exportName is unique when deployed to different/multiple environments, use app.logicalPrefixedName method in sst.App
    // This method prefixes a given name with the name of the stage/environment and the name of the app.

    new CfnOutput(this, "TableName", {
      value: table.tableName,
      exportName: app.logicalPrefixedName("TableName"),
    });

    //  Use the table ARN to ensure that Lambda functions have access to this table. Again exported using the CfnOutput method
    new CfnOutput(this, "TableArn", {
      value: table.tableArn,
      exportName: app.logicalPrefixedName("TableArn"),
    });
  }
}
