import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, Assistant, Question, Exam, ExamAnswer } from '@/types';
import {
  mockCategories,
  mockAssistants,
  mockQuestions,
  mockExams,
  mockExamAnswers,
} from '@/data/mockData';

interface AppContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  assistants: Assistant[];
  setAssistants: React.Dispatch<React.SetStateAction<Assistant[]>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  examAnswers: ExamAnswer[];
  setExamAnswers: React.Dispatch<React.SetStateAction<ExamAnswer[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [assistants, setAssistants] = useState<Assistant[]>(mockAssistants);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [examAnswers, setExamAnswers] = useState<ExamAnswer[]>(mockExamAnswers);

  return (
    <AppContext.Provider
      value={{
        categories, setCategories,
        assistants, setAssistants,
        questions, setQuestions,
        exams, setExams,
        examAnswers, setExamAnswers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
