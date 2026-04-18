import { motion } from "framer-motion";
import { useCareerTimeline } from "@/hooks/usePortfolioData";

const TimelineSection = () => {
  const { data: timeline = [] } = useCareerTimeline();

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
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="mb-10 last:mb-0 relative"
            >
              <div className={`absolute -left-[2.55rem] top-1 w-3 h-3 rounded-full ${item.is_highlight ? "bg-primary ring-4 ring-primary/20" : "bg-primary"}`} />
              <span className="font-mono text-xs text-primary">{item.year}</span>
              <h3 className="text-lg font-semibold mt-1 text-foreground">
                {item.role}
                {item.company && <span className="text-muted-foreground font-normal"> · {item.company}</span>}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
