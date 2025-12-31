/**
 * Real-time Context Engine API
 * MCP-compatible interface for AI agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { realtimeContextEngine, mcpTools } from '@/lib/realtime-context-engine';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const table = searchParams.get('table');
    const key = searchParams.get('key');

    switch (action) {
      case 'query':
        if (!table || !key) {
          return NextResponse.json({ error: 'Table and key required for query' }, { status: 400 });
        }
        
        const result = await mcpTools.queryContext(table, key);
        return NextResponse.json({
          success: true,
          data: result,
          table,
          key,
        });

      case 'query_all':
        if (!table) {
          return NextResponse.json({ error: 'Table required for query_all' }, { status: 400 });
        }
        
        const results = await mcpTools.queryAllContext(table);
        return NextResponse.json({
          success: true,
          data: results,
          table,
          count: results.length,
        });

      case 'schema':
        if (!table) {
          return NextResponse.json({ error: 'Table required for schema' }, { status: 400 });
        }
        
        const schema = await mcpTools.getTableSchema(table);
        return NextResponse.json({
          success: true,
          schema,
          table,
        });

      case 'info':
        const tablesInfo = await mcpTools.getTableInfo();
        return NextResponse.json({
          success: true,
          tables: tablesInfo,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[Context Engine API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// MCP Server endpoint for external agents
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params } = body;

    // MCP protocol implementation
    switch (method) {
      case 'tools/list':
        return NextResponse.json({
          tools: [
            {
              name: 'query_context',
              description: 'Query real-time context data by table and key',
              inputSchema: {
                type: 'object',
                properties: {
                  table: { type: 'string', description: 'Context table name' },
                  key: { type: 'string', description: 'Primary key to query' },
                },
                required: ['table', 'key'],
              },
            },
            {
              name: 'query_all_context',
              description: 'Query all records from a context table',
              inputSchema: {
                type: 'object',
                properties: {
                  table: { type: 'string', description: 'Context table name' },
                  filter: { type: 'object', description: 'Optional filter criteria' },
                },
                required: ['table'],
              },
            },
            {
              name: 'get_table_schema',
              description: 'Get schema information for a context table',
              inputSchema: {
                type: 'object',
                properties: {
                  table: { type: 'string', description: 'Context table name' },
                },
                required: ['table'],
              },
            },
            {
              name: 'get_tables_info',
              description: 'Get information about all available context tables',
              inputSchema: {
                type: 'object',
                properties: {},
              },
            },
          ],
        });

      case 'tools/call':
        const { name, arguments: args } = params;
        
        switch (name) {
          case 'query_context':
            const queryResult = await mcpTools.queryContext(args.table, args.key);
            return NextResponse.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(queryResult, null, 2),
                },
              ],
            });

          case 'query_all_context':
            const allResults = await mcpTools.queryAllContext(args.table, args.filter);
            return NextResponse.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(allResults, null, 2),
                },
              ],
            });

          case 'get_table_schema':
            const schema = await mcpTools.getTableSchema(args.table);
            return NextResponse.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(schema, null, 2),
                },
              ],
            });

          case 'get_tables_info':
            const tablesInfo = await mcpTools.getTableInfo();
            return NextResponse.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(tablesInfo, null, 2),
                },
              ],
            });

          default:
            return NextResponse.json(
              { error: `Unknown tool: ${name}` },
              { status: 400 }
            );
        }

      default:
        return NextResponse.json(
          { error: `Unknown method: ${method}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Context Engine MCP] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}