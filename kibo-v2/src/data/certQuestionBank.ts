// ─── KCP-B01 Question Bank ──────────────────────────────────────────────────
// Client-side question bank for exam engine rendering.
// NOTE: In production, correct answers are NEVER sent to the client.
//       They live in Supabase and are only accessed by Edge Functions.
//       The `correctIndex` and `expectedOutput` fields below are used ONLY
//       for the client-side mock grading engine during development.

import type {
    MCQQuestion,
    CodingQuestion,
    DebuggingQuestion,
} from "@/components/certifications/types";

// ─── MCQ Questions (Section 3 of KCP-B01) ───────────────────────────────────

export const KCP_B01_MCQS: MCQQuestion[] = [
    {
        id: "mcq-1",
        certification_id: "kcp-b01",
        type: "mcq",
        title: "Mutable Default Arguments",
        marks: 4,
        order_index: 1,
        question_text:
            "Consider the following function definition and execution:\n\nWhat is the output of the second `print` statement?",
        code_snippet: `def audit_log(event, log=[]):
    log.append(event)
    return log

print(audit_log("Login"))
print(audit_log("Logout"))`,
        options: [
            "['Logout']",
            "['Login', 'Logout']",
            "['Login']",
            "TypeError",
        ],
        explanation:
            "In Python, default argument values are evaluated only once at function definition time. The list `log` persists across calls. The second call appends to the same list object created during the first call.",
        // DEV ONLY — stripped before sending to client in production
        _correctIndex: 1,
    },
    {
        id: "mcq-2",
        certification_id: "kcp-b01",
        type: "mcq",
        title: "Time Complexity in Loops",
        marks: 4,
        order_index: 2,
        question_text:
            "Which of the following implementations has a time complexity of O(N²)?",
        options: [
            "for x in my_list: print(x)",
            "my_set = set(my_list); for x in my_list: if x in my_set: pass",
            "for x in my_list: if x in my_list: pass",
            "my_dict = {x:x for x in my_list}; for x in my_list: print(my_dict[x])",
        ],
        explanation:
            "The `in` operator for a list performs a linear scan O(N). Doing this inside a for loop (which is also O(N)) results in O(N × N) = O(N²). Sets and Dictionaries have O(1) average lookups.",
        _correctIndex: 2,
    },
    {
        id: "mcq-3",
        certification_id: "kcp-b01",
        type: "mcq",
        title: "Scope and Closure",
        marks: 4,
        order_index: 3,
        question_text: "What does the following snippet print?",
        code_snippet: `handlers = [lambda x: x + i for i in range(3)]
print(handlers[0](10))`,
        options: ["10", "11", "12", "13"],
        explanation:
            'This is the "late binding" closure issue. The lambda function looks up `i` when it is called, not when it is defined. By the time `handlers[0](10)` is called, the loop has finished, and `i` holds the final value of 2. Thus, 10 + 2 = 12.',
        _correctIndex: 2,
    },
    {
        id: "mcq-4",
        certification_id: "kcp-b01",
        type: "mcq",
        title: "Reference vs. Value",
        marks: 4,
        order_index: 4,
        question_text: "What does `print(a)` output?",
        code_snippet: `a = [1, 2, 3]
b = a
c = a[:]
b[0] = 9
c[1] = 8
print(a)`,
        options: [
            "[1, 2, 3]",
            "[9, 8, 3]",
            "[9, 2, 3]",
            "[1, 8, 3]",
        ],
        explanation:
            "`b = a` assigns a reference; modifying `b` modifies `a`. `c = a[:]` creates a shallow copy (slicing); modifying `c` does not affect `a`. Therefore `a` sees the change from `b` but not `c`.",
        _correctIndex: 2,
    },
    {
        id: "mcq-5",
        certification_id: "kcp-b01",
        type: "mcq",
        title: "Dictionary Keys and Hashing",
        marks: 4,
        order_index: 5,
        question_text:
            "Which of the following is valid usage of a Python dictionary?",
        options: [
            '{ ["a", "b"]: 1 }',
            '{ {"a": 1}: 2 }',
            '{ ("a", "b"): 1 }',
            "{ {1, 2}: 3 }",
        ],
        explanation:
            "Dictionary keys must be immutable (hashable). Lists (A), Dictionaries (B), and Sets (D) are mutable and cannot be hashed. Tuples (C) are immutable and can be used as keys.",
        _correctIndex: 2,
    },
];

// ─── Coding Problem (Section 1 of KCP-B01) ──────────────────────────────────

export const KCP_B01_CODING: CodingQuestion[] = [
    {
        id: "coding-1",
        certification_id: "kcp-b01",
        type: "coding",
        title: 'The "Target Aggregate" Sub-sequence Analysis',
        marks: 40,
        order_index: 6,
        problem_statement: `You are analyzing a stream of financial transaction deltas (positive and negative integers). Your task is to identify how many continuous sub-sequences of these transactions sum up exactly to a specific target value \`k\`.

Write a function \`count_target_sequences(transactions, k)\` that returns the total count of continuous sub-arrays whose elements sum to \`k\`.

### Constraints

- \`1 ≤ n ≤ 100,000\` (where \`n\` is the length of transactions)
- \`-1,000 ≤ tᵢ ≤ 1,000\`
- \`-10⁷ ≤ k ≤ 10⁷\`

> **Performance Requirement:** The solution must run in **O(n)** time complexity. An O(n²) solution will fail the performance test suite.

### Expected Approach

**Time:** O(n) — Single pass using a cumulative sum frequency map.
**Space:** O(n) — To store the hash map of prefix sums.

### Common Wrong Approaches

- **Nested Loops (Brute Force):** O(n²) or O(n³) — will time out.
- **Sliding Window:** Fails because the array contains negative numbers.
- **Recursion without Memoization:** Exponential time complexity.`,
        input_format:
            "`transactions`: A list of integers `[t₁, t₂, ..., tₙ]`.\n`k`: An integer representing the target sum.",
        output_format:
            "Return a single integer representing the total number of valid continuous sub-sequences.",
        constraints: [
            "1 ≤ n ≤ 100,000",
            "-1,000 ≤ tᵢ ≤ 1,000",
            "-10⁷ ≤ k ≤ 10⁷",
            "Solution must be O(n) time complexity",
        ],
        examples: [
            {
                input: "transactions = [1, 1, 1], k = 2",
                output: "2",
                explanation:
                    "Sub-arrays [1, 1] (indices 0-1) and [1, 1] (indices 1-2).",
            },
            {
                input: "transactions = [1, 2, 3], k = 3",
                output: "2",
                explanation: "Sub-arrays [1, 2] and [3].",
            },
        ],
        starter_code: `def count_target_sequences(transactions, k):
    """
    Count continuous sub-arrays that sum to k.
    
    Args:
        transactions: List of integers
        k: Target sum (integer)
    
    Returns:
        Integer count of valid sub-sequences
    """
    # Write your solution here
    pass`,
        function_name: "count_target_sequences",
        // Hidden test cases used for grading (DEV ONLY)
        _hiddenTestCases: [
            { input: "[1, 1, 1], 2", output: "2" },
            { input: "[1, 2, 3], 3", output: "2" },
            { input: "[1, -1, 1], 1", output: "3" },
            { input: "[0, 0, 0], 0", output: "6" },
            { input: "[1, 2, 3], 10", output: "0" },
            { input: "[5], 5", output: "1" },
            { input: "[1, 2, -1], 2", output: "2" },
        ],
    },
];

// ─── Debugging Problem (Section 2 of KCP-B01) ───────────────────────────────

export const KCP_B01_DEBUGGING: DebuggingQuestion[] = [
    {
        id: "debug-1",
        certification_id: "kcp-b01",
        type: "debugging",
        title: "Merge Audit Intervals",
        marks: 30,
        order_index: 7,
        description:
            "The function `merge_audit_intervals` is intended to take a list of time intervals `[start, end]` and merge any overlapping intervals into a single continuous interval. The goal is to produce a clean timeline of activity.\n\nThere are **2 bugs** in the code below. Find and fix them.",
        buggy_code: `def merge_audit_intervals(intervals):
    """
    Merges overlapping time intervals for an audit log.
    intervals: A list of lists, e.g., [[1, 3], [2, 6], [8, 10]]
    Returns: A new list of merged intervals.
    """
    if not intervals:
        return []

    # BUG 1: Missing sort.
    # The logic assumes intervals are ordered by start time.
    
    merged = [intervals[0]]

    for current_start, current_end in intervals[1:]:
        last_interval = merged[-1]
        
        # BUG 2: Incorrect overlap logic.
        # Fails to account for cases where the current interval
        # is fully inside the last one (e.g., [1, 5] and [2, 3]).
        if current_start <= last_interval[1]:
            last_interval[1] = current_end
        else:
            merged.append([current_start, current_end])
    
    return merged`,
        expected_behavior:
            "The function should:\n1. Sort intervals by start time before processing.\n2. When merging overlapping intervals, use `max()` to handle cases where a new interval is completely enclosed by the previous one.\n\n**Expected fixes:**\n- Add `intervals.sort(key=lambda x: x[0])` before processing.\n- Change `last_interval[1] = current_end` to `last_interval[1] = max(last_interval[1], current_end)`.",
        hints: [
            "What happens if the input intervals are not sorted by start time?",
            "Consider the case [[1, 10], [2, 5]]. What should the merged result be?",
        ],
        // DEV ONLY
        _expectedFixedCode: `def merge_audit_intervals(intervals):
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_interval = merged[-1]
        if current_start <= last_interval[1]:
            last_interval[1] = max(last_interval[1], current_end)
        else:
            merged.append([current_start, current_end])
    return merged`,
        _testCases: [
            {
                input: "[[1, 3], [2, 6], [8, 10], [15, 18]]",
                output: "[[1, 6], [8, 10], [15, 18]]",
            },
            {
                input: "[[8, 10], [1, 3], [2, 6]]",
                output: "[[1, 6], [8, 10]]",
            },
            {
                input: "[[1, 10], [2, 5]]",
                output: "[[1, 10]]",
            },
            {
                input: "[[1, 2], [2, 3]]",
                output: "[[1, 3]]",
            },
            {
                input: "[[1, 1]]",
                output: "[[1, 1]]",
            },
        ],
    },
];

// ─── Combined question bank ─────────────────────────────────────────────────

export type AnyQuestion = MCQQuestion | CodingQuestion | DebuggingQuestion;

export interface ExamQuestionSet {
    mcqs: MCQQuestion[];
    coding: CodingQuestion[];
    debugging: DebuggingQuestion[];
}

/** Assemble a complete exam set for KCP-B01 */
export function assembleKCPB01Exam(): ExamQuestionSet {
    return {
        mcqs: KCP_B01_MCQS,
        coding: KCP_B01_CODING,
        debugging: KCP_B01_DEBUGGING,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── KCP-I01 Question Bank (Python Intermediate) ────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export const KCP_I01_MCQS: MCQQuestion[] = [
    {
        id: "int-mcq-1",
        certification_id: "kcp-i01",
        type: "mcq",
        title: "Generators & Lazy Evaluation",
        marks: 2.5,
        order_index: 1,
        question_text: "What is the key difference between a list comprehension and a generator expression?",
        code_snippet: `nums = [1, 2, 3, 4, 5]
squares_list = [x**2 for x in nums]
squares_gen  = (x**2 for x in nums)`,
        options: [
            "There is no difference; they produce the same object type.",
            "The generator expression computes all values upfront but stores them more efficiently.",
            "The generator expression produces values lazily, one at a time, using O(1) memory instead of O(n).",
            "Generator expressions are faster because they use C-level optimizations internally.",
        ],
        explanation:
            "A generator expression uses lazy evaluation — it yields one value at a time, consuming O(1) memory regardless of input size. A list comprehension materializes all values into memory at once (O(n)). This makes generators ideal for large datasets or infinite sequences.",
        _correctIndex: 2,
    },
    {
        id: "int-mcq-2",
        certification_id: "kcp-i01",
        type: "mcq",
        title: "Decorators",
        marks: 2.5,
        order_index: 2,
        question_text: "What does the following decorator produce?",
        code_snippet: `import functools

def trace(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@trace
def add(a, b):
    return a + b

print(add.__name__)`,
        options: [
            "wrapper",
            "add",
            "trace",
            "TypeError: __name__ is not defined",
        ],
        explanation:
            "`functools.wraps(func)` copies metadata (including `__name__`, `__doc__`, `__module__`) from the original function to the wrapper. Without `@functools.wraps`, `add.__name__` would return 'wrapper'. With it, the original name 'add' is preserved.",
        _correctIndex: 1,
    },
    {
        id: "int-mcq-3",
        certification_id: "kcp-i01",
        type: "mcq",
        title: "Abstract Base Classes",
        marks: 2.5,
        order_index: 3,
        question_text: "What happens when you try to instantiate `Dog` below?",
        code_snippet: `from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self):
        pass
    
    @abstractmethod
    def move(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

d = Dog()`,
        options: [
            "A Dog instance is created successfully, move() returns None",
            "TypeError: Can't instantiate abstract class Dog with abstract method move",
            "The code runs fine because Dog inherits move() from Animal",
            "AttributeError: Dog has no attribute 'move'",
        ],
        explanation:
            "A class that inherits from an ABC must implement ALL abstract methods. `Dog` only implements `speak()` but not `move()`. Attempting to instantiate it raises TypeError. Every abstract method must be overridden.",
        _correctIndex: 1,
    },
    {
        id: "int-mcq-4",
        certification_id: "kcp-i01",
        type: "mcq",
        title: "Context Managers",
        marks: 2.5,
        order_index: 4,
        question_text: "What is printed when running this code?",
        code_snippet: `class ManagedResource:
    def __enter__(self):
        print("acquired")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("released")
        return True  # suppress exceptions

with ManagedResource() as r:
    print("using")
    raise ValueError("oops")

print("after")`,
        options: [
            "acquired → using → ValueError is raised (program crashes)",
            "acquired → using → released → after",
            "acquired → using → released → ValueError is raised",
            "acquired → released → using → after",
        ],
        explanation:
            "`__exit__` returning `True` suppresses any exception raised inside the `with` block. So the ValueError is caught and silenced. Execution continues normally after the `with` block, printing 'after'.",
        _correctIndex: 1,
    },
    {
        id: "int-mcq-5",
        certification_id: "kcp-i01",
        type: "mcq",
        title: "itertools & Combinatorics",
        marks: 2.5,
        order_index: 5,
        question_text: "What does the following code output?",
        code_snippet: `from itertools import chain, repeat, islice

result = list(islice(chain([1, 2], repeat(0)), 6))
print(result)`,
        options: [
            "[1, 2, 0, 0, 0, 0]",
            "[1, 2, 0]",
            "[1, 2]",
            "The code runs forever (infinite loop)",
        ],
        explanation:
            "`chain([1, 2], repeat(0))` creates an iterator that first yields 1, 2 from the list, then yields 0 infinitely from `repeat(0)`. `islice(..., 6)` takes only the first 6 elements, preventing infinite iteration. Result: [1, 2, 0, 0, 0, 0].",
        _correctIndex: 0,
    },
    {
        id: "int-mcq-6",
        certification_id: "kcp-i01",
        type: "mcq",
        title: "Type Hints & Protocol",
        marks: 2.5,
        order_index: 6,
        question_text: "Which statement about Python's typing.Protocol is correct?",
        options: [
            "Protocol requires explicit inheritance — classes must subclass Protocol to be considered compatible.",
            "Protocol enables structural subtyping — any class with matching methods is compatible, without inheriting.",
            "Protocol is only for documentation; it has no effect on type checkers like mypy.",
            "Protocol and ABC are identical in functionality.",
        ],
        explanation:
            "typing.Protocol enables structural subtyping (duck typing for type checkers). Unlike ABC, classes don't need to explicitly inherit from a Protocol — they just need to implement the required methods/attributes. This is checked by static type checkers like mypy.",
        _correctIndex: 1,
    },
    {
        id: "int-mcq-7",
        certification_id: "kcp-i01",
        type: "mcq",
        title: "Asyncio Basics",
        marks: 2.5,
        order_index: 7,
        question_text: "What is the output of this asyncio code?",
        code_snippet: `import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return f"{name}-done"

async def main():
    results = await asyncio.gather(
        fetch("A", 0.3),
        fetch("B", 0.1),
        fetch("C", 0.2),
    )
    print(results)

asyncio.run(main())`,
        options: [
            "['B-done', 'C-done', 'A-done']  (completion order)",
            "['A-done', 'B-done', 'C-done']  (original order)",
            "The order is non-deterministic",
            "['A-done', 'C-done', 'B-done']",
        ],
        explanation:
            "`asyncio.gather()` runs coroutines concurrently but returns results in the ORDER THEY WERE PASSED, not completion order. Even though B finishes first (0.1s delay), the results list maintains the original order: ['A-done', 'B-done', 'C-done'].",
        _correctIndex: 1,
    },
    {
        id: "int-mcq-8",
        certification_id: "kcp-i01",
        type: "mcq",
        title: "Dunder Methods & Operator Overloading",
        marks: 2.5,
        order_index: 8,
        question_text: "What does `print(v1 + v2)` output?",
        code_snippet: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)`,
        options: [
            "TypeError: unsupported operand type(s) for +",
            "(4, 6)",
            "Vector(4, 6)",
            "Vector(1, 2, 3, 4)",
        ],
        explanation:
            "`__add__` defines the behavior of the `+` operator. It creates a new Vector with summed components. `__repr__` defines how the object is displayed. So `v1 + v2` creates `Vector(4, 6)` and `print()` uses `__repr__` to output 'Vector(4, 6)'.",
        _correctIndex: 2,
    },
];

export const KCP_I01_CODING: CodingQuestion[] = [
    {
        id: "int-coding-1",
        certification_id: "kcp-i01",
        type: "coding",
        title: "Shortest Path in Unweighted Graph (BFS)",
        marks: 25,
        order_index: 9,
        problem_statement: `You are given an unweighted, undirected graph represented as an adjacency list and two nodes — a \`start\` and an \`end\`. Find the **shortest path** (fewest edges) from \`start\` to \`end\`.

Write a function \`shortest_path(graph, start, end)\` that returns the shortest path as a list of nodes, or an empty list if no path exists.

### Constraints

- \`1 ≤ nodes ≤ 10,000\`
- \`0 ≤ edges ≤ 50,000\`
- Nodes are strings or integers

> **Performance Requirement:** Must use **BFS** for O(V + E) time complexity. DFS-based solutions will not find shortest paths.

### Expected Approach

**Time:** O(V + E) — BFS traversal.
**Space:** O(V) — For visited set and parent tracking.`,
        input_format:
            "`graph`: A dictionary where keys are nodes and values are lists of neighboring nodes.\n`start`: The starting node.\n`end`: The target node.",
        output_format:
            "Return a list of nodes representing the shortest path from start to end (inclusive). Return [] if no path exists.",
        constraints: [
            "1 ≤ nodes ≤ 10,000",
            "0 ≤ edges ≤ 50,000",
            "Must use BFS for correctness",
        ],
        examples: [
            {
                input: 'graph = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C"]}, start = "A", end = "D"',
                output: '["A", "B", "D"]',
                explanation: 'Shortest path from A to D is A → B → D (2 edges). A → C → D is equally valid.',
            },
        ],
        starter_code: `from collections import deque

def shortest_path(graph, start, end):
    """
    Find shortest path in an unweighted graph using BFS.
    
    Args:
        graph: Adjacency list (dict)
        start: Starting node
        end: Target node
    
    Returns:
        List of nodes in shortest path, or [] if unreachable
    """
    # Write your solution here
    pass`,
        function_name: "shortest_path",
        _hiddenTestCases: [
            { input: '{"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C"]}, "A", "D"', output: '["A", "B", "D"]' },
            { input: '{"A": ["B"], "B": ["A"], "C": ["D"], "D": ["C"]}, "A", "D"', output: '[]' },
            { input: '{"A": []}, "A", "A"', output: '["A"]' },
        ],
    },
    {
        id: "int-coding-2",
        certification_id: "kcp-i01",
        type: "coding",
        title: "Minimum Coin Change (Dynamic Programming)",
        marks: 25,
        order_index: 10,
        problem_statement: `Given a set of coin denominations and a target amount, find the **minimum number of coins** needed to make that amount. If it's impossible, return -1.

Write a function \`min_coins(coins, amount)\` that returns the minimum number of coins.

### Constraints

- \`1 ≤ len(coins) ≤ 20\`
- \`1 ≤ coins[i] ≤ 10,000\`
- \`0 ≤ amount ≤ 100,000\`

> **Performance Requirement:** Must use **Dynamic Programming** for O(amount × len(coins)) complexity. Recursive brute-force will time out.

### Expected Approach

**Time:** O(amount × n) — Bottom-up DP table.
**Space:** O(amount) — 1D DP array.`,
        input_format:
            "`coins`: A list of positive integers (coin denominations).\n`amount`: Target amount (non-negative integer).",
        output_format:
            "Return the minimum number of coins needed, or -1 if impossible.",
        constraints: [
            "1 ≤ len(coins) ≤ 20",
            "0 ≤ amount ≤ 100,000",
            "Solution must use dynamic programming",
        ],
        examples: [
            {
                input: "coins = [1, 5, 10, 25], amount = 30",
                output: "2",
                explanation: "25 + 5 = 30 (2 coins). Using 10+10+10 would be 3 coins.",
            },
            {
                input: "coins = [2], amount = 3",
                output: "-1",
                explanation: "It's impossible to make 3 with only denomination 2.",
            },
        ],
        starter_code: `def min_coins(coins, amount):
    """
    Find minimum coins needed to make the given amount.
    
    Args:
        coins: List of coin denominations
        amount: Target amount
    
    Returns:
        Minimum number of coins, or -1 if impossible
    """
    # Write your solution here
    pass`,
        function_name: "min_coins",
        _hiddenTestCases: [
            { input: "[1, 5, 10, 25], 30", output: "2" },
            { input: "[2], 3", output: "-1" },
            { input: "[1], 0", output: "0" },
            { input: "[1, 2, 5], 11", output: "3" },
            { input: "[3, 7], 1", output: "-1" },
        ],
    },
];

export const KCP_I01_DEBUGGING: DebuggingQuestion[] = [
    {
        id: "int-debug-1",
        certification_id: "kcp-i01",
        type: "debugging",
        title: "Observer Pattern Implementation",
        marks: 30,
        order_index: 11,
        description:
            "The following Observer pattern implementation has **3 bugs**. The `EventEmitter` class should allow subscribing to events, emitting events to notify all subscribers, and unsubscribing. Find and fix the bugs.",
        buggy_code: `class EventEmitter:
    def __init__(self):
        self._listeners = {}
    
    def on(self, event, callback):
        """Subscribe a callback to an event."""
        if event not in self._listeners:
            self._listeners[event] = []
        self._listeners[event] = callback  # BUG 1: overwrites instead of appending
    
    def emit(self, event, *args, **kwargs):
        """Notify all listeners of an event."""
        for callback in self._listeners[event]:  # BUG 2: KeyError if event not registered
            callback(*args, **kwargs)
    
    def off(self, event, callback):
        """Unsubscribe a callback from an event."""
        if event in self._listeners:
            self._listeners[event].pop(callback)  # BUG 3: pop() takes index, not value`,
        expected_behavior:
            "**Expected fixes:**\n1. Change `self._listeners[event] = callback` to `self._listeners[event].append(callback)` — should append to the list, not overwrite.\n2. Change `self._listeners[event]` to `self._listeners.get(event, [])` — safely handle events with no listeners.\n3. Change `.pop(callback)` to `.remove(callback)` — `pop()` takes an index, `remove()` takes a value.",
        hints: [
            "What happens when you assign a single value to a dict key that should hold a list?",
            "What happens when you access a dict key that doesn't exist?",
            "What's the difference between list.pop() and list.remove()?",
        ],
        _expectedFixedCode: `class EventEmitter:
    def __init__(self):
        self._listeners = {}
    
    def on(self, event, callback):
        if event not in self._listeners:
            self._listeners[event] = []
        self._listeners[event].append(callback)
    
    def emit(self, event, *args, **kwargs):
        for callback in self._listeners.get(event, []):
            callback(*args, **kwargs)
    
    def off(self, event, callback):
        if event in self._listeners:
            self._listeners[event].remove(callback)`,
        _testCases: [
            {
                input: 'emitter.on("click", handler1); emitter.on("click", handler2); emitter.emit("click")',
                output: "Both handler1 and handler2 are called",
            },
            {
                input: 'emitter.emit("unknown_event")',
                output: "No error, nothing happens",
            },
        ],
    },
];

/** Assemble a complete exam set for KCP-I01 */
export function assembleKCPI01Exam(): ExamQuestionSet {
    return {
        mcqs: KCP_I01_MCQS,
        coding: KCP_I01_CODING,
        debugging: KCP_I01_DEBUGGING,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── KCP-A01 Question Bank (Python Advanced) ───────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export const KCP_A01_MCQS: MCQQuestion[] = [
    {
        id: "adv-mcq-1",
        certification_id: "kcp-a01",
        type: "mcq",
        title: "GIL and Concurrency",
        marks: 4,
        order_index: 1,
        question_text:
            "Which statement about the Global Interpreter Lock (GIL) in CPython is correct?",
        options: [
            "The GIL prevents all forms of parallelism in Python, including multiprocessing.",
            "The GIL is released during I/O operations, allowing other threads to run.",
            "The GIL ensures thread-safe access to all Python objects, eliminating the need for locks.",
            "The GIL is present in all Python implementations, including PyPy and Jython.",
        ],
        explanation:
            "The GIL is released during I/O operations (file reads, network calls, sleep), allowing other threads to proceed. It does not prevent multiprocessing (separate processes). It only protects interpreter internals, not application-level data structures. PyPy has a GIL, but Jython does not.",
        _correctIndex: 1,
    },
    {
        id: "adv-mcq-2",
        certification_id: "kcp-a01",
        type: "mcq",
        title: "Metaclasses",
        marks: 4,
        order_index: 2,
        question_text: "What is the output of the following code?",
        code_snippet: `class Meta(type):
    def __new__(mcs, name, bases, namespace):
        namespace['registry'] = []
        cls = super().__new__(mcs, name, bases, namespace)
        cls.registry.append(name)
        return cls

class Base(metaclass=Meta):
    pass

class Child(Base):
    pass

print(Base.registry, Child.registry)`,
        options: [
            "['Base'] ['Child']",
            "['Base'] ['Base', 'Child']",
            "['Base', 'Child'] ['Child']",
            "['Base', 'Child'] ['Base', 'Child']",
        ],
        explanation:
            "Each class created through Meta gets a fresh `registry = []` in its namespace. `Base.registry` gets `['Base']` appended. `Child.registry` gets a new `[]` then `['Child']` appended. They are independent lists because `namespace['registry'] = []` creates a new list for each class.",
        _correctIndex: 0,
    },
    {
        id: "adv-mcq-3",
        certification_id: "kcp-a01",
        type: "mcq",
        title: "Async/Await Event Loop",
        marks: 4,
        order_index: 3,
        question_text: "What does the following asyncio code print?",
        code_snippet: `import asyncio

async def task(name, delay):
    print(f"start-{name}")
    await asyncio.sleep(delay)
    print(f"end-{name}")

async def main():
    await task("A", 0.2)
    await task("B", 0.1)

asyncio.run(main())`,
        options: [
            "start-A start-B end-B end-A",
            "start-A end-A start-B end-B",
            "start-A start-B end-A end-B",
            "The order is non-deterministic",
        ],
        explanation:
            "Because each `await` is sequential (not gathered), task A runs to completion before task B starts. `await task('A', 0.2)` blocks until A finishes, then `await task('B', 0.1)` runs. To run concurrently, you'd use `asyncio.gather()` or `asyncio.create_task()`.",
        _correctIndex: 1,
    },
    {
        id: "adv-mcq-4",
        certification_id: "kcp-a01",
        type: "mcq",
        title: "Descriptors Protocol",
        marks: 4,
        order_index: 4,
        question_text: "What does the following descriptor-based code print?",
        code_snippet: `class Validator:
    def __set_name__(self, owner, name):
        self.name = name
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name, 0)
    
    def __set__(self, obj, value):
        if not isinstance(value, int):
            raise TypeError(f"{self.name} must be int")
        obj.__dict__[self.name] = value

class Config:
    timeout = Validator()

c = Config()
c.timeout = 30
print(c.timeout, Config.timeout)`,
        options: [
            "30 30",
            "30 0",
            "30 <Validator object>",
            "TypeError is raised",
        ],
        explanation:
            "`c.timeout = 30` triggers `__set__`, storing 30 in `c.__dict__['timeout']`. `c.timeout` triggers `__get__` with `obj=c`, returning `c.__dict__['timeout']` = 30. `Config.timeout` triggers `__get__` with `obj=None`, returning `self` (the Validator instance).",
        _correctIndex: 2,
    },
    {
        id: "adv-mcq-5",
        certification_id: "kcp-a01",
        type: "mcq",
        title: "Memory Management & Garbage Collection",
        marks: 4,
        order_index: 5,
        question_text:
            "In CPython, which of the following scenarios would NOT be cleaned up by reference counting alone and requires the cyclic garbage collector?",
        options: [
            "A list that goes out of scope in a function",
            "Two objects that reference each other but are no longer reachable from global scope",
            "A large dictionary that is reassigned to an empty dict",
            "A closure that captures a local variable from an enclosing function",
        ],
        explanation:
            "Reference counting handles object deallocation when the count drops to zero. However, a reference cycle (A → B → A) keeps both counts at ≥ 1 forever. The cyclic garbage collector detects and breaks these cycles. The other options all result in reference counts naturally reaching zero.",
        _correctIndex: 1,
    },
];

export const KCP_A01_CODING: CodingQuestion[] = [
    {
        id: "adv-coding-1",
        certification_id: "kcp-a01",
        type: "coding",
        title: "Longest Increasing Subsequence with Path Reconstruction",
        marks: 50,
        order_index: 6,
        problem_statement: `Given a sequence of integers, find the **length** of the longest strictly increasing subsequence (LIS) and **reconstruct one valid LIS**.

Write a function \`find_lis(nums)\` that returns a tuple of two values:
1. The length of the LIS.
2. A list containing the actual longest increasing subsequence.

### Constraints

- \`1 ≤ n ≤ 50,000\` (length of nums)
- \`-10⁹ ≤ nums[i] ≤ 10⁹\`

> **Performance Requirement:** The solution must run in **O(n log n)** time complexity. An O(n²) DP solution will fail the performance tests.

### Expected Approach

**Time:** O(n log n) — Using patience sorting with binary search (bisect).
**Space:** O(n) — For tracking predecessors and reconstructing the path.

### Common Wrong Approaches

- **O(n²) DP:** Classic DP with nested loops will time out for n = 50,000.
- **Greedy without reconstruction:** Finding length alone is easier; reconstructing the actual subsequence requires tracking predecessors.
- **Incorrect binary search bounds:** Off-by-one errors in bisect usage.`,
        input_format:
            "`nums`: A list of integers `[n₁, n₂, ..., nₖ]`.",
        output_format:
            "Return a tuple `(length, subsequence)` where `length` is an integer and `subsequence` is a list of integers forming one valid LIS.",
        constraints: [
            "1 ≤ n ≤ 50,000",
            "-10⁹ ≤ nums[i] ≤ 10⁹",
            "Solution must be O(n log n) time complexity",
            "Must return both length AND the actual subsequence",
        ],
        examples: [
            {
                input: "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
                output: "(4, [2, 3, 7, 18])",
                explanation:
                    "The longest increasing subsequence is [2, 3, 7, 18] with length 4. Note: [2, 3, 7, 101] is also valid.",
            },
            {
                input: "nums = [0, 1, 0, 3, 2, 3]",
                output: "(4, [0, 1, 2, 3])",
                explanation:
                    "The LIS is [0, 1, 2, 3] with length 4.",
            },
        ],
        starter_code: `def find_lis(nums):
    """
    Find the longest strictly increasing subsequence.
    
    Args:
        nums: List of integers
    
    Returns:
        Tuple of (length, subsequence_list)
    """
    # Write your solution here
    pass`,
        function_name: "find_lis",
        _hiddenTestCases: [
            { input: "[10, 9, 2, 5, 3, 7, 101, 18]", output: "4" },
            { input: "[0, 1, 0, 3, 2, 3]", output: "4" },
            { input: "[7, 7, 7, 7]", output: "1" },
            { input: "[1]", output: "1" },
            { input: "[5, 4, 3, 2, 1]", output: "1" },
            { input: "[1, 2, 3, 4, 5]", output: "5" },
            { input: "[3, 1, 4, 1, 5, 9, 2, 6]", output: "4" },
        ],
    },
];

export const KCP_A01_DEBUGGING: DebuggingQuestion[] = [
    {
        id: "adv-debug-1",
        certification_id: "kcp-a01",
        type: "debugging",
        title: "Async Rate-Limited Task Processor",
        marks: 30,
        order_index: 7,
        description:
            "The function `process_tasks` is an async task processor that should:\n1. Accept a list of async task coroutines.\n2. Process them with a maximum concurrency limit (semaphore).\n3. Return results in the **original input order**, not completion order.\n\nThere are **3 bugs** in the code. Find and fix them.",
        buggy_code: `import asyncio

async def process_tasks(tasks, max_concurrent=3):
    """
    Process async tasks with a concurrency limit.
    Returns results in original order.
    """
    semaphore = asyncio.Semaphore(max_concurrent)
    results = {}
    
    async def run_task(index, coro):
        async with semaphore:
            result = coro  # BUG 1: not awaiting the coroutine
            results[index] = result
    
    # BUG 2: tasks are awaited sequentially, not concurrently
    for i, task in enumerate(tasks):
        await run_task(i, task)
    
    # BUG 3: dict ordering not guaranteed by insertion order in 
    # older Python; should sort by key
    return list(results.values())`,
        expected_behavior:
            "The function should:\n1. **Await** the coroutine inside `run_task` (`result = await coro`).\n2. Use `asyncio.gather()` to run tasks **concurrently**, not sequentially.\n3. Return results sorted by their original index key.\n\n**Expected fixes:**\n- Change `result = coro` to `result = await coro`.\n- Replace the sequential for-loop with `await asyncio.gather(*[run_task(i, t) for i, t in enumerate(tasks)])`.\n- Change `return list(results.values())` to `return [results[i] for i in range(len(tasks))]`.",
        hints: [
            "What happens when you assign a coroutine to a variable without awaiting it?",
            "How would you run multiple coroutines concurrently with asyncio?",
            "If tasks complete out of order, how do you ensure results maintain original ordering?",
        ],
        _expectedFixedCode: `import asyncio

async def process_tasks(tasks, max_concurrent=3):
    semaphore = asyncio.Semaphore(max_concurrent)
    results = {}
    
    async def run_task(index, coro):
        async with semaphore:
            result = await coro
            results[index] = result
    
    await asyncio.gather(*[run_task(i, t) for i, t in enumerate(tasks)])
    
    return [results[i] for i in range(len(tasks))]`,
        _testCases: [
            {
                input: "[asyncio.sleep(0.1), asyncio.sleep(0.05), asyncio.sleep(0.01)]",
                output: "[None, None, None]",
            },
        ],
    },
];

/** Assemble a complete exam set for KCP-A01 */
export function assembleKCPA01Exam(): ExamQuestionSet {
    return {
        mcqs: KCP_A01_MCQS,
        coding: KCP_A01_CODING,
        debugging: KCP_A01_DEBUGGING,
    };
}

/** Generic exam assembler — routes by certification ID */
export function assembleExamForCert(certId: string): ExamQuestionSet | null {
    switch (certId) {
        case "kcp-b01":
            return assembleKCPB01Exam();
        case "kcp-i01":
            return assembleKCPI01Exam();
        case "kcp-a01":
            return assembleKCPA01Exam();
        default:
            return null;
    }
}

// Extend MCQ type to include dev-only correct index
declare module "@/components/certifications/types" {
    interface MCQQuestion {
        _correctIndex?: number;
    }
    interface CodingQuestion {
        _hiddenTestCases?: { input: string; output: string }[];
    }
    interface DebuggingQuestion {
        _expectedFixedCode?: string;
        _testCases?: { input: string; output: string }[];
    }
}
