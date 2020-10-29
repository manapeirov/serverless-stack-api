import { CfnOutput } from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as sst from "@serverless-stack/resources";
import * as iam from "@aws-cdk/aws-iam"
import CognitoAuthRole from "./CognitoAuthRole"

export default class CognitoStack extends sst.Stack {
    constructor(scope, id, props) {
        
        super(scope, id, props);


        const { bucketArn } = props;

        const app = this.node.root;

        //  New instance of the cognito.UserPool class:
        const userPool = new cognito.UserPool(this, "UserPool", {
            selfSignUpEnabled: true, // Allow users to sign up
            autoVerify: { email: true }, // Verify email addresses by sending a verification code
            signInAliases: { email: true } // Set email as an alias
        });

        // New instance of the cognito.UserPoolClient class linked to the User Pool defined above.
        const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
            userPool,
            generateSecret: false, // Don't need to generate secret for web app running on browsers
        });

        //  New instance of CfnIdentityPool linked to the User Pool created above
        const identityPool = new cognito.CfnIdentityPool(this, "IdentityPool", {
            allowUnauthenticatedIdentities: false, // Don't allow unauthenticated users
            cognitoIdentityProviders: [
                {
                    clientId: userPoolClient.userPoolClientId,
                    providerName: userPool.userPoolProviderName
                }
            ]
        })

        // New instance of CognitoAuthRole assigned to authenticatedRole
        const authenticatedRole = new CognitoAuthRole(this, "CognitoAuthRole", {
            identityPool
        })


        // Access new IAM role through authenticatedRole.role. Add a new policy to this role which grants permission to a specific folder in S3 bucket
        // Ensures authenticated users can only access their own uploaded files
        authenticatedRole.role.addToPolicy(
            // IAM policy grandting users permission to a specific folder in the S3 bucket
            new iam.PolicyStatement({
                actions: ["s3:*"],
                effect: iam.Effect.ALLOW,
                resources: [ 
                    bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*"
                ]
            })
        )
        // Export values to be used in React App
        new CfnOutput(this, "UserPoolId", {
            value: userPool.userPoolId
        });

        new CfnOutput(this, "UserPoolClientId", {
            value: userPoolClient.userPoolClientId
        });

        new CfnOutput(this, "IdentityPoolId", {
            value: identityPool.ref
        })

        new CfnOutput(this, "AuthenticatedRoleName", {
            value: authenticatedRole.role.roleName,
            exportName: app.logicalPrefixedName("CognitoAuthRole")
        })
    }
}