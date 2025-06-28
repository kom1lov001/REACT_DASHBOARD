import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Plus, Edit, Trash2, Calendar as CalendarIcon, User, Award, Building, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema and types
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  deadline: z.string().min(1, "Deadline is required"),
  budget: z.string().min(1, "Budget is required"),
  status: z.enum(["Planning", "In Progress", "Completed", "On Hold"]),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  teamLead: z.string().min(1, "Team lead is required"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

type Project = {
  id: string;
  name: string;
  description: string;
  deadline: string;
  budget: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  priority: "Low" | "Medium" | "High" | "Critical";
  teamLead: string;
  teamLeadAvatar: string;
  progress: number;
  teamSize: number;
};

const initialProjects: Project[] = [
  {
    id: "1",
    name: "HRMS Development",
    description: "Complete Human Resource Management System with employee tracking, payroll, and attendance features",
    deadline: "2024-08-15",
    budget: "$45,000",
    status: "In Progress",
    priority: "High",
    teamLead: "John Doe",
    teamLeadAvatar: "/placeholder.svg",
    progress: 75,
    teamSize: 8,
  },
  {
    id: "2",
    name: "Mobile App UI/UX",
    description: "Design and development of mobile application interface for iOS and Android platforms",
    deadline: "2024-07-30",
    budget: "$28,000",
    status: "Planning",
    priority: "Medium",
    teamLead: "Jane Smith",
    teamLeadAvatar: "/placeholder.svg",
    progress: 25,
    teamSize: 5,
  },
  {
    id: "3",
    name: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment gateway integration and inventory management",
    deadline: "2024-09-20",
    budget: "$65,000",
    status: "Completed",
    priority: "Critical",
    teamLead: "Mike Johnson",
    teamLeadAvatar: "/placeholder.svg",
    progress: 100,
    teamSize: 12,
  },
  {
    id: "4",
    name: "Data Analytics Dashboard",
    description: "Business intelligence dashboard with real-time data visualization and reporting capabilities",
    deadline: "2024-08-05",
    budget: "$32,000",
    status: "On Hold",
    priority: "Low",
    teamLead: "Sarah Wilson",
    teamLeadAvatar: "/placeholder.svg",
    progress: 40,
    teamSize: 6,
  },
];

const Projects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (editingProject) {
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id 
          ? {
              ...project,
              name: data.name,
              description: data.description,
              deadline: data.deadline,
              budget: data.budget,
              status: data.status,
              priority: data.priority,
              teamLead: data.teamLead,
            }
          : project
      ));
      toast.success("Project updated successfully!");
    } else {
      const newProject: Project = {
        id: (projects.length + 1).toString(),
        name: data.name,
        description: data.description,
        deadline: data.deadline,
        budget: data.budget,
        status: data.status,
        priority: data.priority,
        teamLead: data.teamLead,
        teamLeadAvatar: "/placeholder.svg",
        progress: 0,
        teamSize: 1,
      };
      setProjects(prev => [...prev, newProject]);
      toast.success("Project created successfully!");
    }
    
    setIsDialogOpen(false);
    setEditingProject(null);
    reset();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setValue("name", project.name);
    setValue("description", project.description);
    setValue("deadline", project.deadline);
    setValue("budget", project.budget);
    setValue("status", project.status);
    setValue("priority", project.priority);
    setValue("teamLead", project.teamLead);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    toast.success("Project deleted successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Planning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "On Hold": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "High": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="sticky top-0 z-30">
          <Header title="Projects" subtitle="Project Management & Tracking" />
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
                        <p className="text-muted-foreground text-xs sm:text-sm">Total Projects</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{projects.length}</p>
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
                        <p className="text-muted-foreground text-xs sm:text-sm">In Progress</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">
                          {projects.filter(p => p.status === "In Progress").length}
                        </p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm">Completed</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">
                          {projects.filter(p => p.status === "Completed").length}
                        </p>
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
                        <p className="text-muted-foreground text-xs sm:text-sm">On Hold</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">
                          {projects.filter(p => p.status === "On Hold").length}
                        </p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-300 text-sm sm:text-lg">⏸️</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Project List */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <CardTitle className="text-foreground text-lg sm:text-xl">Projects</CardTitle>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search projects..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-full sm:w-32 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Planning">Planning</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                          <SelectTrigger className="w-full sm:w-32 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => { setEditingProject(null); reset(); }} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Add Project</span>
                            <span className="sm:hidden">Add</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700 mx-4">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">
                              {editingProject ? "Edit Project" : "Add New Project"}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                              <Input
                                {...register("name")}
                                placeholder="Project Name"
                                className="h-12 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {errors.name && (
                                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                              )}
                            </div>

                            <div>
                              <Input
                                {...register("description")}
                                placeholder="Project Description"
                                className="h-12 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {errors.description && (
                                <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Input
                                  {...register("deadline")}
                                  type="date"
                                  placeholder="Deadline"
                                  className="h-12 dark:bg-gray-700 dark:border-gray-600"
                                />
                                {errors.deadline && (
                                  <p className="mt-1 text-sm text-destructive">{errors.deadline.message}</p>
                                )}
                              </div>

                              <div>
                                <Input
                                  {...register("budget")}
                                  placeholder="Budget (e.g., $50,000)"
                                  className="h-12 dark:bg-gray-700 dark:border-gray-600"
                                />
                                {errors.budget && (
                                  <p className="mt-1 text-sm text-destructive">{errors.budget.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <Select {...register("status")}>
                                  <SelectTrigger className="h-12 dark:bg-gray-700 dark:border-gray-600">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="On Hold">On Hold</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors.status && (
                                  <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
                                )}
                              </div>

                              <div>
                                <Select {...register("priority")}>
                                  <SelectTrigger className="h-12 dark:bg-gray-700 dark:border-gray-600">
                                    <SelectValue placeholder="Priority" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors.priority && (
                                  <p className="mt-1 text-sm text-destructive">{errors.priority.message}</p>
                                )}
                              </div>

                              <div>
                                <Input
                                  {...register("teamLead")}
                                  placeholder="Team Lead"
                                  className="h-12 dark:bg-gray-700 dark:border-gray-600"
                                />
                                {errors.teamLead && (
                                  <p className="mt-1 text-sm text-destructive">{errors.teamLead.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => {
                                  setIsDialogOpen(false);
                                  setEditingProject(null);
                                  reset();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" className="flex-1">
                                {editingProject ? "Update" : "Create"}
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
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-6 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-2">
                              {project.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(project.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <Badge className={`${getStatusColor(project.status)} text-xs`}>
                              {project.status}
                            </Badge>
                            <Badge className={`${getPriorityColor(project.priority)} text-xs`}>
                              {project.priority}
                            </Badge>
                          </div>
                          
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{project.progress}% complete</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                <AvatarImage src={project.teamLeadAvatar} />
                                <AvatarFallback className="text-xs">
                                  {project.teamLead.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{project.teamLead}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{project.teamSize} members</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">{project.budget}</p>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                {project.deadline}
                              </div>
                            </div>
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

export default Projects;
