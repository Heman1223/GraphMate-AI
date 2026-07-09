import { motion } from 'framer-motion';
import { 
  HiOutlineSparkles, 
  HiOutlineShare, 
  HiOutlinePresentationChartBar, 
  HiOutlineSearch, 
  HiOutlineShieldCheck, 
  HiOutlineLightningBolt 
} from 'react-icons/hi';
import Card from '../ui/Card';

export default function Features() {
  const features = [
    {
      icon: HiOutlineSparkles,
      title: 'AI Similarity Engine',
      description: 'Find peers using Sentence Transformers all-MiniLM-L6-v2. We analyze bios, skills, and college fields using cosine similarity.',
      color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
    },
    {
      icon: HiOutlineShare,
      title: 'Advanced Graph Algorithms',
      description: 'Leverages C++ graph algorithms under the hood including BFS depth-2, Jaccard similarity, and Adamic-Adar to score network density.',
      color: 'bg-accent-500/10 text-accent-500'
    },
    {
      icon: HiOutlinePresentationChartBar,
      title: 'Interactive Network Graph',
      description: 'Explore friendships and suggestions with responsive Cytoscape.js layouts. Zoom, pan, and filter suggested paths interactively.',
      color: 'bg-indigo-500/10 text-indigo-500'
    },
    {
      icon: HiOutlineSearch,
      title: 'Semantic AI Search',
      description: 'Go beyond keywords. Querying "Backend" matches related items like Node.js, Express, and Spring Boot using embeddings.',
      color: 'bg-teal-500/10 text-teal-500'
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'Explainable Matching',
      description: 'Understand recommendations instantly. Get complete percentage breakdowns for college matches, skills, and AI scores.',
      color: 'bg-emerald-500/10 text-emerald-500'
    },
    {
      icon: HiOutlineLightningBolt,
      title: 'Analytics Dashboard',
      description: 'Visualize your growth, popular skills in your local network, and interest categories with responsive Recharts widgets.',
      color: 'bg-amber-500/10 text-amber-500'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="py-24 sm:py-32 bg-muted/30 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Why Choose <span className="gradient-text">GraphMate</span>?
          </h2>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
            A premium full-stack social recommendation engine engineered with modern graph models and natural language processing.
          </p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={idx} variants={cardVariants}>
                <Card className="h-full" hover>
                  <div className="flex flex-col gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight mt-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
