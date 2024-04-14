"use client";

import { Tabs, Tab, Card, CardBody, Code } from "@nextui-org/react";

interface Item {
  id: string;
  label: string;
  content: string[];
}

interface Props {
  submission?: Submission;
  testcases?: TestCase[];
}

export default function FeedbackTabs({ submission, testcases }: Props) {
  const feedback = submission ? submission.feedbacks : [];
  const feedbackContent = feedback.map(
    (fb) => `Line ${fb.line.toString()}: ${fb.hints[0]}`
  );
  const testcase = testcases ? testcases : [];
  const testcaseContent = testcase.map((tc) => `${tc.input}`);
  const tabs = [
    {
      id: "feedback",
      label: "Feedback",
      content: feedbackContent.length ? feedbackContent : ["Code is correct, no feedback required."],
    },
    {
      id: "testcases",
      label: "Test Cases",
      content: testcaseContent,
    },
  ];

  const renderTabContent = (item: Item) => {
    return (
      <div className="flex flex-col gap-4">
        {item.content.map((itemcontent: string) => (
          <Code color="default" key={itemcontent}>
            {itemcontent}
          </Code>
        ))}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs color="primary" aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card style={{ height: "30%" }}>
              <CardBody>{renderTabContent(item)}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
