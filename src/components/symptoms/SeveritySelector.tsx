import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type Severity = "mild" | "moderate" | "severe";

interface SeveritySelectorProps {
  value: Severity | null;
  onChange: (severity: Severity) => void;
}

const severities: { value: Severity; label: string; description: string }[] = [
  { value: "mild", label: "Mild", description: "Noticeable but manageable" },
  { value: "moderate", label: "Moderate", description: "Affecting daily activities" },
  { value: "severe", label: "Severe", description: "Significant impairment" },
];

export function SeveritySelector({ value, onChange }: SeveritySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">
        Symptom Severity
      </label>
      <div className="flex gap-3">
        {severities.map((severity) => (
          <motion.button
            key={severity.value}
            onClick={() => onChange(severity.value)}
            className={cn(
              "severity-button",
              severity.value,
              value === severity.value && "selected"
            )}
            whileTap={{ scale: 0.98 }}
          >
            <div className="font-semibold">{severity.label}</div>
          </motion.button>
        ))}
      </div>
      {value && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground text-center"
        >
          {severities.find((s) => s.value === value)?.description}
        </motion.p>
      )}
    </div>
  );
}
