import { useEffect, useRef, useState } from "react";
import { Truck, UserRound, Users as UsersIcon } from "lucide-react";

import { useAdminUsers } from "../../../hooks/useAdminUsers";
import AdminUserActionsMenu from "./AdminUserActionsMenu";
import AdminUserModal from "./AdminUserModal";
import AdminUserStatusModal from "./AdminUserStatusModal";
import AdminUserResetPasswordModal from "./AdminUserResetPasswordModal";

function AdminUsers() {
  const { data: users = [], isPending, error } = useAdminUsers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToToggle, setUserToToggle] = useState(null);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const teamUsers = users.filter(
    (user) => user.role === "staff" || user.role === "delivery",
  );

  const activeUsers = teamUsers.filter((user) => user.isActive);
  const staffUsers = teamUsers.filter((user) => user.role === "staff");
  const deliveryUsers = teamUsers.filter((user) => user.role === "delivery");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-basil-600">
            Team management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-espresso sm:text-4xl">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-warm-gray">
            Manage staff and delivery accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-basil-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-basil-600"
        >
          + Add team member
        </button>
      </div>

      {/* Summary */}
      {!isPending && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<UsersIcon size={18} strokeWidth={1.8} />}
            label="Total users"
            value={teamUsers.length}
          />

          <SummaryCard
            icon={<UserRound size={18} strokeWidth={1.8} />}
            label="Active"
            value={activeUsers.length}
          />

          <SummaryCard
            icon={<UserRound size={18} strokeWidth={1.8} />}
            label="Staff"
            value={staffUsers.length}
          />

          <SummaryCard
            icon={<Truck size={18} strokeWidth={1.8} />}
            label="Delivery"
            value={deliveryUsers.length}
          />
        </div>
      )}

      {/* Users */}
      <div className="mt-6 overflow-visible rounded-2xl border border-warm-border/60 bg-white shadow-sm">
        <div className="border-b border-warm-border/40 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-espresso">
              Team members
            </h2>

            <p className="mt-1 text-xs text-warm-gray">
              Your current Nanna&apos;s Pizza team accounts.
            </p>
          </div>
        </div>

        {isPending && <LoadingState />}

        {error && <ErrorState message={error.message} />}

        {!isPending && !error && users.length === 0 && <EmptyState />}

        {!isPending && !error && users.length > 0 && (
          <div className="divide-y divide-warm-border/40">
            {teamUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onEditUser={setEditingUser}
                onToggleActive={setUserToToggle}
                onResetPassword={setUserToResetPassword}
              />
            ))}
          </div>
        )}
      </div>
      {isAddModalOpen && (
        <AdminUserModal onClose={() => setIsAddModalOpen(false)} />
      )}
      {editingUser && (
        <AdminUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      {userToToggle && (
        <AdminUserStatusModal
          user={userToToggle}
          onClose={() => setUserToToggle(null)}
        />
      )}
      {userToResetPassword && (
        <AdminUserResetPasswordModal
          user={userToResetPassword}
          onClose={() => setUserToResetPassword(null)}
        />
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-warm-border/60 bg-white px-5 py-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ivory text-basil-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-warm-gray">{label}</p>

        <p className="mt-0.5 text-xl font-bold text-espresso">{value}</p>
      </div>
    </div>
  );
}

function UserRow({ user, onEditUser, onToggleActive, onResetPassword }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  function handleEdit() {
    setIsMenuOpen(false);
    onEditUser(user);
  }

  function handleToggleActive() {
    setIsMenuOpen(false);
    onToggleActive(user);

    console.log(user.isActive ? "DEACTIVATE USER:" : "ACTIVATE USER:", user);
  }

  function handleResetPassword() {
    setIsMenuOpen(false);
    onResetPassword(user);
  }

  return (
    <article className="relative min-w-0 px-5 py-4 transition-colors hover:bg-ivory/30 sm:px-6">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory text-sm font-semibold text-basil-700">
          {getInitials(user.fullName)}
        </div>

        {/* User information */}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-espresso sm:text-base">
              {user.fullName}
            </h3>

            <RoleBadge role={user.role} />
          </div>

          <p className="mt-0.5 truncate text-xs text-warm-gray sm:text-sm">
            {user.email || "No email address"}
          </p>
        </div>

        {/* Status */}
        <div className="hidden shrink-0 sm:block">
          <StatusBadge isActive={user.isActive} />
        </div>

        {/* Actions */}
        <div ref={menuRef} className="shrink-0">
          <AdminUserActionsMenu
            user={user}
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen((open) => !open)}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
            onResetPassword={handleResetPassword}
          />
        </div>
      </div>

      {/* Mobile status */}
      <div className="mt-3 pl-[60px] sm:hidden">
        <StatusBadge isActive={user.isActive} />
      </div>
    </article>
  );
}

function RoleBadge({ role }) {
  const styles = {
    admin: "bg-tomato-400/10 text-tomato-600",
    staff: "bg-basil-500/10 text-basil-700",
    delivery: "bg-amber-500/10 text-amber-700",
  };

  const labels = {
    admin: "Admin",
    staff: "Staff",
    delivery: "Delivery",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        styles[role] || "bg-warm-border/30 text-warm-gray"
      }`}
    >
      {labels[role] || role}
    </span>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        isActive
          ? "bg-basil-500/10 text-basil-700"
          : "bg-warm-border/40 text-warm-gray"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-basil-500" : "bg-warm-gray/50"
        }`}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="divide-y divide-warm-border/30">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center gap-4 px-5 py-5 sm:px-6">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-warm-border/30" />

          <div className="min-w-0 flex-1">
            <div className="h-4 w-32 animate-pulse rounded bg-warm-border/30" />
            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-warm-border/20" />
          </div>

          <div className="hidden h-6 w-16 animate-pulse rounded-full bg-warm-border/30 sm:block" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="px-5 py-10 text-center sm:px-6">
      <p className="text-sm font-semibold text-tomato-600">
        Could not load users
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-warm-gray">
        {message}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-12 text-center sm:px-6">
      <UsersIcon
        className="mx-auto text-warm-gray/60"
        size={28}
        strokeWidth={1.5}
      />

      <p className="mt-3 text-sm font-semibold text-espresso">
        No team members found
      </p>

      <p className="mt-1 text-sm text-warm-gray">
        There are currently no users to display.
      </p>
    </div>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default AdminUsers;

// import { useEffect } from "react";
// import { supabase } from "../../../services/supabase";

// function AdminUsers() {
//   useEffect(() => {
//     async function testAdminUsers() {
//       const {
//         data: { session },
//         error: sessionError,
//       } = await supabase.auth.getSession();

//       console.log("SESSION:", session);
//       console.log("SESSION ERROR:", sessionError);

//       const { data, error } = await supabase.functions.invoke("admin-users", {
//         body: {},
//       });

//       console.log("ADMIN USERS DATA:", data);
//       console.log("ADMIN USERS ERROR:", error);
//     }

//     testAdminUsers();
//   }, []);

//   return <div>Users</div>;
// }

// export default AdminUsers;

// import { useEffect } from "react";
// import { supabase } from "../../../services/supabase";

// function AdminUsers() {
//   useEffect(() => {
//     async function testAdminUsers() {
//       const { data, error } = await supabase.functions.invoke("admin-users", {
//         body: {},
//       });

//       console.log("ADMIN USERS DATA:", data);
//       console.log("ADMIN USERS ERROR:", error);
//     }

//     testAdminUsers();
//   }, []);

//   return <div>Users</div>;
// }

// export default AdminUsers;
