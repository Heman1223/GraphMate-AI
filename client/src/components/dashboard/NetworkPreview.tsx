import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { HiOutlineShare } from 'react-icons/hi2';

export default function NetworkPreview() {
  return (
    <Card className="p-6 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Decorative SVG connection backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20 flex items-center justify-center">
        <svg className="w-48 h-48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="8" fill="currentColor" />
          <circle cx="20" cy="30" r="5" fill="currentColor" />
          <circle cx="80" cy="25" r="5" fill="currentColor" />
          <circle cx="15" cy="70" r="5" fill="currentColor" />
          <circle cx="75" cy="75" r="5" fill="currentColor" />
          <line x1="50" y1="50" x2="20" y2="30" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="80" y2="25" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="15" y2="70" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="75" y2="75" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2 mb-2">
          <HiOutlineShare className="h-4 w-4 text-primary-500" />
          Interactive Graph Map
        </h3>
        <p className="text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark mt-2">
          Visualize your local network topology. View nodes, click avatars to view details, and track suggested matching edges.
        </p>
      </div>

      <div className="mt-6 relative z-10">
        <Link to="/network" className="btn-primary flex items-center justify-center py-2 text-xs w-full">
          Launch Graph Map
        </Link>
      </div>
    </Card>
  );
}
