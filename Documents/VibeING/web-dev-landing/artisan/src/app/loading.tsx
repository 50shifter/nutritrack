export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="font-serif text-4xl font-bold tracking-tight mb-4">
          ARTISAN<span className="text-gold-light">.</span>
        </div>
        <div className="w-32 h-0.5 bg-white/[0.05] rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gold rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
}
