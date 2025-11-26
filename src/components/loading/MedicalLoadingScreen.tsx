import { motion } from "framer-motion";
import { Activity, Heart, Brain, Stethoscope } from "lucide-react";

const loadingMessages = [
  "Analyzing symptoms...",
  "Cross-referencing medical data...",
  "Running AI diagnostics...",
  "Generating recommendations...",
];

export function MedicalLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Animated background pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-64 w-64 rounded-full border border-primary/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.5, 2],
              opacity: [0.5, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Central icon animation */}
      <motion.div
        className="relative z-10 mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full gradient-primary shadow-glow">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Activity className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary-foreground" />
            <Heart className="absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 translate-x-1/2 text-primary-foreground" />
            <Brain className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 translate-y-1/2 text-primary-foreground" />
            <Stethoscope className="absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary-foreground" />
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Activity className="h-12 w-12 text-primary-foreground" />
          </motion.div>
        </div>
      </motion.div>

      {/* Loading text animation */}
      <div className="relative z-10 text-center">
        <motion.h2
          className="mb-4 text-2xl font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Processing Your Symptoms
        </motion.h2>
        
        <div className="h-6 overflow-hidden">
          <motion.div
            animate={{ y: [0, -24, -48, -72, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          >
            {loadingMessages.map((message, index) => (
              <p
                key={index}
                className="h-6 text-sm text-muted-foreground"
              >
                {message}
              </p>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="relative z-10 mt-8 flex gap-2">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
