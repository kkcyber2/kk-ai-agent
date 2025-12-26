const Scene3D = () => {
  return (
    <div className="scene-3d w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
      <div className="rotate-3d relative">
        {/* 3D K Letter */}
        <div className="relative w-32 h-40 md:w-40 md:h-48">
          {/* Main vertical bar */}
          <div 
            className="absolute left-0 top-0 w-6 h-full bg-gradient-to-b from-primary via-primary/80 to-accent rounded-sm"
            style={{
              boxShadow: '0 0 30px hsl(180 100% 50% / 0.6), 0 0 60px hsl(180 100% 50% / 0.3)',
              transform: 'translateZ(10px)'
            }}
          />
          
          {/* Upper diagonal */}
          <div 
            className="absolute left-6 top-0 w-6 h-24 bg-gradient-to-r from-primary to-accent rounded-sm origin-bottom-left"
            style={{
              transform: 'rotate(45deg) translateZ(5px)',
              boxShadow: '0 0 20px hsl(180 100% 50% / 0.5)'
            }}
          />
          
          {/* Lower diagonal */}
          <div 
            className="absolute left-6 bottom-0 w-6 h-24 bg-gradient-to-r from-accent to-primary rounded-sm origin-top-left"
            style={{
              transform: 'rotate(-45deg) translateZ(5px)',
              boxShadow: '0 0 20px hsl(280 100% 65% / 0.5)'
            }}
          />

          {/* Glow effect */}
          <div 
            className="absolute inset-0 blur-2xl opacity-50"
            style={{
              background: 'radial-gradient(circle, hsl(180 100% 50% / 0.4) 0%, transparent 70%)'
            }}
          />
        </div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary animate-pulse"
            style={{
              top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
              left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
              boxShadow: '0 0 10px hsl(180 100% 50% / 0.8)',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Scene3D;
