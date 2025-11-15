# Product Specifications API - Architecture Diagrams

This directory contains AWS Architecture Diagrams generated for the Product Specifications API project.

## Generated Diagrams

### 1. Basic Architecture (`product-specs-api-architecture.png`)
- **Purpose**: High-level overview of the API architecture
- **Components**: Client → API Gateway → Lambda → DynamoDB
- **Focus**: Simple data flow and core components

### 2. Detailed Architecture (`product-specs-api-detailed.png`)
- **Purpose**: Detailed view showing API endpoints and database operations
- **Components**: 
  - API Gateway with specific endpoints (GET /products, GET /products/{id})
  - Lambda function with Node.js 20.x runtime
  - DynamoDB with Scan and GetItem operations
- **Focus**: API endpoint mapping and database operation details

### 3. Deployment Architecture (`product-specs-api-deployment.png`)
- **Purpose**: Complete deployment and runtime architecture
- **Components**:
  - CDK deployment pipeline
  - CloudFormation template generation
  - IAM roles and permissions
  - Sample data initialization
- **Focus**: Infrastructure as Code deployment and security model

## Architecture Overview

The Product Specifications API follows a serverless architecture pattern:

- **API Gateway**: Provides RESTful endpoints at `/api/v1`
- **Lambda Function**: Node.js 20.x runtime handling API logic
- **DynamoDB**: NoSQL database storing product specifications
- **CDK**: Infrastructure as Code for deployment
- **IAM**: Least privilege access control

## API Endpoints

- `GET /api/v1/products` - Retrieve all products
- `GET /api/v1/products/{productId}` - Retrieve specific product

## Database Schema

- **Table**: ProductSpecifications
- **Partition Key**: productId (String)
- **Attributes**: productName, category, brand, specifications, createdAt, updatedAt

## Deployment

The infrastructure is deployed using AWS CDK with TypeScript, creating:
- DynamoDB table with sample data
- Lambda function with appropriate IAM permissions
- API Gateway with CORS enabled
- CloudFormation stack for resource management

Generated on: 2025-11-14T20:38:29.758-05:00
