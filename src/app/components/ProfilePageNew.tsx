// tumee
'use client';

import React, { useState } from 'react';

const graphicProjects = [
  {
    id: 1,
    views: '1.4K',
    likes: 268,
    badge: 'Free',
    gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 50%, #ee5a6f 100%)',
  },
  {
    id: 2,
    views: '319',
    likes: 91,
    badge: 'Free',
    gradient: 'linear-gradient(135deg, #667eea 0%, #a855f7 50%, #ec4899 100%)',
  },
  {
    id: 3,
    views: '139',
    likes: 45,
    badge: 'Free',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #2563eb 100%)',
  },
  {
    id: 4,
    views: '55',
    likes: 16,
    badge: 'Free',
    gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #000000 100%)',
  },
];

export default function ProfilePageNew() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <div style={styles.container}>
      {/* Profile Header */}
      <div style={styles.maxWidth}>
        <div style={styles.profileSection}>
          {/* Avatar */}
          <div style={styles.avatarWrapper}>
            <div style={styles.avatarGradient}>
              <div style={styles.avatarInner}>
                <span style={styles.avatarText}>PG</span>
              </div>
            </div>
            <div style={styles.onlineBadge}></div>
          </div>

          {/* Profile Info */}
          <div style={styles.profileInfo}>
            <div style={styles.nameSection}>
              <h1 style={styles.name}>pinegraphic</h1>
              <span style={styles.verifiedBadge}>✓</span>
            </div>
            {/* <p style={styles.username}>@mikeyi2a</p> */}
            <p style={styles.bio}>
              {/* Designing websites and MVPs @{' '} */}
              {/* <span style={styles.link}>i2astudio.com</span> */}
            </p>

            <div style={styles.detailsSection}>
              <div style={styles.detail}>
                <span>📍</span>
                <span>Ulaanbaatar</span>
              </div>
              <div style={styles.detail}>
                {/* <span>𝕏</span> */}
                {/* <span>@ituadesign</span> */}
              </div>
              <div style={styles.detail}>
                {/* <span>🔗</span> */}
                {/* <span style={styles.link}>i2astudio.com</span> */}
              </div>
            </div>

            <div style={styles.statsBox}>
              <span style={styles.statsLabel}>Total prompts</span>
              <span style={styles.statsNumber}>145  </span>
            </div>
          </div>
        </div>

        {/* Showcase Section */}
        <div style={styles.showcaseSection}>
          <h2 style={styles.showcaseTitle}>Graphic</h2>

          <div style={styles.projectsGrid}>
            {graphicProjects.map((project) => (
              <div
                key={project.id}
                style={{
                  ...styles.projectCard,
                  transform: hoveredProject === project.id ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Gradient Background */}
                <div
                  style={{
                    ...styles.projectGradient,
                    background: project.gradient,
                  }}
                >
                  {/* Mock Browser Window */}
                  <div style={styles.browserWindow}>
                    <div style={styles.browserControls}>
                      <div style={styles.controlRed}></div>
                      <div style={styles.controlYellow}></div>
                      <div style={styles.controlGreen}></div>
                    </div>
                    <div style={styles.browserContent}>
                      <div style={styles.contentLine1}></div>
                      <div style={styles.contentLine2}></div>
                      <div style={styles.contentBox}></div>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div style={styles.projectInfo}>
                  <div>
                    <div style={styles.projectStats}>
                      <span style={styles.stat}>
                        👁️ {project.views}
                      </span>
                      <span style={styles.stat}>
                        ❤️ {project.likes}
                      </span>
                    </div>
                  </div>
                  <span style={styles.badge}>{project.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '48px 24px',
  } as React.CSSProperties,

  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
  } as React.CSSProperties,

  profileSection: {
    display: 'flex',
    gap: '32px',
    marginBottom: '64px',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  avatarWrapper: {
    position: 'relative',
  } as React.CSSProperties,

  avatarGradient: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)',
    padding: '4px',
  } as React.CSSProperties,

  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  avatarText: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as React.CSSProperties,

  onlineBadge: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    width: '24px',
    height: '24px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    border: '4px solid #000000',
  } as React.CSSProperties,

  profileInfo: {
    flex: 1,
    minWidth: '300px',
  } as React.CSSProperties,

  nameSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  } as React.CSSProperties,

  name: {
    fontSize: '36px',
    fontWeight: '900',
    margin: 0,
  } as React.CSSProperties,

  verifiedBadge: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#ffffff',
  } as React.CSSProperties,

  username: {
    color: '#9ca3af',
    marginBottom: '16px',
    fontSize: '16px',
  } as React.CSSProperties,

  bio: {
    fontSize: '18px',
    marginBottom: '16px',
    lineHeight: '1.6',
  } as React.CSSProperties,

  link: {
    color: '#60a5fa',
    cursor: 'pointer',
  } as React.CSSProperties,

  detailsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    color: '#9ca3af',
    marginBottom: '24px',
  } as React.CSSProperties,

  detail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  statsBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    border: '1px solid #374151',
  } as React.CSSProperties,

  statsLabel: {
    color: '#9ca3af',
  } as React.CSSProperties,

  statsNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
  } as React.CSSProperties,

  showcaseSection: {
    marginTop: '64px',
  } as React.CSSProperties,

  showcaseTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '32px',
  } as React.CSSProperties,

  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '32px',
  } as React.CSSProperties,

  projectCard: {
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  } as React.CSSProperties,

  projectGradient: {
    borderRadius: '24px',
    padding: '32px',
    height: '320px',
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,

  browserWindow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    height: '100%',
  } as React.CSSProperties,

  browserControls: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  } as React.CSSProperties,

  controlRed: { 
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
  } as React.CSSProperties,

  controlYellow: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#fbbf24',
  } as React.CSSProperties,

  controlGreen: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  } as React.CSSProperties,

  browserContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as React.CSSProperties,

  contentLine1: {
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    width: '75%',
  } as React.CSSProperties,

  contentLine2: {
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    width: '50%',
  } as React.CSSProperties,

  contentBox: {
    height: '128px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    marginTop: '24px',
  } as React.CSSProperties,

  projectInfo: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  } as React.CSSProperties,

  projectTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  } as React.CSSProperties,

  projectStats: {
    display: 'flex',
    gap: '16px',
    color: '#9ca3af',
    fontSize: '14px',
  } as React.CSSProperties,

  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  } as React.CSSProperties,

  badge: {
    padding: '8px 16px',
    backgroundColor: '#1f2937',
    borderRadius: '20px',
    fontSize: '14px',
    border: '1px solid #374151',
  } as React.CSSProperties,
};