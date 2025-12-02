import { DiagnosisData } from "@/components/diagnosis/DiagnosisCard";

interface PendingDiagnosisData {
  diagnosis: DiagnosisData;
  timestamp: number;
}

const PENDING_DIAGNOSIS_KEY = "pendingDiagnosis";
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

export function savePendingDiagnosis(diagnosis: DiagnosisData) {
  const data: PendingDiagnosisData = {
    diagnosis,
    timestamp: Date.now(),
  };
  localStorage.setItem(PENDING_DIAGNOSIS_KEY, JSON.stringify(data));
}

export function getPendingDiagnosis(): DiagnosisData | null {
  try {
    const stored = localStorage.getItem(PENDING_DIAGNOSIS_KEY);
    if (!stored) return null;

    const data: PendingDiagnosisData = JSON.parse(stored);
    
    // Check if data has expired
    if (Date.now() - data.timestamp > EXPIRATION_TIME) {
      clearPendingDiagnosis();
      return null;
    }

    return data.diagnosis;
  } catch (error) {
    console.error("Error reading pending diagnosis:", error);
    clearPendingDiagnosis();
    return null;
  }
}

export function clearPendingDiagnosis() {
  localStorage.removeItem(PENDING_DIAGNOSIS_KEY);
}

export function hasPendingDiagnosis(): boolean {
  return getPendingDiagnosis() !== null;
}
