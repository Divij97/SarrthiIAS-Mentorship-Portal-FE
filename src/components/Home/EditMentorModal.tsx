import { useState, useEffect } from 'react';
import { StrippedDownMentor } from '@/types/mentor';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface EditMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: StrippedDownMentor;
  onUpdate: (data: { displayName: string; displayEmail: string }) => void;
}

export default function EditMentorModal({ isOpen, onClose, mentor, onUpdate }: EditMentorModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');

  useEffect(() => {
    if (mentor) {
      setDisplayName(mentor.displayName || mentor.name);
      setDisplayEmail(mentor.displayEmail || mentor.email);
    }
  }, [mentor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ displayName, displayEmail });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="displayEmail" className="block text-sm font-medium text-gray-700">
            Display Email
          </label>
          <Input
            id="displayEmail"
            type="email"
            value={displayEmail}
            onChange={e => setDisplayEmail(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Dialog>
  );
} 