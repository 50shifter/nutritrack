import { Mail, Video, Image as ImageIcon, FileCheck, Camera } from "lucide-react";

interface Step {
  step: number;
  icon: typeof Camera;
  title: string;
  desc: string;
}

export const steps: Step[] = [
  {
    step: 1,
    icon: Mail,
    title: "Заявка",
    desc: "Вы оставляете заявку, мы связываемся в течение 24 часов",
  },
  {
    step: 2,
    icon: Video,
    title: "Обсуждение",
    desc: "Узнаём ваши пожелания, подбираем стиль и локацию",
  },
  {
    step: 3,
    icon: Camera,
    title: "Съёмка",
    desc: "Проводим съёмку в удобном для вас формате",
  },
  {
    step: 4,
    icon: ImageIcon,
    title: "Результат",
    desc: "Вы получаете обработанные фото в течение 2-3 недель",
  },
];
