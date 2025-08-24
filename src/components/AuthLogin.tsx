import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Terminal } from 'lucide-react';

interface AuthLoginProps {
  onLogin: () => void;
}

const AuthLogin = ({ onLogin }: AuthLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'peter' && password === 'Peter??//23172317') {
      toast({
        title: "Access Granted",
        description: "Welcome to the Network Scanner",
      });
      onLogin();
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 matrix-rain opacity-20"></div>
      
      <Card className="w-full max-w-md relative z-10 glow-border bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-terminal">
            <Shield className="h-8 w-8 text-terminal-green" />
          </div>
          <CardTitle className="text-2xl glow-text">Network Scanner</CardTitle>
          <CardDescription className="text-muted-foreground">
            Secure Authentication Required
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                <Terminal className="inline h-4 w-4 mr-2" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-input border-border focus:border-terminal-green transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                <Lock className="inline h-4 w-4 mr-2" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border focus:border-terminal-green transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold scanning-pulse"
            >
              {isLoading ? 'Authenticating...' : 'Access System'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLogin;