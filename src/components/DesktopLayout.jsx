import React from 'react';

const DesktopLayout = ({ title, subtitle, actions, sidebar, children }) => {
  const hasSidebar = Boolean(sidebar);
  const containerClass = hasSidebar
    ? 'mx-auto flex w-full max-w-7xl gap-6 px-6 py-8 lg:px-10'
    : 'mx-auto flex w-full max-w-6xl flex-col px-6 py-8 lg:px-10';
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200/70 via-sky-100/50 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-6 h-80 w-80 rounded-full bg-gradient-to-tr from-teal-200/60 via-cyan-100/40 to-transparent blur-3xl" />
        <div className={containerClass}>
          {hasSidebar ? (
            <aside className="hidden w-60 flex-col gap-6 rounded-3xl bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:flex">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-cyan-600">Admin</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">Carb Partner</div>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-600">
                {sidebar}
              </div>
              <div className="mt-auto rounded-2xl bg-cyan-50 p-4 text-xs text-slate-600">
                Daily insights for your admin view.
              </div>
            </aside>
          ) : null}

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <header className="flex flex-col gap-3 rounded-3xl bg-white/90 px-6 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h1>
                {subtitle ? (
                  <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                ) : null}
              </div>
              {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
            </header>

            <main className="flex flex-col gap-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
