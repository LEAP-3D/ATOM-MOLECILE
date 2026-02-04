import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="relative z-10 max-w-5xl mx-auto text-center">
      <h1 className="text-6xl font-bold mb-6">
        Excel to{" "}
        <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
          Beautiful Charts
        </span>
      </h1>

      <p className="text-xl text-muted-foreground mb-10">
        Upload your spreadsheet and watch it transform into stunning charts.
      </p>

      <Link href="/charts">
        <button className="px-8 py-4 rounded-full bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-white">
          Try Charts
        </button>
      </Link>
    </div>
  );
}
