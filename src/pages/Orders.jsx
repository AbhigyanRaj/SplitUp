import React from 'react';

const orders = [
  {
    id: 1,
    status: 'active',
    plan: 'Premium',
    service: 'Netflix',
    logo: '/netflix.png',
    expires: '2024-07-20',
    people: 4,
    desc: "You're sharing this subscription with 3 other people.",
  },
  {
    id: 2,
    status: 'pending',
    plan: 'Premium',
    service: 'Spotify',
    logo: '/spotify2.png',
    waiting: 2,
    desc: "You're waiting for 2 more people to join this subscription.",
  },
  {
    id: 3,
    status: 'completed',
    plan: 'Premium',
    service: 'Prime Video',
    logo: '/primevideo2.png',
    people: 4,
    desc: "You shared this subscription with 3 other people.",
  },
];

const statusSections = [
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

function Orders() {
  return (
    <main className="bg-slate-50 min-h-screen py-20 px-2 sm:px-4 mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10 tracking-tight">My Subscriptions</h1>
        <div className="space-y-12">
          {statusSections.map((section, idx) => (
            <div key={section.key}>
              <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wider mb-6 pl-1">{section.label}</h2>
              <div className="flex flex-col gap-6">
                {orders.filter(o => o.status === section.key).length === 0 && (
                  <div className="text-slate-400 italic">No {section.label.toLowerCase()} subscriptions.</div>
                )}
                {orders.filter(o => o.status === section.key).map(order => (
                  <div key={order.id} className="flex flex-col sm:flex-row items-center sm:items-stretch bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md">
                    <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                      {order.expires && (
                        <div className="text-xs text-slate-400 mb-1">Expires on {new Date(order.expires).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      )}
                      <div className="font-bold text-lg text-slate-900 mb-1 truncate">{order.plan}</div>
                      <div className="text-slate-600 mb-3 text-sm leading-relaxed">{order.desc}</div>
                      <button className="mt-auto px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold bg-white hover:bg-blue-50 transition w-max text-sm">View Details</button>
                    </div>
                    <div className="sm:w-48 w-full h-32 sm:h-auto flex items-center justify-center bg-slate-100 border-l border-slate-200">
                      {order.logo ? (
                        <img src={order.logo} alt={order.service} className="max-h-16 w-auto object-contain" />
                      ) : (
                        <span className="text-slate-400 font-bold text-xl">{order.service}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {idx < statusSections.length - 1 && (
                <div className="my-12 border-t border-slate-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Orders; 