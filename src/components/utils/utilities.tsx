"use client";
import Link from "next/link";

export const Utilities = () => {
  return (
    <div className={"absolute  right-0 top-0 flex gap-2 p-4 text-white"}>
      <Link
        className={"flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 hover:bg-purple-800"}
        href={"/create-quiz"}
      >
        Add New Quiz
      </Link>
    </div>
  );
};
