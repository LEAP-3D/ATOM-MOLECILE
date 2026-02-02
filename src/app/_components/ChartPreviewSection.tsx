"use client";

export function ChartPreviewSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            See your data{" "}
            <span className="bg-gradient-to-r from-chart-3 to-chart-4 bg-clip-text text-transparent">
              come alive
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
