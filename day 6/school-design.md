# School Database Design

## Tables

### Students

The `students` table stores information about students. Each student has a unique
student ID, name and email address. The student ID is the primary key, while the
email address is unique to prevent duplicate student accounts.

### Courses

The `courses` table stores the courses offered by the school. Each course has a
unique course ID and a course name. The course ID is the primary key.

### Enrolments

The `enrolments` table records which students are enrolled in which courses. It
contains foreign keys referencing the `students` and `courses` tables. It also
stores the student's grade for the course.

The combination of `student_id` and `course_id` is unique, which prevents the
same student from being enrolled on the same course more than once.

## Relationships

There is a one-to-many relationship between students and enrolments because one
student can have many enrolments, while each enrolment belongs to one student.

There is also a one-to-many relationship between courses and enrolments because
one course can have many enrolments, while each enrolment belongs to one course.

Students and courses have a many-to-many relationship because a student can take
many courses and a course can have many students. The `enrolments` table is
therefore needed as a join table to represent this relationship. It also stores
additional information about the relationship, such as the student's grade.

## Index

I would add an index on `enrolments.course_id` because queries frequently need
to find all students enrolled in a particular course. An index would make these
lookups more efficient as the number of enrolments increases.

For example:

```sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);