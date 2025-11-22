import React from 'react';

export default function Lobby({ giveaways, open, onSimulateFund, currentBlock }) {
  const list = (giveaways || []).filter(g => ['waiting_funds','active','unlocked'].includes(g.status));
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-green-300">Active Giveaways</h2>
      {list.length === 0 ? (
        <div className="p-6 bg-gray-800 rounded shadow text-center text-green-400">No active giveaways yet. Be the first to create one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(g => (
            <div key={g.id} className="p-4 bg-gray-800 rounded-2xl shadow flex flex-col">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-300">{g.title}</h3>
                  <div className="text-xs text-green-500">Creator: {g.creator}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-500">Prize</div>
                  <div className="text-xl font-bold text-yellow-400">{g.prizeAmount || g.fundedAmount || 0} BCH</div>
                </div>
              </div>

              <div className="mt-3 flex-grow flex items-end justify-between">
                <div>
                  <div className="text-xs text-green-500">Unlocks in</div>
                  <div className="font-mono text-green-400">{Math.max(0, g.unlockBlock - currentBlock)} blocks</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => open(g.id)} className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">View</button>
                  {g.status === 'waiting_funds' && <button onClick={() => onSimulateFund(g.id, g.prizeAmount || 0.001)} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Simulate Fund</button>}
                </div>
              </div>

              <div className="mt-4 text-xs text-green-600 break-words">Addr: <span className="font-mono">{g.timerAddress}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}