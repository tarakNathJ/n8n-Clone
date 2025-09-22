import React, { useState } from 'react';
import { User, Palette, Globe, Shield, Bell, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';



export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const AUTH_KEY = 'auth_token';
  const USER_KEY = 'user_info';
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [workflowErrors, setWorkflowErrors] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConformPassword, setConformPassword] = useState("");

  const handleSaveProfile = () => {
    console.log(email, NewPassword, currentPassword, ConformPassword)
    toast({
      title: 'Profile Updated',
      description: 'Your profile settings have been saved.',
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: 'Preferences Updated',
      description: 'Your preferences have been saved.',
    });
  };


  ///updatePassword
  const UpdatePssword = async () => {
    try {
      if (!email || !NewPassword || !currentPassword || !ConformPassword) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',

        });
        return
      }
      if ((NewPassword !== ConformPassword) && (NewPassword == currentPassword)) {
        toast({
          title: 'Error',
          description: 'chack your new password  and Confirm Password  / New Password and current Password ',

        });
        return
      }
      const responce: any = await axios.post(`${import.meta.env.VITE_PRIMARY_BACKEND}/updatePassword`, {
        email: email,
        currentPassword: currentPassword,
        newPassword: NewPassword
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      localStorage.setItem(AUTH_KEY, responce.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(responce.data.payload));
      if (responce.data.success == true) {
        toast({
          title: 'success',
          description: 'Please fill in all fields',

        });
        return

      } else {
        toast({
          title: 'failed',
          description: 'update password  failed',

        });

      }

    } catch (error) {

      toast({
        title: 'Error',
        description: 'chack your new password  and Confirm Password  / New Password and current Password ',

      });
    }

  }

  return (
    <div className="p-6 space-y-6 bg-n8n-canvas min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-n8n-canvas-foreground">Settings</h1>
        <p className="text-n8n-canvas-foreground/70 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-n8n-sidebar border border-n8n-node-border">
          <TabsTrigger value="profile" className="text-n8n-sidebar-foreground data-[state=active]:bg-n8n-header">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-n8n-sidebar-foreground data-[state=active]:bg-n8n-header">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          {/* <TabsTrigger value="notifications" className="text-n8n-sidebar-foreground data-[state=active]:bg-n8n-header">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger> */}
          <TabsTrigger value="security" className="text-n8n-sidebar-foreground data-[state=active]:bg-n8n-header">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-n8n-sidebar border-n8n-node-border">
            <CardHeader>
              <CardTitle className="text-n8n-sidebar-foreground">Profile Information</CardTitle>
              <CardDescription className="text-n8n-sidebar-foreground/60">
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 bg-primary">
                  <AvatarFallback className="text-2xl font-semibold text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="border-n8n-node-border hover:bg-n8n-header">
                    Change Avatar
                  </Button>
                  <p className="text-sm text-n8n-sidebar-foreground/60">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-n8n-sidebar-foreground">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-n8n-sidebar-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="role" className="text-n8n-sidebar-foreground">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={user?.role || 'User'}
                    disabled
                    className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground/60"
                  />
                </div>*/}
              </div> 

              {/* <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-n8n-sidebar border-n8n-node-border">
            <CardHeader>
              <CardTitle className="text-n8n-sidebar-foreground">Theme Preferences</CardTitle>
              <CardDescription className="text-n8n-sidebar-foreground/60">
                Customize the appearance of your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-n8n-sidebar-foreground">Dark Mode</Label>
                  <p className="text-sm text-n8n-sidebar-foreground/60">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-n8n-sidebar-foreground">Light Theme</Label>
                  <div
                    className="h-24 rounded-lg border-2 cursor-pointer transition-colors bg-white"
                    style={{ borderColor: theme === 'light' ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                    onClick={() => theme === 'dark' && toggleTheme()}
                  >
                    <div className="h-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <div className="text-xs text-gray-600">Light</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-n8n-sidebar-foreground">Dark Theme</Label>
                  <div
                    className="h-24 rounded-lg border-2 cursor-pointer transition-colors bg-gray-900"
                    style={{ borderColor: theme === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                    onClick={() => theme === 'light' && toggleTheme()}
                  >
                    <div className="h-full rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-xs text-gray-300">Dark</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePreferences} className="bg-primary hover:bg-primary/90">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
{/* 
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-n8n-sidebar border-n8n-node-border">
            <CardHeader>
              <CardTitle className="text-n8n-sidebar-foreground">Notification Settings</CardTitle>
              <CardDescription className="text-n8n-sidebar-foreground/60">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-n8n-sidebar-foreground">Push Notifications</Label>
                    <p className="text-sm text-n8n-sidebar-foreground/60">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-n8n-sidebar-foreground">Email Notifications</Label>
                    <p className="text-sm text-n8n-sidebar-foreground/60">
                      Get notified via email for important events
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-n8n-sidebar-foreground">Workflow Errors</Label>
                    <p className="text-sm text-n8n-sidebar-foreground/60">
                      Notify when workflows fail or encounter errors
                    </p>
                  </div>
                  <Switch
                    checked={workflowErrors}
                    onCheckedChange={setWorkflowErrors}
                  />
                </div>
              </div>

              <Button onClick={handleSavePreferences} className="bg-primary hover:bg-primary/90">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-n8n-sidebar border-n8n-node-border">
            <CardHeader>
              <CardTitle className="text-n8n-sidebar-foreground">Password & Security</CardTitle>
              <CardDescription className="text-n8n-sidebar-foreground/60">
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-n8n-sidebar-foreground">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-n8n-sidebar-foreground">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-n8n-sidebar-foreground">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                    onChange={(event) => setConformPassword(event.target.value)}
                  />
                </div>
              </div>

              <Button onClick={UpdatePssword} className="bg-primary hover:bg-primary/90">
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* <Card className="bg-n8n-sidebar border-n8n-node-border">
            <CardHeader>
              <CardTitle className="text-n8n-sidebar-foreground">API Keys</CardTitle>
              <CardDescription className="text-n8n-sidebar-foreground/60">
                Manage API keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-n8n-header rounded-lg border border-n8n-node-border">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-n8n-sidebar-foreground/60" />
                  <div>
                    <div className="font-medium text-n8n-sidebar-foreground">Personal API Key</div>
                    <div className="text-sm text-n8n-sidebar-foreground/60">Created 2 days ago</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-n8n-node-border hover:bg-n8n-sidebar">
                  Revoke
                </Button>
              </div>

              <Button variant="outline" className="w-full border-n8n-node-border hover:bg-n8n-header">
                Generate New API Key
              </Button>
            </CardContent>
          </Card> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}