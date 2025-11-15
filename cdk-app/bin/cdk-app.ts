#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductApiStack203513 } from '../lib/cdk-app-stack';

const app = new cdk.App();
new ProductApiStack203513(app, 'ProductApiStack203513', {});
