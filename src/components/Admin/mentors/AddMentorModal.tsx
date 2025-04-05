'use client';

import { useState } from 'react';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { registerMentor } from '@/services/admin';

interface AddMentorModalProps {
  onSuccess?: () => void;
}

export function AddMentorModal({ onSuccess }: AddMentorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAuthHeader } = useAdminAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        throw new Error('No auth header found');
      }

        const response = await registerMentor(formData, authHeader);

      if (!response) {
        throw new Error('Failed to register mentor');
      }

      toast.success('Mentor registered successfully');
      setIsOpen(false);
      onSuccess?.();
      setFormData({ name: '', phone: '', email: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register mentor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Register New Mentor</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Register New Mentor"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
} 