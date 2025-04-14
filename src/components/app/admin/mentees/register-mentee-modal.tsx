'use client';

import { useState } from 'react';
import { CreateMenteeRequest } from '@/types/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { registerMentee } from '@/services/admin';
interface RegisterMenteeModalProps {
  onSuccess?: () => void;
}

export function RegisterMenteeModal({ onSuccess }: RegisterMenteeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAuthHeader } = useAdminAuthStore();
  const [formData, setFormData] = useState<CreateMenteeRequest>({
    n: '',
    p: '',
    e: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        throw new Error('No auth header found');
      }
      const response = await registerMentee(formData, authHeader);

      if (!response) {
        throw new Error('Failed to register mentee');
      }

      toast.success('Mentee registered successfully');
      setIsOpen(false);
      onSuccess?.();
      setFormData({ n: '', p: '', e: '' });
    } catch (error) {
      toast.error('Failed to register mentee. Please try again.');
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
      <Button onClick={() => setIsOpen(true)}>Register New Mentee</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Register New Mentee"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.n}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.p}
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
              value={formData.e}
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