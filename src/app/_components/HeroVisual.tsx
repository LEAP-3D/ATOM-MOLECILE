type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
};

type Props = {
  mousePosition: { x: number; y: number };
  particles: Particle[];
  isHovering: boolean;
};

export default function HeroVisual({
  mousePosition,
  particles,
  isHovering,
}: Props) {
  return (
    <>
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-30"
          style={{
            background: `radial-gradient(circle, hsl(220, 70%, 50%), transparent)`,
            left: `${mousePosition.x * 0.4}%`,
            top: `${mousePosition.y * 0.4}%`,
            transform: "translate(-50%, -50%)",
          }}
        />

        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
          style={{
            background: `radial-gradient(circle, hsl(280, 65%, 60%), transparent)`,
            right: `${(100 - mousePosition.x) * 0.4}%`,
            bottom: `${(100 - mousePosition.y) * 0.4}%`,
            transform: "translate(50%, 50%)",
          }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: 0.7,
              transform: `scale(${isHovering ? 1.3 : 1})`,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        ))}
      </div>
    </>
  );
}
