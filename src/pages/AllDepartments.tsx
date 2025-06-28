import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Edit, Trash2, Users, Building, Award, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().min(1, "Description is required"),
  head: z.string().min(1, "Department head is required"),
  location: z.string().min(1, "Location is required"),
  budget: z.string().min(1, "Budget is required"),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

type Department = {
  id: string;
  name: string;
  description: string;
  head: string;
  headAvatar: string;
  employeeCount: number;
  location: string;
  budget: string;
  established: string;
  status: "Active" | "Inactive";
};

const initialDepartments: Department[] = [
  {
    id: "1",
    name: "Human Resources",
    description: "Manages employee relations, recruitment, and organizational development",
    head: "Sarah Johnson",
    headAvatar: "/placeholder.svg",
    employeeCount: 15,
    location: "Floor 3, Building A",
    budget: "$250,000",
    established: "2020-01-15",
    status: "Active",
  },
  {
    id: "2", 
    name: "Information Technology",
    description: "Handles all technical infrastructure, software development, and IT support",
    head: "Michael Chen",
    headAvatar: "/placeholder.svg",
    employeeCount: 28,
    location: "Floor 5, Building B",
    budget: "$450,000",
    established: "2019-03-10",
    status: "Active",
  },
  {
    id: "3",
    name: "Marketing & Sales",
    description: "Drives business growth through marketing campaigns and sales strategies",
    head: "Emily Rodriguez",
    headAvatar: "/placeholder.svg",
    employeeCount: 22,
    location: "Floor 2, Building A",
    budget: "$320,000",
    established: "2020-06-20",
    status: "Active",
  },
  {
    id: "4",
    name: "Finance & Accounting",
    description: "Manages financial planning, budgeting, and accounting operations",
    head: "David Wilson",
    headAvatar: "/placeholder.svg",
    employeeCount: 12,
    location: "Floor 4, Building A",
    budget: "$180,000",
    established: "2019-11-05",
    status: "Active",
  },
];

const AllDepartments = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || department.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const onSubmit = async (data: DepartmentFormData) => {
    if (editingDepartment) {
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDepartment.id 
          ? {
              ...dept,
              name: data.name,
              description: data.description,
              head: data.head,
              location: data.location,
              budget: data.budget,
            }
          : dept
      ));
      toast.success("Department updated successfully!");
    } else {
      const newDepartment: Department = {
        id: (departments.length + 1).toString(),
        name: data.name,
        description: data.description,
        head: data.head,
        headAvatar: "/placeholder.svg",
        location: data.location,
        budget: data.budget,
        employeeCount: 0,
        established: new Date().toISOString().split('T')[0],
        status: "Active",
      };
      setDepartments(prev => [...prev, newDepartment]);
      toast.success("Department created successfully!");
    }
    
    setIsDialogOpen(false);
    setEditingDepartment(null);
    reset();
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setValue("name", department.name);
    setValue("description", department.description);
    setValue("head", department.head);
    setValue("location", department.location);
    setValue("budget", department.budget);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
    toast.success("Department deleted successfully!");
  };

  const handleViewDepartment = (id: string) => {
    navigate(`/departments/${id}`);
  };

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  const activeDepartments = departments.filter(dept => dept.status === "Active").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="sticky top-0 z-30">
          <Header title="Departments" subtitle="Department Management & Overview" />
        </div>
        
        <main className="p-3 sm:p-4 lg:p-6 max-h-[calc(100vh-80px)] overflow-y-auto">
          {isLoading ? (
            <LoadingSkeleton type="card" count={4} />
          ) : (
            <div className="space-y-4 lg:space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Total Departments</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{departments.length}</p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Active Departments</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{activeDepartments}</p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Award className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Total Employees</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{totalEmployees}</p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Avg Department Size</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">
                          {departments.length > 0 ? Math.round(totalEmployees / departments.length) : 0}
                        </p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Department List */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <CardTitle className="text-foreground text-lg sm:text-xl">All Departments</CardTitle>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search departments..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-32 dark:bg-gray-700 dark:border-gray-600">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>

                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => { setEditingDepartment(null); reset(); }} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Add Department</span>
                            <span className="sm:hidden">Add</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700 mx-4">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">
                              {editingDepartment ? "Edit Department" : "Add New Department"}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                              <Input
                                {...register("name")}
                                placeholder="Department Name"
                                className="h-12 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {errors.name && (
                                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                              )}
                            </div>

                            <div>
                              <Input
                                {...register("description")}
                                placeholder="Department Description"
                                className="h-12 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {errors.description && (
                                <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Input
                                  {...register("head")}
                                  placeholder="Department Head"
                                  className="h-12 dark:bg-gray-700 dark:border-gray-600"
                                />
                                {errors.head && (
                                  <p className="mt-1 text-sm text-destructive">{errors.head.message}</p>
                                )}
                              </div>

                              <div>
                                <Input
                                  {...register("location")}
                                  placeholder="Location"
                                  className="h-12 dark:bg-gray-700 dark:border-gray-600"
                                />
                                {errors.location && (
                                  <p className="mt-1 text-sm text-destructive">{errors.location.message}</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <Input
                                {...register("budget")}
                                placeholder="Budget (e.g., $250,000)"
                                className="h-12 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {errors.budget && (
                                <p className="mt-1 text-sm text-destructive">{errors.budget.message}</p>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => {
                                  setIsDialogOpen(false);
                                  setEditingDepartment(null);
                                  reset();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" className="flex-1">
                                {editingDepartment ? "Update" : "Create"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {filteredDepartments.map((department) => (
                      <div key={department.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-6 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                {department.name}
                              </h4>
                              <Badge 
                                className={department.status === "Active" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                }
                              >
                                {department.status}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                              {department.description}
                            </p>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(department)}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(department.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                <AvatarImage src={department.headAvatar} />
                                <AvatarFallback className="text-xs sm:text-sm">
                                  {department.head.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{department.head}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Department Head</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Employees</p>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{department.employeeCount}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Budget</p>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{department.budget}</p>
                            </div>
                          </div>
                          
                          <div className="text-xs sm:text-sm">
                            <p className="text-gray-500 dark:text-gray-400">Location</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{department.location}</p>
                          </div>
                          
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-xs"
                              onClick={() => handleViewDepartment(department.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllDepartments;
