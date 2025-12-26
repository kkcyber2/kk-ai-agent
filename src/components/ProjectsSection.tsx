import { useEffect, useRef, useState } from 'react';
import { Bot, Shield, Zap, ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  command: string;
}

const projects: Project[] = [
  {
    id: 'ai-agents',
    title: 'Autonomous AI Agents',
    description: 'Workflows built on n8n for task automation. Intelligent agents that handle complex processes autonomously.',
    icon: <Bot className="w-6 h-6" />,
    tags: ['n8n', 'AI', 'Automation', 'Workflows'],
    command: './run ai-agents --mode autonomous',
  },
  {
    id: 'network-guard',
    title: 'Network Guard',
    description: 'Python-based tools for network security. Monitor, analyze, and protect network infrastructure.',
    icon: <Shield className="w-6 h-6" />,
    tags: ['Python', 'Security', 'Network', 'Analysis'],
    command: 'sudo python3 network_guard.py --scan',
  },
  {
    id: 'automation-hub',
    title: 'Automation Hub',
    description: 'Custom Python scripts to streamline daily tasks. Boost productivity with intelligent automation.',
    icon: <Zap className="w-6 h-6" />,
    tags: ['Python', 'Scripts', 'Productivity', 'Tools'],
    command: 'python3 automation_hub.py --execute all',
  },
];

const TerminalLine = ({ text, isCommand = false, delay = 0 }: { text: string; isCommand?: boolean; delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setShowCursor(false);
        }
      }, isCommand ? 30 : 10);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, isCommand]);

  return (
    <div className="flex items-center gap-2">
      {isCommand && <span className="text-cyber-green">kkcyber@realm:~$</span>}
      <span className={isCommand ? 'text-foreground' : 'text-muted-foreground'}>
        {displayed}
        {showCursor && <span className="cursor-blink text-primary">▌</span>}
      </span>
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`terminal transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${isHovered ? 'scale-[1.02]' : ''}`}
      style={{ transitionDelay: `${index * 200}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500" />
        <div className="terminal-dot bg-yellow-500" />
        <div className="terminal-dot bg-green-500" />
        <span className="ml-4 text-muted-foreground text-sm font-mono">
          {project.id}.sh — bash
        </span>
      </div>

      {/* Terminal Body */}
      <div className="terminal-body space-y-3">
        {/* Command */}
        {isVisible && (
          <TerminalLine text={project.command} isCommand delay={index * 200} />
        )}

        {/* Project Content */}
        <div className="mt-4 pt-4 border-t border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {project.icon}
            </div>
            <h3 className="font-orbitron text-lg font-bold text-primary">
              {project.title}
            </h3>
          </div>

          <p className="text-muted-foreground text-sm mb-4">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 text-xs rounded bg-muted border border-primary/30 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 transition-colors">
              <ExternalLink className="w-4 h-4" />
              View Demo
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-muted border border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
              <Github className="w-4 h-4" />
              Source
            </button>
          </div>
        </div>
      </div>

      {/* Glow effect on hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            boxShadow: '0 0 40px hsl(180 100% 50% / 0.2), inset 0 0 40px hsl(180 100% 50% / 0.05)'
          }}
        />
      )}
    </div>
  );
};

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative py-24 px-4">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(hsl(180 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(180 100% 50%) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-muted-foreground text-sm tracking-widest mb-2 block">
            {'>'} cat /projects/featured/*
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-4">
            Project Terminal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of cybersecurity tools, automation workflows, and AI-powered solutions.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
