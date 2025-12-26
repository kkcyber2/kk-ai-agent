import { ArrowDown, Mail, Phone } from 'lucide-react';
import Scene3D from './Scene3D';

const HeroSection = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-cyber-radial" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(280 100% 65% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(180 100% 50% / 0.2) 0%, transparent 50%)'
        }}
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(hsl(180 100% 50% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(180 100% 50% / 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Text content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-4">
            <span className="text-muted-foreground text-sm md:text-base tracking-widest">
              {'>'} INITIALIZING SYSTEM...
            </span>
          </div>

          <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            <span className="text-glow">Enter the</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Cyber-Realm
            </span>
            <br />
            <span className="text-glow">of </span>
            <span className="text-glow-purple text-accent">kkcyber</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
            Building AI Agents & Securing the Digital Frontier.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={scrollToContact}
              className="cyber-button group animate-pulse-glow"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Hire Me
              </span>
            </button>

            <button 
              onClick={scrollToProjects}
              className="cyber-button-outline group"
            >
              <span className="flex items-center justify-center gap-2">
                View Projects
                <ArrowDown className="w-5 h-5 group-hover:animate-bounce" />
              </span>
            </button>
          </div>

          {/* Quick contact */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
            <a 
              href="tel:03123583827" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              03123583827
            </a>
            <a 
              href="mailto:kkdev9715@gmail.com" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              kkdev9715@gmail.com
            </a>
          </div>
        </div>

        {/* 3D Scene */}
        <div className="flex-1 flex justify-center items-center">
          <Scene3D />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground tracking-widest">SCROLL</span>
        <ArrowDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  );
};

export default HeroSection;
