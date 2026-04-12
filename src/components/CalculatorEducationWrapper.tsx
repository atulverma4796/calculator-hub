"use client";

import { CalculatorEducation as EducationData } from "@/lib/calculatorContent";
import CalculatorEducation from "./CalculatorEducation";

interface Props {
  data: EducationData;
  calculatorName: string;
  slug: string;
}

export default function CalculatorEducationWrapper({ data, calculatorName }: Props) {
  // For now, render with the static example.
  // In the future, individual calculators can pass dynamic examples
  // by lifting their state up or using context.
  return (
    <CalculatorEducation
      data={data}
      calculatorName={calculatorName}
    />
  );
}
