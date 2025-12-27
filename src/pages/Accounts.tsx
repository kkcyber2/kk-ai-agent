import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: string;
  account_id: string;
  account_name: string;
  created_at: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    platform: '',
    account_id: '',
    account_name: '',
    access_token: '',
    refresh_token: '',
  });

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/platforms/accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const addAccount = async () => {
    try {
      const response = await fetch('/api/platforms/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      });

      if (response.ok) {
        setShowAddDialog(false);
        setNewAccount({
          platform: '',
          account_id: '',
          account_name: '',
          access_token: '',
          refresh_token: '',
        });
        fetchAccounts();
      }
    } catch (error) {
      console.error('Failed to add account:', error);
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      await fetch(`/api/platforms/accounts/${accountId}`, {
        method: 'DELETE',
      });
      fetchAccounts();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const testConnection = async (accountId: string) => {
    try {
      const response = await fetch(`/api/platforms/accounts/${accountId}/test`);
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to test connection:', error);
      return false;
    }
  };

  const handleOAuth = (platform: string) => {
    window.open(`/api/auth/${platform}/oauth`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Connected Accounts</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Social Media Account</DialogTitle>
              <DialogDescription>
                Connect a new social media account to monitor and respond to messages.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={newAccount.platform}
                  onValueChange={(value) =>
                    setNewAccount(prev => ({ ...prev, platform: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-id">Account ID</Label>
                <Input
                  id="account-id"
                  value={newAccount.account_id}
                  onChange={(e) =>
                    setNewAccount(prev => ({ ...prev, account_id: e.target.value }))
                  }
                  placeholder="Platform account ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  value={newAccount.account_name}
                  onChange={(e) =>
                    setNewAccount(prev => ({ ...prev, account_name: e.target.value }))
                  }
                  placeholder="Display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="access-token">Access Token</Label>
                <Input
                  id="access-token"
                  type="password"
                  value={newAccount.access_token}
                  onChange={(e) =>
                    setNewAccount(prev => ({ ...prev, access_token: e.target.value }))
                  }
                  placeholder="API access token"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refresh-token">Refresh Token (Optional)</Label>
                <Input
                  id="refresh-token"
                  type="password"
                  value={newAccount.refresh_token}
                  onChange={(e) =>
                    setNewAccount(prev => ({ ...prev, refresh_token: e.target.value }))
                  }
                  placeholder="API refresh token"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addAccount} disabled={!newAccount.platform || !newAccount.access_token}>
                  Add Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {account.platform}
                  </Badge>
                  <CardTitle>{account.account_name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection(account.id)}
                  >
                    Test Connection
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAccount(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Connected on {new Date(account.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Account ID: {account.account_id}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No accounts connected yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your social media accounts to start monitoring messages
          </p>
          <div className="flex justify-center space-x-2">
            <Button onClick={() => handleOAuth('instagram')} variant="outline">
              Connect Instagram
            </Button>
            <Button onClick={() => handleOAuth('facebook')} variant="outline">
              Connect Facebook
            </Button>
            <Button onClick={() => handleOAuth('linkedin')} variant="outline">
              Connect LinkedIn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;