import React, { useState } from 'react'

export default function CreateForm({ onCreate, onBack }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(0.001);
  const [blockDelay, setBlockDelay] = useState(10);

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-4 sm:p-6 rounded-2xl shadow">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="px-3 py-2 bg-gray-700 text-white rounded">← Back</button>
        <h2 className="text-2xl font-bold text-green-300">🎁 Create Giveaway</h2>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onCreate({ title, amount: Number(amount), blockDelay: Number(blockDelay) }); }}>
        <label className="block text-sm text-gray-400">Prize Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 mb-3 w-full rounded border border-gray-600 bg-gray-700 text-white px-3 py-2" placeholder="My Cool Prize!" />

        <label className="block text-sm text-gray-400">Prize Amount (BCH)</label>
        <input type="number" step="0.0001" min="0.0001" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 mb-3 w-full rounded border border-gray-600 bg-gray-700 text-white px-3 py-2" />

        <label className="block text-sm text-gray-400">Lock Time</label>
        <select value={blockDelay} onChange={(e) => setBlockDelay(e.target.value)} className="mt-1 mb-4 w-full rounded border border-gray-600 bg-gray-700 text-white px-3 py-2">
          <option value={10}>10 blocks (demo)</option>
          <option value={0.5}>5 minutes (approx)</option>
          <option value={144}>144 blocks (approx. 1 day)</option>
          <option value={1008}>1008 blocks (approx. 1 week)</option>
        </select>

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Create Giveaway</button>
          <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Cancel</button>
        </div>

        <p className="text-xs text-slate-400 mt-4">Note: This demo uses a mock timer address. For production, integrate bch-js and a Blockbook watcher.</p>
      </form>
    </div>
  )
}