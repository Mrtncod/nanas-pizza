function AdminHeader({ profile }) {
  return (
    <header className="border-b border-warm-border/60 bg-white/80">
      <div className="flex min-h-20 items-center justify-between gap-4 px-5 sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-basil-600">
            Business overview
          </p>

          <h1 className="mt-1 text-xl font-bold text-espresso sm:text-2xl">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-espresso">
              {profile.full_name}
            </p>

            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-basil-600">
              Administrator
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-basil-500/10 font-bold text-basil-600">
            {profile.full_name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
