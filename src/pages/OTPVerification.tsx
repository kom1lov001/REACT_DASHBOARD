
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

const OTPVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Password updated successfully! 🎉");
    navigate("/login");
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900">Enter OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            We have shared a code to your registered email address {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex justify-center space-x-2">
              <Input
                {...register("otp")}
                type="text"
                maxLength={6}
                placeholder="5 0"
                className="h-16 text-center text-2xl font-bold w-32"
              />
            </div>
            {errors.otp && (
              <p className="mt-1 text-center text-sm text-destructive">{errors.otp.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
