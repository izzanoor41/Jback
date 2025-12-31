/**
 * Confluent Connectors Management API
 * Full integration with Confluent Cloud managed connectors
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectorService, DATAGEN_FEEDBACK_CONNECTOR } from '@/lib/confluent-connectors';
import { flinkService } from '@/lib/confluent-flink';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'list':
        const connectors = await connectorService.listConnectors();
        return NextResponse.json({
          success: true,
          connectors,
          count: connectors.length
        });

      case 'status':
        const name = searchParams.get('name');
        if (!name) {
          return NextResponse.json({ error: 'Connector name required' }, { status: 400 });
        }
        
        const status = await connectorService.getConnectorStatus(name);
        return NextResponse.json({
          success: true,
          connector: name,
          status
        });

      case 'flink-jobs':
        const jobs = await flinkService.listJobs();
        return NextResponse.json({
          success: true,
          jobs,
          count: jobs.length
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Connectors API] GET Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, teamId, connectorName, connectorConfig } = body;

    switch (action) {
      case 'create-datagen':
        // Create Datagen Source connector for realistic feedback data
        const datagen = {
          ...DATAGEN_FEEDBACK_CONNECTOR,
          config: {
            ...DATAGEN_FEEDBACK_CONNECTOR.config,
            'teamId.with': teamId || 'demo-team'
          }
        };
        
        const result = await connectorService.createConnector(datagen);
        return NextResponse.json({
          success: true,
          message: 'Datagen connector created successfully',
          connector: result
        });

      case 'create-custom':
        if (!connectorName || !connectorConfig) {
          return NextResponse.json({ 
            error: 'Connector name and config required' 
          }, { status: 400 });
        }
        
        const customConnector = {
          name: connectorName,
          type: connectorConfig.type || 'sink',
          config: connectorConfig
        };
        
        const customResult = await connectorService.createConnector(customConnector);
        return NextResponse.json({
          success: true,
          message: 'Custom connector created successfully',
          connector: customResult
        });

      case 'initialize-all':
        // Initialize all Jback connectors
        await connectorService.initializeJbackConnectors();
        return NextResponse.json({
          success: true,
          message: 'All Jback connectors initialized'
        });

      case 'pause':
        if (!connectorName) {
          return NextResponse.json({ error: 'Connector name required' }, { status: 400 });
        }
        
        const paused = await connectorService.pauseConnector(connectorName);
        return NextResponse.json({
          success: paused,
          message: paused ? 'Connector paused' : 'Failed to pause connector'
        });

      case 'resume':
        if (!connectorName) {
          return NextResponse.json({ error: 'Connector name required' }, { status: 400 });
        }
        
        const resumed = await connectorService.resumeConnector(connectorName);
        return NextResponse.json({
          success: resumed,
          message: resumed ? 'Connector resumed' : 'Failed to resume connector'
        });

      case 'delete':
        if (!connectorName) {
          return NextResponse.json({ error: 'Connector name required' }, { status: 400 });
        }
        
        const deleted = await connectorService.deleteConnector(connectorName);
        return NextResponse.json({
          success: deleted,
          message: deleted ? 'Connector deleted' : 'Failed to delete connector'
        });

      case 'create-flink-jobs':
        if (!teamId) {
          return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
        }
        
        const jobIds = await flinkService.initializeTeamJobs(teamId);
        return NextResponse.json({
          success: true,
          message: 'Flink jobs created successfully',
          jobIds,
          count: jobIds.length
        });

      case 'execute-ml-function':
        const { functionName, data } = body;
        if (!functionName) {
          return NextResponse.json({ error: 'Function name required' }, { status: 400 });
        }
        
        const mlResult = await flinkService.executeMLFunction(functionName, data || []);
        return NextResponse.json({
          success: true,
          function: functionName,
          result: mlResult
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Connectors API] POST Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}