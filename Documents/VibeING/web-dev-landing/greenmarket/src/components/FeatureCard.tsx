interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, desc, delay = 0 }: FeatureCardProps) {
  return (
    <div
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03] text-center hover:bg-white/[0.03] transition-all duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="text-green-light mb-3 flex justify-center">{icon}</div>
      <h3 className="font-bold text-sm mb-2">{title}</h3>
      <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}
