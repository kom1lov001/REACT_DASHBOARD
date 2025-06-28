
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Plus, Edit, Trash2, Calendar as CalendarIcon, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const leaveSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  leaveType: z.string().min(1, "Leave type is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  reason: z.string().min(1, "Reason is required"),
});

type LeaveFormData = z.infer<typeof leaveSchema>;

type Leave = {
  id: number;
  employeeName: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
  appliedDate: Date;
  avatar: string;
};

const leavesData: Leave[] = [
  {
    id: 1,
    employeeName: "Robert Fox",
    leaveType: "Sick Leave",
    startDate: new Date("2023-07-15"),
    endDate: new Date("2023-07-17"),
    reason: "Medical treatment",
    status: "Pending",
    appliedDate: new Date("2023-07-10"),
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    employeeName: "Jane Cooper",
    leaveType: "Annual Leave",
    startDate: new Date("2023-07-20"),
    endDate: new Date("2023-07-25"),
    reason: "Family vacation",
    status: "Approved",
    appliedDate: new Date("2023-07-12"),
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    employeeName: "Wade Warren",
    leaveType: "Emergency Leave",
    startDate: new Date("2023-07-18"),
    endDate: new Date("2023-07-19"),
    reason: "Family emergency",
    status: "Rejected",
    appliedDate: new Date("2023-07-17"),
    avatar: "/placeholder.svg",
  },
];

const Leaves = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaves, setLeaves] = useState<Leave[]>(leavesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    const matchesType = typeFilter === "all" || leave.leaveType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const onSubmit = async (data: LeaveFormData) => {
    if (editingLeave) {
      setLeaves(prev => prev.map(leave => 
        leave.id === editingLeave.id 
          ? {
              ...leave,
              employeeName: data.employeeName,
              leaveType: data.leaveType,
              startDate: data.startDate,
              endDate: data.endDate,
              reason: data.reason,
            }
          : leave
      ));
      toast.success("Leave updated successfully!");
    } else {
      const newLeave: Leave = {
        id: leaves.length + 1,
        employeeName: data.employeeName,
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        status: "Pending",
        appliedDate: new Date(),
        avatar: "/placeholder.svg",
      };
      setLeaves(prev => [...prev, newLeave]);
      toast.success("Leave request submitted successfully!");
    }
    
    setIsDialogOpen(false);
    setEditingLeave(null);
    setStartDate(undefined);
    setEndDate(undefined);
    reset();
  };

  const handleEdit = (leave: Leave) => {
    setEditingLeave(leave);
    setValue("employeeName", leave.employeeName);
    setValue("leaveType", leave.leaveType);
    setValue("startDate", leave.startDate);
    setValue("endDate", leave.endDate);
    setValue("reason", leave.reason);
    setStartDate(leave.startDate);
    setEndDate(leave.endDate);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setLeaves(prev => prev.filter(leave => leave.id !== id));
    toast.success("Leave request deleted successfully!");
  };

  const handleStatusChange = (id: number, status: string) => {
    setLeaves(prev => prev.map(leave => 
      leave.id === id ? { ...leave, status } : leave
    ));
    toast.success(`Leave request ${status.toLowerCase()} successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Header title="Leaves" subtitle="All Leave Requests" />
        
        <main className="p-6">
          {isLoading ? (
            <LoadingSkeleton type="table" count={8} />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Leave Requests</CardTitle>
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
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                        <SelectItem value="Emergency Leave">Emergency</SelectItem>
                        <SelectItem value="Maternity Leave">Maternity</SelectItem>
                      </SelectContent>
                    </Select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => { 
                          setEditingLeave(null); 
                          setStartDate(undefined); 
                          setEndDate(undefined); 
                          reset(); 
                        }}>
                          <Plus className="mr-2 h-4 w-4" />
                          Request Leave
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingLeave ? "Edit Leave Request" : "Request Leave"}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          <div>
                            <Input
                              {...register("employeeName")}
                              placeholder="Employee Name"
                              className="h-12"
                            />
                            {errors.employeeName && (
                              <p className="mt-1 text-sm text-destructive">{errors.employeeName.message}</p>
                            )}
                          </div>

                          <div>
                            <Select {...register("leaveType")}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Leave Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                                <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                                <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.leaveType && (
                              <p className="mt-1 text-sm text-destructive">{errors.leaveType.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full h-12 justify-start text-left font-normal",
                                      !startDate && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP") : "Start Date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => {
                                      setStartDate(date);
                                      if (date) setValue("startDate", date);
                                    }}
                                    className={cn("p-3 pointer-events-auto")}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              {errors.startDate && (
                                <p className="mt-1 text-sm text-destructive">{errors.startDate.message}</p>
                              )}
                            </div>

                            <div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full h-12 justify-start text-left font-normal",
                                      !endDate && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : "End Date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) => {
                                      setEndDate(date);
                                      if (date) setValue("endDate", date);
                                    }}
                                    className={cn("p-3 pointer-events-auto")}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              {errors.endDate && (
                                <p className="mt-1 text-sm text-destructive">{errors.endDate.message}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <Textarea
                              {...register("reason")}
                              placeholder="Reason for leave"
                              className="min-h-20"
                            />
                            {errors.reason && (
                              <p className="mt-1 text-sm text-destructive">{errors.reason.message}</p>
                            )}
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                setIsDialogOpen(false);
                                setEditingLeave(null);
                                setStartDate(undefined);
                                setEndDate(undefined);
                                reset();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" className="flex-1">
                              {editingLeave ? "Update" : "Submit"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Employee
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Leave Type
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Start Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          End Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Reason
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaves.map((leave) => (
                        <tr key={leave.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={leave.avatar} />
                                <AvatarFallback>
                                  {leave.employeeName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{leave.employeeName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm">{leave.leaveType}</td>
                          <td className="py-4 px-4 text-sm">{format(leave.startDate, "MMM dd, yyyy")}</td>
                          <td className="py-4 px-4 text-sm">{format(leave.endDate, "MMM dd, yyyy")}</td>
                          <td className="py-4 px-4 text-sm max-w-32 truncate">{leave.reason}</td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant="secondary" 
                              className={getStatusColor(leave.status)}
                            >
                              {leave.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {leave.status === "Pending" && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleStatusChange(leave.id, "Approved")}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleStatusChange(leave.id, "Rejected")}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(leave)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(leave.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredLeaves.length} of {leaves.length} leave requests
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Leaves;
