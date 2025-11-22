import React, { useState } from 'react'

export default function GiveawayPage({ gw, currentBlock, user, onClaim, onBack, onDelete }) {
  const [claimerAddress, setClaimerAddress] = useState('');
  const [feedback, setFeedback] = useState('')

  if (!gw) return (
    <div className="mt-6"><div className="p-6 bg-gray-800 rounded shadow text-green-400">Giveaway not found. <button onClick={onBack} className="text-green-600">Back</button></div></div>
  );

  const isCreator = gw.creator && user && gw.creator === user;
  const blocksRemaining = Math.max(0, gw.unlockBlock - currentBlock);

  const handleClaim = async() => {
    setFeedback('');
    try {
      const res = await onClaim(gw.id, claimerAddress || user);
      if (!res.ok) {
        setFeedback(res.reason === 'creator_cannot_claim' ? 'Creators cannot claim their own giveaways.' : `Failed: ${res.reason}`);
      } else {
        setFeedback('Success — claimed! (demo)');
      }
    } catch (error) {
      setFeedback(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <div className="mt-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <button onClick={onBack} className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">← Back to Lobby</button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
          <h1 className="text-2xl font-bold text-green-300">{gw.title}</h1>
          <div className="sm:ml-auto font-mono text-yellow-400">Prize: {gw.prizeAmount} BCH</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-6 rounded-2xl shadow">
          <h3 className="font-semibold text-green-400">⏰ Countdown</h3>
          <div className="mt-3 text-sm text-green-500">Current Block: <span className="font-mono">{currentBlock}</span><br/>Unlocks at: <span className="font-mono">{gw.unlockBlock}</span><br/><strong>Blocks Remaining: <span className="font-mono">{blocksRemaining}</span></strong><div className="text-xs text-gray-400 mt-2">~{Math.round((blocksRemaining * 10))} minutes (estimate)</div></div>

          <div className="mt-4 w-full bg-gray-700 rounded h-3 overflow-hidden">
            <div className="h-3 bg-green-500" style={{ width: `${
              gw.lockDelayBlocks > 0 ? Math.min(100, Math.round(((gw.lockDelayBlocks - blocksRemaining) / gw.lockDelayBlocks) * 100)) : 100
            }%` }} />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow">
          <h3 className="font-semibold text-green-400">🏃 Get Ready to Claim!</h3>

          {isCreator ? (
            <div className="p-4 bg-yellow-900 bg-opacity-50 rounded">
              <div className="font-medium text-yellow-300">You are the creator of this giveaway.</div>
              <div className="text-sm text-yellow-400">Creators cannot claim their own giveaways. Once the timer unlocks others may claim it.</div>
              <button onClick={() => onDelete(gw.id)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded w-full hover:bg-red-700">
                Delete Giveaway
              </button>
            </div>
          ) : (
            <>
              <label className="text-xs text-green-500 mt-2">Your BCH Address (destination)</label>
              <input value={claimerAddress} onChange={(e) => setClaimerAddress(e.target.value)} placeholder="bitcoincash:q..." className="mt-1 w-full rounded border border-gray-600 bg-gray-700 text-white px-3 py-2" />

              <div className="mt-4"><div className="text-sm text-green-500">Status: <span className="font-mono">{gw.status}</span></div><div className="text-sm text-green-500">Timer Address: <span className="font-mono break-words">{gw.timerAddress}</span></div><div className="text-sm text-green-500">Funded Amount: {gw.fundedAmount || 0} BCH</div></div>

              <div className="mt-4 flex gap-3">
                <button onClick={handleClaim} disabled={gw.status !== 'unlocked'} className={`px-4 py-2 rounded ${gw.status === 'unlocked' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                  🚀 CLAIM PRIZE!
                </button>
              </div>

              {feedback && <div className="mt-3 text-sm text-green-400">{feedback}</div>}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded shadow text-sm text-green-500"><div><strong>Created:</strong> {new Date(gw.createdAt).toLocaleString()}</div><div className="mt-1"><strong>Status:</strong> {gw.status}</div><div className="mt-1 break-words"><strong>Timer Address:</strong> <span className="font-mono">{gw.timerAddress}</span></div></div>
    </div>
  );
}
