
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Download, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Brooklyn Simmons",
      email: "brooklyn.s@example.com",
      phone: "(505) 555-0125",
      address: "2464 Royal Ln. Mesa, New Jersey",
      dateOfBirth: "Jul 14, 1995",
      nationality: "American",
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const attendanceData = [
    { date: "Jul 01, 2024", checkIn: "09:05 AM", checkOut: "06:00 PM", workingHours: "08:55 hrs", status: "Present" },
    { date: "Jul 02, 2024", checkIn: "09:30 AM", checkOut: "06:00 PM", workingHours: "08:30 hrs", status: "Present" },
    { date: "Jul 03, 2024", checkIn: "09:25 AM", checkOut: "06:00 PM", workingHours: "08:35 hrs", status: "Present" },
    { date: "Jul 04, 2024", checkIn: "09:00 AM", checkOut: "06:00 PM", workingHours: "09:00 hrs", status: "Present" },
    { date: "Jul 05, 2024", checkIn: "-", checkOut: "-", workingHours: "00:00 hrs", status: "Absent" },
  ];

  const projectsData = [
    { id: 1, name: "Language Discovery Panel", startDate: "Feb 15, 2023", endDate: "May 15, 2024", status: "Completed" },
    { id: 2, name: "Website - Development Project", startDate: "Feb 12, 2023", endDate: "April 30, 2024", status: "Completed" },
    { id: 3, name: "Integration Web Development", startDate: "April 01, 2024", endDate: "October 15, 2024", status: "In Progress" },
    { id: 4, name: "Workflow Ecommerce Platform", startDate: "May 12, 2024", endDate: "August 15, 2024", status: "In Progress" },
  ];

  const documentsData = [
    { id: 1, name: "Appointment Letter.pdf", type: "Appointment", uploadDate: "Jan 15, 2023" },
    { id: 2, name: "Salary Slip_June.pdf", type: "Salary Slip", uploadDate: "Jul 01, 2024" },
    { id: 3, name: "Relieving Letter.pdf", type: "Relieving", uploadDate: "Dec 20, 2023" },
    { id: 4, name: "Experience Letter.pdf", type: "Experience", uploadDate: "Nov 10, 2023" },
  ];

  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "professional", label: "Professional Information" },
    { id: "documents", label: "Documents" },
    { id: "attendance", label: "Attendance" },
    { id: "projects", label: "Projects" },
    { id: "account", label: "Account Access" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      disabled={!isEditing}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled={!isEditing}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground">Phone</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      disabled={!isEditing}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-foreground">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      {...register("dateOfBirth")}
                      disabled={!isEditing}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-destructive">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nationality" className="text-foreground">Nationality</Label>
                    <Input
                      id="nationality"
                      {...register("nationality")}
                      disabled={!isEditing}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.nationality && (
                      <p className="mt-1 text-sm text-destructive">{errors.nationality.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-foreground">Address</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      disabled={!isEditing}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <div className="flex space-x-3">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        );

      case "professional":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-foreground">Employee ID</Label>
                  <Input value="EMP-001" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <Label className="text-foreground">Department</Label>
                  <Input value="Development" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <Label className="text-foreground">Designation</Label>
                  <Input value="Project Manager" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <Label className="text-foreground">Joining Date</Label>
                  <Input value="July 15, 2022" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <Label className="text-foreground">Work Type</Label>
                  <Input value="Office" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <Label className="text-foreground">Employment Status</Label>
                  <Input value="Permanent" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "documents":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentsData.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">PDF</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.type} • Uploaded {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "attendance":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground">Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-600">
                      <th className="text-left py-3 px-4 text-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-foreground">Check In</th>
                      <th className="text-left py-3 px-4 text-foreground">Check Out</th>
                      <th className="text-left py-3 px-4 text-foreground">Working Hours</th>
                      <th className="text-left py-3 px-4 text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((record, index) => (
                      <tr key={index} className="border-b dark:border-gray-600">
                        <td className="py-3 px-4 text-foreground">{record.date}</td>
                        <td className="py-3 px-4 text-foreground">{record.checkIn}</td>
                        <td className="py-3 px-4 text-foreground">{record.checkOut}</td>
                        <td className="py-3 px-4 text-foreground">{record.workingHours}</td>
                        <td className="py-3 px-4">
                          <Badge variant={record.status === "Present" ? "default" : "destructive"}>
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );

      case "projects":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectsData.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.startDate} - {project.endDate}
                        </p>
                      </div>
                      <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "account":
        return (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground">Account Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-foreground">Username</Label>
                    <Input value="brooklyn_simmons" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <Label className="text-foreground">User Role</Label>
                    <Input value="Project Manager" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <Label className="text-foreground">Last Login</Label>
                    <Input value="Jul 10, 2024 09:30 AM" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <Label className="text-foreground">Account Status</Label>
                    <Input value="Active" disabled className="mt-1 dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>
                <div className="mt-6">
                  <Button>Change Password</Button>
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
      <Sidebar />
      <div className="flex-1">
        <Header title="Profile" subtitle="Employee Profile Information" />
        
        <main className="p-6">
          {isLoading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : (
            <div className="space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>BS</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl text-foreground">Brooklyn Simmons</CardTitle>
                        <p className="text-muted-foreground">Project Manager</p>
                        <p className="text-sm text-muted-foreground">brooklyn.s@example.com</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="flex gap-6">
                {/* Sidebar Tabs */}
                <div className="w-64">
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
