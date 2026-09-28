"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ShieldOutlined,
} from "@mui/icons-material";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Paper,
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
      setMessage("Anmeldung dauert länger als erwartet...");
    }, 5000);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json().catch(() => ({}));
      setSuccess(res.ok);
      setMessage(res.ok ? "Anmeldung erfolgreich!" : data?.error || "Login fehlgeschlagen");
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
    { icon: <ShoppingBagOutlined fontSize="small" />, title: "Bestellungen & Rechnungen", desc: "Ein schneller Überblick über alle Bestellungen und Zahlungen." },
    { icon: <DownloadOutlined fontSize="small" />, title: "Schneller Checkout", desc: "Gespeicherte Daten erleichtern dir zukünftige Käufe." },
    { icon: <ShieldOutlined fontSize="small" />, title: "Sichere Kontodaten", desc: "Deine Daten bleiben geschützt und sauber verwaltet." },
  ];

  const inputSx = {
    "& .MuiInputBase-root": {
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      color: "#18212b",
      "& fieldset": { borderColor: "#e5e7eb" },
      "&:hover fieldset": { borderColor: "#fe8b19" },
      "&.Mui-focused fieldset": { borderColor: "#fe8b19" },
    },
    "& .MuiInputLabel-root": { color: "#485563", fontWeight: 500 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#d96b08" },
    "& .MuiOutlinedInput-input::placeholder": { color: "#9ca3af", opacity: 1 },
  };

  return (
    <section className="bg-[radial-gradient(circle_at_top,_#fffaf4_0%,_#f5f1eb_35%,_#efeae4_100%)] px-4 py-12 text-[#1f2937] md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-[#b65d00]">Startseite</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="font-medium text-gray-800">Anmelden</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Paper elevation={0} className="rounded-[28px] border border-[#ecd8c2] bg-[#fffdfb] p-6 shadow-[0_24px_60px_rgba(38,28,20,0.08)] md:p-8">
            <Box className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#fff0df] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a95d12]">
              <AccountCircleOutlined fontSize="small" />
              Mein Konto
            </Box>

            <Typography variant="h1" className="text-4xl font-bold tracking-[-0.04em] text-[#1f2937] md:text-5xl" style={{ fontFamily: "var(--font-fraunces)" }}>
              Willkommen zurück
            </Typography>

            <Typography variant="body1" className="mt-4 max-w-lg text-base leading-relaxed text-gray-600">
              Melde dich an, um Bestellungen, Versanddaten und deine persönlichen Einstellungen jederzeit schnell zu verwalten.
            </Typography>

            <Box className="mt-8 space-y-3">
              {features.map((item, index) => (
                <Box
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-[#f0e6db] bg-[#fffaf5] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.02)]"
                  sx={{
                    transform: index === 1 ? "translateX(4px)" : index === 2 ? "translateX(8px)" : "none",
                  }}
                >
                  <Box className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#fce5c9] text-[#b65d00]">{item.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" className="text-base font-semibold text-gray-900">{item.title}</Typography>
                    <Typography variant="body2" className="mt-1 text-sm leading-relaxed text-gray-600">{item.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box className="mt-8 rounded-[22px] border border-[#f0e0c9] bg-[#fff6ec] p-5">
              <Typography variant="subtitle2" className="text-base font-semibold text-gray-900">
                Noch kein Konto?
              </Typography>
              <Typography variant="body2" className="mt-1 text-sm text-gray-600">
                Jetzt registrieren und deine Lieblingsprodukte in wenigen Klicks sichern.
              </Typography>
              <Link href="/registrieren" className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#efb169] bg-white px-4 py-2 text-sm font-semibold text-[#8d4700] transition hover:-translate-y-0.5 hover:border-[#d37a18] hover:text-[#7a3e00]">
                Jetzt registrieren
                <ArrowForward fontSize="small" />
              </Link>
            </Box>
          </Paper>

          <Paper elevation={0} component="form" onSubmit={handleSubmit} className="rounded-[28px] border border-[#eadcc5] bg-[#fffefc] p-6 shadow-[0_16px_40px_rgba(31,41,55,0.05)] md:p-8">
            <Box className="mb-7">
              <Typography variant="h2" className="text-2xl font-bold tracking-[-0.03em] text-gray-900">
                Einloggen
              </Typography>
              <Typography variant="body2" className="mt-2 text-sm text-gray-600">
                Bitte gib deine Zugangsdaten ein.
              </Typography>
            </Box>

            {message && (
              <Box
                className="mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium"
                sx={{
                  borderColor: success ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.25)",
                  backgroundColor: success ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.04)",
                  color: success ? "#127a45" : "#b42318",
                }}
              >
                {success ? <CheckCircleOutline fontSize="small" /> : <ErrorOutline fontSize="small" />}
                {message}
              </Box>
            )}

            <Box className="space-y-5">
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
                      <MailOutline fontSize="small" className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
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
                      <LockOutline fontSize="small" className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />

              <Box className="flex items-center justify-between gap-3">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "#d1d5db",
                        "&.Mui-checked": { color: "#fe8b19" },
                      }}
                    />
                  }
                  label={<span className="text-sm text-[#4b5563]">Angemeldet bleiben</span>}
                />

                <Button href="/konto" component={Link} variant="text" className="normal-case text-sm" sx={{ color: "#d96b08", "&:hover": { backgroundColor: "transparent", color: "#a84900" } }}>
                  Passwort vergessen?
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                className="normal-case"
                sx={{
                  width: "100%",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #ea8b2d 0%, #d96b08 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  py: 1.5,
                  boxShadow: "0 12px 28px rgba(217,107,8,0.22)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #de7b1d 0%, #c45d00 100%)",
                    boxShadow: "0 16px 32px rgba(217,107,8,0.28)",
                  },
                  "&.Mui-disabled": { opacity: 0.6 },
                }}
                endIcon={!submitting && <ArrowForward fontSize="small" />}
              >
                {submitting ? "Wird angemeldet..." : "Anmelden"}
              </Button>
            </Box>

            <Typography variant="body2" className="mt-6 text-center text-sm text-gray-600">
              Noch kein Konto?{" "}
              <Link href="/registrieren" className="font-semibold text-[#d96b08] underline decoration-[#d96b08]/30 underline-offset-4 transition hover:text-[#a84900]">
                Jetzt registrieren
              </Link>
            </Typography>
          </Paper>
        </div>
      </div>
    </section>
  );
}
