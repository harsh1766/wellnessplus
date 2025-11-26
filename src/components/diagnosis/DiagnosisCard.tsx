import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Pill, Calendar, FileText, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiagnosisData {
  id: string;
  disease: string;
  description: string;
  symptoms: string[];
  severity: "mild" | "moderate" | "severe";
  medicines: string[];
  aiScore: number;
  ruleScore: number;
  notes?: string;
  createdAt: Date;
}

interface DiagnosisCardProps {
  diagnosis: DiagnosisData;
  index?: number;
}

export function DiagnosisCard({ diagnosis, index = 0 }: DiagnosisCardProps) {
  const confidenceColor = 
    diagnosis.aiScore >= 0.8 ? "text-success" :
    diagnosis.aiScore >= 0.5 ? "text-warning" : "text-destructive";

  const severityConfig = {
    mild: { color: "bg-success/20 text-success border-success/30", label: "Mild" },
    moderate: { color: "bg-warning/20 text-warning border-warning/30", label: "Moderate" },
    severe: { color: "bg-destructive/20 text-destructive border-destructive/30", label: "Severe" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card variant="glass" className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{diagnosis.disease}</CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {diagnosis.createdAt.toLocaleDateString()}
              </div>
            </div>
            <Badge className={cn("border", severityConfig[diagnosis.severity].color)}>
              {severityConfig[diagnosis.severity].label}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {diagnosis.description}
          </p>

          {/* Symptoms */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Symptoms
            </div>
            <div className="flex flex-wrap gap-2">
              {diagnosis.symptoms.map((symptom) => (
                <Badge key={symptom} variant="secondary" className="text-xs">
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>

          {/* Medicines */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Pill className="h-4 w-4 text-primary" />
              Recommended
            </div>
            <div className="flex flex-wrap gap-2">
              {diagnosis.medicines.map((medicine) => (
                <Badge key={medicine} variant="outline" className="text-xs border-primary/30 text-primary">
                  {medicine}
                </Badge>
              ))}
            </div>
          </div>

          {/* Confidence Scores */}
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">AI Confidence</span>
            </div>
            <span className={cn("text-sm font-bold", confidenceColor)}>
              {Math.round(diagnosis.aiScore * 100)}%
            </span>
          </div>

          {/* Notes */}
          {diagnosis.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Notes
              </div>
              <p className="text-xs text-muted-foreground italic">
                "{diagnosis.notes}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
