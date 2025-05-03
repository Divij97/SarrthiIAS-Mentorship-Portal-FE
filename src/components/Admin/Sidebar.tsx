'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface NavigationItem {
  name: string;
  path: string;
  subsections?: { name: string; path: string }[];
}

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubsections, setOpenSubsections] = useState<string | null>(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });
  
  const navigation: NavigationItem[] = [
    {
      name: 'Courses',
      path: '/admin/dashboard/courses',
      subsections: [
        { name: 'Create New Course', path: '/admin/dashboard/courses/create' },
        { name: 'Active Courses', path: '/admin/dashboard/courses/active' },
      ]
    },
    { name: 'Mentors', path: '/admin/dashboard/mentors' },
    { name: 'Mentees', path: '/admin/dashboard/mentees' },
    // { name: 'Feedback', path: '/admin/dashboard/feedback' }
  ];

  // Update the indicator position based on the active tab
  useEffect(() => {
    if (activeTabRef.current && navRef.current) {
      const activeTab = activeTabRef.current;
      const navContainer = navRef.current;
      const tabRect = activeTab.getBoundingClientRect();
      const navRect = navContainer.getBoundingClientRect();
      
      setIndicatorStyle({
        left: tabRect.left - navRect.left,
        width: tabRect.width,
      });
    }
  }, [pathname, navRef, activeTabRef]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      onLogout();
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubsections = (path: string) => {
    const openedSectionPath = openSubsections === path ? null : path
    setOpenSubsections(openedSectionPath);
    setIsSubMenuOpen(openedSectionPath !== null)
  };

  const getActiveSubsection = (item: NavigationItem) => {
    if (!item.subsections) return null;
    return item.subsections.find(sub => pathname === sub.path);
  };

  return (
    <>
      {/* Mobile navigation overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={toggleDrawer} 
      />
      
      {/* Mobile navigation drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="h-10 w-auto relative">
              <Image
                src="/sarrthiias.webp"
                alt="Sarrthi IAS Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
            <button onClick={toggleDrawer} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none">
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const activeSubsection = getActiveSubsection(item);
                return (
                  <div key={item.path}>
                    <button
                      onClick={() => {
                        if (item.subsections) {
                          toggleSubsections(item.path);
                        } else {
                          router.push(item.path);
                          setIsOpen(false);
                          setIsSubMenuOpen(false)
                        }
                      }}
                      className={`${
                        pathname.startsWith(item.path)
                          ? 'bg-orange-100 text-orange-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center justify-between w-full px-3 py-3 text-base font-medium rounded-md`}
                    >
                      <span>{activeSubsection ? activeSubsection.name : item.name}</span>
                      {item.subsections && (
                        <ChevronDown 
                          className={`h-5 w-5 transition-transform duration-200 ${
                            openSubsections === item.path ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {item.subsections && openSubsections === item.path && (
                      <div className="ml-4 space-y-1">
                        {item.subsections.map((subsection) => (
                          <Link
                            key={subsection.path}
                            href={subsection.path}
                            onClick={(e) => {
                              e.preventDefault();
                              setIsOpen(false);
                              setOpenSubsections(null);
                              setIsSubMenuOpen(false);
                              router.push(subsection.path);
                            }}
                            className={`${
                              pathname === subsection.path
                                ? 'text-orange-900 bg-orange-50'
                                : 'text-gray-500 hover:text-gray-900'
                            } group flex items-center px-3 py-2 text-sm rounded-md w-full`}
                          >
                            {subsection.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
            >
              <div className="w-5 mr-3 flex justify-center"><LogOut className="h-5 w-5" /></div>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="nav-container">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo and mobile menu button */}
            <div className="flex items-center">
              <button
                onClick={toggleDrawer}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none mr-2"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="h-10 w-auto relative">
                <Image
                  src="/sarrthiias.webp"
                  alt="Sarrthi IAS Logo"
                  width={140}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Center: Navigation tabs with sliding indicator */}
            <div className="hidden md:flex items-center relative" ref={navRef}>
              {navigation.map((item) => {
                const activeSubsection = getActiveSubsection(item);
                return (
                  <div key={item.path} className="relative group">
                    <button
                      onClick={() => {
                        if (item.subsections) {
                          toggleSubsections(item.path);
                        } else {
                          toggleSubsections(null)
                          router.push(item.path);
                        }
                      }}
                      ref={pathname.startsWith(item.path) ? activeTabRef : null}
                      className={`
                        h-16 px-5 font-medium transition-colors duration-300 ease-in-out flex items-center
                        ${pathname.startsWith(item.path) ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'}
                      `}
                    >
                      {activeSubsection ? activeSubsection.name : item.name}
                      {item.subsections && (
                        <ChevronDown 
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            openSubsections === item.path ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {item.subsections && isSubMenuOpen && (
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          {item.subsections.map((subsection) => (
                            <Link
                              key={subsection.path}
                              href={subsection.path}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsOpen(false);
                                setOpenSubsections(null);
                                setIsSubMenuOpen(false);
                                router.push(subsection.path);
                              }}
                              className={`${
                                pathname === subsection.path
                                  ? 'bg-orange-50 text-orange-900'
                                  : 'text-gray-700 hover:bg-gray-100'
                              } block px-4 py-2 text-sm`}
                            >
                              {subsection.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Animated slider indicator */}
              <div 
                className="absolute bottom-0 h-0.5 bg-orange-500 transition-all duration-300 ease-in-out"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
            </div>
            
            {/* Right: Logout button */}
            <div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 