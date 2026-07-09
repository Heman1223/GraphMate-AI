import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function TrendingInterests() {
  const trends = [
    { name: 'AI & Machine Learning', count: 48, variant: 'primary' },
    { name: 'Full Stack', count: 35, variant: 'accent' },
    { name: 'System Design', count: 28, variant: 'success' },
    { name: 'Competitive Programming', count: 25, variant: 'warning' },
    { name: 'Web3', count: 18, variant: 'neutral' },
    { name: 'Cybersecurity', count: 12, variant: 'neutral' }
  ] as const;

  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
        Popular Local Focus
      </h3>
      <div className="flex flex-wrap gap-2">
        {trends.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-bg-secondary-light/40 dark:bg-bg-secondary-dark/40 px-3 py-1.5 rounded-xl border border-border-light/20 dark:border-border-dark/20 hover:scale-105 transition-all">
            <Badge variant={item.variant} size="sm">
              {item.name}
            </Badge>
            <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark font-bold ml-1">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
