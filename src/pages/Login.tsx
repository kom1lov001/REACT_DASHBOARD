
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@hrms.com",
      password: "admin123",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock authentication - check for admin credentials
    if (data.email === "admin@hrms.com" && data.password === "admin123") {
      localStorage.setItem("auth-token", "admin-token");
      localStorage.setItem("user-role", "admin");
      localStorage.setItem("user-name", "Admin User");
      toast.success("Welcome to HRMS Admin Panel! 👋");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials. Use admin@hrms.com / admin123");
    }
    
    setIsLoading(false);
  };

  const fillAdminCredentials = () => {
    setValue("email", "admin@hrms.com");
    setValue("password", "admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">H</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">HRMS</h2>
          <p className="mt-2 text-sm text-gray-600">Welcome 👋</p>
          <p className="text-xs text-gray-500 mt-1">Please sign-in to your account.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              {...register("password")}
              type="password"
              placeholder="Password"
              className="h-12"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("rememberMe")} id="rememberMe" />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember Me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Login"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={fillAdminCredentials}
              className="w-full h-10 text-sm"
            >
              Use Admin Credentials
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Default: admin@hrms.com / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
