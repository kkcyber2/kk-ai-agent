import { useState, useEffect } from 'react';
import { Menu, X, Terminal, Shield, Code, Mail } from 'lucide-react';

const navItems = [
  { label: 'Skills', href: '#skills', icon: <Code className="w-4 h-4" /> },
  { label: 'Projects', href: '#projects', icon: <Terminal className="w-4 h-4" /> },
  { label: 'Contact', href: '#contact', icon: <Mail className="w-4 h-4" /> },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg border-b border-primary/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:animate-pulse-glow transition-all">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-orbitron font-bold text-lg text-glow hidden sm:block">
              kkcyber
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <span className="group-hover:text-primary transition-colors">{item.icon}</span>
                <span className="font-mono text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-primary"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-primary/20">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                {item.icon}
                <span className="font-mono">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
