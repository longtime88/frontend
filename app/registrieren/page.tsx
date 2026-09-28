"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useCallback } from "react";
import {
  PersonOutline,
  MailOutline,
  LockOutline,
  Visibility,
  VisibilityOff,
  HomeOutlined,
  PlaceOutlined,
  InfoOutlined,
  ArrowForward,
  ErrorOutline,
  ShoppingBagOutlined,
  AccountCircleOutlined,
  ShieldOutlined,
} from "@mui/icons-material";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  LinearProgress,
  Divider,
  Paper,
  Grid,
} from "@mui/material";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  street: "",
  zipcode: "",
  city: "",
};

type PasswordStrength = { score: number; label: string; color: string };

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Schwach", color: "#ef4444" };
  if (score === 2) return { score, label: "Okay", color: "#f97316" };
  if (score === 3) return { score, label: "Gut", color: "#eab308" };
  if (score === 4) return { score, label: "Stark", color: "#22c55e" };
  return { score, label: "Sehr stark", color: "#16a34a" };
}

export default function Registrieren() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const strength = getPasswordStrength(form.password);
  const strengthPercent = Math.min((strength.score / 5) * 100, 100);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(data?.error || "Registrierung fehlgeschlagen.");
        return;
      }

      router.push("/konto");
      router.refresh();
    } catch {
      setMessage("Der Server ist nicht erreichbar.");
    } finally {
      setSubmitting(false);
    }
  }, [form, router]);

  const textFieldSx = {
    "& .MuiInputBase-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",
      color: "#18212b",
      "& fieldset": { borderColor: "#e5e7eb" },
      "&:hover fieldset": { borderColor: "#fe8b19" },
      "&.Mui-focused fieldset": { borderColor: "#fe8b19" },
    },
    "& .MuiInputLabel-root": { color: "#374151", fontWeight: 500 },
    "& .MuiInputLabel-root.Mui-focused": { color: "#d96b08" },
    "& .MuiOutlinedInput-input::placeholder": { color: "#9ca3af", opacity: 1 },
  };

  const trustItems = [
    { icon: <ShoppingBagOutlined fontSize="small" />, title: "Bestellungen", desc: "Schneller Überblick über alle Käufe." },
    { icon: <AccountCircleOutlined fontSize="small" />, title: "Kundenkonto", desc: "Persönliche Daten immer griffbereit." },
    { icon: <ShieldOutlined fontSize="small" />, title: "Sicher", desc: "Vertrauliche Daten geschützt." },
  ];

  return (
    <section className="bg-[radial-gradient(circle_at_top,_#fffaf4_0%,_#f5f1eb_35%,_#efeae4_100%)] px-4 py-12 text-[#1f2937] md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-[#b65d00]">Startseite</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="font-medium text-gray-800">Registrieren</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Paper elevation={0} className="rounded-[28px] border border-[#ecd8c2] bg-[#fffdfb] p-6 shadow-[0_24px_60px_rgba(38,28,20,0.08)] md:p-8">
            <Box className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff2e6]">
              <PersonOutline className="text-[#d96b08]" fontSize="large" />
            </Box>

            <Typography variant="h1" className="text-4xl font-bold tracking-[-0.04em] text-[#1f2937] md:text-5xl" style={{ fontFamily: "var(--font-fraunces)" }}>
              Neues Konto erstellen
            </Typography>

            <Typography variant="body1" className="mt-4 max-w-lg text-base leading-relaxed text-gray-600">
              Registriere dich kostenlos und profitiere von schnelleren Bestellungen, gespeicherten Adressen und einem unkomplizierten Checkout.
            </Typography>

            <Box className="mt-8 space-y-3">
              {trustItems.map((item, index) => (
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
                    <Typography variant="body2" className="mt-1 text-sm text-gray-600">{item.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box className="mt-8 rounded-[22px] border border-[#f0e0c9] bg-[#fff6ec] p-5">
              <Typography variant="subtitle2" className="text-base font-semibold text-gray-900">
                Bereits registriert?
              </Typography>
              <Typography variant="body2" className="mt-1 text-sm text-gray-600">
                Dann melde dich direkt mit deinem Kundenkonto an und starte sofort durch.
              </Typography>
              <Link href="/anmelden" className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#efb169] bg-white px-4 py-2 text-sm font-semibold text-[#8d4700] transition hover:-translate-y-0.5 hover:border-[#d37a18] hover:text-[#7a3e00]">
                Jetzt anmelden
                <ArrowForward fontSize="small" />
              </Link>
            </Box>
          </Paper>

          <Paper elevation={0} className="rounded-[28px] border border-[#eadcc5] bg-[#fffefc] p-6 shadow-[0_16px_40px_rgba(31,41,55,0.05)] md:p-8">
            {message && (
              <Box className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <ErrorOutline fontSize="small" />
                {message}
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box className="mb-6">
                <Typography variant="subtitle2" className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Box className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#d96b08]">1</Box>
                  Persönliche Angaben
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      id="firstName"
                      label="Vorname"
                      type="text"
                      required
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                      sx={{
                        ...textFieldSx,
                        ...(focusedField === "firstName" && { "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(217,107,8,0.12)" } }),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      id="lastName"
                      label="Nachname"
                      type="text"
                      required
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                      sx={{
                        ...textFieldSx,
                        ...(focusedField === "lastName" && { "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(217,107,8,0.12)" } }),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      id="email"
                      label="E-Mail"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutline fontSize="small" className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        ...textFieldSx,
                        ...(focusedField === "email" && { "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(217,107,8,0.12)" } }),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      id="password"
                      label="Passwort"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      inputProps={{ minLength: 8 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutline fontSize="small" className="text-gray-400" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: "#9ca3af" }}>
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        ...textFieldSx,
                        ...(focusedField === "password" && { "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(217,107,8,0.12)" } }),
                      }}
                    />

                    {form.password && (
                      <Box className="mt-3">
                        <Box className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <LinearProgress
                            variant="determinate"
                            value={strengthPercent}
                            sx={{
                              height: "6px",
                              borderRadius: "9999px",
                              backgroundColor: "#f3f4f6",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: "9999px",
                                backgroundColor: strength.color,
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="caption" className="mt-1.5 text-xs text-gray-500">
                          Passwortstärke: <span className="font-medium text-gray-700">{strength.label}</span>
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ borderColor: "#f3f4f6", my: 4 }} />

              <Box className="mb-6">
                <Typography variant="subtitle2" className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Box className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#d96b08]">2</Box>
                  Rechnungsadresse
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      id="street"
                      label="Straße und Hausnummer"
                      type="text"
                      required
                      autoComplete="street-address"
                      value={form.street}
                      onChange={(e) => updateField("street", e.target.value)}
                      onFocus={() => setFocusedField("street")}
                      onBlur={() => setFocusedField(null)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeOutlined fontSize="small" className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        ...textFieldSx,
                        ...(focusedField === "street" && { "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(217,107,8,0.12)" } }),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                      fullWidth
                      id="zipcode"
                      label="PLZ"
                      type="text"
                      required
                      autoComplete="postal-code"
                      value={form.zipcode}
                      onChange={(e) => updateField("zipcode", e.target.value)}
                      onFocus={() => setFocusedField("zipcode")}
                      onBlur={() => setFocusedField(null)}
                      sx={{
                        ...textFieldSx,
                        ...(focusedField === "zipcode" && { "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(217,107,8,0.12)" } }),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 7 }}>
                    <TextField
                      fullWidth
                      id="city"
                      label="Ort"
                      type="text"
                      required
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      onFocus={() => setFocusedField("city")}
                      onBlur={() => setFocusedField(null)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PlaceOutlined fontSize="small" className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        ...textFieldSx,
                        ...(focusedField === "city" && { "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(217,107,8,0.12)" } }),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box className="mb-6 flex items-start gap-3 rounded-2xl border border-[#f0e2d1] bg-[#fffaf4] p-4">
                <InfoOutlined fontSize="small" className="mt-0.5 flex-shrink-0 text-[#b65d00]" />
                <Typography variant="caption" className="text-xs leading-relaxed text-gray-600">
                  Mit der Registrierung akzeptierst du unsere{" "}
                  <Link href="/datenschutz" className="font-medium text-[#d96b08] underline decoration-[#d96b08]/30 underline-offset-2 transition hover:text-[#a84900]">
                    Datenschutzerklärung
                  </Link>
                  .
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                className="normal-case w-full"
                sx={{
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
                {submitting ? "Konto wird erstellt..." : "Konto erstellen"}
              </Button>

              <Typography variant="body2" className="mt-5 text-center text-sm text-gray-600">
                Du hast bereits ein Konto?{" "}
                <Link href="/anmelden" className="font-semibold text-[#d96b08] underline decoration-[#d96b08]/30 underline-offset-4 transition hover:text-[#a84900]">
                  Jetzt anmelden
                </Link>
              </Typography>
            </Box>
          </Paper>
        </div>
      </div>
    </section>
  );
}
