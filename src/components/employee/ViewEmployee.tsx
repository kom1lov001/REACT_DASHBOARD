
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  type: string;
  status: string;
  email: string;
  phone: string;
  avatar: string;
}

interface ViewEmployeeProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewEmployee = ({ employee, isOpen, onClose }: ViewEmployeeProps) => {
  if (!employee) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Permanent": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Contract": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Intern": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-foreground">Employee Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Employee Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback className="text-lg">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.designation}</p>
              <p className="text-sm text-muted-foreground">Employee ID: {employee.employeeId}</p>
            </div>
          </div>

          {/* Basic Information */}
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <p className="font-medium text-foreground">{employee.name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Employee ID</span>
                  <p className="font-medium text-foreground">{employee.employeeId}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium text-foreground">{employee.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <p className="font-medium text-foreground">{employee.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Designation</span>
                  <p className="font-medium text-foreground">{employee.designation}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Department</span>
                  <p className="font-medium text-foreground">{employee.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Work Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-sm text-muted-foreground">Work Type</span>
                  <div className="mt-1">
                    <Badge className={getTypeColor(employee.type)}>
                      {employee.type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Employment Status</span>
                  <div className="mt-1">
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Joining Date</span>
                  <p className="font-medium text-foreground">January 15, 2023</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Manager</span>
                  <p className="font-medium text-foreground">John Smith</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Location</span>
                  <p className="font-medium text-foreground">New York Office</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Team</span>
                  <p className="font-medium text-foreground">Development Team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployee;
