'use client';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  // Mock user data - in real app, this would come from authentication context
  const user = {
    name: 'Divij Chopra',
    email: 'ictor@ei.in',
  };

  const navigationItems = [
    { id: 'session-details', label: 'Session Details', icon: '📅' },
    { id: 'ask-mentor', label: 'Ask your mentor', icon: '❓' },
    { id: 'logout', label: 'Logout', icon: '🚪' },
  ];

  const handleNavigation = (itemId: string) => {
    if (itemId === 'logout') {
      // Handle logout logic here
      return;
    }
    onSectionChange(itemId);
  };

  return (
    <aside className="w-64 bg-orange-500 text-white min-h-screen p-6">
      {/* User Profile Section */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-gray-500 text-4xl">👤</span>
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-sm opacity-90">{user.email}</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors
              ${activeSection === item.id ? 'bg-orange-600' : 'hover:bg-orange-400'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 