import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Send, Instagram, Facebook, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'kkcyber@realm:~$ contact --init',
    '> Initializing secure communication channel...',
    '> Connection established.',
    '> Ready to receive your message.',
    '',
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setTerminalLines(prev => [
      ...prev,
      `kkcyber@realm:~$ echo "${input}"`,
      '> Message queued for transmission...',
      '> Thank you! I will respond shortly.',
      '',
    ]);
    setInput('');
    toast.success('Message sent! I will get back to you soon.');
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: '03123583827',
      href: 'tel:03123583827',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'kkdev9715@gmail.com',
      href: 'mailto:kkdev9715@gmail.com',
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      label: 'Instagram',
      value: '@kkcyber12',
      href: 'https://instagram.com/kkcyber12',
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      label: 'Facebook',
      value: 'Konain Khan',
      href: 'https://facebook.com/konain.khan',
    },
  ];

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 px-4 pb-32">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-radial opacity-30" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-muted-foreground text-sm tracking-widest mb-2 block">
            {'>'} ./initiate_contact.sh
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-4">
            The Command Line
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate? Send a message through the terminal or reach out directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Terminal */}
          <div 
            className={`terminal transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500" />
              <div className="terminal-dot bg-yellow-500" />
              <div className="terminal-dot bg-green-500" />
              <span className="ml-4 text-muted-foreground text-sm font-mono">
                contact.sh — bash
              </span>
            </div>

            <div className="terminal-body h-80 overflow-y-auto">
              {terminalLines.map((line, index) => (
                <div 
                  key={index}
                  className={`${line.startsWith('kkcyber') ? 'text-cyber-green' : line.startsWith('>') ? 'text-muted-foreground' : ''}`}
                >
                  {line || '\u00A0'}
                </div>
              ))}

              {/* Input form */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                <span className="text-cyber-green">kkcyber@realm:~$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
                />
                <button 
                  type="submit"
                  className="p-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div 
            className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            {/* Profile Card */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-orbitron text-xl font-bold text-primary">
                    Konain Khan
                  </h3>
                  <p className="text-muted-foreground text-sm">kkcyber / kkdev</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                <MapPin className="w-4 h-4" />
                <span>Pakistan • 17-year-old Developer</span>
              </div>

              {/* Contact Links */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/50 transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-foreground group-hover:text-primary transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
