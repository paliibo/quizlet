// import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
//
// type CheckboxProps = {
//   label: string;
//   setSelectedAnswers: Dispatch<SetStateAction<string | string[]>>;
// };
//
// export const Checkbox = ({ label, setSelectedAnswers }: CheckboxProps) => {
//   const [selected, setSelected] = useState<boolean>(false);
//   const hui = () => {
//     setSelected(prevState => {
//       return !prevState;
//     });
//     setSelectedAnswers(prevState => {
//       return typeof prevState === "string"
//         ? [label]
//         : prevState.includes(label)
//           ? prevState.filter(value => value !== label)
//           : [...prevState, label];
//     });
//   };
//   return (
//     <button className={"flex gap-2"} onClick={hui}>
//       <div className={"flex aspect-square h-6 w-6 items-center justify-center rounded-full bg-gray-400"}>
//         <div className={`aspect-square h-2/3 w-2/3 rounded-full ${selected ? "bg-gray-800" : ""}`}></div>
//       </div>
//       <div>{label}</div>
//     </button>
//   );
// };
// Checkbox.displayName = "Checkbox";
