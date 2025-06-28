
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Edit, Trash2, CalendarIcon, MapPin, DollarSign, Clock, Users, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  status: "Open" | "Closed" | "Draft";
  salary: string;
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string;
  benefits: string;
  applicants: number;
};

const initialJobsData: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    status: "Open",
    salary: "$80,000 - $120,000",
    postedDate: "2024-01-15",
    deadline: "2024-02-15",
    description: "We are looking for a Senior Frontend Developer to join our team.",
    requirements: "5+ years of React experience, TypeScript knowledge",
    benefits: "Health insurance, 401k, flexible working hours",
    applicants: 12
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Open",
    salary: "$70,000 - $100,000",
    postedDate: "2024-01-10",
    deadline: "2024-02-10",
    description: "Join our design team to create amazing user experiences.",
    requirements: "3+ years of UX design experience, Figma proficiency",
    benefits: "Health insurance, stock options, remote work",
    applicants: 8
  }
];

const Jobs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>(initialJobsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time" as Job["type"],
    status: "Draft" as Job["status"],
    salary: "",
    deadline: new Date(),
    description: "",
    requirements: "",
    benefits: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateJob = () => {
    const newJob: Job = {
      id: Date.now(),
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      status: formData.status,
      salary: formData.salary,
      postedDate: format(new Date(), "yyyy-MM-dd"),
      deadline: format(formData.deadline, "yyyy-MM-dd"),
      description: formData.description,
      requirements: formData.requirements,
      benefits: formData.benefits,
      applicants: 0
    };

    setJobs([...jobs, newJob]);
    toast.success("Job posted successfully!");
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditJob = () => {
    if (!editingJob) return;
    
    const updatedJob: Job = {
      ...editingJob,
      title: formData.title,
      department: formData.department,
      location: formData.location,
      type: formData.type,
      status: formData.status,
      salary: formData.salary,
      deadline: format(formData.deadline, "yyyy-MM-dd"),
      description: formData.description,
      requirements: formData.requirements,
      benefits: formData.benefits
    };

    setJobs(jobs.map(job => job.id === editingJob.id ? updatedJob : job));
    toast.success("Job updated successfully!");
    setIsEditModalOpen(false);
    setEditingJob(null);
    resetForm();
  };

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id));
    toast.success("Job deleted successfully!");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      status: "Draft",
      salary: "",
      deadline: new Date(),
      description: "",
      requirements: "",
      benefits: ""
    });
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      salary: job.salary,
      deadline: new Date(job.deadline),
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits
    });
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Closed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1">
        <Header title="Jobs" subtitle="Job Management & Recruitment" />
        
        <main className="p-4 md:p-6">
          {isLoading ? (
            <LoadingSkeleton type="card" count={6} />
          ) : (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Jobs</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{jobs.length}</p>
                      </div>
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Open Positions</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">
                          {jobs.filter(job => job.status === "Open").length}
                        </p>
                      </div>
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Applicants</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">
                          {jobs.reduce((sum, job) => sum + job.applicants, 0)}
                        </p>
                      </div>
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Draft Jobs</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">
                          {jobs.filter(job => job.status === "Draft").length}
                        </p>
                      </div>
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 md:h-6 md:w-6 text-orange-600 dark:text-orange-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Jobs Table */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <CardTitle className="text-foreground">All Jobs</CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search jobs..."
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
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-32 dark:bg-gray-700 dark:border-gray-600">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Post Job
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="text-left p-4">Job Title</th>
                          <th className="text-left p-4">Department</th>
                          <th className="text-left p-4">Location</th>
                          <th className="text-left p-4">Type</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Salary</th>
                          <th className="text-left p-4">Applicants</th>
                          <th className="text-left p-4">Deadline</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.map((job) => (
                          <tr key={job.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{job.title}</p>
                                <p className="text-sm text-muted-foreground">Posted {format(new Date(job.postedDate), "MMM dd, yyyy")}</p>
                              </div>
                            </td>
                            <td className="p-4 text-sm">{job.department}</td>
                            <td className="p-4 text-sm">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </div>
                            </td>
                            <td className="p-4 text-sm">{job.type}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="p-4 text-sm">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {job.salary}
                              </div>
                            </td>
                            <td className="p-4 text-sm">{job.applicants}</td>
                            <td className="p-4 text-sm">{format(new Date(job.deadline), "MMM dd, yyyy")}</td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModal(job)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteJob(job.id)}
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
            </div>
          )}
        </main>
      </div>

      {/* Create Job Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Senior Frontend Developer"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label>Department *</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="e.g. Engineering"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label>Location *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. New York, NY"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label>Job Type *</Label>
                  <Select value={formData.type} onValueChange={(value: Job["type"]) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status *</Label>
                  <Select value={formData.status} onValueChange={(value: Job["status"]) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Salary Range *</Label>
                  <Input
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="e.g. $80,000 - $120,000"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <Label>Application Deadline *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1 dark:bg-gray-700 dark:border-gray-600",
                        !formData.deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.deadline, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => date && setFormData({...formData, deadline: date})}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Job description..."
                  className="mt-1 min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <Label>Requirements *</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="Job requirements..."
                  className="mt-1 min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <Label>Benefits</Label>
                <Textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  placeholder="Job benefits..."
                  className="mt-1 min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob}>
              Post Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Senior Frontend Developer"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label>Department *</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="e.g. Engineering"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label>Location *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. New York, NY"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <Label>Job Type *</Label>
                  <Select value={formData.type} onValueChange={(value: Job["type"]) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status *</Label>
                  <Select value={formData.status} onValueChange={(value: Job["status"]) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Salary Range *</Label>
                  <Input
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="e.g. $80,000 - $120,000"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <Label>Application Deadline *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1 dark:bg-gray-700 dark:border-gray-600",
                        !formData.deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.deadline, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => date && setFormData({...formData, deadline: date})}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Job description..."
                  className="mt-1 min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <Label>Requirements *</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="Job requirements..."
                  className="mt-1 min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <Label>Benefits</Label>
                <Textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  placeholder="Job benefits..."
                  className="mt-1 min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditJob}>
              Update Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;
