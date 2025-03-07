
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showBackButton = false,
  title,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full p-4 border-b backdrop-blur-sm bg-white/70 fixed top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link to="/" className="p-2 rounded-full hover:bg-secondary transition-colors">
                <ChevronLeft size={20} />
              </Link>
            )}
            <h1 className="text-lg font-medium">
              {title || 'Exam Seat Finder'}
            </h1>
          </div>
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-10">
        {children}
      </main>
      
      <footer className="w-full py-6 border-t backdrop-blur-sm bg-white/70">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Exam Seat Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
