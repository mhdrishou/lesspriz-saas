import { lucide, type LucideProps } from "lucide-react";
import * as icons from "lucide-react";

interface IconProps extends LucideProps {
  name: string;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = (icons as any)[name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')] || icons.HelpCircle;
  return <IconComponent {...props} />;
};
