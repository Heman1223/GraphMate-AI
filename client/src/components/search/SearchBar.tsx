import { useState, useRef, useEffect } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineSparkles, HiChevronDown } from 'react-icons/hi2';

interface SearchBarProps {
  onSearch: (query: string, type: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('semantic');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, type);
    }
  };

  const types = [
    { value: 'semantic', label: 'AI Semantic Match', icon: <HiOutlineSparkles className="w-4 h-4 text-violet-500" /> },
    { value: 'name', label: 'Name', icon: <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">N</span> },
    { value: 'skill', label: 'Skill', icon: <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">S</span> },
    { value: 'interest', label: 'Interest', icon: <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">I</span> },
    { value: 'college', label: 'College', icon: <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">C</span> },
    { value: 'city', label: 'City', icon: <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">M</span> },
  ];

  const currentType = types.find(t => t.value === type);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto z-40">
      <form onSubmit={handleSubmit} className="relative flex items-center bg-card shadow-2xl shadow-violet-500/10 border border-border/80 rounded-2xl overflow-hidden group focus-within:border-violet-500/50 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
        
        {/* Dropdown Toggle */}
        <div className="relative h-full flex items-center border-r border-border/50 bg-muted/30" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-16 px-5 flex items-center gap-2 hover:bg-muted transition-colors text-xs font-bold text-foreground focus:outline-none"
          >
            {currentType?.icon}
            <span className="hidden sm:block whitespace-nowrap">{currentType?.label}</span>
            <HiChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
              {types.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setType(t.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-xs font-bold hover:bg-muted transition-colors ${type === t.value ? 'text-violet-500 bg-violet-500/5' : 'text-foreground'}`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-1 flex items-center h-16 relative">
          <HiOutlineMagnifyingGlass className="absolute left-4 text-muted-foreground w-6 h-6" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={type === 'semantic' ? "Try 'Senior Full Stack Developers in New York'..." : `Search by ${currentType?.label.toLowerCase()}...`}
            className="w-full h-full pl-12 pr-4 bg-transparent border-none text-base md:text-lg text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Submit Button */}
        <div className="pr-2">
          <button
            type="submit"
            className="h-12 px-6 bg-violet-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-violet-500/20 hover:bg-violet-500 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Helper text */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        <span>Popular:</span>
        <button type="button" onClick={() => { setType('semantic'); setQuery('React UI Engineer'); }} className="hover:text-violet-500 transition-colors">React UI Engineer</button>
        <span className="w-1 h-1 rounded-full bg-border" />
        <button type="button" onClick={() => { setType('semantic'); setQuery('Machine Learning'); }} className="hover:text-violet-500 transition-colors">Machine Learning</button>
        <span className="w-1 h-1 rounded-full bg-border" />
        <button type="button" onClick={() => { setType('semantic'); setQuery('Student in CSE'); }} className="hover:text-violet-500 transition-colors">Student in CSE</button>
      </div>
    </div>
  );
}
