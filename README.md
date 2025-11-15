# Product Specifications API

A serverless REST API built with AWS CDK that provides access to product specifications stored in DynamoDB.

## Architecture

- **API Gateway**: RESTful API endpoints
- **AWS Lambda**: Serverless compute for API logic
- **DynamoDB**: NoSQL database for product specifications
- **CDK**: Infrastructure as Code deployment

## API Endpoints

### Base URL
```
https://3qi58dvwrb.execute-api.us-east-1.amazonaws.com/prod/
```

### Endpoints

#### GET /products
Retrieve all product specifications.

**Response:**
```json
{
  "products": [
    {
      "productId": "prod-001",
      "productName": "Wireless Headphones",
      "category": "Electronics",
      "brand": "TechBrand",
      "specifications": {
        "batteryLife": "30 hours",
        "connectivity": "Bluetooth 5.0",
        "weight": "250g",
        "color": "Black",
        "noiseCancellation": true
      },
      "createdAt": "2025-11-15T01:43:12.040Z",
      "updatedAt": "2025-11-15T01:43:12.044Z"
    }
  ]
}
```

#### GET /products/{productId}
Retrieve a specific product by ID.

**Parameters:**
- `productId` (path): The unique identifier for the product

**Response (Success):**
```json
{
  "productId": "prod-001",
  "productName": "Wireless Headphones",
  "category": "Electronics",
  "brand": "TechBrand",
  "specifications": {
    "batteryLife": "30 hours",
    "connectivity": "Bluetooth 5.0",
    "weight": "250g",
    "color": "Black",
    "noiseCancellation": true
  },
  "createdAt": "2025-11-15T01:43:12.040Z",
  "updatedAt": "2025-11-15T01:43:12.044Z"
}
```

**Response (Not Found):**
```json
{
  "error": "Product not found",
  "productId": "invalid-id"
}
```

## Sample Data

The API comes pre-populated with 5 sample products:

1. **Wireless Headphones** (Electronics)
2. **Smart Watch** (Wearables)
3. **Gaming Laptop** (Computers)
4. **Coffee Maker** (Appliances)
5. **Running Shoes** (Footwear)

## Testing the API

### Get all products:
```bash
curl -X GET "https://3qi58dvwrb.execute-api.us-east-1.amazonaws.com/prod/products"
```

### Get specific product:
```bash
curl -X GET "https://3qi58dvwrb.execute-api.us-east-1.amazonaws.com/prod/products/prod-001"
```

### Test error handling:
```bash
curl -X GET "https://3qi58dvwrb.execute-api.us-east-1.amazonaws.com/prod/products/invalid-id"
```

## Deployment

### Prerequisites
- AWS CLI configured
- Node.js 18+ installed
- CDK CLI installed (`npm install -g aws-cdk`)

### Deploy
```bash
cd cdk-app
npm install
npm run build
npx cdk deploy --require-approval never
```

### Clean up
```bash
npx cdk destroy
```

## Features

- **Flexible Schema**: Products can have different specification fields
- **CORS Enabled**: Ready for web client integration
- **Error Handling**: Proper HTTP status codes and error messages
- **Auto Scaling**: DynamoDB with auto-scaling enabled
- **Serverless**: Pay-per-use pricing model

## AWS Resources Created

- DynamoDB Table: `ProductSpecifications203513`
- Lambda Functions: `ProductApiHandler203513`, `DataInitHandler203513`
- API Gateway: `ProductApi203513`
- IAM Roles and Policies for secure access
- CloudWatch Log Groups for monitoring
