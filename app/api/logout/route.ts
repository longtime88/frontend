import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Erfolgreich abgemeldet." });
  
  response.cookies.delete("sw-context-token");
  response.cookies.delete("sw-customer-token");

  return response;
}

export async function GET() {
  return NextResponse.json({ error: "Methode nicht erlaubt. Nutze POST." }, { status: 405 });
}
