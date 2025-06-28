import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DocumentUpload from "@/components/employee/DocumentUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Upload, CalendarIcon, User, Briefcase, FileText, Key } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  emailAddress: z.string().email("Valid email is required"),
  dateOfBirth: z.date().optional(),
  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  employeeId: z.string().min(1, "Employee ID is required"),
  userName: z.string().min(1, "User name is required"),
  employeeType: z.string().min(1, "Employee type is required"),
  emailAddressPro: z.string().email().optional(),
  department: z.string().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required"),
  workingDays: z.string().optional(),
  joiningDate: z.date().optional(),
  officeLocation: z.string().optional(),
  emailAccess: z.string().email().optional(),
  slackId: z.string().optional(),
  skypeId: z.string().optional(),
  githubId: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

// Mock employee data for edit mode
const mockEmployee = {
  id: 1,
  firstName: "Brooklyn",
  lastName: "Simmons",
  mobileNumber: "(505) 555-0125",
  emailAddress: "brooklyn.s@example.com",
  dateOfBirth: new Date("1990-05-15"),
  maritalStatus: "single",
  gender: "female",
  nationality: "american",
  address: "123 Main St, New York, NY 10001",
  city: "tashkent",
  state: "tashkent",
  zipCode: "100000",
  employeeId: "EMP001",
  userName: "brooklyn.simmons",
  employeeType: "permanent",
  emailAddressPro: "brooklyn@company.com",
  department: "development",
  designation: "Project Manager",
  workingDays: "monday-friday",
  joiningDate: new Date("2020-01-15"),
  officeLocation: "headquarters",
  emailAccess: "brooklyn@company.com",
  slackId: "brooklyn.simmons",
  skypeId: "brooklyn.simmons",
  githubId: "brooklyn-simmons",
  avatar: "/placeholder.svg"
};

const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  const [currentTab, setCurrentTab] = useState("personal");
  const [avatar, setAvatar] = useState("/placeholder.svg");
  const [documentFiles, setDocumentFiles] = useState<Record<string, any[]>>({});

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: isEditMode ? {
      firstName: mockEmployee.firstName,
      lastName: mockEmployee.lastName,
      mobileNumber: mockEmployee.mobileNumber,
      emailAddress: mockEmployee.emailAddress,
      dateOfBirth: mockEmployee.dateOfBirth,
      maritalStatus: mockEmployee.maritalStatus,
      gender: mockEmployee.gender,
      nationality: mockEmployee.nationality,
      address: mockEmployee.address,
      city: mockEmployee.city,
      state: mockEmployee.state,
      zipCode: mockEmployee.zipCode,
      employeeId: mockEmployee.employeeId,
      userName: mockEmployee.userName,
      employeeType: mockEmployee.employeeType,
      emailAddressPro: mockEmployee.emailAddressPro,
      department: mockEmployee.department,
      designation: mockEmployee.designation,
      workingDays: mockEmployee.workingDays,
      joiningDate: mockEmployee.joiningDate,
      officeLocation: mockEmployee.officeLocation,
      emailAccess: mockEmployee.emailAccess,
      slackId: mockEmployee.slackId,
      skypeId: mockEmployee.skypeId,
      githubId: mockEmployee.githubId,
    } : {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      emailAddress: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      employeeId: "",
      userName: "",
      employeeType: "",
      emailAddressPro: "",
      department: "",
      designation: "",
      workingDays: "",
      officeLocation: "",
      emailAccess: "",
      slackId: "",
      skypeId: "",
      githubId: "",
    },
  });

  const firstName = form.watch("firstName") || "";
  const lastName = form.watch("lastName") || "";

  useEffect(() => {
    if (isEditMode) {
      setAvatar(mockEmployee.avatar);
    }
  }, [isEditMode]);

  const handleDocumentFilesChange = (category: string, files: any[]) => {
    setDocumentFiles(prev => ({
      ...prev,
      [category]: files
    }));
  };

  const onSubmit = async (data: EmployeeFormData) => {
    console.log(isEditMode ? "Updated employee data:" : "New employee data:", data);
    console.log("Uploaded documents:", documentFiles);
    toast.success(isEditMode ? "Employee updated successfully!" : "Employee created successfully!");
    navigate("/employees");
  };

  const handleNext = () => {
    const tabs = ["personal", "professional", "documents", "access"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabs = ["personal", "professional", "documents", "access"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40 hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar overlay */}
      <div className="lg:hidden">
        <Sidebar />
      </div>
      
      <div className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30">
          <Header 
            title={isEditMode ? "Edit Employee" : "Add New Employee"} 
            subtitle={isEditMode ? `Editing ${mockEmployee.firstName} ${mockEmployee.lastName}` : "All Employees > Add New Employee"} 
          />
        </div>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          <main className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/employees")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Employees
                </Button>
              </div>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 lg:p-6">
                  <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                      <TabsTrigger value="personal" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                        <User className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span className="hidden sm:inline">Personal</span>
                        <span className="sm:hidden">Info</span>
                      </TabsTrigger>
                      <TabsTrigger value="professional" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                        <Briefcase className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span className="hidden sm:inline">Professional</span>
                        <span className="sm:hidden">Work</span>
                      </TabsTrigger>
                      <TabsTrigger value="documents" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                        <FileText className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span className="hidden sm:inline">Documents</span>
                        <span className="sm:hidden">Docs</span>
                      </TabsTrigger>
                      <TabsTrigger value="access" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                        <Key className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span className="hidden sm:inline">Access</span>
                        <span className="sm:hidden">Access</span>
                      </TabsTrigger>
                    </TabsList>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <TabsContent value="personal" className="space-y-6">
                          {/* Avatar Upload */}
                          <div className="flex items-center justify-center mb-8">
                            <div className="relative">
                              <Avatar className="h-16 w-16 lg:h-24 lg:w-24">
                                <AvatarImage src={avatar} />
                                <AvatarFallback className="text-lg lg:text-2xl">
                                  {firstName[0]}{lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs"
                                onClick={() => {/* Handle avatar upload */}}
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                            </div>
                          </div>

                          {/* Personal Information Form */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="First Name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Last Name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="mobileNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mobile Number</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Mobile Number" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="emailAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="Email Address" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="dateOfBirth"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date of Birth</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Date of Birth</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        initialFocus
                                        className="p-3 pointer-events-auto"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="maritalStatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Marital Status</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Marital Status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="single">Single</SelectItem>
                                      <SelectItem value="married">Married</SelectItem>
                                      <SelectItem value="divorced">Divorced</SelectItem>
                                      <SelectItem value="widowed">Widowed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">Female</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="nationality"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nationality</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Nationality" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="uzbek">Uzbek</SelectItem>
                                      <SelectItem value="russian">Russian</SelectItem>
                                      <SelectItem value="american">American</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Address" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="City" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="tashkent">Tashkent</SelectItem>
                                      <SelectItem value="samarkand">Samarkand</SelectItem>
                                      <SelectItem value="bukhara">Bukhara</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="State" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="tashkent">Tashkent</SelectItem>
                                      <SelectItem value="samarkand">Samarkand</SelectItem>
                                      <SelectItem value="bukhara">Bukhara</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP Code</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="ZIP Code" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="100000">100000</SelectItem>
                                      <SelectItem value="100001">100001</SelectItem>
                                      <SelectItem value="100002">100002</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="professional" className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="employeeId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employee ID</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Employee ID" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="userName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>User Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="User Name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="employeeType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Select Employee Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Employee Type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="permanent">Permanent</SelectItem>
                                      <SelectItem value="contract">Contract</SelectItem>
                                      <SelectItem value="intern">Intern</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="emailAddressPro"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="Email Address" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="department"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Select Department</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Department" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="development">Development</SelectItem>
                                      <SelectItem value="design">Design</SelectItem>
                                      <SelectItem value="marketing">Marketing</SelectItem>
                                      <SelectItem value="sales">Sales</SelectItem>
                                      <SelectItem value="hr">HR</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="designation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Enter Designation</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter Designation" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="workingDays"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Select Working Days</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Working Days" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="monday-friday">Monday - Friday</SelectItem>
                                      <SelectItem value="monday-saturday">Monday - Saturday</SelectItem>
                                      <SelectItem value="flexible">Flexible</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="joiningDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Select Joining Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Select Joining Date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                        className="p-3 pointer-events-auto"
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="officeLocation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Select Office Location</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Office Location" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="headquarters">Headquarters</SelectItem>
                                      <SelectItem value="branch-1">Branch Office 1</SelectItem>
                                      <SelectItem value="branch-2">Branch Office 2</SelectItem>
                                      <SelectItem value="remote">Remote</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DocumentUpload
                              category="Appointment Letter"
                              title="Upload Appointment Letter"
                              acceptedTypes=".doc,.docx,.pdf"
                              onFilesChange={(files) => handleDocumentFilesChange("appointment", files)}
                            />

                            <DocumentUpload
                              category="Salary Slip"
                              title="Upload Salary Slips"
                              acceptedTypes=".doc,.docx,.pdf"
                              onFilesChange={(files) => handleDocumentFilesChange("salary", files)}
                            />

                            <DocumentUpload
                              category="Relieving Letter"
                              title="Upload Relieving Letter"
                              acceptedTypes=".doc,.docx,.pdf"
                              onFilesChange={(files) => handleDocumentFilesChange("relieving", files)}
                            />

                            <DocumentUpload
                              category="Experience Letter"
                              title="Upload Experience Letter"
                              acceptedTypes=".doc,.docx,.pdf"
                              onFilesChange={(files) => handleDocumentFilesChange("experience", files)}
                            />

                            <DocumentUpload
                              category="ID Card"
                              title="Upload ID Card"
                              acceptedTypes=".jpg,.jpeg,.png,.pdf"
                              onFilesChange={(files) => handleDocumentFilesChange("id", files)}
                            />

                            <DocumentUpload
                              category="Other"
                              title="Upload Other Documents"
                              acceptedTypes=".doc,.docx,.pdf,.jpg,.jpeg,.png"
                              onFilesChange={(files) => handleDocumentFilesChange("other", files)}
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="access" className="space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="emailAccess"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Enter Email Address</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="Enter Email Address" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="slackId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Enter Slack ID</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter Slack ID" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="skypeId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Enter Skype ID</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter Skype ID" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="githubId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Enter GitHub ID</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter GitHub ID" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TabsContent>

                        {/* Navigation Buttons */}
                        <div className="flex flex-col lg:flex-row justify-between pt-6 border-t gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentTab === "personal"}
                            className="order-2 lg:order-1"
                          >
                            Previous
                          </Button>

                          <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 order-1 lg:order-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => navigate("/employees")}
                              className="w-full lg:w-auto"
                            >
                              Cancel
                            </Button>

                            {currentTab === "access" ? (
                              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 w-full lg:w-auto">
                                {isEditMode ? "Update" : "Add"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={handleNext}
                                className="bg-purple-600 hover:bg-purple-700 w-full lg:w-auto"
                              >
                                Next
                              </Button>
                            )}
                          </div>
                        </div>
                      </form>
                    </Form>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CreateEmployeePage;
