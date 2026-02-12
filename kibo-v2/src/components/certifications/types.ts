// ─── Certification Module Types ─────────────────────────────────────────────

export type QuestionType = "mcq" | "coding" | "debugging";
export type ExamStatus = "active" | "submitted" | "expired" | "graded";
export type CertLevel = "beginner" | "intermediate" | "advanced";

// ─── Certification Catalog ──────────────────────────────────────────────────

export interface Certification {
    id: string;
    code: string;              // e.g. "KCP-B01"
    title: string;             // e.g. "Kibo Certified Python – Beginner"
    level: CertLevel;
    language: string;          // e.g. "Python"
    description: string;
    duration_minutes: number;  // e.g. 90
    total_marks: number;       // e.g. 100
    passing_score: number;     // e.g. 60
    cooldown_hours: number;    // e.g. 48
    is_premium: boolean;
    syllabus: string[];
    format: ExamFormat;
    rules: string[];
    icon?: string;
    image?: string;
}

export interface ExamFormat {
    sections: SectionFormat[];
}

export interface SectionFormat {
    type: QuestionType;
    label: string;
    count: number;
    marks: number;
    weight: number;            // percentage, e.g. 40
    description: string;
}

// ─── Questions ──────────────────────────────────────────────────────────────

export interface CertQuestion {
    id: string;
    certification_id: string;
    type: QuestionType;
    title: string;
    marks: number;
    order_index: number;
}

/** MCQ question sent to client (no correctIndex!) */
export interface MCQQuestion extends CertQuestion {
    type: "mcq";
    question_text: string;
    options: string[];
    explanation?: string;       // only shown after grading
    code_snippet?: string;      // optional code block in the question
}

/** Coding question sent to client */
export interface CodingQuestion extends CertQuestion {
    type: "coding";
    problem_statement: string;   // full markdown description
    input_format: string;
    output_format: string;
    constraints: string[];
    examples: CodingExample[];
    starter_code: string;
    function_name: string;
}

export interface CodingExample {
    input: string;
    output: string;
    explanation?: string;
}

/** Debugging question sent to client */
export interface DebuggingQuestion extends CertQuestion {
    type: "debugging";
    description: string;         // what the function should do
    buggy_code: string;          // the code with intentional bugs
    hints?: string[];            // optional hints
    expected_behavior: string;   // description of correct behavior
}

// ─── Exam Attempt ───────────────────────────────────────────────────────────

export interface ExamAttempt {
    id: string;
    user_id: string;
    certification_id: string;
    status: ExamStatus;
    started_at: string;
    expires_at: string;
    submitted_at?: string;
    tab_switch_count: number;
    score?: number;
    passed?: boolean;
    section_scores?: SectionScore[];
    certificate_id?: string;
}

export interface SectionScore {
    type: QuestionType;
    label: string;
    earned: number;
    total: number;
    weight: number;
    details?: string;
}

// ─── Exam Answers ───────────────────────────────────────────────────────────

export interface ExamAnswer {
    question_id: string;
    type: QuestionType;
    // MCQ: index of selected option
    selected_option?: number;
    // Coding / Debugging: submitted code
    code?: string;
    // Coding: language used
    language?: string;
}

// ─── Certificate ────────────────────────────────────────────────────────────

export interface Certificate {
    id: string;
    user_id: string;
    certification_id: string;
    certification_title: string;
    certification_code: string;
    holder_name: string;
    score: number;
    issued_at: string;
    expires_at?: string;         // null = never expires
    verification_url: string;
}

// ─── Exam Result (returned after grading) ───────────────────────────────────

export interface ExamResult {
    attempt_id: string;
    certification_title: string;
    certification_code: string;
    score: number;
    total_marks: number;
    percentage: number;
    passed: boolean;
    passing_score: number;
    section_scores: SectionScore[];
    mcq_feedback?: MCQFeedback[];
    coding_feedback?: CodingFeedback;
    debugging_feedback?: DebuggingFeedback;
    certificate_id?: string;
    time_taken_seconds: number;
    tab_switch_count: number;
}

export interface MCQFeedback {
    question_id: string;
    question_text: string;
    selected_option: number;
    correct_option: number;
    is_correct: boolean;
    explanation: string;
}

export interface CodingFeedback {
    question_title: string;
    test_cases_passed: number;
    test_cases_total: number;
    score: number;
    max_score: number;
    details: string;
}

export interface DebuggingFeedback {
    question_title: string;
    bugs_identified: number;
    bugs_total: number;
    score: number;
    max_score: number;
    details: string;
}
