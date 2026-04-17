import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import avatarImg from "@/assets/avatar.png";

const HeroSection = () => {
  return (
    <section className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="container max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl">
              <img
                src={avatarImg}
                alt="Faridlan - Backend Developer"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
              <span className="sr-only">Available for work</span>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
        >
          Hello, I'm Faridlan
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight mb-6"
        >
          Backend{" "}
          <span className="text-gradient">Developer</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Passionate about building scalable, maintainable systems with Clean Architecture &amp; DRY principles. Always learning new technologies to craft better solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
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
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
