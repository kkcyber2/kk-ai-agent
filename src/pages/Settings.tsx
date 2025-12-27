import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Plus, Trash2, Save } from 'lucide-react';

interface PlatformSettings {
  platform: string;
  response_style: string;
  auto_approve: boolean;
  auto_approve_keywords: string[];
  auto_reject_keywords: string[];
}

interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  email_address: string;
  phone_number: string;
  notify_on_new_message: boolean;
  notify_on_urgent: boolean;
}

const Settings: React.FC = () => {
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_enabled: false,
    sms_enabled: false,
    email_address: '',
    phone_number: '',
    notify_on_new_message: true,
    notify_on_urgent: true,
  });
  const [loading, setLoading] = useState(true);

  const platforms = ['instagram', 'facebook', 'whatsapp', 'linkedin', 'twitter'];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [platformRes, notificationRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/settings/notifications'),
      ]);

      const platformData = await platformRes.json();
      const notificationData = await notificationRes.json();

      setPlatformSettings(platformData);
      setNotificationSettings(notificationData);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlatformSettings = async (platform: string, updates: Partial<PlatformSettings>) => {
    try {
      await fetch(`/api/settings/${platform}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      // Refresh settings
      fetchSettings();
    } catch (error) {
      console.error('Failed to update platform settings:', error);
    }
  };

  const updateNotificationSettings = async (updates: Partial<NotificationSettings>) => {
    try {
      await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notificationSettings, ...updates }),
      });

      setNotificationSettings(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  const getPlatformSettings = (platform: string) => {
    return platformSettings.find(s => s.platform === platform) || {
      platform,
      response_style: 'professional',
      auto_approve: false,
      auto_approve_keywords: [],
      auto_reject_keywords: [],
    };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Platform Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          {platforms.map((platform) => {
            const settings = getPlatformSettings(platform);
            return (
              <Card key={platform}>
                <CardHeader>
                  <CardTitle className="capitalize flex items-center space-x-2">
                    <Badge variant="outline">{platform}</Badge>
                    <span>Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure response behavior and automation for {platform}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${platform}-style`}>Response Style</Label>
                      <Select
                        value={settings.response_style}
                        onValueChange={(value) =>
                          updatePlatformSettings(platform, { response_style: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${platform}-auto-approve`}>Auto-approve Responses</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${platform}-auto-approve`}
                          checked={settings.auto_approve}
                          onCheckedChange={(checked) =>
                            updatePlatformSettings(platform, { auto_approve: checked })
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {settings.auto_approve ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${platform}-approve-keywords`}>Auto-approve Keywords</Label>
                    <Textarea
                      id={`${platform}-approve-keywords`}
                      placeholder="Enter keywords separated by commas (e.g., hello, thanks, question)"
                      value={settings.auto_approve_keywords.join(', ')}
                      onChange={(e) =>
                        updatePlatformSettings(platform, {
                          auto_approve_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${platform}-reject-keywords`}>Auto-reject Keywords</Label>
                    <Textarea
                      id={`${platform}-reject-keywords`}
                      placeholder="Enter keywords separated by commas (e.g., spam, inappropriate)"
                      value={settings.auto_reject_keywords.join(', ')}
                      onChange={(e) =>
                        updatePlatformSettings(platform, {
                          auto_reject_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k),
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive alerts about new messages and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email-enabled">Email Notifications</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-enabled"
                      checked={notificationSettings.email_enabled}
                      onCheckedChange={(checked) =>
                        updateNotificationSettings({ email_enabled: checked })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {notificationSettings.email_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-enabled">SMS Notifications</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sms-enabled"
                      checked={notificationSettings.sms_enabled}
                      onCheckedChange={(checked) =>
                        updateNotificationSettings({ sms_enabled: checked })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {notificationSettings.sms_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {notificationSettings.email_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="email-address">Email Address</Label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="your@email.com"
                    value={notificationSettings.email_address}
                    onChange={(e) =>
                      updateNotificationSettings({ email_address: e.target.value })
                    }
                  />
                </div>
              )}

              {notificationSettings.sms_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="+1234567890"
                    value={notificationSettings.phone_number}
                    onChange={(e) =>
                      updateNotificationSettings({ phone_number: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify-new-message"
                    checked={notificationSettings.notify_on_new_message}
                    onCheckedChange={(checked) =>
                      updateNotificationSettings({ notify_on_new_message: checked })
                    }
                  />
                  <Label htmlFor="notify-new-message">Notify on new messages</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="notify-urgent"
                    checked={notificationSettings.notify_on_urgent}
                    onCheckedChange={(checked) =>
                      updateNotificationSettings({ notify_on_urgent: checked })
                    }
                  />
                  <Label htmlFor="notify-urgent">Notify on urgent messages</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;