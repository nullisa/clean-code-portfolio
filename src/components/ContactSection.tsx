import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  const email = "hello@faridlan.com";

  return (
    <section id="contact" className="py-24 px-4">
      <div className="container max-w-3xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary tracking-widest uppercase mb-4"
        >
          Contact
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
        >
          Let's <span className="text-gradient">build something</span> together.
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
        >
          I'm currently open to backend roles, freelance work, and collaborations.
          Drop me a line — I usually respond within a day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-lg bg-card p-6 sm:p-8 card-glow"
        >
          <div className="grid gap-4 mb-6">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
            >
              <span className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Mail className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium">{email}</p>
              </div>
            </a>

            <div className="flex items-center gap-3 text-foreground">
              <span className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="text-sm font-medium">Indonesia · Open to Remote</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
            <Button size="lg" className="gap-2" asChild>
              <a href={`mailto:${email}`}>
                <Mail className="w-4 h-4" />
                Send Email
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="https://github.com/faridlan" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="https://linkedin.com/in/faridlan" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
