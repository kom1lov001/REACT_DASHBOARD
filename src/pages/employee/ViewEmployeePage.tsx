import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DocumentViewer from "@/components/employee/DocumentViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Download, Eye, FileText } from "lucide-react";

const mockEmployee = {
  id: 1,
  employeeId: "EMP-001",
  name: "Brooklyn Simmons",
  email: "brooklyn.s@example.com",
  phone: "(702) 555-0122",
  designation: "Project Manager",
  department: "Development",
  type: "Office",
  status: "Permanent",
  avatar: "/placeholder.svg",
  // Personal Information
  dateOfBirth: "July 14, 1995",
  gender: "Female",
  nationality: "American",
  maritalStatus: "Married",
  bloodGroup: "B+",
  address: "2464 Royal Ln. Mesa, New Jersey",
  city: "California",
  state: "United State",
  zipCode: "55824",
  // Professional Information
  username: "brooklyn_simmons",
  joiningDate: "July 10, 2022",
  workingDays: "5 Days",
  officeLocation: "2464 Royal Ln. Mesa, New Jersey",
  // Documents
  documents: [
    { name: "Appointment Letter.pdf", type: "PDF", category: "Appointment" },
    { name: "Salary Slip_June.pdf", type: "PDF", category: "Salary Slip" },
    { name: "Salary Slip_May.pdf", type: "PDF", category: "Salary Slip" },
    { name: "Salary Slip_April.pdf", type: "PDF", category: "Salary Slip" },
    { name: "Relieving Letter.pdf", type: "PDF", category: "Relieving" },
    { name: "Experience Letter.pdf", type: "PDF", category: "Experience" },
  ],
  // Account Access
  accountAccess: {
    emailAddress: "brooklyn.s@example.com",
    slackId: "brooklyn_simmons",
    skypeId: "brooklyn_simmons",
    githubId: "brooklyn_simmons"
  },
  // Attendance
  attendance: [
    { date: "July 01, 2023", checkIn: "09:28 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "09:02 Hrs", status: "On-time" },
    { date: "July 02, 2023", checkIn: "09:20 AM", checkOut: "07:00 PM", break: "00:20 Min", workingHours: "09:20 Hrs", status: "On-time" },
    { date: "July 03, 2023", checkIn: "09:25 AM", checkOut: "07:00 PM", break: "00:50 Min", workingHours: "09:05 Hrs", status: "On-time" },
    { date: "July 04, 2023", checkIn: "09:45 AM", checkOut: "07:00 PM", break: "00:40 Min", workingHours: "08:35 Hrs", status: "Late" },
    { date: "July 05, 2023", checkIn: "10:00 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "08:30 Hrs", status: "Late" },
    { date: "July 06, 2023", checkIn: "09:28 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "09:02 Hrs", status: "On-time" },
    { date: "July 07, 2023", checkIn: "09:30 AM", checkOut: "07:00 PM", break: "00:15 Min", workingHours: "09:15 Hrs", status: "On-time" },
    { date: "July 08, 2023", checkIn: "09:52 AM", checkOut: "07:00 PM", break: "00:45 Min", workingHours: "08:23 Hrs", status: "Late" },
    { date: "July 09, 2023", checkIn: "10:10 AM", checkOut: "07:00 PM", break: "00:30 Min", workingHours: "08:20 Hrs", status: "Late" },
    { date: "July 10, 2023", checkIn: "09:48 AM", checkOut: "07:00 PM", break: "00:45 Min", workingHours: "08:50 Hrs", status: "Late" },
  ],
  // Projects
  projects: [
    { id: 1, name: "Amongus - Discovery Phase", startDate: "Feb 01, 2023", endDate: "Mar 05, 2023", status: "Completed" },
    { id: 2, name: "Wildcare - Development Project", startDate: "Feb 12, 2023", endDate: "April 30, 2025", status: "Completed" },
    { id: 3, name: "Hingleton Web Development", startDate: "April 05, 2023", endDate: "October 05, 2025", status: "In Progress" },
    { id: 4, name: "Montllay Ecommerce Platform", startDate: "May 12, 2023", endDate: "August 12, 2025", status: "In Progress" },
  ],
  // Leaves
  leaves: [
    { date: "July 01, 2023", duration: "July 05 - July 08", days: "3 Days", reportingManager: "Mark Williams", status: "Pending" },
    { date: "Apr 05, 2023", duration: "Apr 06 - Apr 10", days: "4 Days", reportingManager: "Mark Williams", status: "Approved" },
    { date: "Mar 12, 2023", duration: "Mar 14 - Mar 16", days: "2 Days", reportingManager: "Mark Williams", status: "Approved" },
    { date: "Feb 01, 2023", duration: "Feb 02 - Feb 10", days: "8 Days", reportingManager: "Mark Williams", status: "Approved" },
    { date: "Jan 01, 2023", duration: "Jan 16 - Jan 19", days: "3 Days", reportingManager: "Mark Williams", status: "Reject" },
  ],
};

const ViewEmployeePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee] = useState(mockEmployee);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Permanent": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Contract": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "On-time": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Late": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Reject": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Office": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Remote": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const documentData = employee.documents.map((doc, index) => ({
    id: `doc-${index}`,
    name: doc.name,
    type: doc.type,
    category: doc.category,
    size: "1.2 MB",
    uploadDate: "2024-01-15"
  }));

  const handleDocumentPreview = (document: any) => {
    console.log("Previewing document:", document);
    // Implement preview logic here
  };

  const handleDocumentDownload = (document: any) => {
    console.log("Downloading document:", document);
    // Implement download logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1">
        <Header title={employee.name} subtitle={`All Employee > ${employee.name}`} />
        
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/employees")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                All Employees
              </Button>
              
              <Button
                onClick={() => navigate(`/employees/edit/${employee.id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Employee Header */}
            <Card className="dark:bg-gray-800 dark:border-gray-700 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback className="text-lg">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground">{employee.name}</h1>
                        <p className="text-muted-foreground">{employee.designation}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Navigation and Content */}
            <Tabs defaultValue="profile" className="space-y-6">
              {/* Left Sidebar Navigation */}
              <div className="flex gap-6">
                <div className="w-64">
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-0">
                      <TabsList className="h-auto bg-transparent flex flex-col items-stretch justify-start space-y-1 p-2">
                        <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          Profile
                        </TabsTrigger>
                        <TabsTrigger value="attendance" className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          Attendance
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          Projects
                        </TabsTrigger>
                        <TabsTrigger value="leave" className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          Leave
                        </TabsTrigger>
                      </TabsList>
                    </CardContent>
                  </Card>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  {/* Profile Tab */}
                  <TabsContent value="profile">
                    <Tabs defaultValue="personal" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
                        <TabsTrigger value="personal">Personal Information</TabsTrigger>
                        <TabsTrigger value="professional">Professional Information</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="account">Account Access</TabsTrigger>
                      </TabsList>

                      <TabsContent value="personal">
                        <Card className="dark:bg-gray-800 dark:border-gray-700">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">First Name</span>
                                  <p className="font-medium text-foreground">Brooklyn</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Mobile Number</span>
                                  <p className="font-medium text-foreground">{employee.phone}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                                  <p className="font-medium text-foreground">{employee.dateOfBirth}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Gender</span>
                                  <p className="font-medium text-foreground">{employee.gender}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Address</span>
                                  <p className="font-medium text-foreground">{employee.address}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">State</span>
                                  <p className="font-medium text-foreground">{employee.state}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">Last Name</span>
                                  <p className="font-medium text-foreground">Simmons</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Email Address</span>
                                  <p className="font-medium text-foreground">{employee.email}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Marital Status</span>
                                  <p className="font-medium text-foreground">{employee.maritalStatus}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Nationality</span>
                                  <p className="font-medium text-foreground">{employee.nationality}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">City</span>
                                  <p className="font-medium text-foreground">{employee.city}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Zip Code</span>
                                  <p className="font-medium text-foreground">{employee.zipCode}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="professional">
                        <Card className="dark:bg-gray-800 dark:border-gray-700">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">Employee ID</span>
                                  <p className="font-medium text-foreground">{employee.employeeId}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Employee Type</span>
                                  <Badge className={getTypeColor(employee.type)}>
                                    {employee.type}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Department</span>
                                  <p className="font-medium text-foreground">{employee.department}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Working Days</span>
                                  <p className="font-medium text-foreground">{employee.workingDays}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">User Name</span>
                                  <p className="font-medium text-foreground">{employee.username}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Email Address</span>
                                  <p className="font-medium text-foreground">{employee.email}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Designation</span>
                                  <p className="font-medium text-foreground">{employee.designation}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Joining Date</span>
                                  <p className="font-medium text-foreground">{employee.joiningDate}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <span className="text-sm text-muted-foreground">Office Location</span>
                              <p className="font-medium text-foreground">{employee.officeLocation}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="documents">
                        <Card className="dark:bg-gray-800 dark:border-gray-700">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg text-foreground flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Documents
                            </CardTitle>
                            <Button 
                              onClick={() => setIsDocumentViewerOpen(true)}
                              variant="outline"
                              size="sm"
                            >
                              View All Documents
                            </Button>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {employee.documents.slice(0, 4).map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                                      <span className="text-red-600 dark:text-red-300 text-sm font-medium">PDF</span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">{doc.category}</p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDocumentPreview({ id: index, ...doc })}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDocumentDownload({ id: index, ...doc })}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {employee.documents.length > 4 && (
                              <div className="text-center mt-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsDocumentViewerOpen(true)}
                                >
                                  View All {employee.documents.length} Documents
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="account">
                        <Card className="dark:bg-gray-800 dark:border-gray-700">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">Email Address</span>
                                  <p className="font-medium text-foreground">{employee.accountAccess.emailAddress}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Skype ID</span>
                                  <p className="font-medium text-foreground">{employee.accountAccess.skypeId}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">Slack ID</span>
                                  <p className="font-medium text-foreground">{employee.accountAccess.slackId}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Github ID</span>
                                  <p className="font-medium text-foreground">{employee.accountAccess.githubId}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  {/* Attendance Tab */}
                  <TabsContent value="attendance">
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b dark:border-gray-700">
                                <th className="text-left p-4 text-foreground">Date</th>
                                <th className="text-left p-4 text-foreground">Check In</th>
                                <th className="text-left p-4 text-foreground">Check Out</th>
                                <th className="text-left p-4 text-foreground">Break</th>
                                <th className="text-left p-4 text-foreground">Working Hours</th>
                                <th className="text-left p-4 text-foreground">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {employee.attendance.map((record, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                  <td className="p-4 text-sm text-foreground">{record.date}</td>
                                  <td className="p-4 text-sm text-foreground">{record.checkIn}</td>
                                  <td className="p-4 text-sm text-foreground">{record.checkOut}</td>
                                  <td className="p-4 text-sm text-foreground">{record.break}</td>
                                  <td className="p-4 text-sm text-foreground">{record.workingHours}</td>
                                  <td className="p-4">
                                    <Badge className={getStatusColor(record.status)}>
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
                  </TabsContent>

                  {/* Projects Tab */}
                  <TabsContent value="projects">
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b dark:border-gray-700">
                                <th className="text-left p-4 text-foreground">Sr. No.</th>
                                <th className="text-left p-4 text-foreground">Project Name</th>
                                <th className="text-left p-4 text-foreground">Start Date</th>
                                <th className="text-left p-4 text-foreground">Finish Date</th>
                                <th className="text-left p-4 text-foreground">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {employee.projects.map((project, index) => (
                                <tr key={project.id} className="border-b dark:border-gray-700">
                                  <td className="p-4 text-foreground">{index + 1}</td>
                                  <td className="p-4 font-medium text-foreground">{project.name}</td>
                                  <td className="p-4 text-sm text-foreground">{project.startDate}</td>
                                  <td className="p-4 text-sm text-foreground">{project.endDate}</td>
                                  <td className="p-4">
                                    <Badge className={getStatusColor(project.status)}>
                                      {project.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Leave Tab */}
                  <TabsContent value="leave">
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b dark:border-gray-700">
                                <th className="text-left p-4 text-foreground">Date</th>
                                <th className="text-left p-4 text-foreground">Duration</th>
                                <th className="text-left p-4 text-foreground">Days</th>
                                <th className="text-left p-4 text-foreground">Reporting Manager</th>
                                <th className="text-left p-4 text-foreground">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {employee.leaves.map((leave, index) => (
                                <tr key={index} className="border-b dark:border-gray-700">
                                  <td className="p-4 text-sm text-foreground">{leave.date}</td>
                                  <td className="p-4 text-sm text-foreground">{leave.duration}</td>
                                  <td className="p-4 text-sm text-foreground">{leave.days}</td>
                                  <td className="p-4 text-sm text-foreground">{leave.reportingManager}</td>
                                  <td className="p-4">
                                    <Badge className={getStatusColor(leave.status)}>
                                      {leave.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </main>

        {/* Document Viewer Modal */}
        <DocumentViewer
          documents={documentData}
          isOpen={isDocumentViewerOpen}
          onClose={() => setIsDocumentViewerOpen(false)}
          onPreview={handleDocumentPreview}
          onDownload={handleDocumentDownload}
          isEditable={false}
        />
      </div>
    </div>
  );
};

export default ViewEmployeePage;
