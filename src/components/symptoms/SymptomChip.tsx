import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SymptomChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function SymptomChip({ label, selected, onClick }: SymptomChipProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn("symptom-chip flex items-center gap-2", selected && "selected")}
      whileTap={{ scale: 0.95 }}
      layout
    >
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <Check className="h-4 w-4" />
        </motion.span>
      )}
      {label}
    </motion.button>
  );
}
