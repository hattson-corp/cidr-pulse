import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Activity } from 'lucide-react';

interface TerminalOutputProps {
  output: string[];
  isScanning: boolean;
}

const TerminalOutput = ({ output, isScanning }: TerminalOutputProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const getLineColor = (line: string) => {
    if (line.includes('[ERROR]')) return 'text-destructive';
    if (line.includes('[WARN]')) return 'text-warning-orange';
    if (line.includes('[INFO]')) return 'text-terminal-cyan';
    if (line.includes('[DEBUG]')) return 'text-muted-foreground';
    return 'text-foreground';
  };

  const getLineIcon = (line: string) => {
    if (line.includes('[ERROR]')) return '❌';
    if (line.includes('[WARN]')) return '⚠️';
    if (line.includes('[INFO]')) return 'ℹ️';
    if (line.includes('[DEBUG]')) return '🔍';
    return '>';
  };

  return (
    <Card className="h-96 glow-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-terminal-green" />
          <span>Terminal Output</span>
          {isScanning && (
            <div className="flex items-center space-x-2 ml-auto">
              <Activity className="h-4 w-4 text-terminal-green animate-pulse" />
              <span className="text-sm text-terminal-green">Live Feed</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={terminalRef}
          className="h-80 overflow-y-auto bg-card/50 backdrop-blur-sm font-mono text-sm p-4 space-y-1"
        >
          {output.length === 0 ? (
            <div className="text-muted-foreground italic">
              Terminal ready. Waiting for scan to begin...
            </div>
          ) : (
            output.map((line, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-2 ${getLineColor(line)} animate-in slide-in-from-left-2 duration-300`}
              >
                <span className="text-terminal-green font-bold min-w-[20px]">
                  {getLineIcon(line)}
                </span>
                <span className="break-all">{line}</span>
              </div>
            ))
          )}
          
          {isScanning && (
            <div className="flex items-center space-x-2 text-terminal-green">
              <span className="terminal-cursor">$</span>
              <span className="animate-pulse">Scanning...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TerminalOutput;