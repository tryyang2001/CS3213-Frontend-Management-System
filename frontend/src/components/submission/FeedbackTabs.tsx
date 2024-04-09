"use client";

import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Spacer,
  Divider,
  Code,
} from "@nextui-org/react";

interface Item {
  id: string;
  label: string;
  content: string[];
}

export default function FeedbackTabs() {
  const feedback = {
    line: 2,
    hints: ["Incorrect else block for if ( ((x % 2) == 1) )"],
  };

  const tabs = [
    {
      id: "testcases",
      label: "Test Cases",
      content: [
        "is_odd(1)",
        "is_odd(2)",
        "is_odd(3)",
        "is_odd(0)",
        "is_odd(-1)",
      ],
    },
    {
      id: "feedback",
      label: "Feedback",
      content: [`Line ${feedback.line.toString()}: ${feedback.hints[0]}`],
    },
    {
      id: "grades",
      label: "Grades",
      content: [
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      ],
    },
  ];

  const renderTabContent = (tabId: string, item: Item) => {
    if (tabId === "testcases") {
      return (
        <div className="flex flex-col gap-4">
          {item.content.map((testcase: string) => (
            <Code color="default" key={testcase}>
              {testcase}
            </Code>
          ))}
        </div>
      );
    } else if (tabId === "feedback") {
      return item.content[0];
    } else if (tabId === "grades") {
      return item.content[0];
    }
  };
  return (
    <div className="flex w-full flex-col">
      <Tabs color="primary" aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card style={{ height: "30%" }}>
              <CardBody>{renderTabContent(item.id, item)}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
