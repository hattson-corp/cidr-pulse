import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  Play, 
  Square, 
  Activity, 
  Globe, 
  Shield, 
  AlertTriangle,
  Database,
  Terminal,
  Wifi,
  Server
} from 'lucide-react';
import TerminalOutput from './TerminalOutput';
import ScanResults from './ScanResults';

interface ScanData {
  id: string;
  ip: string;
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  timestamp: string;
}

interface HttpServer {
  id: string;
  ip: string;
  port: number;
  url: string;
  hasEnv: boolean;
  hasConfig: boolean;
  hasBackup: boolean;
  openDirectory: boolean;
  timestamp: string;
}

const NetworkDashboard = () => {
  const [cidrList, setCidrList] = useState('192.168.1.0/24\n10.0.0.0/24');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeHosts, setActiveHosts] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<ScanData[]>([]);
  const [httpServers, setHttpServers] = useState<HttpServer[]>([]);
  const [vulnerableServers, setVulnerableServers] = useState<HttpServer[]>([]);

  // Simulate scanning process
  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setActiveHosts(0);
    setTerminalOutput([]);
    setScanResults([]);
    setHttpServers([]);
    setVulnerableServers([]);

    // Add initial terminal output
    addTerminalLine('[INFO] Starting network scan...');
    addTerminalLine('[INFO] Parsing CIDR ranges...');
    addTerminalLine('[INFO] Initializing masscan...');

    // Simulate scan progress
    const scanInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          addTerminalLine('[INFO] Scan completed successfully');
          generateMockResults();
          return 100;
        }
        return newProgress;
      });

      // Add random terminal output
      const messages = [
        '[DEBUG] Scanning range 192.168.1.0/24...',
        '[INFO] Host discovered: 192.168.1.25',
        '[DEBUG] Port 80 open on 192.168.1.25',
        '[INFO] HTTP service detected',
        '[DEBUG] Checking for sensitive files...',
        '[WARN] .env file found!',
        '[INFO] Adding to database...'
      ];
      
      if (Math.random() > 0.7) {
        addTerminalLine(messages[Math.floor(Math.random() * messages.length)]);
        if (Math.random() > 0.8) {
          setActiveHosts(prev => prev + 1);
        }
      }
    }, 500);
  };

  const stopScan = () => {
    setIsScanning(false);
    addTerminalLine('[WARN] Scan stopped by user');
  };

  const addTerminalLine = (line: string) => {
    setTerminalOutput(prev => [...prev, `${new Date().toLocaleTimeString()} ${line}`]);
  };

  const generateMockResults = () => {
    // Generate mock scan results
    const mockHosts = ['192.168.1.25', '192.168.1.45', '10.0.0.12', '10.0.0.88'];
    const mockPorts = [80, 443, 8080, 8443, 8000, 8888];
    
    const results: ScanData[] = [];
    const servers: HttpServer[] = [];
    const vulnerable: HttpServer[] = [];

    mockHosts.forEach((ip, index) => {
      mockPorts.forEach(port => {
        if (Math.random() > 0.7) {
          const result: ScanData = {
            id: `${ip}:${port}`,
            ip,
            port,
            service: port === 443 ? 'https' : 'http',
            status: 'open',
            timestamp: new Date().toISOString(),
          };
          results.push(result);

          const server: HttpServer = {
            id: `${ip}:${port}`,
            ip,
            port,
            url: `http${port === 443 ? 's' : ''}://${ip}:${port}`,
            hasEnv: Math.random() > 0.8,
            hasConfig: Math.random() > 0.9,
            hasBackup: Math.random() > 0.95,
            openDirectory: Math.random() > 0.85,
            timestamp: new Date().toISOString(),
          };
          servers.push(server);

          if (server.hasEnv || server.hasConfig || server.hasBackup || server.openDirectory) {
            vulnerable.push(server);
          }
        }
      });
    });

    setScanResults(results);
    setHttpServers(servers);
    setVulnerableServers(vulnerable);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-terminal">
              <Network className="h-8 w-8 text-terminal-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold glow-text">Network Scanner Dashboard</h1>
              <p className="text-muted-foreground">Advanced network reconnaissance and vulnerability detection</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-terminal-green/20 text-terminal-green border-terminal-green/50">
              <Activity className="h-4 w-4 mr-1" />
              System Online
            </Badge>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-terminal-green" />
              <span>Scan Configuration</span>
            </CardTitle>
            <CardDescription>Configure CIDR ranges and start network reconnaissance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cidr-input">CIDR Ranges (one per line)</Label>
              <Textarea
                id="cidr-input"
                value={cidrList}
                onChange={(e) => setCidrList(e.target.value)}
                placeholder="192.168.1.0/24&#10;10.0.0.0/24"
                className="mt-2 bg-input border-border font-mono"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={startScan}
                disabled={isScanning}
                className="bg-primary hover:bg-primary/90 scanning-pulse"
              >
                <Play className="h-4 w-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </Button>
              
              {isScanning && (
                <Button
                  onClick={stopScan}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Scan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress and Stats */}
        {(isScanning || progress > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-terminal-cyan" />
                  <span className="font-semibold">Progress</span>
                </div>
                <div className="mt-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-1">{Math.round(progress)}% Complete</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5 text-terminal-green" />
                  <span className="font-semibold">Active Hosts</span>
                </div>
                <p className="text-2xl font-bold text-terminal-green mt-1">{activeHosts}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-terminal-amber" />
                  <span className="font-semibold">HTTP Services</span>
                </div>
                <p className="text-2xl font-bold text-terminal-amber mt-1">{httpServers.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-critical-red" />
                  <span className="font-semibold">Vulnerabilities</span>
                </div>
                <p className="text-2xl font-bold text-critical-red mt-1">{vulnerableServers.length}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="terminal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="terminal">Terminal Output</TabsTrigger>
            <TabsTrigger value="results">Scan Results</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terminal">
            <TerminalOutput output={terminalOutput} isScanning={isScanning} />
          </TabsContent>
          
          <TabsContent value="results">
            <ScanResults 
              scanResults={scanResults} 
              httpServers={httpServers}
            />
          </TabsContent>
          
          <TabsContent value="vulnerabilities">
            <ScanResults 
              scanResults={[]} 
              httpServers={vulnerableServers}
              showOnlyVulnerable={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NetworkDashboard;