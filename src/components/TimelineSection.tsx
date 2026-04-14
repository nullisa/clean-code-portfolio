import { motion } from "framer-motion";

const timeline = [
  { year: "2019", title: "Started in Operations / Production", description: "Began career working in operational and production roles, building a strong foundation in process management." },
  { year: "2022", title: "Self-Taught Programming", description: "Started learning programming independently, focusing on backend technologies and system design." },
  { year: "2024", title: "First Real-World Projects", description: "Built production systems for Bank Galuh Ciamis, including employee tracking and meeting minutes platforms." },
  { year: "2026", title: "Professional Backend Developer", description: "Focused on Clean Architecture, scalable APIs, and modern backend stacks with TypeScript and Go." },
];

const TimelineSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-3xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary tracking-widest uppercase mb-12"
        >
          Career Journey
        </motion.h2>

        <div className="relative pl-8 border-l border-border">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="mb-10 last:mb-0 relative"
            >
              <div className="absolute -left-[2.55rem] top-1 w-3 h-3 rounded-full bg-primary" />
              <span className="font-mono text-xs text-primary">{item.year}</span>
              <h3 className="text-lg font-semibold mt-1 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
