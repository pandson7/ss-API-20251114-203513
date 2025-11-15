# Design Document

## Introduction

This document describes the technical architecture for the Product Specifications API, a serverless solution built on AWS that provides RESTful access to product data stored in DynamoDB.

## System Architecture

### High-Level Architecture
The system follows a serverless architecture pattern using:
- **API Gateway**: RESTful API endpoint management
- **AWS Lambda**: Serverless compute for API logic
- **DynamoDB**: NoSQL database for product specifications
- **CDK**: Infrastructure as Code deployment

### Component Overview
```
Client → API Gateway → Lambda Function → DynamoDB
```

## Technical Components

### 1. DynamoDB Table Design
- **Table Name**: `ProductSpecifications`
- **Partition Key**: `productId` (String)
- **Attributes**: Flexible JSON schema supporting:
  - `productName` (String)
  - `category` (String) 
  - `brand` (String)
  - `specifications` (Map) - flexible nested attributes
  - `createdAt` (String)
  - `updatedAt` (String)

### 2. API Gateway Configuration
- **Base Path**: `/api/v1`
- **Endpoints**:
  - `GET /products` - Retrieve all products
  - `GET /products/{productId}` - Retrieve specific product
- **CORS**: Enabled for web client access
- **Authentication**: None (prototype)

### 3. Lambda Function Design
- **Runtime**: Node.js 20.x
- **Handler**: Single function handling all API operations
- **Environment Variables**:
  - `DYNAMODB_TABLE_NAME`: ProductSpecifications table name
- **IAM Permissions**:
  - `dynamodb:GetItem`
  - `dynamodb:Scan`

### 4. Sample Data Structure
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
    "color": "Black"
  },
  "createdAt": "2024-11-14T20:36:45.489Z",
  "updatedAt": "2024-11-14T20:36:45.489Z"
}
```

## API Response Formats

### Success Responses
```json
// GET /products
{
  "products": [
    {
      "productId": "prod-001",
      "productName": "Wireless Headphones",
      "category": "Electronics",
      "brand": "TechBrand",
      "specifications": {...}
    }
  ]
}

// GET /products/{productId}
{
  "productId": "prod-001",
  "productName": "Wireless Headphones",
  "category": "Electronics",
  "brand": "TechBrand",
  "specifications": {...}
}
```

### Error Responses
```json
// 404 Not Found
{
  "error": "Product not found",
  "productId": "invalid-id"
}

// 500 Internal Server Error
{
  "error": "Internal server error",
  "message": "Unable to retrieve products"
}
```

## Deployment Architecture

### CDK Stack Components
- **DynamoDB Table**: With sample data initialization
- **Lambda Function**: API handler with DynamoDB permissions
- **API Gateway**: REST API with Lambda integration
- **IAM Roles**: Least privilege access for Lambda

### Data Initialization
- CDK custom resource to populate sample data
- 5 sample products with diverse categories
- Automated during stack deployment

## Non-Functional Requirements

### Performance
- API response time: < 500ms
- DynamoDB read capacity: On-demand pricing
- Lambda cold start optimization

### Scalability
- Serverless auto-scaling
- DynamoDB on-demand capacity
- API Gateway built-in scaling

### Security
- API Gateway throttling
- Lambda execution role with minimal permissions
- No authentication required (prototype)

## Technology Stack
- **Infrastructure**: AWS CDK (TypeScript)
- **Backend**: Node.js 20.x Lambda
- **Database**: DynamoDB
- **API**: API Gateway REST API
- **Deployment**: CDK deploy command
