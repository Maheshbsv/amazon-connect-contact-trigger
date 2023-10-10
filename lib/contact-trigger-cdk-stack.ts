import * as cdk from "aws-cdk-lib";
import { Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";
import { createLambdaFunction } from "./lambda-construct";

export interface IContactTriggerProps extends cdk.StackProps {
  amazonConnectInstanceArn: string;
  contactFlowTriggerApiEndpoint: string;
  eventBridgeTriggerApiEndpoint: string;
  eventProcessorLambdaArn: string;
  eventRuleArn: string;
  apiKey: string;
  tenantId: string;
  apiSecureCalls: string;
}

export class ContactTriggerCdkStack extends cdk.Stack {
  private readonly props: IContactTriggerProps;

  constructor(scope: Construct, id: string, props: IContactTriggerProps) {
    super(scope, id);
    this.props = props;

    this.setupContactTriggerLambda();
    this.setupEventBridgeListener();
  }

  private setupContactTriggerLambda(): void {
    const contactTriggerLambda = createLambdaFunction(
      this,
      "ContactFlowTrigger",
      {
        description:
          "Lambda to post the Contact flow event data to external api",
        moduleName: "contact-flow-trigger",
        environment: {
          API_URL: this.props.contactFlowTriggerApiEndpoint,
          TENANT_ID: this.props.tenantId,
          API_KEY: this.props.apiKey,
          API_SECURE_CALLS: this.props.apiSecureCalls,
        },
      }
    );
  }

  private setupEventBridgeListener(): void {
    const callEventLambda = createLambdaFunction(this, "EventBridgeListener", {
      moduleName: "event-bridge-listener",
      description:
        "Lambda to be called when Event Bridge publish a Amazon connect event",
      environment: {
        API_URL: this.props.eventBridgeTriggerApiEndpoint,
        TENANT_ID: this.props.tenantId,
        API_KEY: this.props.apiKey,
        API_SECURE_CALLS: this.props.apiSecureCalls,
      },
    });

    const eventBridgeRule = new Rule(this, "AmazonConnectEventRule", {
      description: "Amazon Connect Event Rule for specific instance",
      eventPattern: {
        source: ["aws.connect"],
        detailType: ["Amazon Connect Contact Event"],
        detail: {
          "instanceArn": [this.props.amazonConnectInstanceArn]
        }
      },
    });

    eventBridgeRule.addTarget(new LambdaFunction(callEventLambda));
  }
}
