import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Database,
  ExternalLink,
  FileText,
  Archive,
  Folder
} from 'lucide-react';

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

interface ScanResultsProps {
  scanResults: ScanData[];
  httpServers: HttpServer[];
  showOnlyVulnerable?: boolean;
}

const ScanResults = ({ scanResults, httpServers, showOnlyVulnerable = false }: ScanResultsProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/50">Open</Badge>;
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>;
      case 'filtered':
        return <Badge className="bg-warning-orange/20 text-warning-orange border-warning-orange/50">Filtered</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getVulnerabilityCount = (server: HttpServer) => {
    let count = 0;
    if (server.hasEnv) count++;
    if (server.hasConfig) count++;
    if (server.hasBackup) count++;
    if (server.openDirectory) count++;
    return count;
  };

  const getVulnerabilityBadge = (count: number) => {
    if (count === 0) {
      return <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/50">Secure</Badge>;
    } else if (count <= 2) {
      return <Badge className="bg-warning-orange/20 text-warning-orange border-warning-orange/50">Medium Risk</Badge>;
    } else {
      return <Badge className="bg-critical-red/20 text-critical-red border-critical-red/50">High Risk</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {!showOnlyVulnerable && scanResults.length > 0 && (
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-terminal-cyan" />
              <span>Port Scan Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-mono">{result.ip}</TableCell>
                    <TableCell>{result.port}</TableCell>
                    <TableCell>{result.service}</TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(result.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {httpServers.length > 0 && (
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-terminal-amber" />
              <span>{showOnlyVulnerable ? 'Vulnerable HTTP Servers' : 'HTTP Servers Discovered'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Vulnerabilities</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {httpServers.map((server) => {
                  const vulnCount = getVulnerabilityCount(server);
                  
                  return (
                    <TableRow key={server.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-terminal-cyan" />
                          <span className="font-mono">{server.url}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getVulnerabilityBadge(vulnCount)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {server.hasEnv && (
                            <Badge variant="destructive" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              .env
                            </Badge>
                          )}
                          {server.hasConfig && (
                            <Badge variant="destructive" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              web.config
                            </Badge>
                          )}
                          {server.hasBackup && (
                            <Badge variant="destructive" className="text-xs">
                              <Archive className="h-3 w-3 mr-1" />
                              backup.zip
                            </Badge>
                          )}
                          {server.openDirectory && (
                            <Badge className="bg-warning-orange/20 text-warning-orange border-warning-orange/50 text-xs">
                              <Folder className="h-3 w-3 mr-1" />
                              Open Dir
                            </Badge>
                          )}
                          {vulnCount === 0 && (
                            <Badge className="bg-terminal-green/20 text-terminal-green border-terminal-green/50 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Secure
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-terminal-green/50 text-terminal-green hover:bg-terminal-green/10"
                          onClick={() => window.open(server.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {scanResults.length === 0 && httpServers.length === 0 && (
        <Card className="glow-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
            <p className="text-muted-foreground text-center">
              {showOnlyVulnerable 
                ? 'No vulnerabilities detected. Start a scan to find potential security issues.'
                : 'Start a network scan to discover hosts and services on your target networks.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanResults;