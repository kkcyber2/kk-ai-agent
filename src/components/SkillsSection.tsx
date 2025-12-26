import { useEffect, useRef, useState } from 'react';
import { Shield, Code, Bot, Terminal, Globe, Lock, Cpu, Zap, Database } from 'lucide-react';

interface Skill {
  name: string;
  icon: React.ReactNode;
}

interface SkillCategory {
  title: string;
  color: 'cyan' | 'purple' | 'green';
  icon: React.ReactNode;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Cybersecurity',
    color: 'cyan',
    icon: <Shield className="w-8 h-8" />,
    skills: [
      { name: 'Kali Linux', icon: <Terminal className="w-5 h-5" /> },
      { name: 'Network Protocol Analysis', icon: <Globe className="w-5 h-5" /> },
      { name: 'Pentesting', icon: <Lock className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Programming',
    color: 'purple',
    icon: <Code className="w-8 h-8" />,
    skills: [
      { name: 'Python (Expert)', icon: <Cpu className="w-5 h-5" /> },
      { name: 'Java', icon: <Code className="w-5 h-5" /> },
      { name: 'JavaScript', icon: <Zap className="w-5 h-5" /> },
      { name: 'HTML5/CSS3 (Bootstrap)', icon: <Globe className="w-5 h-5" /> },
    ],
  },
  {
    title: 'AI & Automation',
    color: 'green',
    icon: <Bot className="w-8 h-8" />,
    skills: [
      { name: 'n8n AI Agent Workflows', icon: <Bot className="w-5 h-5" /> },
      { name: 'Python Automation Scripts', icon: <Cpu className="w-5 h-5" /> },
      { name: 'AI Agent Architectures', icon: <Database className="w-5 h-5" /> },
    ],
  },
];

const colorClasses = {
  cyan: {
    border: 'border-primary/50 hover:border-primary',
    glow: 'group-hover:shadow-[0_0_30px_hsl(180_100%_50%/0.4)]',
    text: 'text-primary',
    bg: 'bg-primary/10',
    icon: 'text-primary',
  },
  purple: {
    border: 'border-accent/50 hover:border-accent',
    glow: 'group-hover:shadow-[0_0_30px_hsl(280_100%_65%/0.4)]',
    text: 'text-accent',
    bg: 'bg-accent/10',
    icon: 'text-accent',
  },
  green: {
    border: 'border-cyber-green/50 hover:border-cyber-green',
    glow: 'group-hover:shadow-[0_0_30px_hsl(120_100%_50%/0.4)]',
    text: 'text-cyber-green',
    bg: 'bg-cyber-green/10',
    icon: 'text-cyber-green',
  },
};

const SkillCard = ({ category, index }: { category: SkillCategory; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const colors = colorClasses[category.color];

  return (
    <div
      ref={cardRef}
      className={`group glass-card p-6 transition-all duration-500 ${colors.border} ${colors.glow} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-lg ${colors.bg} ${colors.icon}`}>
          {category.icon}
        </div>
        <h3 className={`font-orbitron text-xl font-bold ${colors.text}`}>
          {category.title}
        </h3>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        {category.skills.map((skill, skillIndex) => (
          <div
            key={skillIndex}
            className={`flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-transparent hover:${colors.border} transition-all duration-300 group/skill`}
          >
            <div className={`${colors.icon} opacity-70 group-hover/skill:opacity-100 transition-opacity`}>
              {skill.icon}
            </div>
            <span className="text-foreground/80 group-hover/skill:text-foreground transition-colors">
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      {/* Decorative corner */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${colors.bg} opacity-20`} 
        style={{
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
        }}
      />
    </div>
  );
};

const SkillsSection = () => {
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
    <section ref={sectionRef} id="skills" className="relative py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-radial opacity-50" />
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-muted-foreground text-sm tracking-widest mb-2 block">
            {'>'} ACCESSING SKILL_MATRIX.SYS
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-4">
            The Skill Matrix
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Core competencies and technical expertise spanning cybersecurity, development, and AI automation.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
