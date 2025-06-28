
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Plus, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const holidaySchema = z.object({
  name: z.string().min(1, "Holiday name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
});

type HolidayFormData = z.infer<typeof holidaySchema>;

const holidaysData = [
  {
    id: 1,
    name: "New Year",
    date: new Date("2023-01-01"),
    day: "Sunday",
    type: "Upcoming",
  },
  {
    id: 2,
    name: "International Programmers' Day",
    date: new Date("2023-01-07"),
    day: "Saturday",
    type: "Upcoming",
  },
  {
    id: 3,
    name: "World Cancer Day",
    date: new Date("2023-02-04"),
    day: "Saturday",
    type: "Upcoming",
  },
  {
    id: 4,
    name: "April Fool Day",
    date: new Date("2023-04-01"),
    day: "Saturday",
    type: "Upcoming",
  },
];

const Holidays = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [holidays, setHolidays] = useState(holidaysData);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
  });

  const watchDate = watch("date");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredHolidays = holidays.filter(holiday => {
    const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || holiday.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const onSubmit = async (data: HolidayFormData) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = dayNames[data.date.getDay()];
    
    if (editingHoliday) {
      setHolidays(prev => prev.map(holiday => 
        holiday.id === editingHoliday.id 
          ? { ...holiday, name: data.name, date: data.date, day }
          : holiday
      ));
      toast.success("Holiday updated successfully!");
    } else {
      const newHoliday = {
        id: holidays.length + 1,
        name: data.name,
        date: data.date,
        day,
        type: "Upcoming",
      };
      setHolidays(prev => [...prev, newHoliday]);
      toast.success("Holiday added successfully!");
    }
    
    setIsDialogOpen(false);
    setEditingHoliday(null);
    setSelectedDate(undefined);
    reset();
  };

  const handleEdit = (holiday: any) => {
    setEditingHoliday(holiday);
    setValue("name", holiday.name);
    setValue("date", holiday.date);
    setSelectedDate(holiday.date);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setHolidays(prev => prev.filter(holiday => holiday.id !== id));
    toast.success("Holiday deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Header title="Holidays" subtitle="All Holiday List" />
        
        <main className="p-6">
          {isLoading ? (
            <LoadingSkeleton type="table" count={8} />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>26 Holiday</CardTitle>
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

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditingHoliday(null); setSelectedDate(undefined); reset(); }}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Holiday
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          <div>
                            <Input
                              {...register("name")}
                              placeholder="Holiday Name"
                              className="h-12"
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                            )}
                          </div>

                          <div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full h-12 justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={(date) => {
                                    setSelectedDate(date);
                                    if (date) setValue("date", date);
                                  }}
                                  className={cn("p-3 pointer-events-auto")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {errors.date && (
                              <p className="mt-1 text-sm text-destructive">{errors.date.message}</p>
                            )}
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                setIsDialogOpen(false);
                                setEditingHoliday(null);
                                setSelectedDate(undefined);
                                reset();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" className="flex-1">
                              {editingHoliday ? "Update" : "Add"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <Button 
                    variant={typeFilter === "all" ? "default" : "outline"}
                    onClick={() => setTypeFilter("all")}
                    className="text-sm"
                  >
                    All Holidays
                  </Button>
                  <Button 
                    variant={typeFilter === "Upcoming" ? "default" : "outline"}
                    onClick={() => setTypeFilter("Upcoming")}
                    className="text-sm"
                  >
                    • Upcoming
                  </Button>
                  <Button 
                    variant={typeFilter === "Past" ? "default" : "outline"}
                    onClick={() => setTypeFilter("Past")}
                    className="text-sm"
                  >
                    Past Holidays
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Day
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Holiday Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHolidays.map((holiday) => (
                        <tr key={holiday.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm">
                            {format(holiday.date, "MMMM dd, yyyy")}
                          </td>
                          <td className="py-4 px-4 text-sm">{holiday.day}</td>
                          <td className="py-4 px-4 text-sm font-medium">{holiday.name}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(holiday)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(holiday.id)}
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
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Holidays;
