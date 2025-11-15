const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE_NAME;

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, pathParameters, resource } = event;
    
    try {
        if (httpMethod === 'GET') {
            if (resource === '/products') {
                // Get all products
                const command = new ScanCommand({
                    TableName: tableName
                });
                
                const result = await docClient.send(command);
                
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key'
                    },
                    body: JSON.stringify({
                        products: result.Items || []
                    })
                };
            } else if (resource === '/products/{productId}') {
                // Get specific product
                const productId = pathParameters?.productId;
                
                if (!productId) {
                    return {
                        statusCode: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({
                            error: 'Product ID is required'
                        })
                    };
                }
                
                const command = new GetCommand({
                    TableName: tableName,
                    Key: {
                        productId: productId
                    }
                });
                
                const result = await docClient.send(command);
                
                if (!result.Item) {
                    return {
                        statusCode: 404,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({
                            error: 'Product not found',
                            productId: productId
                        })
                    };
                }
                
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key'
                    },
                    body: JSON.stringify(result.Item)
                };
            }
        }
        
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Method not allowed'
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: 'Unable to retrieve products'
            })
        };
    }
};
