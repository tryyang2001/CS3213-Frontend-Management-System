"use client";

import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    // feel free to edit/remove this code
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-medium mt-4">
        Frontend Management System{" "}
        <span className="text-lime-500 font-semibold">Homepage</span>
      </h1>
      <p>This is a proof that NextUI is working :)</p>
      <Button
        color="primary"
        onClick={(_e) => {
          alert("Button clicked");
        }}
        className="my-4"
      >
        Click Me
      </Button>
    </div>
  );
}
