import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { PasswordResetRequest } from "@/types/admin";
import { SHA256 } from "crypto-js";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: PasswordResetRequest) => void;
  loading: boolean;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onSubmit,
  loading
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      newPassword: SHA256(newPassword).toString(),
      authOtp: "" // As per requirement
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            required
            minLength={6}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !newPassword}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
} 