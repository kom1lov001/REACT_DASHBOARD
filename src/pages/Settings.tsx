import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Clock, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appearance");
  const [settings, setSettings] = useState({
    appearance: "light",
    language: "english",
    dateFormat: "dd/mm/yyyy",
    timeFormat: "24h",
    timezone: "UTC",
    twoFactorAuth: true,
    mobilePushNotifications: true,
    desktopNotifications: true,
    emailNotifications: true,
    profileVisibility: true,
    activityStatus: true,
    dataAnalytics: false,
    autoLogout: 30,
    sessionTimeout: new Date(),
    compactMode: false,
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success("Settings updated successfully!");
    
    // Apply theme changes immediately
    if (key === "appearance") {
      const root = window.document.documentElement;
      if (value === "dark") {
        root.classList.add("dark");
      } else if (value === "light") {
        root.classList.remove("dark");
      } else {
        // System preference
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemPrefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("Password change data:", data);
    toast.success("Password updated successfully!");
    passwordForm.reset();
  };

  const handleDownloadData = () => {
    toast.success("Data download initiated! Check your downloads folder.");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires admin approval. Contact support.");
  };

  const TimeInput = ({ value, onChange, placeholder }: { value?: string, onChange: (value: string) => void, placeholder: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full sm:w-32 justify-start text-left font-normal">
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <ScrollArea className="h-48">
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                <Button
                  key={hour}
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(`${hour.toString().padStart(2, '0')}:00`)}
                >
                  {hour.toString().padStart(2, '0')}:00
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );

  const tabs = [
    { id: "appearance", label: "Appearance" },
    { id: "language", label: "Language & Region" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "account", label: "Account" },
    { id: "privacy", label: "Privacy" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "appearance":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Appearance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Customize how your theme looks on your device.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <Select 
                    value={settings.appearance} 
                    onValueChange={(value) => handleSettingChange("appearance", value)}
                  >
                    <SelectTrigger className="w-full sm:w-32 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium text-foreground">Compact Mode</span>
                  <Switch 
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "language":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Language & Region</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure your language and regional preferences.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium text-foreground">Display Language</span>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => handleSettingChange("language", value)}
                  >
                    <SelectTrigger className="w-full sm:w-32 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="uzbek">Uzbek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium text-foreground">Date Format</span>
                  <Select 
                    value={settings.dateFormat}
                    onValueChange={(value) => handleSettingChange("dateFormat", value)}
                  >
                    <SelectTrigger className="w-full sm:w-40 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy/mm/dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium text-foreground">Time Format</span>
                  <Select 
                    value={settings.timeFormat}
                    onValueChange={(value) => handleSettingChange("timeFormat", value)}
                  >
                    <SelectTrigger className="w-full sm:w-32 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-sm font-medium text-foreground">Timezone</span>
                  <Select 
                    value={settings.timezone}
                    onValueChange={(value) => handleSettingChange("timezone", value)}
                  >
                    <SelectTrigger className="w-full sm:w-40 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "security":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Security</CardTitle>
              <p className="text-sm text-muted-foreground">
                Keep your account secure with these settings.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">Two-Factor Authentication</span>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch 
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">Auto-logout Time</span>
                    <p className="text-xs text-muted-foreground">Logout after inactivity (minutes)</p>
                  </div>
                  <Select 
                    value={settings.autoLogout.toString()}
                    onValueChange={(value) => handleSettingChange("autoLogout", parseInt(value))}
                  >
                    <SelectTrigger className="w-full sm:w-24 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="120">120</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-foreground">Session Timeout</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !settings.sessionTimeout && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {settings.sessionTimeout ? format(settings.sessionTimeout, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={settings.sessionTimeout}
                        onSelect={(date) => handleSettingChange("sessionTimeout", date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label className="text-foreground">Change Password</Label>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-3">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Current Password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="password" placeholder="New Password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Confirm Password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Update Password</Button>
                    </form>
                  </Form>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "notifications":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Notifications</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your notification preferences.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">Push Notifications</span>
                    <p className="text-xs text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch 
                    checked={settings.mobilePushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("mobilePushNotifications", checked)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">Desktop Notifications</span>
                    <p className="text-xs text-muted-foreground">Show desktop notifications</p>
                  </div>
                  <Switch 
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) => handleSettingChange("desktopNotifications", checked)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">Email Notifications</span>
                    <p className="text-xs text-muted-foreground">Receive email notifications</p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "account":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Account Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your account information.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Account Type</Label>
                  <Input value="Premium" disabled className="dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Member Since</Label>
                  <Input value="January 2023" disabled className="dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Storage Used</Label>
                  <Input value="2.4 GB of 10 GB" disabled className="dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "privacy":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Privacy Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Control your privacy and data settings.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">Profile Visibility</span>
                    <p className="text-xs text-muted-foreground">Make your profile visible to others</p>
                  </div>
                  <Switch 
                    checked={settings.profileVisibility}
                    onCheckedChange={(checked) => handleSettingChange("profileVisibility", checked)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">Activity Status</span>
                    <p className="text-xs text-muted-foreground">Show when you're online</p>
                  </div>
                  <Switch 
                    checked={settings.activityStatus}
                    onCheckedChange={(checked) => handleSettingChange("activityStatus", checked)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">Data Analytics</span>
                    <p className="text-xs text-muted-foreground">Help improve our service</p>
                  </div>
                  <Switch 
                    checked={settings.dataAnalytics}
                    onCheckedChange={(checked) => handleSettingChange("dataAnalytics", checked)}
                  />
                </div>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleDownloadData}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download My Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="sticky top-0 z-30">
          <Header title="Settings" subtitle="System Settings & Preferences" />
        </div>
        
        <main className="p-3 sm:p-4 lg:p-6 max-h-[calc(100vh-80px)] overflow-y-auto">
          {isLoading ? (
            <LoadingSkeleton type="card" count={4} />
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Sidebar Tabs */}
              <div className="w-full lg:w-64">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-0">
                    <nav className="space-y-1">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {renderContent()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
