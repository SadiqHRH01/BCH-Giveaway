import React from 'react'

export default function Header({ user, setView, currentBlock, onLogout }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-green-400">🎪 BCH Giveaway Arena</h1>
        <p className="text-sm text-green-500">Signed in as <strong>{user}</strong></p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="text-sm text-green-500 p-2 bg-gray-800 rounded-md">Block: <span className="font-mono">{currentBlock}</span></div>
        <button onClick={() => setView({ name: 'lobby' })} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Lobby</button>
        <button onClick={() => setView({ name: 'history' })} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">History</button>
        <button onClick={() => setView({ name: 'create' })} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Create</button>
        <button onClick={onLogout} className="px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-700">Logout</button>
      </div>
    </div>
  )
}
