import { useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Activity, Mail, Lock, User, ArrowLeft, Chrome, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from "@/lib/validations/auth";
import { hasPendingDiagnosis, getPendingDiagnosis } from "@/lib/pendingDiagnosis";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  // Signup form
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onBlur",
  });

  const isLoginLoading = loginForm.formState.isSubmitting;
  const isSignupLoading = signupForm.formState.isSubmitting;
  const isLoading = isLoginLoading || isSignupLoading;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // If there's a pending diagnosis, redirect to results with the data
      if (hasPendingDiagnosis()) {
        const pending = getPendingDiagnosis();
        if (pending) {
          // Navigate to results - the Results page will auto-save
          navigate("/results", { 
            state: {
              symptoms: pending.symptoms,
              severity: pending.severity,
              notes: pending.notes,
              diagnoses: [{
                disease: pending.disease,
                description: pending.description,
                commonSymptoms: [],
                medicines: pending.medicines,
                confidence: pending.aiScore,
                urgency: pending.urgency
              }]
            }
          });
          return;
        }
      }
      // Otherwise go to home
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      // Navigation handled by useEffect
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    const { error } = await signUp(data.email, data.password, data.name);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "Please try again with different credentials.",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Welcome to Wellness+. You're now signed in.",
      });
      // Navigation handled by useEffect
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: "Please try again or use email/password.",
      });
    }
  };

  const handleGuestContinue = () => {
    toast({
      title: "Continuing as Guest",
      description: "Your data will only be stored locally. Sign in to save your diagnoses.",
    });
    navigate("/");
  };

  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen flex flex-col px-4 py-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="-ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mt-8 mb-8"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary shadow-glow mb-4">
            <Activity className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-gradient">Wellness</span>
            <span className="text-foreground">+</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to sync your health data
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 max-w-md mx-auto w-full"
        >
          <Card variant="glass">
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Email address"
                            className={`pl-11 ${loginForm.formState.errors.email ? 'border-destructive focus:border-destructive' : ''}`}
                            {...loginForm.register("email")}
                            disabled={isLoading}
                          />
                        </div>
                        {loginForm.formState.errors.email && (
                          <p className="text-xs text-destructive pl-1">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Password"
                            className={`pl-11 ${loginForm.formState.errors.password ? 'border-destructive focus:border-destructive' : ''}`}
                            {...loginForm.register("password")}
                            disabled={isLoading}
                          />
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-xs text-destructive pl-1">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoginLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Full name"
                            className={`pl-11 ${signupForm.formState.errors.name ? 'border-destructive focus:border-destructive' : ''}`}
                            {...signupForm.register("name")}
                            disabled={isLoading}
                          />
                        </div>
                        {signupForm.formState.errors.name && (
                          <p className="text-xs text-destructive pl-1">
                            {signupForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Email address"
                            className={`pl-11 ${signupForm.formState.errors.email ? 'border-destructive focus:border-destructive' : ''}`}
                            {...signupForm.register("email")}
                            disabled={isLoading}
                          />
                        </div>
                        {signupForm.formState.errors.email && (
                          <p className="text-xs text-destructive pl-1">
                            {signupForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Password (min 6 characters)"
                            className={`pl-11 ${signupForm.formState.errors.password ? 'border-destructive focus:border-destructive' : ''}`}
                            {...signupForm.register("password")}
                            disabled={isLoading}
                          />
                        </div>
                        {signupForm.formState.errors.password && (
                          <p className="text-xs text-destructive pl-1">
                            {signupForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isSignupLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Divider */}
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  or continue with
                </span>
              </div>

              {/* Social & Guest Options */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4" />
                  Continue with Google
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleGuestContinue}
                  disabled={isLoading}
                >
                  Continue as Guest
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center mt-6 px-4">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
