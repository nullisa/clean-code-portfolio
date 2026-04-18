import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useProjects } from "@/hooks/usePortfolioData";

const PAGE_SIZE = 5;

const PortfolioSection = () => {
  const { data: projects = [] } = useProjects();
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const visibleProjects = projects.slice(start, start + PAGE_SIZE);

  const goTo = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          {visibleProjects.map((project, i) => {
            const isGitHub = project.link.includes("github.com");

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-lg bg-card p-6 card-glow"
              >
                {project.image_url && (
                  <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover rounded-md mb-4 border border-border" />
                )}
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
                    project.link && (
                      <Button size="sm" variant="secondary" className="gap-2 text-xs" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          {isGitHub ? <Github className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                          View Project
                        </a>
                      </Button>
                    )
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

        {totalPages > 1 && (
          <Pagination className="mt-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#projects"
                      isActive={p === page}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(p);
                      }}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(page + 1);
                  }}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
