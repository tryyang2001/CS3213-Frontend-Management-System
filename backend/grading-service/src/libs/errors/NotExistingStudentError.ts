class NotExistingStudentError extends Error {
  constructor(studentId: number) {
    super(`Student with id ${studentId} does not exist`);
  }
}
