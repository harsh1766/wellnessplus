import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { DiagnosisCard, DiagnosisData } from "@/components/diagnosis/DiagnosisCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveDiagnosis } from "@/lib/diagnoses";
import { savePendingDiagnosis, getPendingDiagnosis, clearPendingDiagnosis } from "@/lib/pendingDiagnosis";

interface AIDiagnosis {
  disease: string;
  description: string;
  commonSymptoms: string[];
  medicines: string[];
  confidence: number;
  urgency: "low" | "medium" | "high";
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const state = location.state as {
    symptoms: string[];
    severity: string;
    notes: string;
    diagnoses: AIDiagnosis[];
  } | null;

  if (!state || !state.diagnoses) {
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

  const diagnoses: DiagnosisData[] = state.diagnoses.map((d, i) => ({
    id: `temp-${i}`,
    disease: d.disease,
    description: d.description,
    symptoms: state.symptoms,
    severity: state.severity as "mild" | "moderate" | "severe",
    medicines: d.medicines,
    aiScore: d.confidence,
    ruleScore: d.confidence * 0.9,
    notes: state.notes,
    createdAt: new Date(),
    urgency: d.urgency,
    rank: i + 1,
  }));

  const selectedDiagnosis = diagnoses[selectedIndex];

  // Auto-save pending diagnosis after user logs in
  useEffect(() => {
    const autoSavePendingDiagnosis = async () => {
      if (user && selectedDiagnosis) {
        const pending = getPendingDiagnosis();
        if (pending) {
          setIsSaving(true);
          try {
            await saveDiagnosis({
              disease: selectedDiagnosis.disease,
              description: selectedDiagnosis.description,
              symptoms: selectedDiagnosis.symptoms,
              severity: selectedDiagnosis.severity,
              medicines: selectedDiagnosis.medicines,
              ai_score: selectedDiagnosis.aiScore,
              rule_score: selectedDiagnosis.ruleScore,
              notes: selectedDiagnosis.notes || null,
            });

            clearPendingDiagnosis();
            
            toast({
              title: "Diagnosis Saved",
              description: "Your diagnosis has been saved to your history.",
            });
            
            // Redirect to history after auto-save
            setTimeout(() => {
              navigate("/history");
            }, 1500);
          } catch (error) {
            console.error("Error auto-saving diagnosis:", error);
            toast({
              variant: "destructive",
              title: "Save failed",
              description: "There was an error saving your diagnosis. Please try again.",
            });
          } finally {
            setIsSaving(false);
          }
        }
      }
    };

    autoSavePendingDiagnosis();
  }, [user, selectedDiagnosis, navigate, toast]);

  const handleSave = async () => {
    if (!user) {
      // Save pending diagnosis to localStorage before redirecting
      savePendingDiagnosis(selectedDiagnosis);
      
      toast({
        title: "Sign in required",
        description: "Please sign in to save your diagnosis to history.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSaving(true);

    try {
      await saveDiagnosis({
        disease: selectedDiagnosis.disease,
        description: selectedDiagnosis.description,
        symptoms: selectedDiagnosis.symptoms,
        severity: selectedDiagnosis.severity,
        medicines: selectedDiagnosis.medicines,
        ai_score: selectedDiagnosis.aiScore,
        rule_score: selectedDiagnosis.ruleScore,
        notes: selectedDiagnosis.notes || null,
      });

      clearPendingDiagnosis();

      toast({
        title: "Diagnosis Saved",
        description: "Your diagnosis has been saved to your history.",
      });
      navigate("/history");
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving your diagnosis. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getRankLabel = (index: number) => {
    if (index === 0) return "Most Likely";
    if (index === 1) return "Possible";
    return "Less Likely";
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
            {diagnoses.length} possible conditions found based on your symptoms
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
                  {diagnoses.length} conditions identified
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Diagnosis Cards */}
        <div className="space-y-4 mb-6">
          {diagnoses.map((diagnosis, index) => (
            <motion.div
              key={diagnosis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <DiagnosisCard 
                diagnosis={diagnosis} 
                index={index}
                rank={index + 1}
                rankLabel={getRankLabel(index)}
                isSelected={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
                showSelectButton
              />
            </motion.div>
          ))}
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
          <Button 
            size="lg" 
            className="w-full gap-2" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {user ? `Save "${selectedDiagnosis.disease}"` : "Sign In to Save"}
              </>
            )}
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
