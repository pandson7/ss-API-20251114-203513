import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class ProductApiStack203513 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'ProductSpecifications203513', {
      tableName: 'ProductSpecifications203513',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Enable auto scaling
    table.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    table.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    // Lambda Function
    const apiHandler = new lambda.Function(this, 'ProductApiHandler203513', {
      functionName: 'ProductApiHandler203513',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src')),
      environment: {
        DYNAMODB_TABLE_NAME: table.tableName
      }
    });

    // Grant Lambda permissions to DynamoDB
    table.grantReadData(apiHandler);

    // API Gateway
    const api = new apigateway.RestApi(this, 'ProductApi203513', {
      restApiName: 'ProductApi203513',
      description: 'API for product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key']
      }
    });

    const productsResource = api.root.addResource('products');
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(apiHandler));

    const productResource = productsResource.addResource('{productId}');
    productResource.addMethod('GET', new apigateway.LambdaIntegration(apiHandler));

    // Data initialization Lambda
    const dataInitHandler = new lambda.Function(this, 'DataInitHandler203513', {
      functionName: 'DataInitHandler203513',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'data-init.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src')),
      environment: {
        DYNAMODB_TABLE_NAME: table.tableName
      }
    });

    table.grantWriteData(dataInitHandler);

    // Custom resource to initialize data
    new cdk.CustomResource(this, 'DataInitializer203513', {
      serviceToken: dataInitHandler.functionArn
    });

    // Grant invoke permission to custom resource
    dataInitHandler.addPermission('AllowCustomResourceInvoke', {
      principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
      action: 'lambda:InvokeFunction'
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
      description: 'DynamoDB Table Name'
    });
  }
}
