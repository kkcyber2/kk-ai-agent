import { useEffect, useState } from 'react';
import { Shield, Wifi, Activity, Lock } from 'lucide-react';

const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="status-bar">
      <div className="container mx-auto flex items-center justify-between text-xs">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-cyber-green">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>System: Online</span>
          </div>

          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-3 h-3" />
            <span>Security: High</span>
          </div>
        </div>

        {/* Center */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Encryption: AES-256</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="w-3 h-3" />
            <span>Network: Secure</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground font-mono">
            {formatTime(time)}
          </span>
          <span className="text-primary font-mono">
            kkcyber@realm
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
