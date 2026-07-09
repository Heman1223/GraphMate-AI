export const APP_NAME = 'GraphMate';
export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const AVATAR_STYLES = [
  'adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles',
  'fun-emoji', 'lorelei', 'micah', 'miniavs', 'notionists',
  'open-peeps', 'personas', 'pixel-art', 'thumbs',
];

export function getAvatarUrl(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const style = AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

export function getUserAvatar(user: { profilePicture?: string; username?: string; name?: string }): string {
  if (user.profilePicture && user.profilePicture.length > 0) {
    return user.profilePicture;
  }
  return getAvatarUrl(user.username || user.name || 'default');
}

export const SKILLS_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'Go', 'Rust',
  'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js',
  'Django', 'Flask', 'Spring Boot', 'FastAPI',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'Git', 'Linux', 'CI/CD', 'REST APIs', 'GraphQL',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
  'TensorFlow', 'PyTorch', 'Data Science', 'Data Analysis',
  'HTML', 'CSS', 'Tailwind CSS', 'SASS',
  'Mobile Development', 'React Native', 'Flutter',
  'Blockchain', 'Web3', 'Cybersecurity',
  'System Design', 'DSA', 'Competitive Programming',
];

export const INTERESTS_OPTIONS = [
  'Coding', 'Open Source', 'Hackathons', 'Competitive Programming',
  'Web Development', 'App Development', 'AI/ML', 'Data Science',
  'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain',
  'Gaming', 'Music', 'Photography', 'Videography',
  'Reading', 'Writing', 'Blogging', 'Podcasting',
  'Travelling', 'Fitness', 'Cricket', 'Football',
  'Basketball', 'Chess', 'Entrepreneurship', 'Startups',
  'Design', 'UI/UX', 'Anime', 'Movies',
  'Cooking', 'Astronomy', 'Robotics', 'IoT',
  'Public Speaking', 'Debate', 'Volunteering', 'Teaching',
];

export const COLLEGES = [
  'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad',
  'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut',
  'BITS Pilani', 'BITS Hyderabad', 'BITS Goa',
  'Delhi University', 'VIT Vellore', 'SRM Chennai', 'IIIT Hyderabad',
  'Manipal Institute of Technology', 'Thapar University',
  'PEC Chandigarh', 'LPU', 'Amity University',
];

export const CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad',
  'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow',
  'Chandigarh', 'Indore', 'Bhopal', 'Noida', 'Gurgaon',
];

export const BRANCHES = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Data Science', 'AI & Machine Learning', 'Biotechnology',
  'Chemical Engineering', 'Aerospace Engineering',
];
