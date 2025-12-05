"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Unlock } from 'lucide-react';

interface TokenLimitModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: (password: string) => boolean;
  pairName: string;
}

export function TokenLimitModal({ open, onClose, onUnlock, pairName }: TokenLimitModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = onUnlock(password);

    if (success) {
      setPassword('');
      onClose();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <DialogTitle>Generation Limit Reached</DialogTitle>
          </div>
          <DialogDescription>
            You've used all 2 free generations for the <strong>{pairName}</strong> pair this month.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Free tier:</strong> 2 generations per planetary pair per month
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Resets:</strong> Automatically on the 1st of each month
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Unlock className="h-4 w-4" />
                Enter Password to Unlock
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'border-destructive' : ''}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">
                Password unlocks unlimited generations for 1 hour
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!password}>
                Unlock
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
