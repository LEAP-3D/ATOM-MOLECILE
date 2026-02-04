type Project = {
  id: number;
  views: string;
  likes: number;
  gradient: string;
};

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Graphic</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((p) => (
          <div key={p.id}>
            <div
              className="h-72 rounded-2xl"
              style={{ background: p.gradient }}
            />

            <div className="mt-3 flex justify-between text-gray-400">
              <span>👁 {p.views}</span>
              <span>❤️ {p.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
