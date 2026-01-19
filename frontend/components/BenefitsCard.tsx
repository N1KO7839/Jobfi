import {Card, CardHeader, CardBody} from "@heroui/card";
import {Image} from "@heroui/image"

interface BenefitsCardProps{
    title: string
    description: string
}

export default function BenefitsCard({title, description}: BenefitsCardProps) {
    const iconName = title.replace(/ /g,'')
    console.log(iconName)
  return (
      <Card className="py-8 bg-background/60 dark:bg-purple-400/15" isBlurred>
        <Image
          alt="Icon"
          className="object-cover rounded-xl ml-5 mb-2"
          src={`/${iconName}.png`}
          width={48}
        />
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start gap-1">
        <h4 className="font-bold text-xl">{title}</h4>
        <p className="text-default-500">{description}</p>
      </CardHeader>
      
    </Card>
  );
}
