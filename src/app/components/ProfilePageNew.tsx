"use client";

import Header from "./ProfileHeader";
import Projects from "./ProfileProjects";

const graphicProjects = [
  {
    id: 1,
    views: "1.4K",
    likes: 268,
    gradient:
      "linear-gradient(135deg,#ff9a56,#ff6b6b,#ee5a6f)",
  },
  {
    id: 2,
    views: "319",
    likes: 91,
    gradient:
      "linear-gradient(135deg,#667eea,#a855f7,#ec4899)",
  },
];

export default function ProfilePageNew() {
  return (
    <div className="min-h-screen bg-black text-white p-12">
      <div className="max-w-6xl mx-auto">
        <Header />
        <Projects projects={graphicProjects} />
      </div>
    </div>
  );
}
