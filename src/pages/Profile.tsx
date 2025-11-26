import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Shield,
  LogOut,
  ChevronRight,
  Lock,
  FileText,
  Bell,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: Bell, label: "Notifications", to: "#" },
  { icon: Lock, label: "Privacy Settings", to: "#" },
  { icon: FileText, label: "Terms of Service", to: "#" },
  { icon: HelpCircle, label: "Help & Support", to: "#" },
];

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest User";
  const displayEmail = user?.email || "Not signed in";

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">Profile</h1>
          <p className="text-muted-foreground text-sm">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card variant="glass">
            <CardContent className="flex items-center gap-4 py-6">
              <Avatar className="h-16 w-16 border-2 border-primary/30">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground text-lg">
                  {displayName}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {displayEmail}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Auth Buttons */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 space-y-3"
          >
            <Link to="/auth">
              <Button className="w-full gap-2">
                <User className="h-4 w-4" />
                Sign In / Sign Up
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center">
              Sign in to sync your data across devices
            </p>
          </motion.div>
        )}

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card variant="glass">
            <CardContent className="p-0">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <Link
                    to={item.to}
                    className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  {index < menuItems.length - 1 && (
                    <Separator className="bg-border/50" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your health data is encrypted and stored securely. We never share 
                your personal information with third parties without your explicit 
                consent. You can request data deletion at any time.
              </p>
              <Button variant="link" className="px-0 mt-2 text-primary">
                Learn more about our privacy policy
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sign Out (if logged in) */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="outline" 
              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </motion.div>
        )}

        {/* App Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Wellness+ v1.0.0
        </motion.p>
      </div>
    </AppLayout>
  );
}
