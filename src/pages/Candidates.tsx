
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
import { Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const candidateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  status: z.enum(["Selected", "In Review", "Rejected"]),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

type Candidate = {
  id: number;
  name: string;
  position: string;
  appliedDate: string;
  email: string;
  phone: string;
  status: string;
  avatar: string;
};

const candidatesData: Candidate[] = [
  {
    id: 1,
    name: "Leasie Watson",
    position: "UI/UX Designer",
    appliedDate: "July 14, 2023",
    email: "leasie.w@demo.com",
    phone: "(629) 555-0129",
    status: "Selected",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Floyd Miles",
    position: "Sales Manager",
    appliedDate: "July 14, 2023",
    email: "floyd.m@demo.com",
    phone: "(217) 555-0113",
    status: "In Review",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Theresa Webb",
    position: "Sr. UX Designer",
    appliedDate: "July 14, 2023",
    email: "theresa.w@demo.com",
    phone: "(219) 555-0114",
    status: "In Review",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Darlene Robertson",
    position: "Sr. Python Developer",
    appliedDate: "July 14, 2023",
    email: "darlene.r@demo.com",
    phone: "(505) 555-0125",
    status: "In Review",
    avatar: "/placeholder.svg",
  },
];

const Candidates = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>(candidatesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesPosition = positionFilter === "all" || candidate.position.toLowerCase().includes(positionFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const onSubmit = async (data: CandidateFormData) => {
    if (editingCandidate) {
      setCandidates(prev => prev.map(candidate => 
        candidate.id === editingCandidate.id 
          ? {
              ...candidate,
              name: data.name,
              position: data.position,
              email: data.email,
              phone: data.phone,
              status: data.status,
            }
          : candidate
      ));
      toast.success("Candidate updated successfully!");
    } else {
      const newCandidate: Candidate = {
        id: candidates.length + 1,
        name: data.name,
        position: data.position,
        email: data.email,
        phone: data.phone,
        status: data.status,
        appliedDate: new Date().toLocaleDateString(),
        avatar: "/placeholder.svg",
      };
      setCandidates(prev => [...prev, newCandidate]);
      toast.success("Candidate added successfully!");
    }
    
    setIsDialogOpen(false);
    setEditingCandidate(null);
    reset();
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setValue("name", candidate.name);
    setValue("position", candidate.position);
    setValue("email", candidate.email);
    setValue("phone", candidate.phone);
    setValue("status", candidate.status as "Selected" | "In Review" | "Rejected");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCandidates(prev => prev.filter(candidate => candidate.id !== id));
    toast.success("Candidate deleted successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selected": return "bg-green-100 text-green-700";
      case "In Review": return "bg-yellow-100 text-yellow-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Header title="Candidates" subtitle="All Candidates Information" />
        
        <main className="p-6">
          {isLoading ? (
            <LoadingSkeleton type="table" count={8} />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>25 Candidates</CardTitle>
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
                        <SelectItem value="Selected">Selected</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditingCandidate(null); reset(); }}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Candidate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          <div>
                            <Input
                              {...register("name")}
                              placeholder="Candidate Name"
                              className="h-12"
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                            )}
                          </div>

                          <div>
                            <Input
                              {...register("position")}
                              placeholder="Applied Position"
                              className="h-12"
                            />
                            {errors.position && (
                              <p className="mt-1 text-sm text-destructive">{errors.position.message}</p>
                            )}
                          </div>

                          <div>
                            <Input
                              {...register("email")}
                              type="email"
                              placeholder="Email Address"
                              className="h-12"
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                            )}
                          </div>

                          <div>
                            <Input
                              {...register("phone")}
                              placeholder="Mobile Number"
                              className="h-12"
                            />
                            {errors.phone && (
                              <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                            )}
                          </div>

                          <div>
                            <Select {...register("status")}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Selected">Selected</SelectItem>
                                <SelectItem value="In Review">In Review</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.status && (
                              <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
                            )}
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                setIsDialogOpen(false);
                                setEditingCandidate(null);
                                reset();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" className="flex-1">
                              {editingCandidate ? "Update" : "Add"}
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
                          Candidate Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Applied For
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Applied Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Email Address
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Mobile Number
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
                      {filteredCandidates.map((candidate) => (
                        <tr key={candidate.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={candidate.avatar} />
                                <AvatarFallback>
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{candidate.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm">{candidate.position}</td>
                          <td className="py-4 px-4 text-sm">{candidate.appliedDate}</td>
                          <td className="py-4 px-4 text-sm">{candidate.email}</td>
                          <td className="py-4 px-4 text-sm">{candidate.phone}</td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant="secondary" 
                              className={getStatusColor(candidate.status)}
                            >
                              {candidate.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(candidate)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(candidate.id)}
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
                    Showing {filteredCandidates.length} of {candidates.length} candidates
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Candidates;
