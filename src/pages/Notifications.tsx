
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal } from "lucide-react";

const notificationsData = [
  {
    id: 1,
    type: "Leave Request",
    message: "Robert Fox has applied for leave",
    time: "Just Now",
    avatar: "/placeholder.svg",
    read: false,
    sender: "Robert Fox",
  },
  {
    id: 2,
    type: "Check In Issue",
    message: "Admin logged a message regarding check in issue",
    time: "11:16 AM",
    avatar: "/placeholder.svg",
    read: false,
    sender: "Admin",
  },
  {
    id: 3,
    type: "Job Application",
    message: "Sathana Watson has applied for job.",
    time: "09:00 AM",
    avatar: "/placeholder.svg",
    read: true,
    sender: "Sathana Watson",
  },
  {
    id: 4,
    type: "Feedback",
    message: "Robert Fox has share his feedback",
    time: "Yesterday",
    avatar: "/placeholder.svg",
    read: true,
    sender: "Robert Fox",
  },
  {
    id: 5,
    type: "Password Update",
    message: "Your password has been updated successfully",
    time: "Yesterday",
    avatar: "/placeholder.svg",
    read: true,
    sender: "System",
  },
];

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(notificationsData);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotifications = notifications.filter(notification =>
    notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Leave Request": return "bg-blue-100 text-blue-700";
      case "Check In Issue": return "bg-red-100 text-red-700";
      case "Job Application": return "bg-green-100 text-green-700";
      case "Feedback": return "bg-purple-100 text-purple-700";
      case "Password Update": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Header title="Notifications" subtitle="All Notifications" />
        
        <main className="p-6">
          {isLoading ? (
            <LoadingSkeleton type="card" count={6} />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notifications</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" onClick={markAllAsRead}>
                      Mark All as Read
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        notification.read 
                          ? "bg-white border-gray-200" 
                          : "bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              {notification.sender.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge 
                                variant="secondary" 
                                className={getTypeColor(notification.type)}
                              >
                                {notification.type}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm ${
                              notification.read ? "text-gray-600" : "text-gray-900 font-medium"
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No notifications found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Notifications;
