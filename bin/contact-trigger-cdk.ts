#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ContactTriggerCdkStack } from '../lib/contact-trigger-cdk-stack';
require("dotenv").config();

const app = new cdk.App();
new ContactTriggerCdkStack(app, 'MinervaContactTriggerStack', {
  description: "Cdk stack for Connect integration with Minerva system for audio processing",
  amazonConnectInstanceArn: process.env.AMAZON_CONNECT_INSTANCE_ARN ?? "",
  contactFlowTriggerApiEndpoint: process.env.CONTACT_FLOW_TRIGGER_API_ENDPOINT ?? "",
  eventBridgeTriggerApiEndpoint: process.env.EVENT_BRIDGE_TRIGGER_API_ENDPOINT ?? "",
  eventProcessorLambdaArn: process.env.EVENT_PROCESSOR_LAMBDA_ARN ?? "",
  eventRuleArn: process.env.EVENT_RULE_ARN ?? "",
  apiKey: process.env.API_KEY ?? "",
  tenantId: process.env.TENANT_ID ?? "",
  apiSecureCalls: process.env.API_SECURE_CALLS ?? ""
});