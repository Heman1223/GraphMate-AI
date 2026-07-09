import Card from '../ui/Card';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Rohan Sharma',
      role: 'SDE Intern @ Uber',
      college: 'DTU CSE',
      quote: 'The semantic search feature is a lifesaver. Finding peers with exact tech alignment (like React Native + WebRTC) is incredibly fast.',
      emoji: '🚗'
    },
    {
      name: 'Anjali Goel',
      role: 'Incoming SWE @ Google',
      college: 'IGDTUW ECE',
      quote: 'GraphMate visualization maps are gorgeous. It literally shows your secondary connections in a clean Cytoscape graph. Recruiter magnet!',
      emoji: '👩‍💻'
    },
    {
      name: 'Vikram Aditya',
      role: 'M.Tech AI Student',
      college: 'IIT Madras',
      quote: 'Combining standard C++ graph search with sentence-transformers is brilliant. The similarity scores are highly relevant.',
      emoji: '🎓'
    }
  ];

  return (
    <div className="py-24 sm:py-32 bg-background transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            What Developers <span className="gradient-text">Say</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
            Hear from engineering students and interns who built their networks with GraphMate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <Card key={idx} hover className="h-full">
              <div className="flex flex-col justify-between h-full gap-6">
                <p className="text-sm italic leading-relaxed text-muted-foreground">
                  "{rev.quote}"
                </p>
                <div className="flex items-center gap-4 border-t border-border/60 pt-5 mt-auto">
                  <span className="text-3xl">{rev.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-foreground tracking-tight">{rev.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{rev.role} &middot; {rev.college}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
