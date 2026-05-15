'use client';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-10 md:px-6">
      <div className="flex w-full max-w-5xl flex-row items-start gap-8 rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-[color:var(--ink)] shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-8">
        {children}
      </div>
    </div>
  );
}









