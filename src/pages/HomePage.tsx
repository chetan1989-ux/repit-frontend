
import React from 'react';
import { useUser } from '../contexts/UserContext';

interface ContentCardProps {
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  tags: string[];
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  author,
  date,
  excerpt,
  imageUrl,
  tags,
}) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl || 'https://via.placeholder.com/600x400'}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="mb-4 text-gray-600">{excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-gray-200">
              <img
                src={`https://ui-avatars.com/api/?name=${author}&background=random`}
                alt={author}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">{author}</span>
          </div>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { user } = useUser();
  
  // Mock content data
  const featuredContent = [
    {
      id: 1,
      title: 'Getting Started with React and TypeScript',
      author: 'Alex Johnson',
      date: 'May 15, 2023',
      excerpt: 'Learn how to set up a new React project with TypeScript and best practices for type safety.',
      imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
      tags: ['React', 'TypeScript', 'Frontend'],
    },
    {
      id: 2,
      title: 'Building Responsive UIs with Tailwind CSS',
      author: 'Samantha Lee',
      date: 'June 2, 2023',
      excerpt: 'Discover how to create beautiful, responsive user interfaces using Tailwind CSS utility classes.',
      imageUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
      tags: ['CSS', 'Tailwind', 'Design'],
    },
    {
      id: 3,
      title: 'State Management with Context API and Hooks',
      author: 'Michael Chen',
      date: 'June 10, 2023',
      excerpt: 'Explore how to manage state in React applications using Context API and custom hooks.',
      imageUrl: 'https://images.unsplash.com/photo-1549082984-1323b94df9a6',
      tags: ['React', 'Hooks', 'State Management'],
    },
  ];
  
  const recentContent = [
    {
      id: 4,
      title: 'Authentication Best Practices in React',
      author: 'David Wilson',
      date: 'June 15, 2023',
      excerpt: 'Learn secure ways to implement authentication in your React applications.',
      imageUrl: 'https://images.unsplash.com/photo-1580894732930-0babd100d356',
      tags: ['Security', 'Auth', 'React'],
    },
    {
      id: 5,
      title: 'Performance Optimization for React Apps',
      author: 'Emily Rodriguez',
      date: 'June 20, 2023',
      excerpt: 'Tips and tricks for improving the performance of your React applications.',
      imageUrl: 'https://images.unsplash.com/photo-1618044733300-9472054094ee',
      tags: ['Performance', 'React', 'Optimization'],
    },
    {
      id: 6,
      title: 'Creating Accessible Web Forms',
      author: 'Jordan Taylor',
      date: 'June 25, 2023',
      excerpt: 'How to build web forms that are accessible to all users, including those with disabilities.',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      tags: ['Accessibility', 'Forms', 'UX'],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Welcome{user?.fullName ? `, ${user.fullName}` : ''}!</h2>
          <div className="flex gap-2">
            <button className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Popular
            </button>
            <button className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Latest
            </button>
            <button className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              For You
            </button>
          </div>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featuredContent.map((content) => (
            <ContentCard
              key={content.id}
              title={content.title}
              author={content.author}
              date={content.date}
              excerpt={content.excerpt}
              imageUrl={content.imageUrl}
              tags={content.tags}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Recent Uploads</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recentContent.map((content) => (
            <ContentCard
              key={content.id}
              title={content.title}
              author={content.author}
              date={content.date}
              excerpt={content.excerpt}
              imageUrl={content.imageUrl}
              tags={content.tags}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
