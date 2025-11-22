import React from 'react';

export default function History({ giveaways, open }) {
  const list = (giveaways || []).filter(g => g.status === 'claimed').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-green-300">Giveaway History</h2>
      {list.length === 0 ? (
        <div className="p-6 bg-gray-800 rounded shadow text-center text-green-400">
          No claimed giveaways yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(g => (
            <div key={g.id} className="p-4 bg-gray-800 rounded-2xl shadow border border-gray-700">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-300">{g.title}</h3>
                  <p className="text-xs text-green-500">Creator: {g.creator}</p>
                  <p className="text-xs text-yellow-400 mt-1">Winner: {g.claimer}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-500">Prize</div>
                  <div className="text-xl font-bold text-yellow-400">{g.prizeAmount || g.fundedAmount || 0} BCH</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={() => open(g.id)} className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}