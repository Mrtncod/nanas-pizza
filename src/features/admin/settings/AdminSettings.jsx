import { useOutletContext } from "react-router";

import AdminProfileForm from "./AdminProfileForm";
import AdminPasswordForm from "./AdminPasswordForm";

function AdminSettings() {
  const { user, profile, setProfile } = useOutletContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-basil-600">
          Account management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-espresso sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-warm-gray">
          Manage your personal information and keep your account secure.
        </p>
      </div>

      {/* Settings sections */}
      <div className="max-w-4xl space-y-6">
        <AdminProfileForm
          user={user}
          profile={profile}
          setProfile={setProfile}
        />

        <AdminPasswordForm email={user?.email} />
      </div>
    </div>
  );
}

export default AdminSettings;
