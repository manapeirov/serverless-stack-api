import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as sst from "@serverless-stack/resources";

export default class S3Stack extends sst.Stack {

    // public reference to the S3 bucket 
    bucket;

    constructor(scope, id, props) {
        super(scope, id, props);

        this.bucket = new s3.Bucket(this, "Uploads", {
            // Allow client side access to the bucket from a different domain
            cors: [
                {
                    maxAge: 3000,
                    allowedOrigins: ["*"],
                    allowedHeaders: ["*"],
                    allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
                }
            ],
        })

        // Export values
        new cdk.CfnOutput(this, "AttachmentsBucketName", {
            value:  this.bucket.bucketName,
        })
    }
}

// Don’t need to create a CloudFormation export because we need this value in our React app. And there isn’t really a way to import CloudFormation exports there.
// Creating a public class property called bucket. It holds a reference to the bucket that is created in this stack. Refer to this later when creating Cognito IAM policies.