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
import { Search, Plus, Edit, Trash2, Calendar, User, Building, Clock, Award } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().min(1, "Description is required"),
  assignee: z.string().min(1, "Assignee is required"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  dueDate: z.string().min(1, "Due date is required"),
  project: z.string().min(1, "Project is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  priority: string;
  dueDate: string;
  project: string;
  status: "To Do" | "In Progress" | "Review" | "Done";
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design User Authentication Flow",
    description: "Create wireframes and mockups for login/signup process",
    assignee: "John Doe",
    assigneeAvatar: "/placeholder.svg",
    priority: "High",
    dueDate: "2024-07-15",
    project: "HRMS Development",
    status: "To Do",
  },
  {
    id: "2",
    title: "Implement Dashboard API",
    description: "Develop REST API endpoints for dashboard data",
    assignee: "Jane Smith",
    assigneeAvatar: "/placeholder.svg",
    priority: "Critical",
    dueDate: "2024-07-10",
    project: "HRMS Development",
    status: "In Progress",
  },
  {
    id: "3",
    title: "User Testing Session",
    description: "Conduct usability testing with target users",
    assignee: "Mike Johnson",
    assigneeAvatar: "/placeholder.svg",
    priority: "Medium",
    dueDate: "2024-07-20",
    project: "Mobile App UI/UX",
    status: "Review",
  },
  {
    id: "4",
    title: "Payment Gateway Integration",
    description: "Integrate Stripe payment system",
    assignee: "Sarah Wilson",
    assigneeAvatar: "/placeholder.svg",
    priority: "High",
    dueDate: "2024-07-25",
    project: "E-commerce Platform",
    status: "Done",
  },
];

const columnConfig = [
  { id: "To Do", title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "In Progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "Review", title: "Review", color: "bg-yellow-100 dark:bg-yellow-900" },
  { id: "Done", title: "Done", color: "bg-green-100 dark:bg-green-900" },
];

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject = projectFilter === "all" || task.project === projectFilter;
    
    return matchesSearch && matchesPriority && matchesProject;
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      setTasks(prev => prev.map(task => 
        task.id === draggableId 
          ? { ...task, status: destination.droppableId as Task["status"] }
          : task
      ));
      toast.success("Task moved successfully!");
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              title: data.title,
              description: data.description,
              assignee: data.assignee,
              priority: data.priority,
              dueDate: data.dueDate,
              project: data.project,
            }
          : task
      ));
      toast.success("Task updated successfully!");
    } else {
      const newTask: Task = {
        id: (tasks.length + 1).toString(),
        title: data.title,
        description: data.description,
        assignee: data.assignee,
        assigneeAvatar: "/placeholder.svg",
        priority: data.priority,
        dueDate: data.dueDate,
        project: data.project,
        status: "To Do",
      };
      setTasks(prev => [...prev, newTask]);
      toast.success("Task created successfully!");
    }
    
    setIsDialogOpen(false);
    setEditingTask(null);
    reset();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("assignee", task.assignee);
    setValue("priority", task.priority as any);
    setValue("dueDate", task.dueDate);
    setValue("project", task.project);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
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

  const getTasksByStatus = (status: Task["status"]) => {
    return filteredTasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="sticky top-0 z-30">
          <Header title="Tasks" subtitle="Task Management & Kanban Board" />
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
                        <p className="text-muted-foreground text-xs sm:text-sm">Total Tasks</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{tasks.length}</p>
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
                          {tasks.filter(t => t.status === "In Progress").length}
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
                          {tasks.filter(t => t.status === "Done").length}
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
                        <p className="text-muted-foreground text-xs sm:text-sm">Overdue</p>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">2</p>
                      </div>
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-300 text-sm sm:text-lg">⚠️</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Actions */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <CardTitle className="text-foreground text-lg sm:text-xl">Task Board</CardTitle>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search tasks..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
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

                        <Select value={projectFilter} onValueChange={setProjectFilter}>
                          <SelectTrigger className="w-full sm:w-40 dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Project" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem value="all">All Projects</SelectItem>
                            <SelectItem value="HRMS Development">HRMS Development</SelectItem>
                            <SelectItem value="Mobile App UI/UX">Mobile App UI/UX</SelectItem>
                            <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => { setEditingTask(null); reset(); }} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Add Task</span>
                            <span className="sm:hidden">Add</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700 mx-4">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">
                              {editingTask ? "Edit Task" : "Add New Task"}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                              <Input
                                {...register("title")}
                                placeholder="Task Title"
                                className="h-12 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {errors.title && (
                                <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
                              )}
                            </div>

                            <div>
                              <Input
                                {...register("description")}
                                placeholder="Task Description"
                                className="h-12 dark:bg-gray-700 dark:border-gray-600"
                              />
                              {errors.description && (
                                <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Input
                                  {...register("assignee")}
                                  placeholder="Assignee"
                                  className="h-12 dark:bg-gray-700 dark:border-gray-600"
                                />
                                {errors.assignee && (
                                  <p className="mt-1 text-sm text-destructive">{errors.assignee.message}</p>
                                )}
                              </div>

                              <div>
                                <Input
                                  {...register("dueDate")}
                                  type="date"
                                  placeholder="Due Date"
                                  className="h-12 dark:bg-gray-700 dark:border-gray-600"
                                />
                                {errors.dueDate && (
                                  <p className="mt-1 text-sm text-destructive">{errors.dueDate.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <Select {...register("project")}>
                                  <SelectTrigger className="h-12 dark:bg-gray-700 dark:border-gray-600">
                                    <SelectValue placeholder="Project" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                    <SelectItem value="HRMS Development">HRMS Development</SelectItem>
                                    <SelectItem value="Mobile App UI/UX">Mobile App UI/UX</SelectItem>
                                    <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors.project && (
                                  <p className="mt-1 text-sm text-destructive">{errors.project.message}</p>
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
                                  setEditingTask(null);
                                  reset();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" className="flex-1">
                                {editingTask ? "Update" : "Create"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Kanban Board */}
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      {columnConfig.map((column) => (
                        <div key={column.id} className={`${column.color} rounded-lg p-3 sm:p-4`}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">{column.title}</h3>
                            <Badge variant="secondary" className="bg-white dark:bg-gray-600 text-xs">
                              {getTasksByStatus(column.id as Task["status"]).length}
                            </Badge>
                          </div>
                          
                          <Droppable droppableId={column.id}>
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`space-y-3 min-h-[200px] ${
                                  snapshot.isDraggingOver ? 'bg-gray-200 dark:bg-gray-700 rounded-lg' : ''
                                }`}
                              >
                                {getTasksByStatus(column.id as Task["status"]).map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-white dark:bg-gray-700 rounded-lg p-3 sm:p-4 shadow-sm border hover:shadow-md transition-shadow ${
                                          snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
                                        }`}
                                      >
                                        <div className="flex items-start justify-between mb-3">
                                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm leading-tight">
                                            {task.title}
                                          </h4>
                                          <div className="flex space-x-1 ml-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              onClick={() => handleDelete(task.id)}
                                              className="text-destructive hover:text-destructive"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                        
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                          {task.description}
                                        </p>
                                        
                                        <div className="flex items-center justify-between mb-3">
                                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                                            {task.priority}
                                          </Badge>
                                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {task.dueDate}
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                                              <AvatarImage src={task.assigneeAvatar} />
                                              <AvatarFallback className="text-xs">
                                                {task.assignee.split(' ').map(n => n[0]).join('')}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{task.assignee}</span>
                                          </div>
                                        </div>
                                        
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                                          Project: {task.project}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      ))}
                    </div>
                  </DragDropContext>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Tasks;
