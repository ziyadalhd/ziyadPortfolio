import type { SVGProps } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  Sun,
  Moon,
  Globe,
  MessageCircle,
  Mail,
  X,
  Plus,
  Pause,
  Play,
  Sparkle,
  CodeXml,
  FileText,
  Download,
} from "lucide-react";

const icons = {
  arrow: ArrowUpRight,
  down: ArrowDown,
  back: ArrowLeft,
  sun: Sun,
  moon: Moon,
  globe: Globe,
  chat: MessageCircle,
  mail: Mail,
  close: X,
  plus: Plus,
  pause: Pause,
  play: Play,
  spark: Sparkle,
  code: CodeXml,
  file: FileText,
  download: Download,
} as const;

export function Icon({
  name,
  ...props
}: Omit<SVGProps<SVGSVGElement>, "name"> & { name: keyof typeof icons }) {
  const Drawing = icons[name];
  return (
    <Drawing
      width={20}
      height={20}
      strokeWidth={1.7}
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}
