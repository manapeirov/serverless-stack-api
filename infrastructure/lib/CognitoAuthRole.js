import * as cdk from "@aws-cdk/core"
import * as iam from "@aws-cdk/aws-iam"
import * as cognito from "@aws-cdk/aws-cognito"

export default class CognitoAuthRole extends cdk.Construct {
    // Public reference to the IAM role, public class property that can be accessed in the CognitoStack
    role;

    constructor(scope, id, props) {
        super(scope, id, props);

        // The CognitoAuthRole construct takes an identityPool as a prop
        const { identityPool } = props;

        // IAM role used for authenticated users

        // Iam role can be assumed by users that are authenticated with the Identity Pool that's passed in.
        this.role = new iam.Role(this, "CognitoDefaultAuthenticatedRole", {
            assumedBy: new iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    StringEquals: {
                        "cognito-identity.amazonaws.com:aud": identityPool.ref,
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.awmazonaws.com:amr": "authenticated",
                    },
                },
                "sts:AssumeRoleWithWebIdentity"
            ),
        })

        // Add a policy to this role using addToPolicy method. This is a standard Cognito related policy
        this.role.addToPolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    "mobileanalytics:PutEvents",
                    "cognito-sync:*",
                    "cognito-identity:*",
                ],
                resources: ["*"]
            })
        );

        // Attach newly created role to the Identity Pool by creating a new cognito.CfnIdentityPoolRoleattachment

        new cognito.CfnIdentityPoolRoleAttachment(
            this,
            "IdentityPoolRoleAttachment",
            {
                identityPoolId: identityPool.ref,
                roles: { authenticated: this.role.roleArn }
            }
        );

    }
}