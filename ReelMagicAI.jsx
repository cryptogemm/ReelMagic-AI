import { useState, useEffect, useRef } from "react";

const SCREENS = ["splash", "login", "home", "upload", "processing", "preview", "export", "settings"];

const glowStyle = (color = "#a855f7") => ({
  boxShadow: `0 0 20px ${color}55, 0 0 60px ${color}22`,
});

function useAnimatedValue(target, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

// ── SPLASH ─────────────────────────────────────────────────────────────────
function SplashScreen({ onNext }) {
  const [phase, setPhase] = useState(0);
  const progress = useAnimatedValue(100, 2400);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1500);
    const t4 = setTimeout(onNext, 3000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%", background: "#050508",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Animated orbs */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: [340, 260, 200][i], height: [340, 260, 200][i],
          borderRadius: "50%",
          background: [`radial-gradient(circle, #7c3aed44, transparent)`,
            `radial-gradient(circle, #ec4899aa, transparent)`,
            `radial-gradient(circle, #06b6d444, transparent)`][i],
          top: ["10%", "60%", "35%"][i], left: ["-10%", "50%", "20%"][i],
          animation: `pulse${i} ${[4, 5, 3.5][i]}s ease-in-out infinite`,
          filter: "blur(30px)",
        }} />
      ))}

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
      }} />

      {/* Logo ring */}
      <div style={{
        position: "relative", marginBottom: 32,
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.6s, transform 0.6s",
        transform: phase >= 1 ? "scale(1)" : "scale(0.5)",
      }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="55" fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" strokeDasharray="8 4" />
          <circle cx="60" cy="60" r="44" fill="#0f0f1a" />
          <polygon points="48,38 48,82 86,60" fill="url(#logoGrad)" />
          <circle cx="60" cy="60" r="55" fill="none" stroke="url(#logoGrad)" strokeWidth="1" opacity="0.3" />
        </svg>
        <div style={{
          position: "absolute", inset: -8,
          borderRadius: "50%",
          background: "radial-gradient(circle, #a855f744 0%, transparent 70%)",
          animation: "splashPulse 2s ease-in-out infinite",
        }} />
      </div>

      <div style={{
        opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.5s 0.1s, transform 0.5s 0.1s",
        transform: phase >= 2 ? "translateY(0)" : "translateY(16px)",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 32, fontWeight: 900, letterSpacing: "-0.5px",
          background: "linear-gradient(135deg, #a855f7, #ec4899, #06b6d4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontFamily: "'Trebuchet MS', sans-serif",
        }}>ReelMagic AI</div>
        <div style={{ color: "#6366f1", fontSize: 13, letterSpacing: 3, marginTop: 4, textTransform: "uppercase" }}>
          Cinematic · Instant · Magical
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 80, width: "60%",
        opacity: phase >= 3 ? 1 : 0, transition: "opacity 0.4s",
      }}>
        <div style={{
          height: 3, background: "#1a1a2e", borderRadius: 99, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)",
            borderRadius: 99, transition: "width 0.1s",
          }} />
        </div>
        <div style={{ textAlign: "center", color: "#6b7280", fontSize: 11, marginTop: 8 }}>
          Loading AI Engine... {progress}%
        </div>
      </div>

      <style>{`
        @keyframes splashPulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:1} }
      `}</style>
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function LoginScreen({ onNext }) {
  const [tab, setTab] = useState("login");
  const [lang, setLang] = useState("en");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [focused, setFocused] = useState(null);

  const txt = {
    en: { title: "Welcome Back", sub: "Your AI studio awaits", email: "Email address", pass: "Password", btn: "Sign In", or: "or continue with", noAcc: "Don't have an account?", signup: "Sign Up", name: "Full Name", createAcc: "Create Account", haveAcc: "Already have an account?" },
    ur: { title: "خوش آمدید", sub: "آپ کا AI اسٹوڈیو انتظار میں ہے", email: "ای میل", pass: "پاس ورڈ", btn: "سائن ان", or: "یا جاری رکھیں", noAcc: "اکاؤنٹ نہیں ہے؟", signup: "سائن اپ", name: "پورا نام", createAcc: "اکاؤنٹ بنائیں", haveAcc: "پہلے سے اکاؤنٹ ہے؟" },
  }[lang];

  const inputStyle = (id) => ({
    width: "100%", padding: "14px 16px", background: focused === id ? "#16162a" : "#0d0d1f",
    border: `1.5px solid ${focused === id ? "#a855f7" : "#1e1e3a"}`,
    borderRadius: 14, color: "#e2e8f0", fontSize: 14, outline: "none",
    transition: "all 0.3s", boxSizing: "border-box",
    boxShadow: focused === id ? "0 0 16px #a855f733" : "none",
  });

  return (
    <div style={{
      width: "100%", height: "100%", background: "#050508",
      display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
    }}>
      {/* Top art */}
      <div style={{
        height: "35%", background: "linear-gradient(160deg, #0f0720 0%, #1a0533 50%, #050508 100%)",
        position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 50%, #7c3aed33 0%, transparent 60%)",
        }} />
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🎬</div>
          <div style={{
            fontSize: 26, fontWeight: 800,
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{txt.title}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{txt.sub}</div>
        </div>
        {/* Lang toggle */}
        <button onClick={() => setLang(l => l === "en" ? "ur" : "en")} style={{
          position: "absolute", top: 16, right: 16,
          background: "#1a1a2e", border: "1px solid #2d2d4e", borderRadius: 20,
          color: "#a855f7", fontSize: 11, padding: "5px 12px", cursor: "pointer",
          fontWeight: 700,
        }}>{lang === "en" ? "اردو" : "EN"}</button>
      </div>

      {/* Form area */}
      <div style={{
        flex: 1, background: "#07071a", borderRadius: "28px 28px 0 0",
        marginTop: -24, padding: "28px 24px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {/* Tabs */}
        <div style={{
          display: "flex", background: "#0d0d1f", borderRadius: 14, padding: 4,
        }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "10px", borderRadius: 10, border: "none",
              background: tab === t ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
              color: tab === t ? "#fff" : "#6b7280", fontWeight: 700, fontSize: 14,
              cursor: "pointer", transition: "all 0.3s",
            }}>{t === "login" ? txt.btn.replace("Sign In","Login") : txt.signup}</button>
          ))}
        </div>

        {tab === "signup" && (
          <input placeholder={txt.name} style={inputStyle("name")}
            onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
        )}
        <input placeholder={txt.email} value={email} onChange={e => setEmail(e.target.value)}
          style={inputStyle("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
        <input type="password" placeholder={txt.pass} value={pass} onChange={e => setPass(e.target.value)}
          style={inputStyle("pass")} onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)} />

        <button onClick={onNext} style={{
          width: "100%", padding: "15px",
          background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
          border: "none", borderRadius: 16, color: "#fff",
          fontSize: 16, fontWeight: 800, cursor: "pointer",
          ...glowStyle(),
          transition: "transform 0.1s",
        }}>{tab === "login" ? txt.btn : txt.createAcc} ✨</button>

        <div style={{ textAlign: "center", color: "#4b5563", fontSize: 12 }}>{txt.or}</div>

        {/* Social buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          {[["G", "#ea4335"], ["f", "#1877f2"], ["◎", "#000"]].map(([label, bg]) => (
            <button key={label} onClick={onNext} style={{
              flex: 1, padding: "12px", background: "#0d0d1f",
              border: "1.5px solid #1e1e3a", borderRadius: 14,
              color: "#e2e8f0", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900,
            }}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HOME DASHBOARD ─────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("home");
  const tabs = [
    { id: "home", icon: "⊞", label: "Home" },
    { id: "trending", icon: "🔥", label: "Trending" },
    { id: "create", icon: "✦", label: "" },
    { id: "library", icon: "▤", label: "Library" },
    { id: "profile", icon: "◎", label: "Profile" },
  ];

  const categories = ["All", "Cinematic", "Aesthetic", "Retro", "Minimal", "Dramatic"];
  const [cat, setCat] = useState("All");

  const templates = [
    { name: "Cosmic Drift", emoji: "🌌", color: "#7c3aed", uses: "2.4M" },
    { name: "Neon Pulse", emoji: "⚡", color: "#ec4899", uses: "1.8M" },
    { name: "Golden Hour", emoji: "🌅", color: "#f59e0b", uses: "3.1M" },
    { name: "Ocean Vibe", emoji: "🌊", color: "#06b6d4", uses: "1.2M" },
    { name: "Dark Luxury", emoji: "🖤", color: "#6366f1", uses: "987K" },
    { name: "Sakura Dream", emoji: "🌸", color: "#f472b6", uses: "2.7M" },
  ];

  return (
    <div style={{
      width: "100%", height: "100%", background: "#050508",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 12px",
        background: "linear-gradient(180deg, #0a0a1f 0%, #050508 100%)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Good evening 👋</div>
            <div style={{
              fontSize: 22, fontWeight: 900,
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Create Magic</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{
              width: 38, height: 38, borderRadius: 12,
              background: "#111125", border: "1px solid #1e1e3a",
              color: "#a855f7", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>🔔</button>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, cursor: "pointer",
            }}>👤</div>
          </div>
        </div>

        {/* Search */}
        <div style={{
          marginTop: 16, display: "flex", alignItems: "center",
          background: "#0d0d22", border: "1.5px solid #1e1e3a", borderRadius: 14,
          padding: "10px 14px", gap: 10,
        }}>
          <span style={{ color: "#4b5563" }}>🔍</span>
          <span style={{ color: "#374151", fontSize: 13 }}>Search templates, effects...</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 80px" }}>
        {/* Hero CTA */}
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{
            borderRadius: 20,
            background: "linear-gradient(135deg, #0f0720, #1a0533)",
            border: "1px solid #2d1a5e",
            padding: 20, position: "relative", overflow: "hidden",
            ...glowStyle("#7c3aed"),
          }}>
            <div style={{
              position: "absolute", right: -20, top: -20,
              width: 140, height: 140, borderRadius: "50%",
              background: "radial-gradient(circle, #a855f755, transparent)",
              filter: "blur(20px)",
            }} />
            <div style={{ fontSize: 12, color: "#a78bfa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              ✦ AI Powered
            </div>
            <div style={{
              fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6,
              lineHeight: 1.3,
            }}>Turn Photos into<br />Cinematic Reels</div>
            <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 16 }}>
              One tap · 4K quality · No watermark
            </div>
            <button onClick={() => onNavigate("upload")} style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              border: "none", borderRadius: 12, color: "#fff",
              padding: "12px 24px", fontSize: 14, fontWeight: 800,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            }}>
              ✦ Create AI Reel
              <span style={{ fontSize: 16 }}>→</span>
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          {[["12M+", "Reels Made"], ["4.9★", "Rating"], ["Free", "Forever"]].map(([v, l]) => (
            <div key={l} style={{
              flex: 1, background: "#0d0d22", border: "1px solid #1e1e3a",
              borderRadius: 14, padding: "12px 8px", textAlign: "center",
            }}>
              <div style={{
                fontSize: 16, fontWeight: 900,
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{v}</div>
              <div style={{ color: "#4b5563", fontSize: 10, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Category pills */}
        <div style={{ paddingLeft: 20, marginBottom: 16, display: "flex", gap: 8, overflowX: "auto", paddingRight: 20 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "7px 16px", borderRadius: 20, border: "none",
              background: cat === c ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#0d0d22",
              color: cat === c ? "#fff" : "#6b7280",
              fontSize: 12, fontWeight: cat === c ? 700 : 500,
              cursor: "pointer", whiteSpace: "nowrap",
              border: cat !== c ? "1px solid #1e1e3a" : "none",
            }}>{c}</button>
          ))}
        </div>

        {/* Templates grid */}
        <div style={{ padding: "0 20px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>🔥 Trending Templates</div>
            <div style={{ color: "#a855f7", fontSize: 12 }}>See all →</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {templates.map((t, i) => (
              <div key={i} onClick={() => onNavigate("upload")} style={{
                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                background: `linear-gradient(135deg, ${t.color}22, #0d0d22)`,
                border: `1px solid ${t.color}44`,
                padding: 16, position: "relative",
                transition: "transform 0.2s",
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{t.emoji}</div>
                <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                <div style={{ color: "#6b7280", fontSize: 10 }}>{t.uses} reels</div>
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  background: `${t.color}33`, border: `1px solid ${t.color}55`,
                  borderRadius: 6, padding: "3px 8px",
                  color: t.color, fontSize: 10, fontWeight: 700,
                }}>USE</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "#07071a", borderTop: "1px solid #1e1e3a",
        padding: "10px 0 20px",
        display: "flex", justifyContent: "space-around", alignItems: "center",
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => tab.id === "create" ? onNavigate("upload") : setActiveTab(tab.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}>
            {tab.id === "create" ? (
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginTop: -16,
                ...glowStyle(),
              }}>{tab.icon}</div>
            ) : (
              <>
                <span style={{
                  fontSize: 20,
                  filter: activeTab === tab.id ? "none" : "grayscale(1) opacity(0.4)",
                }}>{tab.icon}</span>
                <span style={{
                  fontSize: 9, color: activeTab === tab.id ? "#a855f7" : "#4b5563",
                  fontWeight: activeTab === tab.id ? 700 : 400,
                }}>{tab.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── UPLOAD ─────────────────────────────────────────────────────────────────
function UploadScreen({ onNext, onBack }) {
  const [dragging, setDragging] = useState(false);
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setPhoto(e.target.result);
    reader.readAsDataURL(file);
  };

  const styles = ["Cinematic", "Aesthetic", "Dreamy", "Epic", "Retro"];
  const [selStyle, setSelStyle] = useState("Cinematic");

  return (
    <div style={{
      width: "100%", height: "100%", background: "#050508",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 16px",
        display: "flex", alignItems: "center", gap: 14,
        borderBottom: "1px solid #111125",
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          background: "#0d0d22", border: "1px solid #1e1e3a",
          color: "#a855f7", fontSize: 18, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>←</button>
        <div>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16 }}>Upload Photo</div>
          <div style={{ color: "#4b5563", fontSize: 11 }}>Choose your masterpiece</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            borderRadius: 20, minHeight: 220,
            border: `2px dashed ${dragging ? "#a855f7" : photo ? "#7c3aed" : "#2d2d4e"}`,
            background: dragging ? "#0f0720" : photo ? "transparent" : "#07071a",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.3s", position: "relative", overflow: "hidden",
            ...(dragging ? glowStyle() : {}),
          }}>
          {photo ? (
            <>
              <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18 }} />
              <div style={{
                position: "absolute", bottom: 12, right: 12,
                background: "#7c3aed", borderRadius: 8, padding: "6px 12px",
                color: "#fff", fontSize: 12, fontWeight: 700,
              }}>✓ Ready</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 6 }}>Drop photo here</div>
              <div style={{ color: "#4b5563", fontSize: 12 }}>or tap to browse</div>
              <div style={{ color: "#2d2d4e", fontSize: 11, marginTop: 8 }}>JPG, PNG, HEIC up to 50MB</div>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])} />
        </div>

        {/* Quick sources */}
        <div style={{ display: "flex", gap: 10 }}>
          {[["📷", "Camera"], ["🖼", "Gallery"], ["☁️", "Cloud"], ["🔗", "URL"]].map(([ic, lb]) => (
            <button key={lb} onClick={() => fileRef.current?.click()} style={{
              flex: 1, padding: "12px 4px",
              background: "#0d0d22", border: "1px solid #1e1e3a", borderRadius: 14,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 20 }}>{ic}</span>
              <span style={{ color: "#6b7280", fontSize: 10 }}>{lb}</span>
            </button>
          ))}
        </div>

        {/* Style selector */}
        <div>
          <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 12, fontSize: 15 }}>
            🎨 Choose Style
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
            {styles.map(s => (
              <button key={s} onClick={() => setSelStyle(s)} style={{
                padding: "8px 16px", borderRadius: 12, border: "none",
                background: selStyle === s
                  ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                  : "#0d0d22",
                color: selStyle === s ? "#fff" : "#6b7280",
                fontSize: 13, fontWeight: selStyle === s ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap",
                border: selStyle !== s ? "1px solid #1e1e3a" : "none",
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Aspect ratio */}
        <div>
          <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 12, fontSize: 15 }}>
            📐 Aspect Ratio
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[["9:16", "Reel/Story"], ["1:1", "Square"], ["16:9", "Landscape"]].map(([r, l]) => (
              <div key={r} style={{
                flex: 1, background: r === "9:16" ? "#0f0720" : "#0d0d22",
                border: `1.5px solid ${r === "9:16" ? "#7c3aed" : "#1e1e3a"}`,
                borderRadius: 14, padding: "14px 8px", textAlign: "center", cursor: "pointer",
              }}>
                <div style={{ color: r === "9:16" ? "#a855f7" : "#e2e8f0", fontWeight: 700, fontSize: 14 }}>{r}</div>
                <div style={{ color: "#4b5563", fontSize: 10, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button onClick={onNext} style={{
          width: "100%", padding: "17px",
          background: photo
            ? "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)"
            : "#1a1a2e",
          border: "none", borderRadius: 18, color: photo ? "#fff" : "#4b5563",
          fontSize: 16, fontWeight: 800, cursor: photo ? "pointer" : "not-allowed",
          ...(photo ? glowStyle() : {}),
          transition: "all 0.3s",
        }}>
          {photo ? "✨ Generate AI Reel" : "Select a photo first"}
        </button>
      </div>
    </div>
  );
}

// ── PROCESSING ─────────────────────────────────────────────────────────────
function ProcessingScreen({ onNext }) {
  const [step, setStep] = useState(0);
  const progress = useAnimatedValue(100, 4000);

  const steps = [
    { icon: "🔍", text: "Analyzing photo..." },
    { icon: "🧠", text: "AI detecting subjects..." },
    { icon: "🎬", text: "Generating cinematic motion..." },
    { icon: "🎵", text: "Syncing with music beats..." },
    { icon: "✨", text: "Applying AI effects..." },
    { icon: "📦", text: "Rendering 4K output..." },
  ];

  useEffect(() => {
    const intervals = steps.map((_, i) =>
      setTimeout(() => setStep(i), (i * 4000) / steps.length)
    );
    const done = setTimeout(onNext, 4200);
    return () => [...intervals, done].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%", background: "#050508",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, gap: 32,
    }}>
      {/* Animated rings */}
      <div style={{ position: "relative", width: 180, height: 180 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            inset: `${i * 24}px`,
            borderRadius: "50%",
            border: `2px solid transparent`,
            borderTopColor: ["#a855f7", "#ec4899", "#06b6d4"][i],
            animation: `spin${i} ${[1.2, 1.8, 2.4][i]}s linear infinite`,
          }} />
        ))}
        <div style={{
          position: "absolute", inset: "54px",
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30,
        }}>🎬</div>

        {/* Orbiting dot */}
        <div style={{
          position: "absolute", inset: 0,
          animation: "orbit 1.5s linear infinite",
        }}>
          <div style={{
            position: "absolute", top: 4, left: "50%",
            width: 10, height: 10, borderRadius: "50%",
            background: "#a855f7", marginLeft: -5,
            boxShadow: "0 0 10px #a855f7",
          }} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 22, fontWeight: 800,
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 8,
        }}>AI Magic in Progress</div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>Creating your cinematic reel...</div>
      </div>

      {/* Progress */}
      <div style={{ width: "100%" }}>
        <div style={{
          height: 6, background: "#111125", borderRadius: 99, overflow: "hidden", marginBottom: 10,
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)",
            borderRadius: 99, transition: "width 0.1s",
            boxShadow: "0 0 12px #a855f7",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "#a855f7", fontSize: 13, fontWeight: 700 }}>
            {steps[step]?.icon} {steps[step]?.text}
          </div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>{progress}%</div>
        </div>
      </div>

      {/* Step list */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 16px", borderRadius: 12,
            background: i <= step ? "#0f0720" : "#07071a",
            border: `1px solid ${i < step ? "#7c3aed" : i === step ? "#a855f788" : "#111125"}`,
            transition: "all 0.3s",
          }}>
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <span style={{
              flex: 1, fontSize: 13, color: i <= step ? "#e2e8f0" : "#374151",
            }}>{s.text}</span>
            {i < step && <span style={{ color: "#22c55e", fontSize: 16 }}>✓</span>}
            {i === step && (
              <div style={{
                width: 16, height: 16, border: "2px solid #a855f7",
                borderTopColor: "transparent", borderRadius: "50%",
                animation: "spin0 0.8s linear infinite",
              }} />
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin0 { to { transform: rotate(360deg); } }
        @keyframes spin1 { to { transform: rotate(-360deg); } }
        @keyframes spin2 { to { transform: rotate(360deg); } }
        @keyframes orbit { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── PREVIEW ────────────────────────────────────────────────────────────────
function PreviewScreen({ onNext, onBack }) {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [effect, setEffect] = useState(0);

  const effects = ["🌌 Cosmic", "⚡ Neon", "🌅 Golden", "🌊 Ocean"];

  return (
    <div style={{
      width: "100%", height: "100%", background: "#050508",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #111125", flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10, background: "#0d0d22",
          border: "1px solid #1e1e3a", color: "#a855f7", fontSize: 18,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>←</button>
        <div style={{ color: "#e2e8f0", fontWeight: 700 }}>Preview Reel</div>
        <button onClick={() => setLiked(l => !l)} style={{
          background: "none", border: "none", fontSize: 22, cursor: "pointer",
        }}>{liked ? "❤️" : "🤍"}</button>
      </div>

      {/* Video preview mockup */}
      <div style={{
        margin: "16px 20px",
        borderRadius: 20, aspectRatio: "9/16", maxHeight: 300,
        background: "linear-gradient(160deg, #1a0533, #0a1628, #001a1a)",
        border: "1.5px solid #2d1a5e",
        position: "relative", overflow: "hidden",
        ...glowStyle("#7c3aed"),
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {/* Animated background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 40%, #7c3aed33, transparent 50%), radial-gradient(ellipse at 70% 70%, #ec489933, transparent 50%)",
          animation: "bgPulse 3s ease-in-out infinite",
        }} />

        {/* Particle dots */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
            borderRadius: "50%",
            background: ["#a855f7", "#ec4899", "#06b6d4"][i % 3],
            top: `${10 + i * 7}%`, left: `${10 + (i * 17) % 80}%`,
            animation: `float${i % 3} ${2 + i * 0.3}s ease-in-out infinite`,
            opacity: 0.7,
          }} />
        ))}

        <div style={{ textAlign: "center", zIndex: 1 }}>
          <button onClick={() => setPlaying(p => !p)} style={{
            width: 60, height: 60, borderRadius: "50%",
            background: playing ? "rgba(236,72,153,0.8)" : "rgba(124,58,237,0.8)",
            border: "2px solid #fff3",
            fontSize: 24, cursor: "pointer",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s",
            ...glowStyle(playing ? "#ec4899" : "#7c3aed"),
          }}>{playing ? "⏸" : "▶"}</button>
          <div style={{ color: "#ffffff88", fontSize: 11, marginTop: 8 }}>
            {playing ? "Playing..." : "Tap to play"}
          </div>
        </div>

        {/* Duration badge */}
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          background: "#00000088", backdropFilter: "blur(4px)",
          borderRadius: 6, padding: "3px 8px", color: "#fff", fontSize: 11,
        }}>0:15</div>

        {/* Effect label */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "#7c3aed88", backdropFilter: "blur(4px)",
          borderRadius: 8, padding: "4px 10px", color: "#fff", fontSize: 11, fontWeight: 700,
        }}>{effects[effect]}</div>
      </div>

      {/* Effects */}
      <div style={{ padding: "0 20px 12px", flexShrink: 0 }}>
        <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 10 }}>✨ AI Effects</div>
        <div style={{ display: "flex", gap: 8 }}>
          {effects.map((ef, i) => (
            <button key={i} onClick={() => setEffect(i)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 12,
              background: effect === i ? "#0f0720" : "#0d0d22",
              border: `1.5px solid ${effect === i ? "#a855f7" : "#1e1e3a"}`,
              color: effect === i ? "#a855f7" : "#6b7280",
              fontSize: 11, cursor: "pointer", fontWeight: effect === i ? 700 : 400,
            }}>{ef}</button>
          ))}
        </div>
      </div>

      {/* Music section */}
      <div style={{
        margin: "0 20px 16px",
        background: "#0d0d22", border: "1px solid #1e1e3a", borderRadius: 16,
        padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>🎵</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>Midnight Dreams</div>
          <div style={{ color: "#6b7280", fontSize: 11 }}>Auto-synced to your reel</div>
        </div>
        <div style={{ color: "#a855f7", fontSize: 12 }}>Change</div>
      </div>

      <button onClick={onNext} style={{
        margin: "0 20px 20px",
        padding: "16px", background: "linear-gradient(135deg, #7c3aed, #ec4899)",
        border: "none", borderRadius: 18, color: "#fff",
        fontSize: 16, fontWeight: 800, cursor: "pointer",
        ...glowStyle(), flexShrink: 0,
      }}>📤 Export & Share</button>

      <style>{`
        @keyframes bgPulse { 0%,100%{opacity:0.8} 50%{opacity:1} }
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  );
}

// ── EXPORT ─────────────────────────────────────────────────────────────────
function ExportScreen({ onBack, onHome }) {
  const [exported, setExported] = useState(false);
  const [quality, setQuality] = useState("4K");

  const handleExport = () => setExported(true);

  return (
    <div style={{
      width: "100%", height: "100%", background: "#050508",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        borderBottom: "1px solid #111125", flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10, background: "#0d0d22",
          border: "1px solid #1e1e3a", color: "#a855f7", fontSize: 18,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>←</button>
        <div style={{ color: "#e2e8f0", fontWeight: 700 }}>Export & Share</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        {exported ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e33, #4ade8033)",
              border: "2px solid #22c55e", margin: "0 auto 20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
            }}>✓</div>
            <div style={{
              fontSize: 22, fontWeight: 800, color: "#22c55e", marginBottom: 8,
            }}>Reel Exported!</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 28 }}>
              4K quality · No watermark · Saved to gallery
            </div>
            <button onClick={onHome} style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              border: "none", borderRadius: 14, color: "#fff",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              ...glowStyle(),
            }}>🏠 Back to Home</button>
          </div>
        ) : (
          <>
            {/* Quality selector */}
            <div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 12 }}>📊 Export Quality</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[["720p", "Fast"], ["1080p", "HD"], ["4K", "Ultra"]].map(([q, l]) => (
                  <div key={q} onClick={() => setQuality(q)} style={{
                    flex: 1, background: quality === q ? "#0f0720" : "#0d0d22",
                    border: `1.5px solid ${quality === q ? "#a855f7" : "#1e1e3a"}`,
                    borderRadius: 14, padding: "14px 8px", textAlign: "center", cursor: "pointer",
                  }}>
                    <div style={{ color: quality === q ? "#a855f7" : "#e2e8f0", fontWeight: 700, fontSize: 15 }}>{q}</div>
                    <div style={{ color: "#4b5563", fontSize: 10, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share platforms */}
            <div>
              <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 14 }}>📱 Share To</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["📷", "Instagram", "#e1306c"],
                  ["🎵", "TikTok", "#010101"],
                  ["💬", "WhatsApp", "#25d366"],
                  ["🐦", "Twitter/X", "#1da1f2"],
                  ["▶️", "YouTube", "#ff0000"],
                  ["💾", "Save", "#6366f1"],
                ].map(([ic, nm, cl]) => (
                  <div key={nm} onClick={() => setExported(true)} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "#0d0d22", border: "1px solid #1e1e3a",
                    borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${cl}22`, border: `1px solid ${cl}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>{ic}</div>
                    <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{nm}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Caption */}
            <div style={{
              background: "#0d0d22", border: "1px solid #1e1e3a", borderRadius: 16, padding: 16,
            }}>
              <div style={{ color: "#a855f7", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                ✦ AI Caption Generator
              </div>
              <div style={{
                color: "#e2e8f0", fontSize: 13, lineHeight: 1.5,
                background: "#07071a", borderRadius: 10, padding: 12,
                border: "1px solid #111125",
              }}>
                ✨ Lost in the magic of the moment... 🌌 #ReelMagicAI #Cinematic #Aesthetic
              </div>
              <div style={{ color: "#6b7280", fontSize: 11, marginTop: 8, textAlign: "right" }}>
                Tap to copy · اردو میں بھی ✓
              </div>
            </div>

            <button onClick={handleExport} style={{
              width: "100%", padding: "17px",
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
              border: "none", borderRadius: 18, color: "#fff",
              fontSize: 16, fontWeight: 800, cursor: "pointer",
              ...glowStyle(),
            }}>⬇️ Export {quality} – Free</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── SETTINGS ───────────────────────────────────────────────────────────────
function SettingsScreen({ onBack }) {
  const [lang, setLang] = useState("en");
  const toggles = [
    ["HD Export", true], ["Auto Music Sync", true],
    ["AI Captions", false], ["Watermark", false],
  ];
  const [states, setStates] = useState(toggles.map(t => t[1]));

  return (
    <div style={{
      width: "100%", height: "100%", background: "#050508",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        borderBottom: "1px solid #111125", flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10, background: "#0d0d22",
          border: "1px solid #1e1e3a", color: "#a855f7", fontSize: 18,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>←</button>
        <div style={{ color: "#e2e8f0", fontWeight: 700 }}>Settings & Profile</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Profile card */}
        <div style={{
          background: "linear-gradient(135deg, #0f0720, #1a0533)",
          border: "1px solid #2d1a5e", borderRadius: 20, padding: 20,
          display: "flex", alignItems: "center", gap: 16,
          ...glowStyle(),
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#e2e8f0", fontWeight: 800, fontSize: 16 }}>ReelMagic User</div>
            <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>Free Plan · 24 Reels Made</div>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            borderRadius: 10, padding: "6px 14px",
            color: "#fff", fontSize: 12, fontWeight: 700,
          }}>PRO ✦</div>
        </div>

        {/* Language */}
        <div style={{
          background: "#0d0d22", border: "1px solid #1e1e3a", borderRadius: 16, padding: 16,
        }}>
          <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 12 }}>🌐 Language</div>
          <div style={{ display: "flex", gap: 10 }}>
            {["en", "ur"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                flex: 1, padding: "10px", borderRadius: 12,
                background: lang === l ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#111125",
                border: "none", color: lang === l ? "#fff" : "#6b7280",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>{l === "en" ? "🇬🇧 English" : "🇵🇰 اردو"}</button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div style={{
          background: "#0d0d22", border: "1px solid #1e1e3a", borderRadius: 16, overflow: "hidden",
        }}>
          {toggles.map(([label], i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px", borderBottom: i < toggles.length - 1 ? "1px solid #111125" : "none",
            }}>
              <div style={{ color: "#e2e8f0", fontSize: 14 }}>{label}</div>
              <div
                onClick={() => setStates(s => s.map((v, j) => j === i ? !v : v))}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: states[i] ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#1e1e3a",
                  position: "relative", cursor: "pointer", transition: "all 0.3s",
                }}>
                <div style={{
                  position: "absolute", top: 3, left: states[i] ? "calc(100% - 21px)" : 3,
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  transition: "left 0.3s",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Menu items */}
        {[
          ["🎵", "Music Library", "200+ tracks"],
          ["✨", "AI Effects Pack", "50+ effects"],
          ["📊", "Usage Stats", "This month"],
          ["🔔", "Notifications", "Manage"],
          ["⭐", "Rate App", "Play Store"],
          ["📧", "Support", "24/7 help"],
        ].map(([ic, label, sub]) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "#0d0d22", border: "1px solid #1e1e3a", borderRadius: 14,
            padding: "14px 16px", cursor: "pointer",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "#111125", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>{ic}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{label}</div>
              <div style={{ color: "#4b5563", fontSize: 11, marginTop: 1 }}>{sub}</div>
            </div>
            <div style={{ color: "#374151", fontSize: 18 }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP SHELL ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [history, setHistory] = useState([]);

  const navigate = (s) => {
    setHistory(h => [...h, screen]);
    setScreen(s);
  };
  const goBack = () => {
    if (history.length > 0) {
      setScreen(history[history.length - 1]);
      setHistory(h => h.slice(0, -1));
    }
  };

  const screenMap = {
    splash: <SplashScreen onNext={() => navigate("login")} />,
    login: <LoginScreen onNext={() => navigate("home")} />,
    home: <HomeScreen onNavigate={navigate} />,
    upload: <UploadScreen onNext={() => navigate("processing")} onBack={goBack} />,
    processing: <ProcessingScreen onNext={() => navigate("preview")} />,
    preview: <PreviewScreen onNext={() => navigate("export")} onBack={goBack} />,
    export: <ExportScreen onBack={goBack} onHome={() => { setHistory([]); setScreen("home"); }} />,
    settings: <SettingsScreen onBack={goBack} />,
  };

  const screenLabels = [
    ["splash", "🌟 Splash"], ["login", "🔐 Login"], ["home", "🏠 Home"],
    ["upload", "📸 Upload"], ["processing", "⚡ AI"], ["preview", "👁 Preview"],
    ["export", "📤 Export"], ["settings", "⚙️ Settings"],
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#02020a",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 16px",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    }}>
      {/* App title */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <div style={{
          fontSize: 22, fontWeight: 900,
          background: "linear-gradient(135deg, #a855f7, #ec4899, #06b6d4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>✦ ReelMagic AI</div>
        <div style={{ color: "#374151", fontSize: 11, marginTop: 2 }}>Interactive App Prototype</div>
      </div>

      {/* Screen nav */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center",
        marginBottom: 16, maxWidth: 480,
      }}>
        {screenLabels.map(([id, label]) => (
          <button key={id} onClick={() => { setHistory([]); setScreen(id); }} style={{
            padding: "5px 12px", borderRadius: 20, border: "none",
            background: screen === id ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#111125",
            color: screen === id ? "#fff" : "#6b7280",
            fontSize: 11, fontWeight: screen === id ? 700 : 400, cursor: "pointer",
            border: screen !== id ? "1px solid #1e1e3a" : "none",
          }}>{label}</button>
        ))}
      </div>

      {/* Phone frame */}
      <div style={{
        width: 375, maxWidth: "100%",
        background: "#111125", borderRadius: 44,
        padding: "14px 10px",
        boxShadow: "0 0 80px #7c3aed22, 0 40px 80px #00000088",
        border: "2px solid #1e1e3a",
      }}>
        {/* Notch */}
        <div style={{
          width: 100, height: 26, background: "#02020a",
          borderRadius: 13, margin: "0 auto 8px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1e1e3a" }} />
        </div>

        {/* Screen */}
        <div style={{
          width: "100%", height: 700, borderRadius: 30, overflow: "hidden",
          background: "#050508", position: "relative",
        }}>
          {screenMap[screen]}
        </div>

        {/* Home indicator */}
        <div style={{
          width: 120, height: 4, background: "#1e1e3a",
          borderRadius: 99, margin: "10px auto 4px",
        }} />
      </div>

      <div style={{ color: "#1e1e3a", fontSize: 11, marginTop: 14, textAlign: "center" }}>
        Tap screen buttons or use nav above to explore
      </div>
    </div>
  );
}
