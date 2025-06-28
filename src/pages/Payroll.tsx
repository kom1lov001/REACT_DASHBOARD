
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, DollarSign, Users, Calendar, TrendingUp, Edit, Eye } from "lucide-react";
import PayrollModalSkeleton from "@/components/employee/PayrollModalSkeleton";
import toast from "react-hot-toast";

const payrollData = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "Brooklyn Simmons",
    designation: "Project Manager",
    department: "Development",
    basicSalary: 75000,
    allowances: 5000,
    deductions: 2000,
    netSalary: 78000,
    status: "Paid",
    payDate: "2024-01-31"
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Savannah Nguyen",
    designation: "UI/UX Designer",
    department: "Design",
    basicSalary: 65000,
    allowances: 3000,
    deductions: 1500,
    netSalary: 66500,
    status: "Pending",
    payDate: "2024-01-31"
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Floyd Miles",
    designation: "Senior Developer",
    department: "Development",
    basicSalary: 85000,
    allowances: 7000,
    deductions: 3000,
    netSalary: 89000,
    status: "Paid",
    payDate: "2024-01-31"
  }
];

const Payroll = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredData = payrollData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || employee.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Total Employees",
      value: payrollData.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Payroll",
      value: `$${payrollData.reduce((sum, emp) => sum + emp.netSalary, 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Paid This Month",
      value: payrollData.filter(emp => emp.status === "Paid").length,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Average Salary",
      value: `$${Math.round(payrollData.reduce((sum, emp) => sum + emp.netSalary, 0) / payrollData.length).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const handleViewPayroll = (employee: any) => {
    setIsLoading(true);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleEditPayroll = (employee: any) => {
    setIsLoading(true);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    toast.success("Payroll editing mode enabled");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-30">
          <Header title="Payroll Management" subtitle="Manage employee payroll and salary information" />
        </div>
        
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Payroll Table */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Employee Payroll</CardTitle>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Process Payroll
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>${employee.basicSalary.toLocaleString()}</TableCell>
                      <TableCell>${employee.allowances.toLocaleString()}</TableCell>
                      <TableCell>${employee.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">${employee.netSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={employee.status === "Paid" ? "default" : "secondary"}
                          className={employee.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPayroll(employee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPayroll(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payroll Details Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {selectedEmployee ? `Payroll Details - ${selectedEmployee.name}` : "Payroll Details"}
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh] w-full">
                {isLoading ? (
                  <PayrollModalSkeleton />
                ) : selectedEmployee ? (
                  <div className="space-y-6 p-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Employee ID</Label>
                        <Input value={selectedEmployee.employeeId} readOnly />
                      </div>
                      <div>
                        <Label>Employee Name</Label>
                        <Input value={selectedEmployee.name} readOnly />
                      </div>
                      <div>
                        <Label>Designation</Label>
                        <Input value={selectedEmployee.designation} readOnly />
                      </div>
                      <div>
                        <Label>Department</Label>
                        <Input value={selectedEmployee.department} readOnly />
                      </div>
                      <div>
                        <Label>Pay Date</Label>
                        <Input value={selectedEmployee.payDate} readOnly />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Input value={selectedEmployee.status} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Salary Breakdown</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <Label className="text-blue-700 dark:text-blue-300">Basic Salary</Label>
                          <p className="text-xl font-bold text-blue-800 dark:text-blue-200">
                            ${selectedEmployee.basicSalary.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <Label className="text-green-700 dark:text-green-300">Allowances</Label>
                          <p className="text-xl font-bold text-green-800 dark:text-green-200">
                            +${selectedEmployee.allowances.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <Label className="text-red-700 dark:text-red-300">Deductions</Label>
                          <p className="text-xl font-bold text-red-800 dark:text-red-200">
                            -${selectedEmployee.deductions.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg col-span-3">
                          <Label className="text-purple-700 dark:text-purple-300">Net Salary</Label>
                          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                            ${selectedEmployee.netSalary.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </ScrollArea>
              
              {!isLoading && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Close
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Generate Payslip
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Payroll;
