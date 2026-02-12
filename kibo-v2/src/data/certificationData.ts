import type { Certification } from "@/components/certifications/types";

// ─── Certification Catalog ──────────────────────────────────────────────────
// Non-sensitive display data for the certifications listing page.

import pythonBeginnerImg from "@/assets/python-beginner.jpg";
import pythonIntermediateImg from "@/assets/python-intermediate.jpg";
import pythonAdvancedImg from "@/assets/python-advanced.jpg";

export const CERTIFICATIONS: Certification[] = [
    {
        id: "kcp-b01",
        code: "KCP-B01",
        title: "Kibo Certified Python – Beginner",
        level: "beginner",
        language: "Python",
        description:
            "Validate your foundational Python skills with a professional-grade certification. This exam tests core Python concepts, algorithmic thinking, and debugging ability — calibrated to FAANG intern/new-grad screening standards.",
        duration_minutes: 90,
        total_marks: 100,
        passing_score: 60,
        cooldown_hours: 48,
        is_premium: false,
        syllabus: [
            "Variables, Data Types & Operators",
            "Control Flow (if/elif/else, loops)",
            "Functions & Scope",
            "Lists, Tuples, Sets & Dictionaries",
            "String Manipulation",
            "List Comprehensions",
            "Hash Maps & Prefix Sums",
            "Sorting & Interval Problems",
            "Mutable vs Immutable Objects",
            "Closures & Late Binding",
            "Time & Space Complexity Analysis",
            "Debugging & Code Tracing",
        ],
        format: {
            sections: [
                {
                    type: "mcq",
                    label: "Multiple Choice Questions",
                    count: 5,
                    marks: 20,
                    weight: 20,
                    description:
                        "Professional-level MCQs testing deep Python knowledge — mutable defaults, closures, time complexity, reference semantics, and hashing.",
                },
                {
                    type: "coding",
                    label: "Coding Problem",
                    count: 1,
                    marks: 40,
                    weight: 40,
                    description:
                        "A single algorithmic coding challenge requiring O(n) solutions using prefix sums and hash maps. Brute-force solutions will fail performance tests.",
                },
                {
                    type: "debugging",
                    label: "Debugging Task",
                    count: 1,
                    marks: 30,
                    weight: 30,
                    description:
                        "Identify and fix bugs in a provided function. Tests algorithmic prerequisites (sorting), logic tracing, and edge case analysis.",
                },
            ],
        },
        rules: [
            "Duration: 90 minutes. The timer starts when you click 'Start Exam'.",
            "Passing Score: 60% (60/100 marks).",
            "All solutions must be in Python 3.x.",
            "Tab switching is monitored and logged.",
            "Cooldown: 48 hours between retakes.",
            "Code must be clean and follow PEP 8 guidelines where possible.",
            "Plagiarism detection algorithms are active.",
            "The exam auto-submits when time expires.",
        ],
        icon: "🐍",
        image: pythonBeginnerImg,
    },
    {
        id: "kcp-i01",
        code: "KCP-I01",
        title: "Kibo Certified Python – Intermediate",
        level: "intermediate",
        language: "Python",
        description:
            "Take your Python skills to the next level. Covers advanced data structures, OOP design patterns, concurrency, and system design fundamentals.",
        duration_minutes: 120,
        total_marks: 100,
        passing_score: 65,
        cooldown_hours: 72,
        is_premium: true,
        syllabus: [
            "Advanced OOP (ABC, Metaclasses, Descriptors)",
            "Generators & Iterators",
            "Decorators & Context Managers",
            "Concurrency (Threading, Asyncio)",
            "Graph Algorithms (BFS, DFS, Dijkstra)",
            "Dynamic Programming",
            "System Design Basics",
            "Testing & Mocking",
        ],
        format: {
            sections: [
                {
                    type: "mcq",
                    label: "Multiple Choice Questions",
                    count: 8,
                    marks: 20,
                    weight: 20,
                    description: "Advanced Python internals and design pattern questions.",
                },
                {
                    type: "coding",
                    label: "Coding Problems",
                    count: 2,
                    marks: 50,
                    weight: 50,
                    description: "Two algorithmic problems requiring optimal solutions.",
                },
                {
                    type: "debugging",
                    label: "Debugging Task",
                    count: 1,
                    marks: 30,
                    weight: 30,
                    description: "Debug a complex OOP-based implementation.",
                },
            ],
        },
        rules: [
            "Duration: 120 minutes.",
            "Passing Score: 65%.",
            "Premium certification — requires Kibo Pro subscription.",
            "All other rules from Beginner apply.",
        ],
        icon: "🚀",
        image: pythonIntermediateImg,
    },
    {
        id: "kcp-a01",
        code: "KCP-A01",
        title: "Kibo Certified Python – Advanced",
        level: "advanced",
        language: "Python",
        description:
            "Prove your mastery of Python internals, advanced design patterns, and production-grade engineering. This exam covers metaclasses, async/await, memory management, C-extension fundamentals, and complex algorithmic challenges — calibrated to senior/staff-level expectations.",
        duration_minutes: 150,
        total_marks: 100,
        passing_score: 70,
        cooldown_hours: 96,
        is_premium: true,
        syllabus: [
            "Metaclasses & Descriptor Protocol",
            "Async/Await & Event Loop Internals",
            "Memory Management & Garbage Collection",
            "C Extensions & ctypes/cffi",
            "Advanced Decorators & functools",
            "Design Patterns (Strategy, Observer, Factory)",
            "Graph Algorithms (Topological Sort, Shortest Path)",
            "Dynamic Programming (Advanced)",
            "Concurrency (multiprocessing, GIL, threading)",
            "Type System (Protocol, TypeVar, Generic)",
            "Performance Profiling & Optimization",
            "Production Code Review & Refactoring",
        ],
        format: {
            sections: [
                {
                    type: "mcq",
                    label: "Multiple Choice Questions",
                    count: 5,
                    marks: 20,
                    weight: 20,
                    description:
                        "Expert-level MCQs on Python internals, metaclasses, GIL, memory model, and advanced language features.",
                },
                {
                    type: "coding",
                    label: "Coding Challenge",
                    count: 1,
                    marks: 50,
                    weight: 50,
                    description:
                        "A hard algorithmic challenge requiring advanced techniques like dynamic programming or graph traversal with optimal complexity.",
                },
                {
                    type: "debugging",
                    label: "Debugging & Refactoring",
                    count: 1,
                    marks: 30,
                    weight: 30,
                    description:
                        "Debug a complex production-grade Python module with subtle concurrency, scope, or design pattern issues.",
                },
            ],
        },
        rules: [
            "Duration: 150 minutes. The timer starts when you click 'Start Exam'.",
            "Passing Score: 70% (70/100 marks).",
            "All solutions must be in Python 3.10+.",
            "Tab switching is monitored and logged.",
            "Cooldown: 96 hours between retakes.",
            "Premium certification — requires Kibo Pro subscription.",
            "Code must demonstrate production-quality standards.",
            "The exam auto-submits when time expires.",
        ],
        icon: "⚡",
        image: pythonAdvancedImg,
    },
];
