import { motion } from "framer-motion";
import { ExternalLink, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";

const PortfolioSection = () => {
  return (
    <section id="projects" className="py-24 px-4">
      <div className="container max-w-3xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary tracking-widest uppercase mb-12"
        >
          Projects
        </motion.h2>

        <div className="grid gap-5">
          {projects.map((project, i) => {
            const isGitHub = project.link.includes("github.com");

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-lg bg-card p-6 card-glow"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{project.description}</p>
                <p className="font-mono text-xs text-primary/70 mb-5">{project.tech}</p>

                <div className="flex flex-wrap gap-3">
                  {project.link2 ? (
                    <>
                      <Button size="sm" variant="secondary" className="gap-2 text-xs" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3.5 h-3.5" />
                          Backend Repo
                        </a>
                      </Button>
                      <Button size="sm" variant="secondary" className="gap-2 text-xs" asChild>
                        <a href={project.link2} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3.5 h-3.5" />
                          Frontend Repo
                        </a>
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="secondary" className="gap-2 text-xs" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        {isGitHub ? <Github className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                        {isGitHub ? "View Project" : "View Project"}
                      </a>
                    </Button>
                  )}

                  {project.demo && (
                    <Button size="sm" className="gap-2 text-xs" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
