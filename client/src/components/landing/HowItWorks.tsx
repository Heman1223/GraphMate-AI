import { motion } from 'framer-motion';
import { HiOutlineUserAdd, HiOutlineCog, HiOutlineSparkles } from 'react-icons/hi';

export default function HowItWorks() {
  const steps = [
    {
      icon: HiOutlineUserAdd,
      title: '1. Create Profile',
      description: 'Fill in your profile details, skills, branch, city, and bio. Our system uses this text to generate custom embeddings.',
      color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
    },
    {
      icon: HiOutlineCog,
      title: '2. Backend Computation',
      description: 'The Node.js server extracts graph connections (BFS, Adamic-Adar) while the Python service ranks embeddings via cosine similarity.',
      color: 'bg-accent-500/10 text-accent-500'
    },
    {
      icon: HiOutlineSparkles,
      title: '3. Interactive Match Feed',
      description: 'View matching results ranked out of 100%. View interactive network graphs and expand node recommendations.',
      color: 'bg-success/10 text-success'
    }
  ];

  return (
    <div className="py-24 sm:py-32 bg-background transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            How <span className="gradient-text">GraphMate</span> Works
          </h2>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
            Under the hood: pipeline execution flow from input metadata to graph matching vectors.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 hidden lg:block z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border shadow-lg"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${step.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
