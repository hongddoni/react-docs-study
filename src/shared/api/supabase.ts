import { createClient } from "@supabase/supabase-js";

// 환경변수 또는 임시 설정 (실제 사용시에는 환경변수로 관리)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase 데이터베이스 타입 정의
export interface DatabaseQuestion {
  id: string;
  title: string;
  description?: string;
  answer_type: "subjective" | "multiple-choice";
  selection_mode?: "single" | "multiple";
  options?: Array<{
    id: string;
    text: string;
    is_correct?: boolean;
  }>;
  correct_answer: string | string[];
  explanation?: string;
  order: number;
  session_id: string;
  created_at?: string;
  updated_at?: string;
  code?: string;
}

export interface DatabaseSession {
  id: string;
  title: string;
  description?: string;
  session_number: number;
  is_locked: boolean;
  required_permission?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseUserAnswer {
  id: string;
  user_id: string;
  question_id: string;
  session_id: string;
  answer: string | string[];
  is_correct: boolean;
  submitted_at: string;
}
