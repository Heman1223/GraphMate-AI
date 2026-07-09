import Card from '../ui/Card';
import { 
  HiOutlineUserPlus, 
  HiOutlineSparkles, 
  HiOutlineUserGroup, 
  HiOutlineShieldCheck 
} from 'react-icons/hi2';

export default function RecentActivity() {
  // Static timeline items for mock recent activities
  const activities = [
    {
      id: 1,
      type: 'match',
      icon: HiOutlineSparkles,
      color: 'bg-primary-500/10 text-primary-500',
      description: 'AI recommended 3 new friends with matching branch and React skills.',
      time: '10m ago'
    },
    {
      id: 2,
      type: 'add',
      icon: HiOutlineUserPlus,
      color: 'bg-emerald-500/10 text-emerald-500',
      description: 'You accepted Rahul\'s friend request.',
      time: '2h ago'
    },
    {
      id: 3,
      type: 'view',
      icon: HiOutlineUserGroup,
      color: 'bg-blue-500/10 text-blue-500',
      description: 'Amit visited your profile.',
      time: '1d ago'
    },
    {
      id: 4,
      type: 'system',
      icon: HiOutlineShieldCheck,
      color: 'bg-cyan-500/10 text-cyan-500',
      description: 'Your profile embedding cache was updated successfully.',
      time: '3d ago'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
        Recent Activity
      </h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => {
            const Icon = activity.icon;
            return (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border-light/40 dark:bg-border-dark/40"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-xl flex items-center justify-center ring-8 ring-surface-light dark:ring-surface-dark ${activity.color}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-xs text-text-primary-light dark:text-text-primary-dark">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-right text-[10px] whitespace-nowrap text-text-muted-light dark:text-text-muted-dark">
                        <time>{activity.time}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
