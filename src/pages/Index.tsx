import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Activity, Clock, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Activity,
    title: "AI-Powered Analysis",
    description: "Advanced symptom analysis using machine learning",
  },
  {
    icon: Clock,
    title: "Track History",
    description: "Monitor your health journey over time",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your health data stays protected",
  },
];

export default function Index() {
  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-12 pb-8">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center max-w-md mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="mb-6 inline-flex items-center justify-center h-20 w-20 rounded-2xl gradient-primary shadow-glow"
            >
              <Activity className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">Wellness</span>
              <span className="text-foreground">+</span>
            </h1>
            
            <p className="text-muted-foreground mb-8 text-lg">
              Your AI-powered health companion for symptom tracking and wellness insights
            </p>

            <Link to="/symptoms">
              <Button size="lg" className="gap-2 w-full max-w-xs">
                <Plus className="h-5 w-5" />
                Start Symptom Check
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 max-w-md mx-auto"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Why Wellness+?
            </h2>
            
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card variant="glass" className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Quick Actions */}
        <section className="px-4 py-8 mt-auto">
          <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
            <Link to="/history">
              <Card variant="glass" className="p-4 h-full hover:border-primary/50 transition-colors cursor-pointer">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm">View History</h3>
                <p className="text-xs text-muted-foreground">Past diagnoses</p>
              </Card>
            </Link>
            
            <Link to="/profile">
              <Card variant="glass" className="p-4 h-full hover:border-primary/50 transition-colors cursor-pointer">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm">Your Profile</h3>
                <p className="text-xs text-muted-foreground">Settings & privacy</p>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
