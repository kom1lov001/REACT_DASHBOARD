
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  type: z.enum(["Office", "Remote"]),
  status: z.enum(["Permanent", "Contract", "Intern"]),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

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

interface UpdateEmployeeProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEmployeeUpdate: (employee: Employee) => void;
}

const UpdateEmployee = ({ employee, isOpen, onClose, onEmployeeUpdate }: UpdateEmployeeProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (employee) {
      setValue("name", employee.name);
      setValue("email", employee.email);
      setValue("phone", employee.phone);
      setValue("designation", employee.designation);
      setValue("department", employee.department);
      setValue("type", employee.type as "Office" | "Remote");
      setValue("status", employee.status as "Permanent" | "Contract" | "Intern");
    }
  }, [employee, setValue]);

  const onSubmit = async (data: EmployeeFormData) => {
    if (!employee) return;

    const updatedEmployee = {
      ...employee,
      name: data.name,
      email: data.email,
      phone: data.phone,
      designation: data.designation,
      department: data.department,
      type: data.type,
      status: data.status,
    };

    onEmployeeUpdate(updatedEmployee);
    toast.success("Employee updated successfully!");
    onClose();
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-foreground">Update Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Full Name</Label>
              <Input
                {...register("name")}
                placeholder="Enter full name"
                className="mt-1 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label className="text-foreground">Email</Label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Phone</Label>
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
              <Label className="text-foreground">Designation</Label>
              <Input
                {...register("designation")}
                placeholder="Enter designation"
                className="mt-1 dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.designation && (
                <p className="mt-1 text-sm text-destructive">{errors.designation.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-foreground">Department</Label>
              <Select {...register("department")}>
                <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
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
              <Label className="text-foreground">Work Type</Label>
              <Select {...register("type")}>
                <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="mt-1 text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div>
              <Label className="text-foreground">Status</Label>
              <Select {...register("status")}>
                <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmployee;
