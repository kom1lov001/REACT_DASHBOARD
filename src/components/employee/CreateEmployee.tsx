
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Upload, CalendarIcon, User, Briefcase, FileText, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const employeeSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  
  // Professional Information
  employeeId: z.string().min(1, "Employee ID is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  type: z.enum(["Office", "Remote", "Hybrid"]),
  joiningDate: z.date().optional(),
  workingDays: z.string().optional(),
  officeLocation: z.string().optional(),
  
  // Account Access
  emailAccess: z.string().email().optional(),
  slackId: z.string().optional(),
  githubId: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface CreateEmployeeProps {
  onEmployeeCreate: (employee: any) => void;
}

const CreateEmployee = ({ onEmployeeCreate }: CreateEmployeeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("personal");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [joiningDate, setJoiningDate] = useState<Date>();
  const [avatar, setAvatar] = useState("/placeholder.svg");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const firstName = watch("firstName") || "";
  const lastName = watch("lastName") || "";

  const onSubmit = async (data: EmployeeFormData) => {
    const newEmployee = {
      id: Date.now(),
      employeeId: data.employeeId,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      designation: data.designation,
      department: data.department,
      type: data.type,
      email: data.email,
      phone: data.phone,
      dateOfBirth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null,
      joiningDate: joiningDate ? format(joiningDate, "yyyy-MM-dd") : null,
      avatar: avatar,
      ...data,
    };

    onEmployeeCreate(newEmployee);
    toast.success("Employee created successfully!");
    setIsOpen(false);
    reset();
    setCurrentTab("personal");
    setDateOfBirth(undefined);
    setJoiningDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Employee</DialogTitle>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Access
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
              <TabsContent value="personal" className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>
                      {firstName[0]}{lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      {...register("firstName")}
                      placeholder="Enter first name"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      {...register("lastName")}
                      placeholder="Enter last name"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Enter email address"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Mobile Number *</Label>
                    <Input
                      {...register("phone")}
                      placeholder="Enter phone number"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1 dark:bg-gray-700 dark:border-gray-600",
                            !dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateOfBirth ? format(dateOfBirth, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Marital Status</Label>
                    <Select onValueChange={(value) => setValue("maritalStatus", value)}>
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <Select onValueChange={(value) => setValue("gender", value)}>
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Nationality</Label>
                    <Input
                      {...register("nationality")}
                      placeholder="Enter nationality"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Textarea
                    {...register("address")}
                    placeholder="Enter full address"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      {...register("city")}
                      placeholder="Enter city"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      {...register("state")}
                      placeholder="Enter state"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input
                      {...register("zipCode")}
                      placeholder="Enter ZIP code"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Employee ID *</Label>
                    <Input
                      {...register("employeeId")}
                      placeholder="Enter employee ID"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.employeeId && (
                      <p className="mt-1 text-sm text-destructive">{errors.employeeId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>User Name</Label>
                    <Input
                      value={`${firstName.toLowerCase()}.${lastName.toLowerCase()}`}
                      disabled
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <Label>Employee Type *</Label>
                    <Select onValueChange={(value) => setValue("type", value as "Office" | "Remote" | "Hybrid")}>
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select employee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-destructive">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Email Address</Label>
                    <Input
                      placeholder="Enter email address"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <Label>Department *</Label>
                    <Select onValueChange={(value) => setValue("department", value)}>
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="mt-1 text-sm text-destructive">{errors.department.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Designation *</Label>
                    <Input
                      {...register("designation")}
                      placeholder="Enter designation"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.designation && (
                      <p className="mt-1 text-sm text-destructive">{errors.designation.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Working Days</Label>
                    <Select onValueChange={(value) => setValue("workingDays", value)}>
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select working days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday-friday">Monday - Friday</SelectItem>
                        <SelectItem value="monday-saturday">Monday - Saturday</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Joining Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1 dark:bg-gray-700 dark:border-gray-600",
                            !joiningDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {joiningDate ? format(joiningDate, "PPP") : "Select joining date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={joiningDate}
                          onSelect={setJoiningDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Office Location</Label>
                    <Select onValueChange={(value) => setValue("officeLocation", value)}>
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select office location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="headquarters">Headquarters</SelectItem>
                        <SelectItem value="branch-1">Branch Office 1</SelectItem>
                        <SelectItem value="branch-2">Branch Office 2</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Upload Appointment Letter</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Drag & Drop or choose file to upload</p>
                      <p className="text-xs text-gray-400">Supported formats: .doc, pdf</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Upload Salary Slips</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Drag & Drop or choose file to upload</p>
                      <p className="text-xs text-gray-400">Supported formats: .doc, pdf</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Upload Reliving Letter</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Drag & Drop or choose file to upload</p>
                      <p className="text-xs text-gray-400">Supported formats: .doc, pdf</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Upload Experience Letter</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Drag & Drop or choose file to upload</p>
                      <p className="text-xs text-gray-400">Supported formats: .doc, pdf</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="access" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Enter Email Address</Label>
                    <Input
                      {...register("emailAccess")}
                      type="email"
                      placeholder="Enter email address"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <Label>Enter Slack ID</Label>
                    <Input
                      {...register("slackId")}
                      placeholder="Enter slack ID"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <Label>Enter Skype ID</Label>
                    <Input
                      placeholder="Enter skype ID"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <Label>Enter Github ID</Label>
                    <Input
                      {...register("githubId")}
                      placeholder="Enter github ID"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </TabsContent>
            </form>
          </ScrollArea>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (currentTab !== "personal") {
                  const tabs = ["personal", "professional", "documents", "access"];
                  const currentIndex = tabs.indexOf(currentTab);
                  setCurrentTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={currentTab === "personal"}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  reset();
                  setCurrentTab("personal");
                }}
              >
                Cancel
              </Button>

              {currentTab === "access" ? (
                <Button onClick={handleSubmit(onSubmit)}>
                  Add Employee
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    const tabs = ["personal", "professional", "documents", "access"];
                    const currentIndex = tabs.indexOf(currentTab);
                    setCurrentTab(tabs[currentIndex + 1]);
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployee;
