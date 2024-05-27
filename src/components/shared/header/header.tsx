import { Utilities } from "@/components/utils";

export const Header = () => {
  return (
    <header>
      <div className={"flex justify-center"}>
        <h1 className={"text-4xl text-indigo-600"}>Quizbrain</h1>
      </div>
      <Utilities />
    </header>
  );
};
