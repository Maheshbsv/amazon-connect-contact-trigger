import { Duration } from "aws-cdk-lib";
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import path from "path";


export interface LambdaFunctionProps {
    moduleName: string;
    environment: { [key: string]: string };
    description: string;
    reservedConcurrentExecutions?: number;
    development?: boolean;
    memorySize?: number;
    timeout?: Duration;
  }
  
  export function createLambdaFunction(
    construct: Construct,
    id: string,
    props: LambdaFunctionProps
  ): NodejsFunction {
    return new NodejsFunction(construct, id, {
      description: props.description,
      entry: path.join(__dirname, "lambda", props.moduleName, "index.ts"),
      runtime: Runtime.NODEJS_18_X,
      memorySize: props.memorySize ?? 256,
      architecture: Architecture.ARM_64,
      bundling: {
        sourceMap: true,
        keepNames: true,
        externalModules: [],
      },
      logRetention: RetentionDays.ONE_YEAR,
      environment: props.environment,
      timeout: props.timeout ?? Duration.minutes(5),
    });
  }