"use client"

import React, { useEffect, useState } from 'react';
import { AssignmentInfo, AssignmentQuestion } from './Assignment';


export default function AssignmentsPage() {
  const [assignmentsData, setAssignmentsData] = useState<AssignmentInfo[]>([]);

  useEffect(() => {
    // TODO: Remove and populate with API call to retrieve assignments
    const fetchAssignmentsData = () => {
      setTimeout(() => {
        const data: AssignmentInfo[] = [
          {
            id: 1,
            title: 'Sample 1',
            desc: 'Assignment description 1',
            inProgress: true,
          },
          {
            id: 2,
            title: 'Sample 2',
            desc: 'Assignment description 2',
            inProgress: false,
          },
          {
            id: 3,
            title: 'Sample 3',
            desc: 'Assignment description 3',
            inProgress: true,
          },
          {
            id: 4,
            title: 'Sample 4',
            desc: 'Assignment description 4',
            inProgress: false,
          },
          {
            id: 5,
            title: 'Sample 5',
            desc: 'Assignment description 5',
            inProgress: true,
          },
        ];
        setAssignmentsData(data);
      }, 1000); // Simulate a delay of 1 second
    };
    fetchAssignmentsData();
  }, []);

  return (
      <div className="container mx-auto pt-16 flex flex-col items-center">
        <h1 className="text-left">Assignment Page</h1>
              {assignmentsData.map((assignmentInfo) => (
        <AssignmentQuestion key={assignmentInfo.id} assignmentInfo={assignmentInfo} />
      ))}
      </div>
  );
};

