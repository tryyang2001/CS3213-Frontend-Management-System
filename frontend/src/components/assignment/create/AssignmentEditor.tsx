"use client";

import { Button, Input, Switch, Tooltip } from "@nextui-org/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import DescriptionField from "./DescriptionField";
import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { notFound, useRouter } from "next/navigation";
import DateUtils from "@/utils/dateUtils";
import FieldLabel from "./FieldLabel";
import Icons from "@/components/common/Icons";
import { useToast } from "@/components/ui/use-toast";
import { useAssignmentContext } from "@/contexts/assignment-context";
import { useUserContext } from "@/contexts/user-context";

interface Props {
  isEditing?: boolean;
}

export default function AssignmentEditor({ isEditing = false }: Props) {
  // states declaration
  const [title, setTitle] = useState("");
  const nextWeekDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  const defaultDeadline = new Date(
    nextWeekDate.getFullYear(),
    nextWeekDate.getMonth(),
    nextWeekDate.getDate(),
    23,
    59,
    59,
    999
  );
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [isTitleInvalid, setIsTitleInvalid] = useState(false);
  const [isDeadlineInvalid, setIsDeadlineInvalid] = useState(false);
  const [isDescriptionInvalid, setIsDescriptionInvalid] = useState(false);

  const router = useRouter();

  const { assignment, enableAddingQuestion } = useAssignmentContext();

  useEffect(() => {
    if (isEditing && assignment) {
      setTitle(assignment.title);
      setDeadline(new Date(assignment.deadline));
      setDescription(assignment.description ?? "");
      setIsPublished(assignment.isPublished);
    }
  }, []);

  const { user } = useUserContext();

  const { toast } = useToast();

  const checkFormValidity = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case "title":
          setIsTitleInvalid(value.length === 0 || value.length > 255);
          break;
        case "deadline":
          setIsDeadlineInvalid(new Date(value) < new Date());
          break;
        case "description":
          setIsDescriptionInvalid(value.length > 50000);
          break;
        default:
          break;
      }
    },
    [title, deadline, description]
  );

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      // update assignment
      AssignmentService.updateAssignment(assignment!.id, {
        title,
        deadline,
        description,
        isPublished,
        // if uid is alr in authors, don't add it again
        authors: assignment!.authors.includes(user.uid)
          ? assignment!.authors
          : [...assignment!.authors, user.uid],
      })
        .then((updatedAssignment) => {
          if (!updatedAssignment) {
            return notFound();
          }

          return toast({
            title: "Assignment updated successfully",
            description: "The assignment has been updated successfully.",
            variant: "success",
          });
        })
        .catch((_err) => {
          return toast({
            title: "Failed to update assignment",
            description:
              "An error occurred while updating the assignment. Please check the inputs and try again.",
            variant: "destructive",
          });
        });
    } else {
      // create assignment
      AssignmentService.createAssignment({
        title,
        deadline,
        description,
        isPublished,
        authors: [user.uid],
      })
        .then((createdAssignment) => {
          if (!createdAssignment) {
            return notFound();
          }

          // reset form values
          setTitle("");
          setDeadline(defaultDeadline);
          setDescription("");

          setIsTitleInvalid(false);
          setIsDeadlineInvalid(false);
          setIsDescriptionInvalid(false);

          // enable adding questions
          enableAddingQuestion(createdAssignment);

          // redirect to create questions page
          router.push(`/assignments/${createdAssignment.id}/questions/create`);
        })
        .catch((_err) => {
          return toast({
            title: "Failed to create assignment",
            description:
              "An error occurred while creating the assignment. Please check the inputs and try again.",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="mx-[8%]">
      <form className="grid mx-4 px-4 gap-8" onSubmit={handleFormSubmit}>
        {/* Title */}
        <div className="grid grid-cols-12">
          <FieldLabel isRequired>Title</FieldLabel>
          <Input
            className="col-span-9"
            value={title}
            onValueChange={(value) => {
              setTitle(value);
              checkFormValidity("title", value);
            }}
            placeholder="Enter you assignment title here"
            isInvalid={isTitleInvalid}
            errorMessage={
              isTitleInvalid &&
              "Title must be between 1 and 255 characters long"
            }
            isRequired
          />
        </div>

        {/* Deadline */}
        <div className="grid grid-cols-12">
          <FieldLabel isRequired>Deadline</FieldLabel>
          <Input
            className="col-span-4"
            type="datetime-local"
            value={DateUtils.toLocalISOString(deadline).slice(0, 16)}
            onValueChange={(dateString) => {
              setDeadline(new Date(dateString));
              checkFormValidity("deadline", dateString);
            }}
            isInvalid={isDeadlineInvalid}
            errorMessage={isDeadlineInvalid && "Deadline must be in the future"}
            isRequired
          />
        </div>

        {/* isPublished */}
        <div className="grid grid-cols-12">
          <FieldLabel isRequired>Publish now</FieldLabel>
          <Switch
            isSelected={isPublished}
            onValueChange={setIsPublished}
            color="success"
          >
            <div className="flex">
              {isPublished ? "Yes" : "No"}
              <Tooltip
                color="primary"
                content="Publishing an assignment will make the assignment to be visible for all the students in the course once the assignment is created"
              >
                <div className="flex items-center ml-[50%]">
                  <Icons.QuestionMark />
                </div>
              </Tooltip>
            </div>
          </Switch>
          <div className="ml-[10%] col-span-1 flex items-center"></div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-12">
          <FieldLabel>Description</FieldLabel>
          <DescriptionField
            className="col-span-9"
            value={description}
            handleValueChanges={(value) => {
              setDescription(value);
              // remove html tags before checking length
              const strippedValue = value.replace(/(<([^>]+)>)/gi, "");
              checkFormValidity("description", strippedValue);
            }}
            placeholder="Enter the details, instructions, or provide a short introduction to the assignment"
            isInvalid={isDescriptionInvalid}
            errorMessage="Description must be less than 50000 characters long"
          />
        </div>

        <div className="my-4 flex justify-end">
          <Button type="submit" color="primary">
            {isEditing ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
