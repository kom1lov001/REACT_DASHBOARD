import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Bell, Moon, Sun, Settings, User, LogOut, Users, Building2, Calendar, DollarSign, Briefcase, FolderOpen, CheckSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const notifications = [
  {
    id: 1,
    title: "New Employee Joined",
    message: "John Doe has joined the Development team",
    time: "5 minutes ago",
    type: "info",
    read: false
  },
  {
    id: 2,
    title: "Leave Request",
    message: "Sarah Wilson requested 3 days leave",
    time: "2 hours ago",
    type: "warning",
    read: false
  },
  {
    id: 3,
    title: "Payroll Processed",
    message: "Monthly payroll has been processed successfully",
    time: "1 day ago",
    type: "success",
    read: true
  },
  {
    id: 4,
    title: "Meeting Reminder",
    message: "Team standup in 30 minutes",
    time: "3 hours ago",
    type: "info",
    read: false
  },
  {
    id: 5,
    title: "Performance Review Due",
    message: "Complete performance reviews for Q4",
    time: "2 days ago",
    type: "warning",
    read: true
  },
];

const searchItems = [
  { title: "Dashboard", url: "/dashboard", icon: Building2 },
  { title: "All Employees", url: "/employees", icon: Users },
  { title: "All Departments", url: "/departments", icon: Building2 },
  { title: "Attendance", url: "/attendance", icon: Calendar },
  { title: "Payroll", url: "/payroll", icon: DollarSign },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];

const Header = ({ title, subtitle }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast.success(`${darkMode ? 'Light' : 'Dark'} mode enabled`);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearch = (url: string) => {
    navigate(url);
    setSearchOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-border p-4 lg:p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-sm lg:text-base truncate">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4 ml-4">
          {/* Search Dialog - Hidden on mobile */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search documentation..."
                  className="pl-10 w-60 lg:w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-pointer text-sm"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 items-center space-x-1 hidden lg:flex">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                    Ctrl
                  </kbd>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                    K
                  </kbd>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="p-0 max-w-2xl">
              <DialogHeader className="px-4 py-3 border-b">
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <Command className="rounded-lg border-none shadow-none">
                <CommandInput placeholder="Type to search..." />
                <ScrollArea className="h-80">
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                      {searchItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <CommandItem
                            key={item.url}
                            onSelect={() => handleSearch(item.url)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </ScrollArea>
              </Command>
            </DialogContent>
          </Dialog>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-4 w-4 lg:h-5 lg:w-5" /> : <Moon className="h-4 w-4 lg:h-5 lg:w-5" />}
          </Button>
          
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 lg:w-80">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-sm lg:text-base">Notifications</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">{unreadCount} unread notifications</p>
              </div>
              <ScrollArea className="max-h-80 lg:max-h-96">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 space-y-1">
                    <div className="flex items-center space-x-2 w-full">
                      <span className="text-sm lg:text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-xs lg:text-sm truncate">{notification.title}</p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <span className="text-sm text-primary cursor-pointer">View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer">
                <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs lg:text-sm">RA</AvatarFallback>
                </Avatar>
                <div className="text-sm hidden lg:block">
                  <div className="font-medium">Robert Allen</div>
                  <div className="text-muted-foreground">HR Manager</div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 lg:w-56">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
