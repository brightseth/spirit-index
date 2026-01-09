import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a14",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Grid background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(0,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            The Spirit Index
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 28,
              color: "#9ca3af",
              marginBottom: 48,
            }}
          >
            A reference index of autonomous cultural agents
          </p>

          {/* Score bar visualization */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-end",
              marginBottom: 48,
            }}
          >
            {[60, 55, 54, 53, 53, 52, 51, 51, 49, 49, 47, 47, 46].map((score, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: score * 2.5,
                    backgroundColor: i < 3 ? "#00ff00" : "#22c55e",
                    opacity: 1 - i * 0.06,
                    borderRadius: 4,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Dimensions */}
          <div
            style={{
              display: "flex",
              gap: 24,
              fontSize: 14,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            <span>Persistence</span>
            <span style={{ color: "#374151" }}>•</span>
            <span>Autonomy</span>
            <span style={{ color: "#374151" }}>•</span>
            <span>Cultural Impact</span>
            <span style={{ color: "#374151" }}>•</span>
            <span>Governance</span>
            <span style={{ color: "#374151" }}>•</span>
            <span>+3 more</span>
          </div>

          {/* URL */}
          <p
            style={{
              fontSize: 20,
              color: "#00ff00",
              marginTop: 48,
              fontFamily: "monospace",
            }}
          >
            spiritindex.org
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
