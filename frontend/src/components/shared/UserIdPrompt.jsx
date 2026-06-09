import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';
import { HeadingMD } from './Typography';

/**
 * Modal prompt to set the userId on first visit.
 * The userId is required for cart and payment operations.
 */
export function UserIdPrompt() {
  const { userId, setUserId, userEmail, setUserEmail } = useUser();
  const [open, setOpen] = useState(!userId);
  const [idInput, setIdInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleSave = () => {
    const trimId = idInput.trim();
    if (!trimId) return;
    setUserId(trimId);
    setUserEmail(emailInput.trim());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="heading-md">Welcome to Delhivery 🛍️</DialogTitle>
          <DialogDescription>
            Enter a User ID to track your cart and orders. This is stored locally on your device.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="user-id">User ID</Label>
            <Input
              id="user-id"
              placeholder="e.g. user123"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-email">Email (optional)</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="you@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <Button onClick={handleSave} disabled={!idInput.trim()} className="w-full">
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
