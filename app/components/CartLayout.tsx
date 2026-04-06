'use client';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-black text-white rounded-xl shadow-xl p-8 flex flex-row gap-8 items-start">
        {children}
      </div>
    </div>
  );
}









