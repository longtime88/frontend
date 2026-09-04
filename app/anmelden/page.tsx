"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { FormEvent } from "react";
import {
  MailOutline,
  LockOutline,
  ArrowForward,
  CheckCircleOutline,
  ErrorOutline,
  AccountCircleOutlined,
  ShoppingBagOutlined,
  DownloadOutlined,
} from "@mui/icons-material";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";

export default function Anmelden() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const slowLoginTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (slowLoginTimer.current) {
        clearTimeout(slowLoginTimer.current);
      }
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setSubmitting(true);
    slowLoginTimer.current = setTimeout(() => {
      setMessage("Anmeldung dauert laenger als erwartet...");
    }, 5000);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json().catch(() => ({}));
      setSuccess(res.ok);
      setMessage(res.ok ? "Anmeldung erfolgreich!" : (data?.error || "Login fehlgeschlagen"));
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setMessage("Server nicht erreichbar");
    } finally {
      if (slowLoginTimer.current) {
        clearTimeout(slowLoginTimer.current);
        slowLoginTimer.current = null;
      }
      setSubmitting(false);
    }
  }

  const features = [
    { icon: <ShoppingBagOutlined fontSize="small" />, title: "Bestellungen & Rechnungen", desc: "Zugriff auf alle deine Bestellungen und Rechnungen" },
    { icon: <DownloadOutlined fontSize="small" />, title: "Schnellerer Checkout", desc: "Gespeicherte Daten fuer schnelleres Einkaufen" },
    { icon: <AccountCircleOutlined fontSize="small" />, title: "Exklusive Ressourcen", desc: "Zugang zu digitalen Downloads und mehr" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#071326] px-4 py-12 text-[#e8f0ff] md:px-6 md:py-16">
      <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[#2850c8]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-4 h-72 w-72 rounded-full bg-[#1e9fdb]/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.02fr,0.98fr]">
        <Box
          className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/20 backdrop-blur md:p-10"
          sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <div>
            <Box className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7bb8ff]/20 bg-[#7bb8ff]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8cb7e5]">
              <AccountCircleOutlined fontSize="small" />
              Konto
            </Box>
            <h1 className="bg-gradient-to-r from-[#d6e5ff] via-[#7bb8ff] to-[#38d5df] bg-clip-text text-4xl font-bold tracking-tight text-transparent [font-family:var(--font-fraunces)] md:text-5xl">
              Anmelden
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#b5c0d9] md:text-base">
              Melde dich an, um Kundenbereiche, Bestellungen und digitale Downloads zentral zu verwalten.
            </p>

            <ul className="mt-10 space-y-4 text-sm leading-relaxed text-[#b5c0d9]">
              {features.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
                  <Box className="mt-0.5 text-[#7bb8ff]">{item.icon}</Box>
                  <div>
                    <p className="font-semibold text-[#d6e5ff]">{item.title}</p>
                    <p className="text-xs text-[#8b9ab5]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-[#7bb8ff]/20 bg-gradient-to-br from-[#1a3c75]/40 to-[#071a35]/40 p-5">
            <p className="font-semibold text-[#8fc3ff]">Noch kein Konto?</p>
            <p className="mt-1 text-sm text-[#b5c0d9]">Erstelle dein Kundenkonto direkt im gleichen Design.</p>
            <Button
              href="/registrieren"
              component={Link}
              variant="outlined"
              className="mt-3 normal-case"
              sx={{
                borderColor: "rgba(123,184,255,0.3)",
                color: "#8fc3ff",
                "&:hover": { borderColor: "rgba(123,184,255,0.5)", backgroundColor: "rgba(123,184,255,0.1)" },
              }}
              endIcon={<ArrowForward fontSize="small" />}
            >
              Jetzt registrieren
            </Button>
          </div>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8"
        >
          <div className="mb-8">
            <Typography variant="h2" className="text-xl font-bold text-[#d6e5ff]">
              Willkommen zurueck
            </Typography>
            <Typography variant="body2" className="mt-1 text-[#8b9ab5]">
              Bitte gib deine Zugangsdaten ein.
            </Typography>
          </div>

          {message && (
            <Box
              className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium"
              sx={{
                borderColor: success ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)",
                backgroundColor: success ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                color: success ? "#6ee7b7" : "#fca5a5",
              }}
            >
              {success ? <CheckCircleOutline fontSize="small" /> : <ErrorOutline fontSize="small" />}
              {message}
            </Box>
          )}

          <div className="space-y-5">
            <TextField
              id="loginMail"
              label="E-Mail"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline fontSize="small" className="text-[#7bb8ff]" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "12px",
                  backgroundColor: "rgba(7,26,53,0.7)",
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                  "&.Mui-focused fieldset": { borderColor: "#7bb8ff" },
                },
                "& .MuiInputLabel-root": { color: "#b5c0d9" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#7bb8ff" },
                "& .MuiOutlinedInput-input::placeholder": { color: "#71809e", opacity: 1 },
              }}
            />

            <TextField
              id="loginPassword"
              label="Passwort"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutline fontSize="small" className="text-[#7bb8ff]" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "12px",
                  backgroundColor: "rgba(7,26,53,0.7)",
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                  "&.Mui-focused fieldset": { borderColor: "#7bb8ff" },
                },
                "& .MuiInputLabel-root": { color: "#b5c0d9" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#7bb8ff" },
                "& .MuiOutlinedInput-input::placeholder": { color: "#71809e", opacity: 1 },
              }}
            />

            <div className="flex items-center justify-between">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: "rgba(255,255,255,0.3)",
                      "&.Mui-checked": { color: "#7bb8ff" },
                    }}
                  />
                }
                label={<span className="text-sm text-[#aebbd3]">Angemeldet bleiben</span>}
              />
              <Button
                href="/konto"
                component={Link}
                variant="text"
                className="normal-case text-sm"
                sx={{ color: "#8fc3ff", "&:hover": { backgroundColor: "rgba(123,184,255,0.1)" } }}
              >
                Passwort vergessen?
              </Button>
            </div>

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              className="normal-case"
              sx={{
                borderRadius: "9999px",
                background: "linear-gradient(to right, #2d6fd8, #4f9eff)",
                color: "#fff",
                fontWeight: 700,
                py: 1.5,
                boxShadow: "0 0 24px rgba(45,110,240,0.28)",
                "&:hover": {
                  background: "linear-gradient(to right, #2d6fd8, #4f9eff)",
                  filter: "brightness(1.1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 0 32px rgba(45,110,240,0.4)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": { opacity: 0.5 },
                transition: "all 0.3s ease",
              }}
            >
              {submitting ? "Wird angemeldet..." : "Einloggen"}
            </Button>

            <Box className="relative py-2">
              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
              <Typography
                variant="caption"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(7,19,38,0.6)] px-3 text-[#6b7a90]"
              >
                oder fortfahren mit
              </Typography>
            </Box>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outlined"
                className="normal-case"
                startIcon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.16 3.31v2.77h3.49c2.04-1.88 3.24-4.64 3.24-7.84z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.49-2.77c-.99.66-2.25 1.06-3.79 1.06-2.91 0-5.37-1.96-6.25-4.63H2.18v2.86C3.99 20.02 7.67 23 12 23z" />
                    <path fill="currentColor" d="M5.75 14.09c-.23-.66-.35-1.36-.35-2.09s.12-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.72-.63z" />
                    <path fill="currentColor" d="M12 4.58c1.64 0 3.1.56 4.25 1.67l3.18-3.18C17.45 1.18 14.97 0 12 0 7.67 0 3.99 2.98 2.18 7.06l2.85 2.22c.88-2.67 3.34-4.7 6.97-4.7z" />
                  </svg>
                }
                sx={{
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "#b5c0d9",
                  "&:hover": { borderColor: "rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff" },
                }}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outlined"
                className="normal-case"
                startIcon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                }
                sx={{
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "#b5c0d9",
                  "&:hover": { borderColor: "rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff" },
                }}
              >
                GitHub
              </Button>
            </div>

            <Typography variant="body2" className="mt-6 text-center text-sm text-[#aebbd3]">
              Noch keinen Account?{" "}
              <Button
                href="/registrieren"
                component={Link}
                variant="text"
                className="normal-case p-0 text-sm font-semibida underline-offset-4"
                sx={{ color: "#8fc3ff", "&:hover": { backgroundColor: "transparent", color: "#fff", textDecoration: "underline" } }}
              >
                Konto erstellen
              </Button>
            </Typography>
          </div>
        </Box>
      </div>
      <SpeedInsights />
    </section>
  );
}
