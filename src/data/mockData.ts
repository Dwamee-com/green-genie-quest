import { Category, Assistant, Question, Exam, ExamAnswer } from '@/types';

export const mockCategories: Category[] = [
  {
    id: '1',
    user_id: 'u1',
    name: 'الرياضيات',
    description: 'أسئلة في الجبر والهندسة والإحصاء',
    visibility: true,
    parent_id: null,
    image: '📐',
  },
  {
    id: '2',
    user_id: 'u1',
    name: 'العلوم',
    description: 'الفيزياء والكيمياء والأحياء',
    visibility: true,
    parent_id: null,
    image: '🔬',
  },
  {
    id: '3',
    user_id: 'u1',
    name: 'اللغة العربية',
    description: 'النحو والصرف والبلاغة',
    visibility: true,
    parent_id: null,
    image: '📖',
  },
  {
    id: '4',
    user_id: 'u1',
    name: 'الجبر',
    description: 'المعادلات والدوال',
    visibility: true,
    parent_id: '1',
    image: '➗',
  },
];

export const mockAssistants: Assistant[] = [
  {
    id: '1',
    user_id: 'u1',
    name: 'مساعد الرياضيات',
    description: 'يولد أسئلة رياضية متنوعة',
    category_id: '1',
    visibility: true,
    files: [
      { id: 'f1', name: 'كتاب_الجبر.pdf', url: '#', tags: ['جبر', 'معادلات'] },
      { id: 'f2', name: 'تمارين_هندسة.pdf', url: '#', tags: ['هندسة'] },
    ],
  },
  {
    id: '2',
    user_id: 'u1',
    name: 'مساعد العلوم',
    description: 'يولد أسئلة علمية شاملة',
    category_id: '2',
    visibility: true,
    files: [],
  },
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    user_id: 'u1',
    assistant_id: '1',
    question: 'ما هو ناتج 2 + 2؟',
    answer: '4',
    page: 1,
    type: 'mcq',
    chapter: 'الجبر الأساسي',
    complexity: 'easy',
    created_at: '2024-01-15',
    history: [],
  },
  {
    id: '2',
    user_id: 'u1',
    assistant_id: '1',
    question: 'هل المثلث متساوي الأضلاع له ثلاث زوايا متساوية؟',
    answer: 'صح',
    page: 5,
    type: 'true_false',
    chapter: 'الهندسة',
    complexity: 'easy',
    created_at: '2024-01-16',
    history: [],
  },
];

export const mockExams: Exam[] = [
  {
    id: '1',
    user_id: 'u1',
    assistant_id: '1',
    title: 'اختبار الرياضيات - الفصل الأول',
    questions_number: 20,
    start_time: '2024-02-01T09:00:00',
    time_in_minutes: 60,
    allowed_time: 90,
    is_random_mode: true,
    is_minus_mode: false,
    is_repeated_mode: false,
    is_public_mode: true,
  },
];

export const mockExamAnswers: ExamAnswer[] = [
  {
    id: '1',
    user_id: 'u1',
    exam_id: '1',
    username: 'أحمد محمد',
    phone: '0501234567',
    start_at: '2024-02-01T09:00:00',
    end_at: '2024-02-01T09:45:00',
    grade: 85,
    note: 'أداء ممتاز',
  },
  {
    id: '2',
    user_id: 'u1',
    exam_id: '1',
    username: 'سارة أحمد',
    phone: '0509876543',
    start_at: '2024-02-01T09:00:00',
    end_at: '2024-02-01T10:00:00',
    grade: 72,
    note: 'جيد',
  },
  {
    id: '3',
    user_id: 'u1',
    exam_id: '1',
    username: 'محمد علي',
    phone: '0551112233',
    start_at: '2024-02-01T09:00:00',
    end_at: '2024-02-01T09:30:00',
    grade: 95,
    note: 'ممتاز',
  },
];
