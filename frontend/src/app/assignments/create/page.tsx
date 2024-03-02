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
          <div className="w-1/2">
            <h2 className="font-bold underline">Question {i + 1}</h2>
            <FileUpload/>
          </div>
          <div className="w-1/2">
            <h2 className="font-bold underline">Suggested Soution {i + 1}</h2>
            <FileUpload/>
          </div>
        </div>
      );
    }
    return uploads;
  };

    return (
      <div className="columns-auto p-12">
        <div className="gap-12 pt-10 flex">
          <h1 className="font-bold text-4xl">Assignment Creation</h1>
          <Input label="Assignment Title"></Input>
        </div>
        <div className="gap-12 pt-10 flex">
            <Input 
              className="w-1/5"
              label="Number of questions"
              type="number"
              defaultValue={numQuestions.toString()}
              min={1}
              onChange={(e) => handleNumQuestionsChange(parseInt(e.target.value))}
            />
            <Input className="w-1/4" label="Deadline" type="date"/>
            <Input className="w-1/4" label="Deadline" type="time"/>
            <Button className="w-1/4" color="primary">Create Assignment</Button>
        </div>
          {renderQuestionUploads()}
      </div>
    );
  }