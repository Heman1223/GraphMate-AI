import { useState } from 'react';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import { searchService } from '../services/search.service';
import type { IUser } from '../types';
import { motion } from 'framer-motion';
import Skeleton from '../components/ui/Skeleton';

export default function SearchPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string, type: any) => {
    try {
      setLoading(true);
      setHasSearched(true);
      const results = await searchService.searchUsers({ q: query, type });
      setUsers(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">
          Semantic & Metadata Search
        </h1>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          Search for users by name, skill, interest, college, city, or run a natural language AI semantic search.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.SkeletonCard key={i} />
          ))}
        </div>
      ) : hasSearched ? (
        <SearchResults users={users} />
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <span className="text-5xl mb-4">🔍</span>
          <h3 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">Enter parameters to search</h3>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2 max-w-xs leading-relaxed">
            Select "AI Semantic Search" to perform conceptual matches, such as typing "Spring Boot developers" or "ML experts".
          </p>
        </div>
      )}
    </motion.div>
  );
}
