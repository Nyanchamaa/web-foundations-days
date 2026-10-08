PRAGMA foreign_keys = ON;

-- =========================================
-- TABLE CREATION
-- =========================================

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,

    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),

    UNIQUE (student_id, course_id)
);


-- =========================================
-- SAMPLE STUDENTS
-- =========================================

INSERT INTO students (student_id, name, email)
VALUES
    (1, 'Sharon Obara', 'sharon@example.com'),
    (2, 'Brian Kamau', 'brian@example.com'),
    (3, 'Mary Wanjiku', 'mary@example.com'),
    (4, 'David Otieno', 'david@example.com');


-- =========================================
-- SAMPLE COURSES
-- =========================================

INSERT INTO courses (course_id, course_name)
VALUES
    (1, 'Web Development'),
    (2, 'Database Systems'),
    (3, 'Cybersecurity');


-- =========================================
-- SAMPLE ENROLMENTS
-- =========================================

INSERT INTO enrolments (enrolment_id, student_id, course_id, grade)
VALUES
    (1, 1, 1, 'A'),
    (2, 1, 2, 'B'),
    (3, 2, 1, 'B'),
    (4, 2, 3, 'A'),
    (5, 3, 2, 'A');


-- =========================================
-- QUERY 1:
-- All courses for one student by name
-- =========================================

SELECT
    students.name AS student_name,
    courses.course_name,
    enrolments.grade
FROM students
JOIN enrolments
    ON students.student_id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE students.name = 'Sharon Obara';


-- =========================================
-- QUERY 2:
-- All students on one course
-- =========================================

SELECT
    courses.course_name,
    students.name AS student_name
FROM courses
JOIN enrolments
    ON courses.course_id = enrolments.course_id
JOIN students
    ON enrolments.student_id = students.student_id
WHERE courses.course_name = 'Web Development';


-- =========================================
-- QUERY 3:
-- Number of students per course
-- =========================================

SELECT
    courses.course_name,
    COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments
    ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id, courses.course_name;


-- =========================================
-- QUERY 4:
-- Students who have no enrolments
-- =========================================

SELECT
    students.student_id,
    students.name,
    students.email
FROM students
LEFT JOIN enrolments
    ON students.student_id = enrolments.student_id
WHERE enrolments.student_id IS NULL;


-- =========================================
-- QUERY 5:
-- Update one enrolment's grade
-- =========================================

UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 2;


-- Check the updated enrolment
SELECT
    students.name AS student_name,
    courses.course_name,
    enrolments.grade
FROM enrolments
JOIN students
    ON enrolments.student_id = students.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE enrolments.enrolment_id = 2;