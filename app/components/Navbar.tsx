'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Check if current route matches the link
  const isActive = (linkPathname: string) => pathname === linkPathname;

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16"> {/* Centered content */}
          <Link 
            href="/" 
            className={`text-xl font-semibold transition-colors duration-200 ${
              isActive('/') ? 'text-green-400' : 'text-gray-300 hover:text-green-400'
            }`}
          >
            LeafLens
          </Link>
        </div>
      </div>
    </nav>
  );
}
