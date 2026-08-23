-- ============================================================
-- PLACIFY SEED DATA
-- Development dataset for testing and demonstration
-- ============================================================
-- This seed data is generic and suitable for any developer
-- testing the Placify platform.
-- ============================================================

-- ============================================================
-- 1. COURSES
-- ============================================================

INSERT INTO courses (id, title, description, category, difficulty, estimated_minutes, is_published) VALUES
('11111111-1111-1111-1111-111111111111', 'Python Fundamentals', 'Master the basics of Python programming including syntax, data structures, and core concepts.', 'Programming', 'beginner', 480, TRUE),
('22222222-2222-2222-2222-222222222222', 'Data Structures & Algorithms', 'Learn essential data structures and algorithms for technical interviews and efficient problem solving.', 'Computer Science', 'intermediate', 720, TRUE),
('33333333-3333-3333-3333-333333333333', 'Machine Learning Fundamentals', 'Introduction to machine learning concepts, algorithms, and practical applications using Python.', 'Data Science', 'intermediate', 600, TRUE),
('44444444-4444-4444-4444-444444444444', 'SQL for Data Analysis', 'Master SQL queries, joins, aggregations, and database optimization for data analysis.', 'Data Engineering', 'beginner', 360, TRUE),
('55555555-5555-5555-5555-555555555555', 'Web Development with React', 'Build modern web applications using React, hooks, and component-based architecture.', 'Web Development', 'intermediate', 540, TRUE),
('66666666-6666-6666-6666-666666666666', 'System Design Essentials', 'Learn to design scalable systems, understand trade-offs, and prepare for system design interviews.', 'System Design', 'advanced', 480, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. LESSONS - Python Fundamentals
-- ============================================================

INSERT INTO lessons (id, course_id, title, description, content, order_index, estimated_minutes) VALUES
('a0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Introduction to Python', 'Overview of Python, installation, and your first program.', 'Python is a high-level, interpreted programming language known for its simplicity and readability...', 0, 30),
('a0000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Variables and Data Types', 'Understanding variables, numbers, strings, and type conversion.', 'In Python, variables are containers for storing data values...', 1, 45),
('a0000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Control Flow', 'If statements, loops, and conditional logic.', 'Control flow determines the order in which code executes...', 2, 60),
('a0000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Functions and Modules', 'Creating reusable code with functions and organizing with modules.', 'Functions are reusable blocks of code that perform specific tasks...', 3, 60),
('a0000001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Lists and Dictionaries', 'Working with Python''s most common data structures.', 'Lists and dictionaries are fundamental Python data structures...', 4, 75),
('a0000001-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'File Handling', 'Reading and writing files in Python.', 'File handling allows programs to persist data beyond runtime...', 5, 45),
('a0000001-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Object-Oriented Programming', 'Classes, objects, inheritance, and polymorphism.', 'OOP organizes code into reusable objects with properties and methods...', 6, 90),
('a0000001-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Error Handling', 'Try-except blocks and debugging techniques.', 'Error handling prevents programs from crashing and provides graceful failure...', 7, 45),
('a0000001-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'Python Standard Library', 'Common modules: os, sys, datetime, json, and more.', 'The standard library provides built-in modules for common tasks...', 8, 30)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. LESSONS - Data Structures & Algorithms
-- ============================================================

INSERT INTO lessons (id, course_id, title, description, content, order_index, estimated_minutes) VALUES
('a0000002-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Algorithm Complexity', 'Understanding Big O notation and time/space complexity.', 'Algorithm complexity measures efficiency and scalability...', 0, 60),
('a0000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Arrays and Strings', 'Common patterns and techniques for array/string problems.', 'Arrays are fundamental data structures storing elements contiguously...', 1, 90),
('a0000002-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Linked Lists', 'Implementation and manipulation of singly and doubly linked lists.', 'Linked lists consist of nodes with data and pointers...', 2, 75),
('a0000002-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'Stacks and Queues', 'LIFO and FIFO data structures and their applications.', 'Stacks and queues are linear data structures with specific access patterns...', 3, 60),
('a0000002-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'Trees and Binary Search Trees', 'Tree traversals, BST operations, and balanced trees.', 'Trees are hierarchical data structures with root, nodes, and leaves...', 4, 90),
('a0000002-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'Graphs', 'Graph representations, BFS, DFS, and shortest path algorithms.', 'Graphs consist of vertices and edges representing relationships...', 5, 105),
('a0000002-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'Sorting Algorithms', 'Quick sort, merge sort, heap sort, and comparison.', 'Sorting arranges elements in a specific order for efficient searching...', 6, 90),
('a0000002-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', 'Dynamic Programming', 'Memoization, tabulation, and classic DP problems.', 'Dynamic programming solves complex problems by breaking into subproblems...', 7, 120),
('a0000002-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222', 'Interview Problem Patterns', 'Common patterns: sliding window, two pointers, backtracking.', 'Recognizing patterns helps solve unfamiliar problems efficiently...', 8, 90)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. LESSONS - Machine Learning Fundamentals
-- ============================================================

INSERT INTO lessons (id, course_id, title, description, content, order_index, estimated_minutes) VALUES
('a0000003-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Introduction to Machine Learning', 'Overview of ML concepts, types, and applications.', 'Machine learning enables computers to learn from data without explicit programming...', 0, 45),
('a0000003-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Python for ML', 'NumPy, Pandas, and data manipulation essentials.', 'NumPy and Pandas are foundational libraries for data science...', 1, 75),
('a0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Data Preprocessing', 'Cleaning, normalization, and feature engineering.', 'Data quality directly impacts model performance...', 2, 60),
('a0000003-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'Linear Regression', 'Simple and multiple linear regression implementation.', 'Linear regression models relationships between variables...', 3, 90),
('a0000003-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'Logistic Regression', 'Classification problems and probability prediction.', 'Logistic regression predicts binary outcomes using sigmoid function...', 4, 75),
('a0000003-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'Decision Trees', 'Tree-based models for classification and regression.', 'Decision trees split data based on feature values...', 5, 60),
('a0000003-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333', 'Model Evaluation', 'Accuracy, precision, recall, F1, and cross-validation.', 'Model evaluation metrics quantify performance...', 6, 75),
('a0000003-0000-0000-0000-000000000008', '33333333-3333-3333-3333-333333333333', 'Neural Networks Basics', 'Perceptrons, activation functions, and backpropagation.', 'Neural networks are inspired by biological neurons...', 7, 90)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. LESSONS - SQL for Data Analysis
-- ============================================================

INSERT INTO lessons (id, course_id, title, description, content, order_index, estimated_minutes) VALUES
('a0000004-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'SQL Basics', 'SELECT, FROM, WHERE, and basic querying.', 'SQL (Structured Query Language) manages relational databases...', 0, 45),
('a0000004-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Filtering and Sorting', 'WHERE conditions, ORDER BY, and LIMIT.', 'Filtering retrieves specific rows based on conditions...', 1, 45),
('a0000004-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'Aggregate Functions', 'COUNT, SUM, AVG, MIN, MAX, and GROUP BY.', 'Aggregates compute single values from multiple rows...', 2, 60),
('a0000004-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'Joins', 'INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN.', 'Joins combine data from multiple tables...', 3, 75),
('a0000004-0000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444444', 'Subqueries', 'Nested queries and derived tables.', 'Subqueries allow queries within queries for complex logic...', 4, 60),
('a0000004-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444', 'Window Functions', 'ROW_NUMBER, RANK, LEAD, LAG, and partitioning.', 'Window functions perform calculations across row sets...', 5, 75)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. CODING PROBLEMS
-- ============================================================

INSERT INTO coding_problems (id, title, description, difficulty, category, tags) VALUES
('b0000001-0000-0000-0000-000000000001', 'Two Sum', 'Given an array of integers, return indices of two numbers that add up to a target.', 'easy', 'Arrays', ARRAY['arrays', 'hash-table', 'two-pointers']),
('b0000001-0000-0000-0000-000000000002', 'Reverse Linked List', 'Reverse a singly linked list iteratively and recursively.', 'easy', 'Linked Lists', ARRAY['linked-list', 'recursion', 'pointers']),
('b0000001-0000-0000-0000-000000000003', 'Valid Parentheses', 'Determine if a string containing brackets is valid.', 'easy', 'Stacks', ARRAY['stack', 'string', 'parsing']),
('b0000001-0000-0000-0000-000000000004', 'Binary Tree Level Order Traversal', 'Return the level order traversal of a binary tree.', 'medium', 'Trees', ARRAY['tree', 'bfs', 'queue']),
('b0000001-0000-0000-0000-000000000005', 'Maximum Subarray', 'Find the contiguous subarray with the largest sum.', 'medium', 'Dynamic Programming', ARRAY['array', 'dynamic-programming', 'kadane']),
('b0000001-0000-0000-0000-000000000006', 'Longest Substring Without Repeating Characters', 'Find the length of the longest substring without repeating characters.', 'medium', 'Strings', ARRAY['string', 'hash-table', 'sliding-window']),
('b0000001-0000-0000-0000-000000000007', 'Merge K Sorted Lists', 'Merge k sorted linked lists into one sorted list.', 'hard', 'Linked Lists', ARRAY['linked-list', 'heap', 'divide-conquer']),
('b0000001-0000-0000-0000-000000000008', 'Word Ladder', 'Find the shortest transformation sequence from start word to end word.', 'hard', 'Graphs', ARRAY['graph', 'bfs', 'shortest-path']),
('b0000001-0000-0000-0000-000000000009', 'Median of Two Sorted Arrays', 'Find the median of two sorted arrays with O(log(m+n)) complexity.', 'hard', 'Binary Search', ARRAY['array', 'binary-search', 'divide-conquer']),
('b0000001-0000-0000-0000-00000000000a', 'LRU Cache', 'Design a data structure that follows Least Recently Used cache constraints.', 'medium', 'Design', ARRAY['design', 'hash-table', 'linked-list']),
('b0000001-0000-0000-0000-00000000000b', 'Group Anagrams', 'Group anagrams together from a list of strings.', 'medium', 'Strings', ARRAY['string', 'hash-table', 'sorting']),
('b0000001-0000-0000-0000-00000000000c', 'Climbing Stairs', 'Calculate distinct ways to climb n stairs taking 1 or 2 steps at a time.', 'easy', 'Dynamic Programming', ARRAY['dynamic-programming', 'recursion', 'fibonacci']),
('b0000001-0000-0000-0000-00000000000d', 'Implement Trie', 'Implement a trie (prefix tree) with insert, search, and startsWith methods.', 'medium', 'Trees', ARRAY['tree', 'design', 'string']),
('b0000001-0000-0000-0000-00000000000e', 'Course Schedule', 'Determine if you can finish all courses given prerequisites (cycle detection).', 'medium', 'Graphs', ARRAY['graph', 'dfs', 'topological-sort']),
('b0000001-0000-0000-0000-00000000000f', 'Serialize and Deserialize Binary Tree', 'Design algorithms to serialize and deserialize a binary tree.', 'hard', 'Trees', ARRAY['tree', 'design', 'dfs', 'bfs'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7. ROADMAPS
-- ============================================================

INSERT INTO roadmaps (id, name, target_role, description) VALUES
('c0000001-0000-0000-0000-000000000001', 'Machine Learning Engineer Path', 'Machine Learning Engineer', 'Complete roadmap for becoming a Machine Learning Engineer, covering programming, math, ML algorithms, and deep learning.'),
('c0000002-0000-0000-0000-000000000002', 'Full Stack Developer Path', 'Full Stack Developer', 'End-to-end web development roadmap covering frontend, backend, databases, and deployment.'),
('c0000003-0000-0000-0000-000000000003', 'Data Scientist Path', 'Data Scientist', 'Comprehensive path for data science including statistics, programming, ML, and data visualization.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. QUIZZES
-- ============================================================

INSERT INTO quizzes (id, title, description, category, difficulty) VALUES
('d0000001-0000-0000-0000-000000000001', 'Python Basics Quiz', 'Test your understanding of Python fundamentals.', 'Programming', 'easy'),
('d0000002-0000-0000-0000-000000000002', 'Data Structures Quiz', 'Assess your knowledge of common data structures.', 'Computer Science', 'medium'),
('d0000003-0000-0000-0000-000000000003', 'SQL Fundamentals Quiz', 'Evaluate your SQL querying skills.', 'Data Engineering', 'easy')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 9. QUIZ QUESTIONS - Python Basics Quiz
-- ============================================================

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index) VALUES
('d0000001-0000-0000-0000-000000000001', 'What is the correct way to create a list in Python?', 
  '["my_list = []", "my_list = {}", "my_list = ()", "my_list = <>"]'::jsonb,
  'my_list = []',
  'Square brackets [] are used to create lists in Python. Curly braces {} create dictionaries, parentheses () create tuples.',
  0),
('d0000001-0000-0000-0000-000000000001', 'Which keyword is used to define a function in Python?',
  '["function", "def", "func", "define"]'::jsonb,
  'def',
  'The "def" keyword is used to define functions in Python.',
  1),
('d0000001-0000-0000-0000-000000000001', 'What will print(type(5.0)) output?',
  '["<class ''int''>", "<class ''float''>", "<class ''double''>", "<class ''number''>"]'::jsonb,
  '<class ''float''>',
  'Numbers with decimal points are float type in Python, even if the decimal is .0',
  2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 10. QUIZ QUESTIONS - Data Structures Quiz
-- ============================================================

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index) VALUES
('d0000002-0000-0000-0000-000000000002', 'What is the time complexity of accessing an element in an array by index?',
  '["O(1)", "O(n)", "O(log n)", "O(n^2)"]'::jsonb,
  'O(1)',
  'Array access by index is constant time because the memory address can be calculated directly.',
  0),
('d0000002-0000-0000-0000-000000000002', 'Which data structure uses LIFO (Last In First Out) principle?',
  '["Queue", "Stack", "Linked List", "Tree"]'::jsonb,
  'Stack',
  'Stacks follow LIFO - the last element added is the first one removed.',
  1),
('d0000002-0000-0000-0000-000000000002', 'What traversal method visits nodes level by level in a tree?',
  '["Inorder", "Preorder", "Postorder", "Level Order (BFS)"]'::jsonb,
  'Level Order (BFS)',
  'Level order traversal uses BFS to visit all nodes at each level before moving to the next level.',
  2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. QUIZ QUESTIONS - SQL Fundamentals Quiz
-- ============================================================

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, order_index) VALUES
('d0000003-0000-0000-0000-000000000003', 'Which SQL clause is used to filter rows?',
  '["FILTER", "WHERE", "HAVING", "SELECT"]'::jsonb,
  'WHERE',
  'The WHERE clause filters rows based on specified conditions.',
  0),
('d0000003-0000-0000-0000-000000000003', 'What does INNER JOIN return?',
  '["All rows from both tables", "Only matching rows from both tables", "All rows from left table", "All rows from right table"]'::jsonb,
  'Only matching rows from both tables',
  'INNER JOIN returns only rows where the join condition is met in both tables.',
  1),
('d0000003-0000-0000-0000-000000000003', 'Which aggregate function counts the number of rows?',
  '["SUM()", "COUNT()", "TOTAL()", "NUM()"]'::jsonb,
  'COUNT()',
  'COUNT() returns the number of rows that match the specified criteria.',
  2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- END OF SEED DATA
-- ============================================================
