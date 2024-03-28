export const getUpdateQuestionRequestBody = () => {
  return {
    title: "Updated Question Title",
    description: "<p>Updated Question Description</p>",
    deadline: new Date("2024-12-31T23:59:59.999Z").getTime(),
  };
};
