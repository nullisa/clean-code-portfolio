import { motion } from "framer-motion";

const techs = [
  "TypeScript",
  "NestJS",
  "Golang",
  "Supabase",
  "PostgreSQL",
  "Prisma",
  "React",
];

const TechStackSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary tracking-widest uppercase mb-8"
        >
          Tech Stack
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          {techs.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-mono border border-border hover:border-primary/40 transition-colors"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
