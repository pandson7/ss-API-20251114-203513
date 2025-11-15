const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE_NAME;

const sampleProducts = [
    {
        productId: 'prod-001',
        productName: 'Wireless Headphones',
        category: 'Electronics',
        brand: 'TechBrand',
        specifications: {
            batteryLife: '30 hours',
            connectivity: 'Bluetooth 5.0',
            weight: '250g',
            color: 'Black',
            noiseCancellation: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'prod-002',
        productName: 'Smart Watch',
        category: 'Wearables',
        brand: 'FitTech',
        specifications: {
            displaySize: '1.4 inches',
            batteryLife: '7 days',
            waterResistance: 'IP68',
            heartRateMonitor: true,
            gpsEnabled: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'prod-003',
        productName: 'Gaming Laptop',
        category: 'Computers',
        brand: 'GamePro',
        specifications: {
            processor: 'Intel i7-12700H',
            ram: '16GB DDR4',
            storage: '512GB SSD',
            graphics: 'RTX 3060',
            displaySize: '15.6 inches',
            refreshRate: '144Hz'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'prod-004',
        productName: 'Coffee Maker',
        category: 'Appliances',
        brand: 'BrewMaster',
        specifications: {
            capacity: '12 cups',
            programmable: true,
            autoShutoff: true,
            material: 'Stainless Steel',
            dimensions: '14x10x12 inches'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        productId: 'prod-005',
        productName: 'Running Shoes',
        category: 'Footwear',
        brand: 'SportFlex',
        specifications: {
            material: 'Mesh and Synthetic',
            sole: 'Rubber',
            cushioning: 'Air Max',
            weight: '280g',
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['Black', 'White', 'Blue', 'Red']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

exports.handler = async (event) => {
    console.log('Data initialization event:', JSON.stringify(event, null, 2));
    
    try {
        // Insert sample products
        for (const product of sampleProducts) {
            const command = new PutCommand({
                TableName: tableName,
                Item: product,
                ConditionExpression: 'attribute_not_exists(productId)'
            });
            
            try {
                await docClient.send(command);
                console.log(`Inserted product: ${product.productId}`);
            } catch (error) {
                if (error.name === 'ConditionalCheckFailedException') {
                    console.log(`Product ${product.productId} already exists, skipping`);
                } else {
                    throw error;
                }
            }
        }
        
        // Send response for CloudFormation custom resource
        const response = {
            Status: 'SUCCESS',
            PhysicalResourceId: 'data-initializer',
            Data: {
                Message: 'Sample data initialized successfully'
            }
        };
        
        if (event.ResponseURL) {
            await sendResponse(event, response);
        }
        
        return response;
        
    } catch (error) {
        console.error('Error initializing data:', error);
        
        const response = {
            Status: 'FAILED',
            PhysicalResourceId: 'data-initializer',
            Reason: error.message
        };
        
        if (event.ResponseURL) {
            await sendResponse(event, response);
        }
        
        throw error;
    }
};

async function sendResponse(event, response) {
    const https = require('https');
    const url = require('url');
    
    const responseBody = JSON.stringify({
        Status: response.Status,
        Reason: response.Reason || 'See CloudWatch logs for details',
        PhysicalResourceId: response.PhysicalResourceId,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: response.Data
    });
    
    const parsedUrl = url.parse(event.ResponseURL);
    const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: 'PUT',
        headers: {
            'content-type': '',
            'content-length': responseBody.length
        }
    };
    
    return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            console.log('Status code:', response.statusCode);
            resolve();
        });
        
        request.on('error', (error) => {
            console.error('Error sending response:', error);
            reject(error);
        });
        
        request.write(responseBody);
        request.end();
    });
}
