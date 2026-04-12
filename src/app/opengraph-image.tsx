import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CalcHub — Free Online Calculators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            🧮
          </div>
          <div style={{ fontSize: "56px", fontWeight: 800, color: "white" }}>
            CalcHub
          </div>
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.9)",
            fontWeight: 600,
            marginBottom: "40px",
          }}
        >
          Free Online Calculators — No Signup Required
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "900px",
          }}
        >
          {["EMI", "SIP", "Mortgage", "Tax", "BMI", "Currency", "GST", "Salary"].map(
            (name) => (
              <div
                key={name}
                style={{
                  padding: "10px 24px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                {name}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          thecalchub.org
        </div>
      </div>
    ),
    { ...size }
  );
}
