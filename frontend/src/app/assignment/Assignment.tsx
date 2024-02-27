"use client";

import { Button, Card } from "@nextui-org/react"
import { useRouter } from "next/navigation"

export type AssignmentInfo = {
    id: number,
    title: string,
    desc: string,
    inProgress: boolean
}

export const AssignmentQuestion = ({assignmentInfo}: {assignmentInfo: AssignmentInfo}) => {
    const router = useRouter();
    const handlePress = () => {
        router.push(`/assignment/${assignmentInfo.id}`);
    };
 
    return (
        <Card className="w-3/5 h-20">
            <div className="p-4">
                <p>Assignment: {assignmentInfo.id} {assignmentInfo.title}</p>
                <p>{assignmentInfo.desc}</p>
                <Button className="bg-white text-black absolute inset-y-5 right-5" onPress={handlePress}>
                    {assignmentInfo.inProgress ? 'Continue' : 'New Attempt'}
                </Button>
            </div>
        </Card>
    )
}