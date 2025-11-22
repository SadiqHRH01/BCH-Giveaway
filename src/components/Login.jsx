import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-300">🔐 Login</h2>
      <p className="text-sm text-green-500 mb-3">Enter a username to participate in giveaways.</p>
      <input className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2 mb-3" placeholder="Your name..." value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => name && onLogin(name)} className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">Continue</button>
    </div>
  );
}