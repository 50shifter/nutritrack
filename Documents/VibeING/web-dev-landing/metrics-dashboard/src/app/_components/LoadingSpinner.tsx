export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/30 text-sm">Загрузка метрик...</p>
      </div>
    </div>
  );
}