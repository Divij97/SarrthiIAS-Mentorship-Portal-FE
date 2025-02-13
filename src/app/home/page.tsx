'use client';

import { useState } from 'react';
import Sidebar from '@/components/Home/Sidebar';
import SessionDetails from '@/components/Home/SessionDetails';
import AskMentor from '@/components/Home/AskMentor';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('session-details');

  const renderContent = () => {
    switch (activeSection) {
      case 'session-details':
        return <SessionDetails />;
      case 'ask-mentor':
        return <AskMentor />;
      default:
        return <SessionDetails />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
} 