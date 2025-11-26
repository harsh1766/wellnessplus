import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SymptomChip } from "@/components/symptoms/SymptomChip";
import { SeveritySelector, Severity } from "@/components/symptoms/SeveritySelector";
import { MedicalLoadingScreen } from "@/components/loading/MedicalLoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Fatigue",
  "Nausea",
  "Sore Throat",
  "Body Aches",
  "Dizziness",
  "Chills",
  "Shortness of Breath",
  "Runny Nose",
  "Loss of Appetite",
  "Chest Pain",
  "Stomach Pain",
  "Joint Pain",
];

export default function Symptoms() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredSymptoms = commonSymptoms.filter((symptom) =>
    symptom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (searchQuery && !commonSymptoms.includes(searchQuery) && !selectedSymptoms.includes(searchQuery)) {
      setSelectedSymptoms((prev) => [...prev, searchQuery]);
      setSearchQuery("");
    }
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 || !severity) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/results", {
        state: {
          symptoms: selectedSymptoms,
          severity,
          notes,
        },
      });
    }, 3000);
  };

  const canAnalyze = selectedSymptoms.length > 0 && severity !== null;

  return (
    <>
      <AnimatePresence>
        {isLoading && <MedicalLoadingScreen />}
      </AnimatePresence>
      
      <AppLayout>
        <div className="px-4 py-6 max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Enter Symptoms
            </h1>
            <p className="text-muted-foreground text-sm">
              Select or type your symptoms for AI analysis
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search or add custom symptom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomSymptom()}
                className="pl-12"
              />
            </div>
            {searchQuery && !filteredSymptoms.some(s => s.toLowerCase() === searchQuery.toLowerCase()) && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onClick={addCustomSymptom}
                className="mt-2 text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Add "{searchQuery}" as custom symptom
              </motion.button>
            )}
          </motion.div>

          {/* Common Symptoms */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Common Symptoms
            </h2>
            <div className="flex flex-wrap gap-2">
              {filteredSymptoms.map((symptom) => (
                <SymptomChip
                  key={symptom}
                  label={symptom}
                  selected={selectedSymptoms.includes(symptom)}
                  onClick={() => toggleSymptom(symptom)}
                />
              ))}
            </div>
          </motion.div>

          {/* Selected Symptoms */}
          <AnimatePresence>
            {selectedSymptoms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Card variant="glass">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      Selected ({selectedSymptoms.length})
                      <button
                        onClick={() => setSelectedSymptoms([])}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Clear all
                      </button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <SymptomChip
                          key={symptom}
                          label={symptom}
                          selected
                          onClick={() => toggleSymptom(symptom)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Severity Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <SeveritySelector value={severity} onChange={setSeverity} />
          </motion.div>

          {/* Additional Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Additional Notes (optional)
            </label>
            <Textarea
              placeholder="Describe how you're feeling, when symptoms started..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none bg-secondary/50 border-2 border-border rounded-xl focus:border-primary"
            />
          </motion.div>

          {/* Analyze Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              className="w-full gap-2"
              disabled={!canAnalyze}
              onClick={handleAnalyze}
            >
              <Sparkles className="h-5 w-5" />
              Analyze Symptoms
              <ArrowRight className="h-4 w-4" />
            </Button>
            {!canAnalyze && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Select at least one symptom and severity level
              </p>
            )}
          </motion.div>
        </div>
      </AppLayout>
    </>
  );
}
