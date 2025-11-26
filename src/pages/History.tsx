import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { DiagnosisCard, DiagnosisData } from "@/components/diagnosis/DiagnosisCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus, FileX, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getDiagnoses, Diagnosis } from "@/lib/diagnoses";

export default function History() {
  const { user } = useAuth();
  const [diagnoses, setDiagnoses] = useState<DiagnosisData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiagnoses() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getDiagnoses();
        const formattedDiagnoses: DiagnosisData[] = data.map((d: Diagnosis) => ({
          id: d.id,
          disease: d.disease,
          description: d.description || "",
          symptoms: d.symptoms,
          severity: d.severity,
          medicines: d.medicines || [],
          aiScore: Number(d.ai_score) || 0,
          ruleScore: Number(d.rule_score) || 0,
          notes: d.notes || undefined,
          createdAt: new Date(d.created_at),
        }));
        setDiagnoses(formattedDiagnoses);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiagnoses();
  }, [user]);

  const hasHistory = diagnoses.length > 0;

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                History
              </h1>
              <p className="text-muted-foreground text-sm">
                Your past diagnoses and health records
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>

        {!user ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FileX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Sign In Required
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Sign in to view and save your diagnosis history across devices.
            </p>
            <Link to="/auth">
              <Button className="gap-2">
                Sign In to View History
              </Button>
            </Link>
          </motion.div>
        ) : hasHistory ? (
          <>
            {/* Stats Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card variant="glass">
                <CardContent className="grid grid-cols-3 gap-4 py-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {diagnoses.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Records</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className="text-2xl font-bold text-success">
                      {diagnoses.filter((d) => d.severity === "mild").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Mild Cases</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">
                      {diagnoses.filter((d) => d.severity !== "mild").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Moderate+</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* History List */}
            <div className="space-y-4">
              {diagnoses.map((diagnosis, index) => (
                <DiagnosisCard
                  key={diagnosis.id}
                  diagnosis={diagnosis}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FileX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Records Yet
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Your diagnosis history will appear here once you complete your first symptom analysis.
            </p>
            <Link to="/symptoms">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Start First Analysis
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
