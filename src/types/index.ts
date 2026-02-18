export interface Category {
  id: string;
  user_id: string;
  name: string;
  description: string;
  visibility: boolean;
  parent_id: string | null;
  image: string;
}

export interface Assistant {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category_id: string;
  visibility: boolean;
  files: AssistantFile[];
}

export interface AssistantFile {
  id: string;
  name: string;
  url: string;
  tags: string[];
}

export type QuestionType = 'true_false' | 'yes_no' | 'mcq' | 'fill_blank' | 'ranking' | 'matching';
export type Complexity = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  user_id: string;
  assistant_id: string;
  question: string;
  answer: string;
  options?: string[];
  page: number;
  type: QuestionType;
  chapter: string;
  complexity: Complexity;
  created_at: string;
  history: QuestionHistory[];
}

export interface QuestionHistory {
  id: string;
  question: string;
  answer: string;
  generated_at: string;
}

export interface Exam {
  id: string;
  user_id: string;
  assistant_id: string;
  title: string;
  questions_number: number;
  start_time: string;
  time_in_minutes: number;
  allowed_time: number;
  is_random_mode: boolean;
  is_minus_mode: boolean;
  is_repeated_mode: boolean;
  is_public_mode: boolean;
  question_ids: string[];
}

export interface StudentAnswer {
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
}

export interface ExamAnswer {
  id: string;
  user_id: string;
  exam_id: string;
  username: string;
  phone: string;
  start_at: string;
  end_at: string;
  grade: number;
  note: string;
  answers: StudentAnswer[];
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  true_false: 'صح / خطأ',
  yes_no: 'نعم / لا',
  mcq: 'اختيار من متعدد',
  fill_blank: 'أكمل الفراغ',
  ranking: 'ترتيب',
  matching: 'مطابقة',
};

export const COMPLEXITY_LABELS: Record<Complexity, string> = {
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
};
