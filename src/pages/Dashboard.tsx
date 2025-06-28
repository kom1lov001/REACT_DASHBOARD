
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Users, Building2, DollarSign } from "lucide-react";

const attendanceData = [
  { day: "Mon", percentage: 95 },
  { day: "Tue", percentage: 88 },
  { day: "Wed", percentage: 92 },
  { day: "Thu", percentage: 85 },
  { day: "Fri", percentage: 90 },
  { day: "Sat", percentage: 78 },
  { day: "Sun", percentage: 82 },
];

const departmentData = [
  { name: "Design", value: 30, color: "hsl(var(--primary))" },
  { name: "Development", value: 25, color: "hsl(var(--secondary))" },
  { name: "Marketing", value: 20, color: "hsl(var(--accent))" },
  { name: "Sales", value: 25, color: "hsl(var(--muted))" },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Total Employees",
      value: "560",
      change: "+10%",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Applicants",
      value: "1050",
      change: "+5%",
      changeType: "positive",
      icon: Building2,
      color: "bg-green-500",
    },
    {
      title: "Total Attendance",
      value: "470",
      change: "-2%",
      changeType: "negative",
      icon: Calendar,
      color: "bg-orange-500",
    },
    {
      title: "Total Projects",
      value: "250",
      change: "+12%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-30">
          <Header title="Hello Robert 👋" subtitle="Good morning" />
        </div>
        
        <main className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              <LoadingSkeleton type="stats" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LoadingSkeleton type="chart" />
                <LoadingSkeleton type="chart" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="transition-all duration-200 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                              {stat.value}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${stat.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                          <span
                            className={`font-medium ${
                              stat.changeType === "positive"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.change}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            vs last month
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
