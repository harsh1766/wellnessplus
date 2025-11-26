import { supabase } from "@/integrations/supabase/client";

export interface Diagnosis {
  id: string;
  user_id: string;
  disease: string;
  description: string | null;
  symptoms: string[];
  severity: "mild" | "moderate" | "severe";
  medicines: string[];
  ai_score: number;
  rule_score: number;
  notes: string | null;
  created_at: string;
}

export async function saveDiagnosis(diagnosis: Omit<Diagnosis, "id" | "user_id" | "created_at">) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be logged in to save diagnosis");
  }

  const { data, error } = await supabase
    .from("diagnoses")
    .insert({
      user_id: user.id,
      disease: diagnosis.disease,
      description: diagnosis.description,
      symptoms: diagnosis.symptoms,
      severity: diagnosis.severity,
      medicines: diagnosis.medicines,
      ai_score: diagnosis.ai_score,
      rule_score: diagnosis.rule_score,
      notes: diagnosis.notes,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving diagnosis:", error);
    throw error;
  }

  return data;
}

export async function getDiagnoses(): Promise<Diagnosis[]> {
  const { data, error } = await supabase
    .from("diagnoses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching diagnoses:", error);
    throw error;
  }

  return (data || []) as Diagnosis[];
}

export async function deleteDiagnosis(id: string) {
  const { error } = await supabase
    .from("diagnoses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting diagnosis:", error);
    throw error;
  }
}
