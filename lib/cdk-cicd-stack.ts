import * as cdk from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'TestPipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('bbaronas/cdk-cicd', 'main'),
        commands: [
          'npm ci',
          'npx cdk synth'
        ]
      })
    });

    const testStage = pipeline.addStage(new PipelineStage(this, 'PipeLineTestStage', {
      stageName: 'test'
    }));

    testStage.addPre(new CodeBuildStep('unit-tests', {
      commands: [
        'npm ci',
        'npm test'
      ]
    }))

  }
}
