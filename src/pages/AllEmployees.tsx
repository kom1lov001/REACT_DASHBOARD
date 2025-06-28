import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Edit, Trash2, Eye, Users, Building, Award, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  avatar: string;
  joinDate: string;
  salary: string;
  status: "Active" | "Inactive" | "On Leave";
  employeeId: string;
};

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    position: "Software Engineer",
    department: "Information Technology",
    avatar: "/placeholder.svg",
    joinDate: "2023-01-15",
    salary: "$75,000",
    status: "Active",
    employeeId: "EMP001",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com", 
    phone: "+1 (555) 234-5678",
    position: "HR Manager",
    department: "Human Resources",
    avatar: "/placeholder.svg",
    joinDate: "2022-08-20",
    salary: "$85,000",
    status: "Active",
    employeeId: "EMP002",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 345-6789", 
    position: "Marketing Specialist",
    department: "Marketing & Sales",
    avatar: "/placeholder.svg",
    joinDate: "2023-03-10",
    salary: "$60,000",
    status: "On Leave",
    employeeId: "EMP003",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+1 (555) 456-7890",
    position: "Financial Analyst", 
    department: "Finance & Accounting",
    avatar: "/placeholder.svg",
    joinDate: "2022-11-05",
    salary: "$70,000",
    status: "Active",
    employeeId: "EMP004",
  },
];

const AllEmployees = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleViewEmployee = (id: string) => {
    navigate(`/employees/${id}`);
  };

  const handleEditEmployee = (id: string) => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    toast.success("Employee deleted successfully!");
  };

  const handleCreateEmployee = () => {
    navigate("/employees/create");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Inactive": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "On Leave": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const activeEmployees = employees.filter(emp => emp.status === "Active").length;
  const onLeaveEmployees = employees.filter(emp => emp.status === "On Leave").length;
  const uniqueDepartments = [...new Set(employees.map(emp => emp.department))].length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="sticky top-0 z-30">
          <Header title="Employees" subtitle="Employee Management & Directory" />
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
                        <p className="text-muted-foreground text-xs sm:text-sm">Total Employees</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{employees.length}</p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Active</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{activeEmployees}</p>
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
                        <p className="text-muted-foreground text-xs sm:text-sm">On Leave</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{onLeaveEmployees}</p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Departments</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{uniqueDepartments}</p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Employee List */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <CardTitle className="text-foreground text-lg sm:text-xl">All Employees</CardTitle>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search employees..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                          <SelectTrigger className="w-full sm:w-40 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Department" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="Information Technology">IT</SelectItem>
                            <SelectItem value="Human Resources">HR</SelectItem>
                            <SelectItem value="Marketing & Sales">Marketing</SelectItem>
                            <SelectItem value="Finance & Accounting">Finance</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-full sm:w-32 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleCreateEmployee} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Add Employee</span>
                        <span className="sm:hidden">Add</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {filteredEmployees.map((employee) => (
                      <div key={employee.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-6 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback className="text-sm">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                                {employee.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                                {employee.position}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                {employee.employeeId}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewEmployee(employee.id)}>
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee.id)}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className={`${getStatusColor(employee.status)} text-xs`}>
                              {employee.status}
                            </Badge>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {employee.salary}
                            </p>
                          </div>
                          
                          <div className="text-xs sm:text-sm">
                            <p className="text-gray-500 dark:text-gray-400">Department</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{employee.department}</p>
                          </div>
                          
                          <div className="text-xs sm:text-sm">
                            <p className="text-gray-500 dark:text-gray-400">Email</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{employee.email}</p>
                          </div>
                          
                          <div className="text-xs sm:text-sm">
                            <p className="text-gray-500 dark:text-gray-400">Join Date</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{employee.joinDate}</p>
                          </div>
                          
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-xs"
                              onClick={() => handleViewEmployee(employee.id)}
                            >
                              View Profile
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

export default AllEmployees;
