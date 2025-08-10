import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-primary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">SCAMS</h1>
          <p className="text-muted-foreground">Smart Classroom Attendance Management System</p>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSubmitted ? "Check Your Email" : "Forgot Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSubmitted 
                ? "We've sent password reset instructions to your email address"
                : "Enter your email address and we'll send you password reset instructions"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Send Reset Instructions
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <p className="text-sm text-success-foreground">
                    Reset instructions have been sent to <strong>{email}</strong>
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            )}

            {!isSubmitted && (
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:underline inline-flex items-center"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to Login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          © 2025 SCAMS - Smart Classroom Attendance Management System
        </div>
      </div>
    </div>
  );
}
