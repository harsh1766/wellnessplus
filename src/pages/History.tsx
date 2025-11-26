import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { DiagnosisCard, DiagnosisData } from "@/components/diagnosis/DiagnosisCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus, FileX } from "lucide-react";
import { Link } from "react-router-dom";

// Mock history data - in real app, this would come from database
const mockHistory: DiagnosisData[] = [
  {
    id: "1",
    disease: "Common Cold",
    description: "A viral infection of the upper respiratory tract affecting the nose and throat.",
    symptoms: ["Headache", "Cough", "Runny Nose", "Fatigue"],
    severity: "mild",
    medicines: ["Acetaminophen", "Decongestant", "Rest"],
    aiScore: 0.85,
    ruleScore: 0.78,
    notes: "Started feeling unwell after the rain yesterday",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "2",
    disease: "Tension Headache",
    description: "A common type of headache characterized by mild to moderate pain, often described as feeling like a tight band around the head.",
    symptoms: ["Headache", "Neck Pain", "Fatigue"],
    severity: "moderate",
    medicines: ["Ibuprofen", "Muscle relaxant"],
    aiScore: 0.72,
    ruleScore: 0.65,
    createdAt: new Date(Date.now() - 172800000),
  },
];

export default function History() {
  const hasHistory = mockHistory.length > 0;

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

        {hasHistory ? (
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
                      {mockHistory.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Records</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className="text-2xl font-bold text-success">
                      {mockHistory.filter((d) => d.severity === "mild").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Mild Cases</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">
                      {mockHistory.filter((d) => d.severity !== "mild").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Moderate+</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* History List */}
            <div className="space-y-4">
              {mockHistory.map((diagnosis, index) => (
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
