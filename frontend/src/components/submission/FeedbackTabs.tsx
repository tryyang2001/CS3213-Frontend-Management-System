"use client";

import { Tabs, Tab, Card, CardBody, Code } from "@nextui-org/react";

interface Item {
  id: string;
  label: string;
  content: string[];
}

interface Props {
  submission?: Submission;
}

export default function FeedbackTabs({ submission }: Props) {
  const feedback = submission ? submission.feedbacks : [];
  const feedbackContent = feedback.map(
    (fb) => `Line ${fb.line.toString()}: ${fb.hints[0]}`
  );
  const testCases = [
    "is_odd(1)",
    "is_odd(2)",
    "is_odd(3)",
    "is_odd(0)",
    "is_odd(-1)",
  ];
  const grade = ["5/5"];

  const tabs = [
    {
      id: "testcases",
      label: "Test Cases",
      content: testCases,
    },
    {
      id: "feedback",
      label: "Feedback",
      content: feedbackContent,
    },
    {
      id: "grades",
      label: "Grades",
      content: grade,
    },
  ];

  const renderTabContent = (item: Item) => {
    return (
      <div className="flex flex-col gap-4">
        {item.content.map((testcase: string) => (
          <Code color="default" key={testcase}>
            {testcase}
          </Code>
        ))}
      </div>
    );
    // if (tabId === "testcases") {
    //   return (
    //     <div className="flex flex-col gap-4">
    //       {item.content.map((testcase: string) => (
    //         <Code color="default" key={testcase}>
    //           {testcase}
    //         </Code>
    //       ))}
    //     </div>
    //   );
    // } else if (tabId === "feedback") {
    //   return item.content[0];
    // } else if (tabId === "grades") {
    //   return item.content[0];
    // }
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
