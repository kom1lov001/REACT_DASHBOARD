
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus } from "lucide-react";

const departmentEmployees = {
  design: [
    {
      id: "345321251",
      name: "Darlene Robertson", 
      designation: "Lead UI/UX Designer",
      type: "Office",
      status: "Permanent",
      avatar: "/placeholder.svg",
    },
    {
      id: "987890345",
      name: "Floyd Miles",
      designation: "Lead UI/UX Designer",
      type: "Office", 
      status: "Permanent",
      avatar: "/placeholder.svg",
    },
    // ... more employees
  ],
};

const DepartmentView = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const employees = departmentEmployees[id as keyof typeof departmentEmployees] || [];
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departmentName = id === "design" ? "Design Department" : "Department";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Header 
          title={departmentName}
          subtitle={`All Departments > ${departmentName}`}
        />
        
        <main className="p-6">
          {isLoading ? (
            <LoadingSkeleton type="table" count={8} />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{departmentName}</CardTitle>
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
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Employee
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Employee ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Employee Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Designation
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Type
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
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-sm">{employee.id}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={employee.avatar} />
                                <AvatarFallback>
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{employee.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">
                            {employee.designation}
                          </td>
                          <td className="py-4 px-4 text-sm">{employee.type}</td>
                          <td className="py-4 px-4">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {employee.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                Delete
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

export default DepartmentView;
