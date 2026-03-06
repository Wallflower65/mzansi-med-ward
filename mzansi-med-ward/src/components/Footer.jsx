import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          Built with <Heart className="w-4 h-4 text-red-500 fill-current" /> for healthcare by 
          <span className="font-bold text-blue-900 ml-1">Phaphamani Zoneleni</span>
        </div>
        
        <a 
          href="https://github.com/Wallflower65" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
        >
          <Github className="w-4 h-4" />
          View on GitHub
        </a>
      </div>
    </footer>
  );
}