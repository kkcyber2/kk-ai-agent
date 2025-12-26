import Navbar from '@/components/Navbar';
import MatrixRain from '@/components/MatrixRain';
import HeroSection from '@/components/HeroSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import StatusBar from '@/components/StatusBar';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default Index;
