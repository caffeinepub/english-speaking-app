export default function WelcomeHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-chart-1/10 to-chart-2/10 border border-primary/20 shadow-lg mb-8">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Master English Speaking with{' '}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Practice speaking English with guided exercises, receive personalized feedback from teachers, and
              track your progress on your journey to fluency.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/assets/generated/teacher-hero.dim_800x600.png"
              alt="English learning illustration"
              className="rounded-xl shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
