import * as RadioGroup from "@radix-ui/react-radio-group";
import { RadioGroupIndicator } from "@radix-ui/react-radio-group";
import { Dispatch, SetStateAction, useState } from "react";

type RadioButtons = {
  labels: string[];
  onAction: Dispatch<SetStateAction<string | string[]>>;
};
export const RadioButtons = ({ labels, onAction }: RadioButtons) => {
  const [active, setActive] = useState(0);
  return (
    <div className={"flex flex-col"}>
      {labels.map((label, index) => (
        <div
          className={"flex items-center gap-2 "}
          key={index}
          onClick={() => {
            setActive(index);
            onAction(label);
          }}
        >
          <div className={"flex aspect-square h-full w-[20px] items-center justify-center rounded-full bg-gray-400"}>
            <div className={`h-[11px] w-[11px] rounded-full ${active == index ? "bg-gray-800" : ""}`}> </div>
          </div>
          <span className={"text-black"}>{label}</span>
        </div>
      ))}
    </div>
  );
};
