import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster as HotToast } from "react-hot-toast";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";
import AllEmployees from "./pages/AllEmployees";
import AllDepartments from "./pages/AllDepartments";
import DepartmentView from "./pages/DepartmentView";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Holidays from "./pages/Holidays";
import Leaves from "./pages/Leaves";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateEmployeePage from "./pages/employee/CreateEmployeePage";
import EditEmployeePage from "./pages/employee/EditEmployeePage";
import ViewEmployeePage from "./pages/employee/ViewEmployeePage";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Sonner />
        <HotToast position="top-right" />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <AllEmployees />
              </ProtectedRoute>
            }
          />
          <Route path="/departments" element={<AllDepartments />} />
          <Route
            path="/departments/:id"
            element={
              <ProtectedRoute>
                <DepartmentView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <Payroll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/holidays"
            element={
              <ProtectedRoute>
                <Holidays />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <ProtectedRoute>
                <Leaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />

          {/* Employee Routes */}
          <Route
            path="/employees/create"
            element={
              <ProtectedRoute>
                <CreateEmployeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/edit/:id"
            element={
              <ProtectedRoute>
                <EditEmployeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/view/:id"
            element={
              <ProtectedRoute>
                <ViewEmployeePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
