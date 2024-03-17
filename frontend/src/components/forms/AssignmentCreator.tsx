"use client";

import { useEffect, useState } from "react";
import { FileUpload } from "../FileUpload";
import { Button, Input } from "@nextui-org/react";

export default function AssignmentCreator() {
    const [formData, setFormData] = useState({
        assignmentTitle: "",
        numQuestions: "1",
        deadline: "",
        questions: [{ question: "", answer: "" }]
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleFileUpload = (questionIndex: number, type: string, fileContent: string) => {
        setFormData((prevFormData) => {
            const newQuestions = [...prevFormData.questions];
            const question = { ...newQuestions[questionIndex] };

            if (type === "question") {
                question.question = fileContent;
            } else if (type === "answer") {
                question.answer = fileContent;
            }

            newQuestions[questionIndex] = question;

            return {
                ...prevFormData,
                questions: newQuestions,
            };
        });
    }

    const handleSubmit = () => {
        const checkEmpty = (obj: any) => {
            for (let key in obj) {
                if (typeof obj[key] === 'object') {
                    if (checkEmpty(obj[key])) {
                        return true;
                    }
                } else if (obj[key] === "") {
                    return true;
                }
            }
            return false;
        };


        if (checkEmpty(formData)) {
            alert("Invalid or missing fields.");
        }
        // Continue with form submission logic
    };

    // To update the number of questions
    useEffect(() => {
        const newQuestions = [...formData.questions];
        // If numQuestions is greater than the current number of questions, add new questions
        while (newQuestions.length < parseInt(formData.numQuestions)) {
            newQuestions.push({ question: "", answer: "" });
        }

        // If numQuestions is less than the current number of questions, remove excess questions
        while (newQuestions.length > parseInt(formData.numQuestions)) {
            newQuestions.pop();
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            questions: newQuestions,
        }))
    }, [formData.numQuestions])

    const renderQuestionUploads = () => {
        const uploads = [];
        for (let i = 0; i < parseInt(formData.numQuestions); i++) {
            uploads.push(
                <div className="gap-12 pt-10 flex" key={i}>
                    <div className="w-1/2 overflow-auto max-h-60">
                        <h2 className="font-bold underline">Question {i + 1}</h2>
                        <FileUpload
                            expectedFileTypes={['html']}
                            questionIndex={i}
                            type="question"
                            onFileUpload={handleFileUpload}
                        />
                    </div>
                    <div className="w-1/2 overflow-auto max-h-60">
                        <h2 className="font-bold underline">Suggested Soution {i + 1}</h2>
                        <FileUpload
                            expectedFileTypes={['py', 'java']}
                            questionIndex={i}
                            type="answer"
                            onFileUpload={handleFileUpload}
                        />
                    </div>
                </div>
            );
        }
        return uploads;
    };

    return (
        <form className="columns-auto p-12">
            <Input
                label="Assignment Title"
                name="assignmentTitle"
                onChange={handleInputChange}
            />
            <div className="gap-12 pt-3 flex">
                <Input
                    className="w-1/3"
                    label="Number of questions"
                    type="number"
                    name="numQuestions"
                    defaultValue={formData.numQuestions}
                    min={1}
                    onChange={handleInputChange}
                />
                <Input
                    className="w-1/3"
                    label="Deadline"
                    name="deadline"
                    onChange={handleInputChange}
                    type="datetime-local"
                />
                <Button className="w-1/3" color="primary" onClick={handleSubmit}>Create Assignment</Button>
            </div>
            {renderQuestionUploads()}
        </form>
    );
}