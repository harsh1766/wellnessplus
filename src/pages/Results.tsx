import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { DiagnosisCard, DiagnosisData } from "@/components/diagnosis/DiagnosisCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock diagnosis result - in real app, this would come from AI analysis
const mockDiagnosis: DiagnosisData = {
  id: "1",
  disease: "Common Cold",
  description: "A viral infection of the upper respiratory tract. Usually harmless and resolves within 7-10 days. Rest and hydration are recommended.",
  symptoms: [],
  severity: "mild",
  medicines: ["Acetaminophen", "Decongestant", "Throat lozenges", "Vitamin C"],
  aiScore: 0.85,
  ruleScore: 0.78,
  notes: "",
  createdAt: new Date(),
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const state = location.state as {
    symptoms: string[];
    severity: string;
    notes: string;
  } | null;

  if (!state) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
          <p className="text-muted-foreground text-center mb-6">
            Please enter your symptoms first to get a diagnosis.
          </p>
          <Button onClick={() => navigate("/symptoms")}>
            Enter Symptoms
          </Button>
        </div>
      </AppLayout>
    );
  }

  const diagnosis: DiagnosisData = {
    ...mockDiagnosis,
    symptoms: state.symptoms,
    severity: state.severity as "mild" | "moderate" | "severe",
    notes: state.notes,
  };

  const handleSave = () => {
    // In real app, save to database
    toast({
      title: "Diagnosis Saved",
      description: "Your diagnosis has been saved to your history.",
    });
    navigate("/history");
  };

  return (
    <AppLayout>
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Analysis Results
          </h1>
          <p className="text-muted-foreground text-sm">
            Based on your symptoms, here's what we found
          </p>
        </motion.div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-success/10 border-success/30">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle className="h-6 w-6 text-success shrink-0" />
              <div>
                <p className="font-medium text-success">Analysis Complete</p>
                <p className="text-xs text-success/80">
                  AI confidence: {Math.round(diagnosis.aiScore * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Diagnosis Card */}
        <div className="mb-6">
          <DiagnosisCard diagnosis={diagnosis} />
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card variant="glass" className="border-warning/30">
            <CardContent className="flex items-start gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                This is not a medical diagnosis. Always consult a healthcare professional 
                for proper medical advice. This tool is for informational purposes only.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button size="lg" className="w-full gap-2" onClick={handleSave}>
            <Save className="h-5 w-5" />
            Save to History
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/symptoms")}
          >
            Start New Analysis
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
