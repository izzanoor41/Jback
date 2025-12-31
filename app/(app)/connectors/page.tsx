"use client";

import { useEffect, useState, useCallback } from "react";
import { useTeam } from "@/lib/store";
import { 
  Plug, 
  Play, 
  Pause, 
  Trash2, 
  Plus,
  Database,
  Zap,
  Cloud,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface Connector {
  name: string;
  type: 'source' | 'sink';
  status: 'RUNNING' | 'PAUSED' | 'FAILED';
  config: Record<string, any>;
  tasks?: any[];
}

interface FlinkJob {
  id: string;
  name: string;
  status: 'RUNNING' | 'STOPPED' | 'FAILED';
  type: 'ML_ANALYTICS' | 'STREAM_PROCESSING' | 'ENRICHMENT';
}

export default function ConnectorsPage() {
  const team = useTeam((state) => state.team);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [flinkJobs, setFlinkJobs] = useState<FlinkJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newConnector, setNewConnector] = useState({
    name: '',
    type: 'sink' as 'source' | 'sink',
    config: '{}'
  });

  const fetchData = useCallback(async () => {
    if (!team) return;
    
    try {
      setRefreshing(true);
      
      // Fetch connectors
      const connectorsRes = await fetch('/api/confluent-connectors?action=list');
      const connectorsData = await connectorsRes.json();
      
      if (connectorsData.success) {
        setConnectors(connectorsData.connectors || []);
      }

      // Fetch Flink jobs
      const flinkRes = await fetch('/api/confluent-connectors?action=flink-jobs');
      const flinkData = await flinkRes.json();
      
      if (flinkData.success) {
        setFlinkJobs(flinkData.jobs || []);
      }
    } catch (error) {
      toast.error('Failed to load connectors data');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [team]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createDatagenConnector = async () => {
    if (!team) return;
    
    try {
      const response = await fetch('/api/confluent-connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-datagen',
          teamId: team.id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Datagen connector created successfully!');
        fetchData();
      } else {
        toast.error('Failed to create Datagen connector');
      }
    } catch (error) {
      toast.error('Error creating Datagen connector');
    }
  };

  const initializeAllConnectors = async () => {
    try {
      const response = await fetch('/api/confluent-connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize-all' })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('All connectors initialized successfully!');
        fetchData();
      } else {
        toast.error('Failed to initialize connectors');
      }
    } catch (error) {
      toast.error('Error initializing connectors');
    }
  };

  const createFlinkJobs = async () => {
    if (!team) return;
    
    try {
      const response = await fetch('/api/confluent-connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-flink-jobs',
          teamId: team.id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(`Created ${result.count} Flink jobs successfully!`);
        fetchData();
      } else {
        toast.error('Failed to create Flink jobs');
      }
    } catch (error) {
      toast.error('Error creating Flink jobs');
    }
  };

  const executeMLFunction = async (functionName: string) => {
    try {
      const response = await fetch('/api/confluent-connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute-ml-function',
          functionName,
          data: [] // Sample data
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(`${functionName} executed successfully!`);
        console.log('ML Function Result:', result.result);
      } else {
        toast.error(`Failed to execute ${functionName}`);
      }
    } catch (error) {
      toast.error(`Error executing ${functionName}`);
    }
  };

  const handleConnectorAction = async (name: string, action: 'pause' | 'resume' | 'delete') => {
    try {
      const response = await fetch('/api/confluent-connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          connectorName: name
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Error ${action}ing connector`);
    }
  };

  const createCustomConnector = async () => {
    try {
      const config = JSON.parse(newConnector.config);
      
      const response = await fetch('/api/confluent-connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-custom',
          connectorName: newConnector.name,
          connectorConfig: { ...config, type: newConnector.type }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Custom connector created successfully!');
        setShowCreateDialog(false);
        setNewConnector({ name: '', type: 'sink', config: '{}' });
        fetchData();
      } else {
        toast.error('Failed to create custom connector');
      }
    } catch (error) {
      toast.error('Invalid JSON configuration');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PAUSED': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'STOPPED': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'RUNNING': 'default',
      'PAUSED': 'secondary',
      'STOPPED': 'outline',
      'FAILED': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Plug className="w-6 h-6 text-emerald-500" />
              Confluent Connectors
            </h1>
            <p className="text-gray-500">Manage data connectors and Flink jobs</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plug className="w-6 h-6 text-emerald-500" />
            Confluent Connectors
          </h1>
          <p className="text-gray-500">Manage data connectors and Flink stream processing jobs</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={fetchData}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Connector
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Connector</DialogTitle>
                <DialogDescription>
                  Create a custom Confluent Cloud connector with your configuration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Connector Name</Label>
                  <Input
                    id="name"
                    value={newConnector.name}
                    onChange={(e) => setNewConnector({...newConnector, name: e.target.value})}
                    placeholder="my-custom-connector"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={newConnector.type}
                    onChange={(e) => setNewConnector({...newConnector, type: e.target.value as 'source' | 'sink'})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="source">Source</option>
                    <option value="sink">Sink</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="config">Configuration (JSON)</Label>
                  <Textarea
                    id="config"
                    value={newConnector.config}
                    onChange={(e) => setNewConnector({...newConnector, config: e.target.value})}
                    placeholder='{"connector.class": "HttpSink", "topics": "my-topic"}'
                    rows={6}
                  />
                </div>
                <Button onClick={createCustomConnector} className="w-full">
                  Create Connector
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            onClick={initializeAllConnectors}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          >
            <Zap className="w-4 h-4" />
            Initialize All
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={createDatagenConnector}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Create Datagen</div>
                <div className="text-xs text-gray-500">Generate test data</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={createFlinkJobs}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Create Flink Jobs</div>
                <div className="text-xs text-gray-500">ML & stream processing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => executeMLFunction('ML_DETECT_ANOMALIES')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Run ML_DETECT_ANOMALIES</div>
                <div className="text-xs text-gray-500">Built-in ML function</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => executeMLFunction('ML_FORECAST')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Run ML_FORECAST</div>
                <div className="text-xs text-gray-500">Trend prediction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="connectors" className="space-y-6">
        <TabsList className="bg-gray-100 p-1.5 h-11 rounded-xl">
          <TabsTrigger value="connectors" className="rounded-lg px-4 h-8 text-sm font-medium">
            <Plug className="w-4 h-4 mr-2" />
            Connectors ({connectors.length})
          </TabsTrigger>
          <TabsTrigger value="flink-jobs" className="rounded-lg px-4 h-8 text-sm font-medium">
            <Cloud className="w-4 h-4 mr-2" />
            Flink Jobs ({flinkJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connectors" className="space-y-4">
          {connectors.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {connectors.map((connector, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {connector.type === 'source' ? 
                          <Database className="w-5 h-5 text-blue-500" /> : 
                          <Cloud className="w-5 h-5 text-green-500" />
                        }
                        {connector.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(connector.status)}
                        {getStatusBadge(connector.status)}
                      </div>
                    </div>
                    <CardDescription>
                      {connector.type === 'source' ? 'Data Source' : 'Data Sink'} Connector
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type</span>
                        <Badge variant="outline" className="capitalize">
                          {connector.type}
                        </Badge>
                      </div>
                      
                      {connector.config?.['connector.class'] && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Class</span>
                          <span className="font-mono text-xs">
                            {connector.config['connector.class']}
                          </span>
                        </div>
                      )}
                      
                      {connector.config?.topics && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Topics</span>
                          <span className="font-mono text-xs">
                            {connector.config.topics}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        {connector.status === 'RUNNING' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleConnectorAction(connector.name, 'pause')}
                            className="gap-1"
                          >
                            <Pause className="w-3 h-3" />
                            Pause
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleConnectorAction(connector.name, 'resume')}
                            className="gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Resume
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleConnectorAction(connector.name, 'delete')}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Plug className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Connectors Found</h3>
                <p className="text-gray-500 mb-6">
                  Create your first connector to start streaming data
                </p>
                <Button onClick={createDatagenConnector} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Datagen Connector
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="flink-jobs" className="space-y-4">
          {flinkJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {flinkJobs.map((job, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                        {job.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                    <CardDescription>
                      Flink {job.type.replace('_', ' ').toLowerCase()} job
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Job ID</span>
                        <span className="font-mono text-xs">{job.id}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type</span>
                        <Badge variant="outline">
                          {job.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Settings className="w-3 h-3" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <BarChart3 className="w-3 h-3" />
                          Metrics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Cloud className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flink Jobs Found</h3>
                <p className="text-gray-500 mb-6">
                  Create Flink jobs for ML analytics and stream processing
                </p>
                <Button onClick={createFlinkJobs} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Flink Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}