import { useEffect, useState } from "react";
import API from "../../api/axios";

/* ─ Stat Card ─ */
const StatCard = ({ title, value, icon, glow }) => (
  <div className={`relative overflow-hidden bg-[#161E38] border border-[#1F2D50] rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-opacity-60 ${glow}`}>
    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-40 bg-current" />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-bold text-[#3D4E70] uppercase tracking-widest mb-3">{title}</p>
        <p className="text-4xl font-black text-[#EDF2FF] tracking-tighter leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>
          {value ?? 0}
        </p>
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-white/5 border border-white/10">
        {icon}
      </div>
    </div>
    <div className="mt-4 h-0.5 rounded-full bg-[#1F2D50] overflow-hidden">
      <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-current to-transparent opacity-60" />
    </div>
  </div>
);

/* ─ Badge ─ */
const Badge = ({ label, className }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {label}
  </span>
);

/* ─ Empty State ─ */
const Empty = ({ text, sub }) => (
  <div className="border border-dashed border-[#1F2D50] rounded-2xl py-14 text-center bg-[#161E38]/50">
    <div className="text-5xl mb-4">🎉</div>
    <p className="font-black text-lg text-[#EDF2FF] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{text}</p>
    <p className="text-sm text-[#7A8FBA]">{sub}</p>
  </div>
);

/* ─ Skeleton ─ */
const Sk = ({ className = "w-full h-3.5" }) => (
  <div className={`rounded-md bg-[#1F2D50] animate-pulse ${className}`} />
);

/* ─ Provider Card ─ */
const ProviderCard = ({ p, acting, onApprove, onReject }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-[18px] p-6 flex gap-4 items-start transition-colors duration-200 hover:border-orange-500/40">
    {/* top accent */}
    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[18px] bg-gradient-to-r from-orange-500 via-blue-500 to-transparent" />

    {/* Avatar */}
    <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black text-2xl bg-gradient-to-br from-orange-500 to-blue-500 shadow-lg shadow-orange-500/20" style={{ fontFamily: "'Syne', sans-serif" }}>
      {p.name?.charAt(0).toUpperCase()}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <h3 className="font-black text-[17px] text-[#EDF2FF]" style={{ fontFamily: "'Syne', sans-serif" }}>{p.name}</h3>
        <Badge label="Awaiting Approval" className="text-yellow-400 bg-yellow-400/10" />
        {p.category && <Badge label={p.category} className="text-blue-400 bg-blue-400/10" />}
      </div>
      <p className="text-sm text-[#7A8FBA] mb-3">{p.email} · {p.phone}</p>
      <div className="flex flex-wrap gap-4">
        {[
          { i: "🛠", v: p.category },
          { i: "⭐", v: p.experience ? `${p.experience} yrs exp` : null },
          { i: "💰", v: p.rate ? `₹${p.rate}/hr` : null },
          { i: "📍", v: p.city ? `${p.area}, ${p.city}` : null },
          { i: "📮", v: p.pincode },
        ].filter(x => x.v).map(({ i, v }) => (
          <span key={i} className="flex items-center gap-1 text-sm text-[#7A8FBA]">
            <span className="text-base">{i}</span>{v}
          </span>
        ))}
      </div>
      {p.bio && (
        <p className="text-sm text-[#3D4E70] italic mt-3 border-l-2 border-orange-500/40 pl-3">{p.bio}</p>
      )}
    </div>

    {/* Actions */}
    <div className="flex flex-col gap-2 flex-shrink-0">
      <button
        onClick={() => onApprove(p._id)}
        disabled={!!acting}
        className="px-5 py-2.5 rounded-xl text-sm font-bold text-green-400 bg-green-400/10 border border-green-400/30 hover:bg-green-400 hover:text-white hover:shadow-lg hover:shadow-green-400/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
      >
        {acting === p._id + "_a" ? "Approving…" : "✓ Approve"}
      </button>
      <button
        onClick={() => onReject(p._id)}
        disabled={!!acting}
        className="px-5 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-transparent border border-red-400/30 hover:bg-red-400/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
      >
        {acting === p._id + "_r" ? "Rejecting…" : "✕ Reject"}
      </button>
    </div>
  </div>
);

/* ─ Service Card ─ */
const ServiceCard = ({ sv, acting, onApprove, onReject }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-[18px] p-6 flex justify-between items-start gap-5 transition-colors duration-200 hover:border-blue-500/40">
    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[18px] bg-gradient-to-r from-blue-500 via-orange-500 to-transparent" />
    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="font-black text-[17px] text-[#EDF2FF]" style={{ fontFamily: "'Syne', sans-serif" }}>{sv.name}</h3>
        <Badge label="Pending" className="text-yellow-400 bg-yellow-400/10" />
      </div>
      <div className="flex flex-wrap gap-4">
        <span className="text-sm text-[#7A8FBA]">💰 ₹{sv.price}</span>
        <span className="text-sm text-[#7A8FBA]">👷 {sv.provider?.name}</span>
        {sv.location?.city && <span className="text-sm text-[#7A8FBA]">📍 {sv.location.area}, {sv.location.city}</span>}
      </div>
      {sv.description && <p className="text-sm text-[#3D4E70] mt-2">{sv.description}</p>}
    </div>
    <div className="flex gap-2 flex-shrink-0">
      <button
        onClick={() => onApprove(sv._id)}
        disabled={!!acting}
        className="px-5 py-2.5 rounded-xl text-sm font-bold text-green-400 bg-green-400/10 border border-green-400/30 hover:bg-green-400 hover:text-white hover:shadow-lg hover:shadow-green-400/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        {acting === sv._id + "_a" ? "…" : "✓ Approve"}
      </button>
      <button
        onClick={() => onReject(sv._id)}
        disabled={!!acting}
        className="px-5 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-transparent border border-red-400/30 hover:bg-red-400/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        {acting === sv._id + "_r" ? "…" : "✕ Reject"}
      </button>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════ */
export default function AdminDashboard() {
  const [stats, setStats]         = useState({});
  const [providers, setProviders] = useState([]);
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [acting, setActing]       = useState(null);
  const [tab, setTab]             = useState("overview");
  const [toast, setToast]         = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [s, p, sv] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin/providers/pending"),
        API.get("/admin/services/pending"),
      ]);
      setStats(s.data);
      setProviders(p.data.providers || []);
      setServices(sv.data.services  || []);
    } catch (e) {
      showToast("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  const run = async (key, fn, msg) => {
    setActing(key);
    try { await fn(); showToast(msg); fetchAll(); }
    catch (e) { showToast(e?.response?.data?.message || "Action failed", "error"); }
    finally { setActing(null); }
  };

  // ✅ all use PATCH to match adminRoutes.js
  const approveProvider = (id) => run(id + "_a", () => API.patch(`/admin/providers/${id}/approve`), "Provider approved! Profile created.");
  const rejectProvider  = (id) => run(id + "_r", () => API.patch(`/admin/providers/${id}/reject`, { reason: "Did not meet requirements" }), "Provider rejected");
  const approveService  = (id) => run(id + "_a", () => API.patch(`/admin/services/${id}/approve`), "Service approved!");
  const rejectService   = (id) => run(id + "_r", () => API.patch(`/admin/services/${id}/reject`, { reason: "Not meeting guidelines" }), "Service rejected");

  const NAV = [
    { id: "overview",  label: "Overview",  icon: "⬡", badge: 0 },
    { id: "providers", label: "Providers", icon: "◈", badge: providers.length },
    { id: "services",  label: "Services",  icon: "◇", badge: services.length },
  ];

  const STATS = loading ? [] : [
    { title: "Total Users",       value: stats.totalUsers,       icon: "👥", glow: "hover:border-blue-500/40    text-blue-400"   },
    { title: "Customers",         value: stats.totalCustomers,   icon: "🛒", glow: "hover:border-green-500/40   text-green-400"  },
    { title: "Providers",         value: stats.totalProviders,   icon: "👷", glow: "hover:border-orange-500/40  text-orange-400" },
    { title: "Pending Providers", value: stats.pendingProviders, icon: "⏳", glow: "hover:border-yellow-500/40  text-yellow-400" },
    { title: "Total Services",    value: stats.totalServices,    icon: "🛠", glow: "hover:border-blue-500/40    text-blue-400"   },
    { title: "Pending Services",  value: stats.pendingServices,  icon: "📋", glow: "hover:border-red-500/40     text-red-400"    },
  ];

  return (
    <div className="flex min-h-screen bg-[#080C18] text-[#EDF2FF]" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ══ SIDEBAR ══ */}
      <aside className="w-[248px] flex-shrink-0 sticky top-0 h-screen flex flex-col px-3.5 py-7 bg-gradient-to-b from-[#0D1224] to-[#080C18] border-r border-[#1F2D50]">

        {/* Logo */}
        <div className="flex items-center gap-3 px-2.5 pb-9">
          <div className="w-10 h-10 rounded-[13px] flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br from-orange-500 to-blue-500 shadow-lg shadow-orange-500/30">🏠</div>
          <div>
            <p className="font-black text-xl leading-none text-[#EDF2FF]" style={{ fontFamily: "'Syne', sans-serif" }}>Homezy</p>
            <p className="text-[9px] font-extrabold text-orange-500 tracking-[2px] mt-0.5">ADMIN PANEL</p>
          </div>
        </div>

        {/* Nav label */}
        <p className="text-[9px] font-extrabold text-[#3D4E70] tracking-[2px] px-2.5 mb-2">MENU</p>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {NAV.map(n => {
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-l-[3px] text-sm font-medium transition-all duration-200 cursor-pointer
                  ${active
                    ? "bg-orange-500/10 text-[#EDF2FF] font-bold border-orange-500"
                    : "bg-transparent text-[#7A8FBA] border-transparent hover:bg-[#1A2540]"
                  }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={`text-[17px] ${active ? "text-orange-500" : "text-[#3D4E70]"}`}>{n.icon}</span>
                  {n.label}
                </span>
                {n.badge > 0 && (
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md shadow-orange-500/30">
                    {n.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom profile */}
        <div className="mt-auto pt-4 border-t border-[#1F2D50]">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#1A2540]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm bg-gradient-to-br from-orange-500 to-blue-500 shadow-md shadow-orange-500/30 flex-shrink-0">A</div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#EDF2FF] truncate">Super Admin</p>
              <p className="text-[11px] text-[#3D4E70] truncate">admin@homezy.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="flex-1 overflow-y-auto max-h-screen px-10 py-9">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm text-white shadow-2xl border-l-4 border-white/30 animate-bounce-in
            ${toast.type === "success" ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600"}`}>
            {toast.type === "success" ? "✓" : "✕"} {toast.msg}
          </div>
        )}

        {/* Page header */}
        <div className="mb-9">
          <div className="flex items-center gap-3.5 mb-1.5">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-orange-500 to-blue-500" />
            <h1 className="text-3xl font-black tracking-tight text-[#EDF2FF]" style={{ fontFamily: "'Syne', sans-serif" }}>
              {tab === "overview" ? "Dashboard" : tab === "providers" ? "Provider Applications" : "Service Approvals"}
            </h1>
          </div>
          <p className="text-sm text-[#3D4E70] pl-[18px]">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-8">
              {loading
                ? [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-[#161E38] border border-[#1F2D50] rounded-2xl p-5 flex flex-col gap-3">
                      <Sk className="w-1/2 h-2.5" />
                      <Sk className="w-2/5 h-8" />
                    </div>
                  ))
                : STATS.map(s => <StatCard key={s.title} {...s} />)
              }
            </div>

            {/* Quick actions */}
            <p className="text-[10px] font-extrabold text-[#3D4E70] tracking-[2px] mb-3.5">QUICK ACTIONS</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                { t: "providers", label: "Review Provider Applications", sub: `${providers.length} awaiting review`, icon: "👷", border: "hover:border-orange-500/50 hover:shadow-orange-500/10" },
                { t: "services",  label: "Review Pending Services",       sub: `${services.length} awaiting approval`, icon: "🛠", border: "hover:border-blue-500/50 hover:shadow-blue-500/10"   },
              ].map(q => (
                <div
                  key={q.t}
                  onClick={() => setTab(q.t)}
                  className={`bg-[#161E38] border border-[#1F2D50] rounded-2xl p-6 cursor-pointer flex justify-between items-center transition-all duration-200 hover:shadow-xl ${q.border}`}
                >
                  <div>
                    <p className="font-extrabold text-[15px] text-[#EDF2FF] mb-1">{q.label}</p>
                    <p className="text-sm text-[#7A8FBA]">{q.sub}</p>
                  </div>
                  <div className="w-12 h-12 rounded-[13px] flex items-center justify-center text-2xl bg-white/5 border border-white/10 ml-4 flex-shrink-0">{q.icon}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PROVIDERS ── */}
        {tab === "providers" && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-extrabold text-[#EDF2FF]">Pending Applications</h2>
              {providers.length > 0 && (
                <span className="text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 text-xs font-bold px-3 py-0.5 rounded-full">
                  {providers.length} pending
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[1,2].map(i => (
                  <div key={i} className="bg-[#161E38] border border-[#1F2D50] rounded-[18px] p-6 flex flex-col gap-3.5">
                    <Sk className="w-2/5 h-3.5" />
                    <Sk className="w-3/5 h-3" />
                    <Sk className="w-4/5 h-3" />
                  </div>
                ))}
              </div>
            ) : providers.length === 0 ? (
              <Empty text="All caught up!" sub="No pending provider applications." />
            ) : (
              <div className="flex flex-col gap-3">
                {providers.map(p => (
                  <ProviderCard
                    key={p._id}
                    p={p}
                    acting={acting}
                    onApprove={approveProvider}
                    onReject={rejectProvider}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── SERVICES ── */}
        {tab === "services" && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-extrabold text-[#EDF2FF]">Pending Services</h2>
              {services.length > 0 && (
                <span className="text-red-400 bg-red-400/10 border border-red-400/20 text-xs font-bold px-3 py-0.5 rounded-full">
                  {services.length} pending
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[1,2].map(i => (
                  <div key={i} className="bg-[#161E38] border border-[#1F2D50] rounded-[18px] p-6 flex flex-col gap-3">
                    <Sk className="w-1/3 h-3.5" />
                    <Sk className="w-1/2 h-3" />
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <Empty text="All caught up!" sub="No pending services for review." />
            ) : (
              <div className="flex flex-col gap-3">
                {services.map(sv => (
                  <ServiceCard
                    key={sv._id}
                    sv={sv}
                    acting={acting}
                    onApprove={approveService}
                    onReject={rejectService}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

