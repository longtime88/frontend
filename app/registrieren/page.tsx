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
  DownloadOutlined,
  CheckCircleOutline,
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
      borderRadius: "8px",
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

  return (
    <section className="min-h-screen bg-white px-4 py-12 text-[#18212b] md:px-6 md:py-16">
      <div className="mx-auto max-w-2xl">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-[#d96b08]">Startseite</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="font-medium text-gray-900">Registrieren</span>
        </nav>

        <div className="mb-8 text-center">
          <Box className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <PersonOutline className="text-[#fe8b19]" fontSize="large" />
          </Box>
          <Typography variant="h1" className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Konto erstellen
          </Typography>
          <Typography variant="body1" className="mt-2 text-base text-gray-600">
            Erstelle dein kostenloses Kundenkonto in wenigen Schritten.
          </Typography>
        </div>

        <Paper elevation={0} className="rounded-2xl border border-gray-200 p-6 shadow-sm md:p-8">
          {message && (
            <Box
              className="mb-6 flex items-center gap-3 rounded-xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
              sx={{ borderLeftWidth: 4 }}
            >
              <ErrorOutline fontSize="small" />
              {message}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box className="mb-6">
              <Typography variant="subtitle2" className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                <Box className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#fe8b19]">1</Box>
                Persoenliche Angaben
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
                      ...(focusedField === "firstName" && {
                        "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(254,139,25,0.12)" },
                      }),
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
                      ...(focusedField === "lastName" && {
                        "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(254,139,25,0.12)" },
                      }),
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
                      ...(focusedField === "email" && {
                        "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(254,139,25,0.12)" },
                      }),
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
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutline fontSize="small" className="text-gray-400" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            sx={{ color: "#9ca3af" }}
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      ...textFieldSx,
                      ...(focusedField === "password" && {
                        "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(254,139,25,0.12)" },
                      }),
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
                        Passwortstaerke: <span className="font-medium text-gray-700">{strength.label}</span>
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: "#f3f4f6", my: 4 }} />

            <Box className="mb-6">
              <Typography variant="subtitle2" className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                <Box className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#fe8b19]">2</Box>
                Rechnungsadresse
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="street"
                    label="Strasse und Hausnummer"
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
                      ...(focusedField === "street" && {
                        "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(254,139,25,0.12)" },
                      }),
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
                      ...(focusedField === "zipcode" && {
                        "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(254,139,25,0.12)" },
                      }),
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
                      ...(focusedField === "city" && {
                        "& .MuiInputBase-root": { boxShadow: "0 0 0 3px rgba(254,139,25,0.12)" },
                      }),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box className="mb-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <InfoOutlined fontSize="small" className="mt-0.5 flex-shrink-0 text-gray-500" />
              <Typography variant="caption" className="text-xs leading-relaxed text-gray-600">
                Mit der Registrierung akzeptierst du unsere{" "}
                <Link href="/datenschutz" className="font-medium text-[#d96b08] underline decoration-[#d96b08]/30 underline-offset-2 transition hover:text-[#a84900]">
                  Datenschutzerklaerung
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
                backgroundColor: "#fe8b19",
                color: "#18212b",
                fontWeight: 700,
                py: 1.5,
                boxShadow: "0 4px 14px rgba(254,139,25,0.25)",
                "&:hover": {
                  backgroundColor: "#e97708",
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(254,139,25,0.35)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": { opacity: 0.5 },
                transition: "all 0.2s ease",
              }}
              endIcon={!submitting && <ArrowForward fontSize="small" />}
            >
              {submitting ? "Konto wird erstellt..." : "Konto erstellen"}
            </Button>

            <Typography variant="body2" className="mt-5 text-center text-sm text-gray-600">
              Du hast bereits ein Konto?{" "}
              <Button
                href="/anmelden"
                component={Link}
                variant="text"
                className="normal-case p-0 text-sm font-semibold text-[#d96b08]"
                sx={{ "&:hover": { backgroundColor: "transparent", color: "#a84900", textDecoration: "underline" } }}
              >
                Jetzt anmelden
              </Button>
            </Typography>
          </Box>
        </Paper>

        <Grid container className="mt-8 gap-4">
          {[
            { icon: <ShoppingBagOutlined fontSize="small" />, title: "Bestellungen", desc: "Uebersicht behalten" },
            { icon: <AccountCircleOutlined fontSize="small" />, title: "Digital", desc: "Downloads verwalten" },
            { icon: <DownloadOutlined fontSize="small" />, title: "Schneller", desc: "Checkout speichern" },
          ].map((item, i) => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}>
              <Paper elevation={0} className="h-full rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:border-gray-300 hover:shadow-md">
                <Box className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-700">
                  {item.icon}
                </Box>
                <Typography variant="subtitle2" className="text-sm font-semibold text-gray-900">
                  {item.title}
                </Typography>
                <Typography variant="caption" className="text-xs text-gray-500">
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:flex md:items-center md:justify-between">
          <Box className="flex items-start gap-3">
            <Box className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white">
              <CheckCircleOutline className="text-[#fe8b19]" />
            </Box>
            <Box>
              <Typography variant="subtitle2" className="text-sm font-semibold text-gray-900">
                Warum Molinka?
              </Typography>
              <Typography variant="caption" className="text-xs text-gray-600">
                Einfache Registrierung, sichere Daten und direkter Zugang zu deinen Bestellungen und digitalen Produkten.
              </Typography>
            </Box>
          </Box>
          <Button
            href="/kontakt"
            component={Link}
            variant="outlined"
            className="mt-4 normal-case md:mt-0"
            sx={{
              borderColor: "#e5e7eb",
              color: "#374151",
              "&:hover": { borderColor: "#fe8b19", color: "#d96b08" },
            }}
          >
            Fragen? Kontaktiere uns
          </Button>
        </Box>
      </div>
    </section>
  );
}
