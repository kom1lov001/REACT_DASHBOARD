
import { useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Form schema for attendance
const attendanceSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  date: z.date(),
  checkInTime: z.string().min(1, "Check in time is required"),
  checkOutTime: z.string().min(1, "Check out time is required"),
  status: z.enum(["Present", "Absent", "Late", "Half Day"]),
  notes: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

// Mock attendance data
const attendanceEvents = [
  {
    id: 1,
    title: "John Doe - Present",
    start: new Date(2024, 5, 15, 9, 0),
    end: new Date(2024, 5, 15, 17, 0),
    resource: { status: "Present", employee: "John Doe" }
  },
  {
    id: 2,
    title: "Jane Smith - Late",
    start: new Date(2024, 5, 16, 10, 30),
    end: new Date(2024, 5, 16, 18, 30),
    resource: { status: "Late", employee: "Jane Smith" }
  },
  {
    id: 3,
    title: "Bob Johnson - Half Day",
    start: new Date(2024, 5, 17, 9, 0),
    end: new Date(2024, 5, 17, 13, 0),
    resource: { status: "Half Day", employee: "Bob Johnson" }
  },
];

const attendanceData = [
  { id: 1, name: "John Doe", date: "2024-06-15", checkIn: "09:00", checkOut: "17:00", status: "Present", hours: "8h" },
  { id: 2, name: "Jane Smith", date: "2024-06-16", checkIn: "10:30", checkOut: "18:30", status: "Late", hours: "8h" },
  { id: 3, name: "Bob Johnson", date: "2024-06-17", checkIn: "09:00", checkOut: "13:00", status: "Half Day", hours: "4h" },
  { id: 4, name: "Alice Brown", date: "2024-06-18", checkIn: "-", checkOut: "-", status: "Absent", hours: "0h" },
];

const Attendance = () => {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      employeeName: "",
      date: new Date(),
      checkInTime: "",
      checkOutTime: "",
      status: "Present",
      notes: "",
    },
  });

  const onSubmit = async (data: AttendanceFormData) => {
    console.log("New attendance data:", data);
    toast.success("Attendance record added successfully!");
    setIsAddDialogOpen(false);
    form.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Late": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Absent": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Half Day": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad';
    
    switch (event.resource?.status) {
      case 'Present':
        backgroundColor = '#10b981'; // green
        break;
      case 'Late':
        backgroundColor = '#f59e0b'; // yellow
        break;
      case 'Absent':
        backgroundColor = '#ef4444'; // red
        break;
      case 'Half Day':
        backgroundColor = '#3b82f6'; // blue
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40 hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="lg:hidden">
        <Sidebar />
      </div>
      
      <div className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30">
          <Header title="Attendance" subtitle="Track and manage employee attendance" />
        </div>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          <main className="p-4 lg:p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Present</p>
                        <p className="text-2xl font-bold text-green-600">85</p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Absent</p>
                        <p className="text-2xl font-bold text-red-600">12</p>
                      </div>
                      <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Late Arrivals</p>
                        <p className="text-2xl font-bold text-yellow-600">8</p>
                      </div>
                      <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Half Days</p>
                        <p className="text-2xl font-bold text-blue-600">5</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar and Controls */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <CardTitle>Attendance Calendar</CardTitle>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      <Select value={view} onValueChange={(value) => setView(value as View)}>
                        <SelectTrigger className="w-full lg:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                        </SelectContent>
                      </Select>

                      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full lg:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Attendance
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Attendance Record</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[70vh]">
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
                                <FormField
                                  control={form.control}
                                  name="employeeName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Employee Name</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select employee" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="john-doe">John Doe</SelectItem>
                                          <SelectItem value="jane-smith">Jane Smith</SelectItem>
                                          <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
                                          <SelectItem value="alice-brown">Alice Brown</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="date"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Date</FormLabel>
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
                                                <span>Select date</span>
                                              )}
                                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                          </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <ShadcnCalendar
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

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="checkInTime"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Check In Time</FormLabel>
                                        <FormControl>
                                          <Input {...field} type="time" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name="checkOutTime"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Check Out Time</FormLabel>
                                        <FormControl>
                                          <Input {...field} type="time" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={form.control}
                                  name="status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Status</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="Present">Present</SelectItem>
                                          <SelectItem value="Absent">Absent</SelectItem>
                                          <SelectItem value="Late">Late</SelectItem>
                                          <SelectItem value="Half Day">Half Day</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="notes"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Notes (Optional)</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Add any notes..." />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <div className="flex justify-end space-x-3 pt-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="submit">Add Record</Button>
                                </div>
                              </form>
                            </Form>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96 lg:h-[500px]">
                    <Calendar
                      localizer={localizer}
                      events={attendanceEvents}
                      startAccessor="start"
                      endAccessor="end"
                      view={view}
                      onView={setView}
                      date={date}
                      onNavigate={setDate}
                      eventPropGetter={eventStyleGetter}
                      className="attendance-calendar"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Attendance List */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 lg:p-4">Employee</th>
                          <th className="text-left p-2 lg:p-4">Date</th>
                          <th className="text-left p-2 lg:p-4 hidden md:table-cell">Check In</th>
                          <th className="text-left p-2 lg:p-4 hidden md:table-cell">Check Out</th>
                          <th className="text-left p-2 lg:p-4">Status</th>
                          <th className="text-left p-2 lg:p-4 hidden lg:table-cell">Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((record) => (
                          <tr key={record.id} className="border-b">
                            <td className="p-2 lg:p-4 font-medium">{record.name}</td>
                            <td className="p-2 lg:p-4 text-sm text-muted-foreground">{record.date}</td>
                            <td className="p-2 lg:p-4 text-sm hidden md:table-cell">{record.checkIn}</td>
                            <td className="p-2 lg:p-4 text-sm hidden md:table-cell">{record.checkOut}</td>
                            <td className="p-2 lg:p-4">
                              <Badge className={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                            </td>
                            <td className="p-2 lg:p-4 text-sm hidden lg:table-cell">{record.hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Attendance;
