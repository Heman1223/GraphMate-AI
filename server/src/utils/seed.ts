import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../config/env';
import User from '../models/User';
import Friendship from '../models/Friendship';
import Notification from '../models/Notification';
import aiService from '../services/ai.service';

// ─── Data Arrays ──────────────────────────────────────────────────────────────

const firstNamesMale = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Sai',
  'Arnav', 'Dhruv', 'Kabir', 'Ritvik', 'Aniket', 'Harsh', 'Pranav',
  'Rohan', 'Shaurya', 'Ayush', 'Kartik', 'Yash', 'Nikhil', 'Raj',
  'Manish', 'Rahul', 'Kunal', 'Amit', 'Varun', 'Ishaan', 'Dev',
  'Ankit', 'Sahil', 'Vikram', 'Aryan', 'Rishi', 'Siddharth', 'Abhinav',
  'Akash', 'Gaurav', 'Mohit', 'Deepak', 'Vishal',
];

const firstNamesFemale = [
  'Aanya', 'Saanvi', 'Aadhya', 'Isha', 'Ananya', 'Tanya', 'Priya',
  'Diya', 'Riya', 'Sneha', 'Kavya', 'Meera', 'Nisha', 'Pooja',
  'Shreya', 'Tanvi', 'Ankita', 'Sakshi', 'Neha', 'Simran', 'Aishwarya',
  'Kiara', 'Navya', 'Rhea', 'Zara', 'Palak', 'Jiya', 'Mahika',
  'Tara', 'Aditi', 'Swati', 'Kritika', 'Divya', 'Sonali', 'Rashmi',
];

const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Joshi',
  'Agarwal', 'Mishra', 'Reddy', 'Nair', 'Iyer', 'Menon', 'Pillai',
  'Chatterjee', 'Banerjee', 'Das', 'Roy', 'Ghosh', 'Mukherjee',
  'Srinivasan', 'Krishnan', 'Rajan', 'Desai', 'Shah', 'Mehta',
  'Kapoor', 'Malhotra', 'Khanna', 'Bhatia', 'Tiwari', 'Pandey',
  'Saxena', 'Jain', 'Chauhan',
];

const colleges = [
  'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Hyderabad', 'IIT Guwahati', 'IIT BHU',
  'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut', 'NIT Rourkela',
  'BITS Pilani', 'BITS Hyderabad', 'BITS Goa',
  'Delhi University', 'Mumbai University', 'Anna University',
  'VIT Vellore', 'SRM University', 'Manipal University', 'Amity University',
  'IIIT Hyderabad', 'IIIT Delhi', 'IIIT Bangalore',
  'Jadavpur University', 'Presidency University', 'Christ University',
  'PES University', 'RV College of Engineering', 'BMS College of Engineering',
  'NSIT Delhi', 'DTU Delhi', 'RVCE Bangalore',
];

const branches = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Information Technology',
  'Data Science and AI',
  'Artificial Intelligence and Machine Learning',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
];

const cities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad',
  'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Chandigarh',
  'Bhopal', 'Indore', 'Kochi', 'Coimbatore', 'Nagpur',
  'Gurgaon', 'Noida', 'Thiruvananthapuram', 'Visakhapatnam',
];

const allSkills = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'Go', 'Rust',
  'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js',
  'Django', 'Flask', 'Spring Boot', 'FastAPI',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
  'TensorFlow', 'PyTorch', 'Scikit-learn',
  'React Native', 'Flutter', 'Swift', 'Kotlin',
  'Git', 'Linux', 'GraphQL', 'REST APIs', 'Microservices',
  'CI/CD', 'Jenkins', 'GitHub Actions',
  'Data Structures', 'Algorithms', 'System Design',
  'Figma', 'UI/UX Design', 'Tailwind CSS', 'Bootstrap',
  'Blockchain', 'Solidity', 'Web3',
  'Cybersecurity', 'Ethical Hacking', 'Penetration Testing',
];

const allInterests = [
  'Coding', 'Competitive Programming', 'Open Source', 'Hackathons',
  'Music', 'Guitar', 'Singing', 'Piano',
  'Photography', 'Filmmaking', 'Graphic Design', 'Digital Art',
  'Gaming', 'Esports', 'Chess',
  'Travelling', 'Trekking', 'Hiking', 'Camping',
  'Reading', 'Writing', 'Blogging', 'Poetry',
  'Fitness', 'Yoga', 'Cricket', 'Football', 'Basketball', 'Badminton',
  'Cooking', 'Baking',
  'Astronomy', 'Robotics', 'IoT', '3D Printing',
  'Entrepreneurship', 'Startups', 'Finance', 'Stock Trading',
  'Public Speaking', 'Debating', 'MUN',
  'Anime', 'Manga', 'Movies', 'Series',
  'Volunteering', 'Social Work', 'Environmental Activism',
];

const bios = [
  'Passionate about building scalable web applications and solving complex problems.',
  'Full-stack developer with a love for clean code and great user experiences.',
  'ML enthusiast exploring the intersection of AI and real-world applications.',
  'Open source contributor and hackathon junkie. Always learning something new.',
  'Backend developer who loves distributed systems and cloud architecture.',
  'Aspiring data scientist with a knack for finding patterns in chaos.',
  'Frontend developer crafting pixel-perfect, accessible user interfaces.',
  'DevOps engineer automating everything that can be automated.',
  'Competitive programmer with a passion for algorithms and data structures.',
  'Mobile app developer creating delightful user experiences on iOS and Android.',
  'Cybersecurity enthusiast working to make the internet a safer place.',
  'Blockchain developer exploring decentralized applications and Web3.',
  'AI researcher focused on natural language processing and understanding.',
  'Student developer passionate about building products that matter.',
  'Tech enthusiast who loves attending meetups and conferences.',
  'Game developer creating immersive experiences with Unity and Unreal.',
  'IoT tinkerer connecting the physical and digital worlds.',
  'Design-minded developer who believes in the power of great UX.',
  'Cloud architect designing resilient and scalable infrastructure.',
  'Product-focused engineer who loves understanding user problems.',
  'Systems programmer fascinated by low-level optimization.',
  'Research intern working on cutting-edge computer vision models.',
  'Teaching assistant who enjoys helping others learn to code.',
  'Startup founder building the next big thing in EdTech.',
  'Data engineer building reliable data pipelines at scale.',
];

// ─── Helper Functions ──────────────────────────────────────────────────────────

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateUsername(name: string, index: number): string {
  const base = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const suffixes = ['', String(index), `_${Math.floor(Math.random() * 100)}`, `${Math.floor(Math.random() * 1000)}`];
  return `${base}${randomItem(suffixes)}`;
}

function generateSocialLinks(username: string): { github: string; linkedin: string } {
  const hasGithub = Math.random() > 0.3;
  const hasLinkedin = Math.random() > 0.3;
  return {
    github: hasGithub ? `https://github.com/${username}` : '',
    linkedin: hasLinkedin ? `https://linkedin.com/in/${username}` : '',
  };
}

// ─── Seed Function ─────────────────────────────────────────────────────────────

async function seed(): Promise<void> {
  console.log('🌱 Starting seed process...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Drop existing data
    console.log('🗑️  Dropping existing data...');
    await Promise.all([
      User.deleteMany({}),
      Friendship.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('✅ Existing data dropped\n');

    // Hash the default password once
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Generate 75 demo users
    console.log('👥 Creating 75 demo users...');
    const usersData: any[] = [];
    const usedUsernames = new Set<string>();
    const usedEmails = new Set<string>();

    for (let i = 0; i < 75; i++) {
      const isMale = Math.random() > 0.45;
      const firstName = isMale ? randomItem(firstNamesMale) : randomItem(firstNamesFemale);
      const lastName = randomItem(lastNames);
      const name = `${firstName} ${lastName}`;

      // Generate unique username
      let username = generateUsername(name, i);
      while (usedUsernames.has(username)) {
        username = `${username}${Math.floor(Math.random() * 1000)}`;
      }
      usedUsernames.add(username);

      // Generate unique email
      let email = `${username}@gmail.com`;
      if (usedEmails.has(email)) {
        email = `${username}${i}@gmail.com`;
      }
      usedEmails.add(email);

      const college = randomItem(colleges);
      const branch = randomItem(branches);
      const city = randomItem(cities);
      const skills = randomItems(allSkills, 3, 8);
      const interests = randomItems(allInterests, 3, 6);

      usersData.push({
        name,
        username,
        email,
        password: hashedPassword,
        college,
        branch,
        graduationYear: 2023 + Math.floor(Math.random() * 5), // 2023-2027
        city,
        bio: randomItem(bios),
        skills,
        interests,
        profilePicture: '',
        socialLinks: generateSocialLinks(username),
        profileViews: Math.floor(Math.random() * 100),
      });
    }

    const users = await User.insertMany(usersData);
    console.log(`✅ Created ${users.length} users\n`);

    // Create ~150 random accepted friendships
    console.log('🤝 Creating ~150 accepted friendships...');
    const friendshipPairs = new Set<string>();
    const friendshipsData: any[] = [];

    let accepted = 0;
    while (accepted < 150) {
      const idx1 = Math.floor(Math.random() * users.length);
      const idx2 = Math.floor(Math.random() * users.length);

      if (idx1 === idx2) continue;

      const pairKey = [idx1, idx2].sort().join('-');
      if (friendshipPairs.has(pairKey)) continue;

      friendshipPairs.add(pairKey);
      friendshipsData.push({
        requester: users[idx1]._id,
        recipient: users[idx2]._id,
        status: 'accepted',
      });
      accepted++;
    }

    // Create ~30 pending friend requests
    console.log('📨 Creating ~30 pending friend requests...');
    let pending = 0;
    while (pending < 30) {
      const idx1 = Math.floor(Math.random() * users.length);
      const idx2 = Math.floor(Math.random() * users.length);

      if (idx1 === idx2) continue;

      const pairKey = [idx1, idx2].sort().join('-');
      if (friendshipPairs.has(pairKey)) continue;

      friendshipPairs.add(pairKey);
      friendshipsData.push({
        requester: users[idx1]._id,
        recipient: users[idx2]._id,
        status: 'pending',
      });
      pending++;
    }

    const friendships = await Friendship.insertMany(friendshipsData);
    console.log(`✅ Created ${friendships.length} friendships (${accepted} accepted, ${pending} pending)\n`);

    // Create notifications for pending requests
    console.log('🔔 Creating notifications for pending requests...');
    const notificationsData = friendshipsData
      .filter((f) => f.status === 'pending')
      .map((f) => {
        const requester = users.find((u) => u._id.equals(f.requester));
        return {
          user: f.recipient,
          type: 'friend_request' as const,
          message: `${requester?.name || 'Someone'} sent you a friend request`,
          relatedUser: f.requester,
          read: Math.random() > 0.5,
        };
      });

    await Notification.insertMany(notificationsData);
    console.log(`✅ Created ${notificationsData.length} notifications\n`);

    // Generate AI embeddings
    console.log('🤖 Attempting to generate AI embeddings...');
    const aiAvailable = await aiService.checkHealth();

    if (aiAvailable) {
      let embeddingCount = 0;
      for (const user of users) {
        try {
          const profileText = aiService.buildProfileText({
            name: user.name,
            bio: user.bio,
            skills: user.skills,
            interests: user.interests,
            college: user.college,
            branch: user.branch,
            city: user.city,
          });
          const embedding = await aiService.generateEmbedding(profileText);
          if (embedding.length > 0) {
            await User.findByIdAndUpdate(user._id, { embedding });
            embeddingCount++;
          }
        } catch (err) {
          // Continue with other users
        }

        // Progress indicator
        if ((embeddingCount + 1) % 10 === 0) {
          process.stdout.write(`  Generated ${embeddingCount} embeddings...\r`);
        }
      }
      console.log(`\n✅ Generated ${embeddingCount} AI embeddings\n`);
    } else {
      console.log('⚠️  AI service unavailable. Skipping embedding generation.');
      console.log('   Run seed again with AI service running to generate embeddings.\n');
    }

    // Print summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('                    SEED COMPLETE                      ');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  Users:            ${users.length}`);
    console.log(`  Friendships:      ${accepted} accepted`);
    console.log(`  Pending Requests: ${pending}`);
    console.log(`  Notifications:    ${notificationsData.length}`);
    console.log(`  AI Embeddings:    ${aiAvailable ? 'Generated' : 'Skipped (AI unavailable)'}`);
    console.log('');
    console.log('  Default password: password123');
    console.log('  Sample users:');
    for (let i = 0; i < 5; i++) {
      console.log(`    - ${users[i].name} (${users[i].email})`);
    }
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed');
    process.exit(0);
  }
}

seed();
