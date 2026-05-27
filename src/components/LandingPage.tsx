"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-636b2.up.railway.app";
const SUPABASE_URL = "https://knxepfyubdkjyxkkxhfy.supabase.co";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [authState, setAuthState] = useState<"login" | "verify" | "done">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (loginMethod === "email") {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), name: name.trim() }),
        });
        const data = await res.json();
        if (data.user || res.ok) {
          setAuthState("verify");
        } else {
          setError(data.error || "Something went wrong.");
        }
      } else {
        const formattedPhone = phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formattedPhone, name: name.trim() }),
        });
        const data = await res.json();
        if (data.user || res.ok) {
          window.location.href = "/dashboard";
        } else {
          setError(data.error || "Something went wrong.");
        }
      }
    } catch {
      setError("Can't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Just hard redirect for dashboard — skip auth gate for now
  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  if (!mounted) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#0a0a0f" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🐦</div>
          <p style={{ color: "#52525b", fontSize: "14px" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#f4f4f5" }}>
      {/* Nav */}
      <nav style={{
        borderBottom: "1px solid rgba(39,39,42,0.3)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(10,10,15,0.8)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🐦</span>
            <span style={{ fontWeight: 700, color: "#f59e0b" }}>Wren</span>
            <span style={{ color: "#52525b", fontSize: "12px", display: "none" }}>AI That Does the Work</span>
          </div>
          <button onClick={goToDashboard} style={{
            padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer",
            backgroundColor: "rgba(24,24,27,0.8)", color: "#a1a1aa", fontSize: "13px", fontWeight: 500,
            transition: "all 0.15s",
          }}>
            Dashboard →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🐦</div>
          <h1 style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2, marginBottom: "12px" }}>
            AI That Does{" "}
            <span style={{ background: "linear-gradient(to right, #f59e0b, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              The Work
            </span>
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "16px", lineHeight: 1.6, marginBottom: "8px" }}>
            Tell Wren what to do. It posts to social media, analyzes your data, and builds you apps.
          </p>
          <p style={{ color: "#52525b", fontSize: "13px", marginBottom: "32px" }}>
            No tech skills. No setup codes. Just click, connect, and type.
          </p>

          {/* 3 tabs preview */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
            {[
              { emoji: "📱", label: "Social Media", desc: "Post to FB, IG, X, LinkedIn" },
              { emoji: "⚡", label: "Automations", desc: "Analyze data, schedule tasks" },
              { emoji: "🔮", label: "Imagine", desc: "Describe an app, Wren builds it" },
            ].map(tab => (
              <div key={tab.label} style={{
                padding: "12px 16px", borderRadius: "12px",
                backgroundColor: "rgba(24,24,27,0.8)", border: "1px solid rgba(39,39,42,0.5)",
                textAlign: "center", minWidth: "140px", flex: 1,
              }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>{tab.emoji}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>{tab.label}</div>
                <div style={{ fontSize: "11px", color: "#71717a" }}>{tab.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div style={{ display: "flex", gap: "4px", backgroundColor: "#18181b", borderRadius: "12px", padding: "4px", marginBottom: "12px" }}>
              <button
                onClick={() => { setLoginMethod("email"); setName(""); }}
                style={{
                  flex: 1, padding: "8px", borderRadius: "10px", border: "none", cursor: "pointer",
                  backgroundColor: loginMethod === "email" ? "#27272a" : "transparent",
                  color: loginMethod === "email" ? "#f4f4f5" : "#71717a",
                  fontSize: "13px", fontWeight: 500, transition: "all 0.2s",
                }}
              >
                📧 Email
              </button>
              <button
                onClick={() => { setLoginMethod("phone"); setName(""); }}
                style={{
                  flex: 1, padding: "8px", borderRadius: "10px", border: "none", cursor: "pointer",
                  backgroundColor: loginMethod === "phone" ? "#27272a" : "transparent",
                  color: loginMethod === "phone" ? "#f4f4f5" : "#71717a",
                  fontSize: "13px", fontWeight: 500, transition: "all 0.2s",
                }}
              >
                📱 Phone
              </button>
            </div>

            {authState === "login" ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  style={{
                    padding: "12px 16px", borderRadius: "12px", border: "1px solid #27272a",
                    backgroundColor: "#18181b", color: "#f4f4f5", fontSize: "14px",
                    outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#f59e0b55"}
                  onBlur={e => e.target.style.borderColor = "#27272a"}
                />
                <input
                  type={loginMethod === "email" ? "email" : "tel"}
                  value={loginMethod === "email" ? email : phone}
                  onChange={e => loginMethod === "email" ? setEmail(e.target.value) : setPhone(e.target.value)}
                  placeholder={loginMethod === "email" ? "you@email.com" : "(555) 123-4567"}
                  required
                  style={{
                    padding: "12px 16px", borderRadius: "12px", border: "1px solid #27272a",
                    backgroundColor: "#18181b", color: "#f4f4f5", fontSize: "14px",
                    outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#f59e0b55"}
                  onBlur={e => e.target.style.borderColor = "#27272a"}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer",
                    backgroundColor: "#f59e0b", color: "#09090b", fontSize: "14px",
                    fontWeight: 600, opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? "Sending..." : "Start →"}
                </button>
                {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}
                <p style={{ color: "#52525b", fontSize: "11px", marginTop: "4px" }}>
                  Enter your email or phone. No credit card needed.
                </p>
              </form>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#10b981", fontSize: "14px", marginBottom: "8px" }}>
                  ✅ Code sent! Check your inbox/texts.
                </div>
                <button
                  onClick={goToDashboard}
                  style={{
                    padding: "12px 24px", borderRadius: "12px", border: "none", cursor: "pointer",
                    backgroundColor: "#f59e0b", color: "#09090b", fontSize: "14px", fontWeight: 600,
                  }}
                >
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#52525b", fontSize: "12px" }}>
              <span>📘</span> Facebook
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#52525b", fontSize: "12px" }}>
              <span>📸</span> Instagram
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#52525b", fontSize: "12px" }}>
              <span>💼</span> LinkedIn
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#52525b", fontSize: "12px" }}>
              <span>🐦</span> X
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#52525b", fontSize: "12px" }}>
              <span>📊</span> Sheets
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#52525b", fontSize: "12px" }}>
              <span>📋</span> CRM
            </div>
          </div>
          <p style={{ color: "#3f3f46", fontSize: "11px", marginTop: "12px" }}>
            One click to connect. No auth codes. No setup.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(39,39,42,0.3)", padding: "20px", textAlign: "center" }}>
        <p style={{ color: "#3f3f46", fontSize: "12px" }}>
          🐦 Wren — Tiny bird. Massive results.
        </p>
      </footer>
    </div>
  );
}
