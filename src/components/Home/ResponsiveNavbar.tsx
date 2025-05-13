'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { UserType } from '@/types/auth';
import { Menu, X, User, Book, Calendar, LogOut, Clock, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ResponsiveNavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userType: UserType | null;
}

export default function ResponsiveNavbar({ 
  activeSection, 
  onSectionChange, 
  onLogout, 
  userType 
}: ResponsiveNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  // const mentee = useMenteeStore((state) => state.menteeResponse);
  // const mentor = useMentorStore((state) => state.mentor);
  const navRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });
  const [prevActiveSection, setPrevActiveSection] = useState(activeSection);

  // const currentUser = userType === UserType.MENTOR ? mentor : mentee;

  const menteeNavigation = [
    { name: 'Profile', section: 'profile', icon: <User className="h-5 w-5" /> },
    { name: 'Courses', section: 'courses', icon: <Book className="h-5 w-5" /> },
    { name: 'Support Queries', section: 'support-queries', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const mentorNavigation = [
    { name: 'Profile', section: 'profile', icon: <User className="h-5 w-5" /> },
    { name: 'Sessions', section: 'mentor-sessions', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Schedules', section: 'mentor-schedules', icon: <Clock className="h-5 w-5" /> }
  ];

  const navigation = userType === UserType.MENTOR ? mentorNavigation : menteeNavigation;

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
    
    setPrevActiveSection(activeSection);
  }, [activeSection, navRef, activeTabRef]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // if (!currentUser) return null;

  return (
    <>
      {/* Mobile navigation overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleDrawer} />
      
      {/* Mobile navigation drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              {navigation.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    onSectionChange(item.section);
                    setIsOpen(false);
                  }}
                  className={`${
                    activeSection === item.section
                      ? 'bg-orange-100 text-orange-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-base font-medium rounded-md w-full`}
                >
                  <div className="w-5 mr-3 flex justify-center">{item.icon}</div>
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={onLogout}
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
              {navigation.map((item) => (
                <button
                  key={item.section}
                  ref={activeSection === item.section ? activeTabRef : null}
                  onClick={() => onSectionChange(item.section)}
                  className={`
                    h-16 px-5 font-medium transition-colors duration-300 ease-in-out
                    ${activeSection === item.section ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  {item.name}
                </button>
              ))}
              
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
              <Button 
                variant="secondary"
                onClick={onLogout}
                className="hidden md:block px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 