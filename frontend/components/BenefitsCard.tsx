import { Card, CardHeader } from "@heroui/card";
import { Shapes, Clock, SlidersHorizontal, Zap } from "lucide-react";

interface BenefitsCardProps {
  title: string;
  description: string;
}

export default function BenefitsCard({
  title,
  description,
}: BenefitsCardProps) {
  return (
    <Card isBlurred className="py-8 bg-purple-400/15 dark:bg-purple-500/15">
      {
        {
          "Always Active": (
            <Clock
              className="ml-5 mb-2 text-purple-600 dark:text-purple-400"
              size={48}
            />
          ),
          Simple: (
            <Shapes
              className="ml-5 mb-2 text-purple-600 dark:text-purple-400"
              size={48}
            />
          ),
          Instant: (
            <Zap
              className="ml-5 mb-2 text-purple-600 dark:text-purple-400"
              size={48}
            />
          ),
          Relevant: (
            <SlidersHorizontal
              className="ml-5 mb-2 text-purple-600 dark:text-purple-400"
              size={48}
            />
          ),
        }[title]
      }
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start gap-1">
        <h4 className="font-bold text-xl">{title}</h4>
        <p className="text-default-500">{description}</p>
      </CardHeader>
    </Card>
  );
}
