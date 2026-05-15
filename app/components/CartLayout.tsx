'use client';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex w-full max-w-5xl flex-row items-start gap-8 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-8 text-[color:var(--ink)] shadow-[var(--shadow-soft)]">
        {children}
      </div>
    </div>
  );
}









