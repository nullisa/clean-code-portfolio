import { motion } from "framer-motion";
import { Download, Mail, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import avatarImg from "@/assets/avatar.png";
import { useProfile } from "@/hooks/usePortfolioData";

const HeroSection = () => {
  const { data: profile } = useProfile();

  const name = profile?.name || "Faridlan";
  const role = profile?.role || "Backend Developer";
  const tagline = profile?.tagline || "Passionate about building scalable, maintainable systems with Clean Architecture & DRY principles. Always learning new technologies to craft better solutions.";
  const avatar = profile?.avatar_url || avatarImg;

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="container max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="shrink-0"
          >
            <div className="relative">
              <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
                <img
                  src={avatar}
                  alt={`${name} - ${role}`}
                  width={208}
                  height={208}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                <span className="text-xs font-medium text-foreground">Available for work</span>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono text-sm text-primary mb-3 tracking-widest uppercase"
            >
              Hello, I'm {name}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            >
              {role.split(" ").slice(0, -1).join(" ") || role}{" "}
              <span className="text-gradient">{role.split(" ").slice(-1)[0]}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed"
            >
              {tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <Button size="lg" className="gap-2 font-medium">
                <Download className="w-4 h-4" />
                Download CV
              </Button>
              <Button size="lg" variant="outline" className="gap-2 font-medium" asChild>
                <a href="#contact">
                  <Mail className="w-4 h-4" />
                  Contact Me
                </a>
              </Button>
              <Button size="lg" variant="secondary" className="gap-2 font-medium" asChild>
                <a href="#projects">
                  <FolderGit2 className="w-4 h-4" />
                  View Projects
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
