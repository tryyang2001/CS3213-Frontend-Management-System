"use client";

import { FileUpload } from "@/components/FileUpload";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

export default function Create() {

  const [numQuestions, setNumQuestions] = useState<number>(1);
  
  const handleNumQuestionsChange = (value: number) => {
    setNumQuestions(value);
  }
  
  const renderQuestionUploads = () => {
    const uploads = [];
    for (let i = 0; i < numQuestions; i++) {
      uploads.push(
        <div className="gap-12 pt-10 flex" key={i}>
          <div className="w-1/2 overflow-auto max-h-60">
            <h2 className="font-bold underline">Question {i + 1}</h2>
            <FileUpload expectedFileTypes={['html']}/>
          </div>
          <div className="w-1/2 overflow-auto max-h-60">
            <h2 className="font-bold underline">Suggested Soution {i + 1}</h2>
            <FileUpload expectedFileTypes={['py', 'java']}/>
          </div>
        </div>
      );
    }
    return uploads;
  };

    return (
      <div className="columns-auto p-12">
        <h1 className="font-bold text-4xl pb-3">Assignment Creation</h1>
        <Input label="Assignment Title"></Input>
        <div className="gap-12 pt-3 flex">
            <Input
              className="w-1/3"
              label="Number of questions"
              type="number"
              defaultValue={numQuestions.toString()}
              min={1}
              onChange={(e) => handleNumQuestionsChange(parseInt(e.target.value))}
            />
            <Input className="w-1/3" label="Deadline" type="datetime-local"/>
            <Button className="w-1/3" color="primary">Create Assignment</Button>
        </div>
          {renderQuestionUploads()}
      </div>
    );
  }