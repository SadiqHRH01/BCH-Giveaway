import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from './components/Login';
import Header from './components/Header';
import Lobby from './components/Lobby';
import CreateForm from './components/CreateForm';
import History from './components/History';
import GiveawayPage from './components/GiveawayPage';

const STORAGE_KEY = "bch_giveaways_v1";
const USER_KEY = "bch_user_v1";
const BLOCK_POLL_INTERVAL_MS = 15_000;

function nowISO() {
  return new Date().toISOString();
}

function loadGiveaways() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { giveaways: [] };
  } catch (e) {
    return { giveaways: [] };
  }
}
function saveGiveaways(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}
function loadUser() {
  try { return localStorage.getItem(USER_KEY); } catch (e) { return null; }
}
function saveUser(name) {
  try { localStorage.setItem(USER_KEY, name); } catch (e) { /* ignore */ }
}

function generateTimerAddressMock(blockDelay) {
  return `bchtest:timer_${Date.now().toString(36)}_${Math.floor(Math.random() * 10000)}`;
}

export default function App() {
  const [storage, setStorage] = useState(() => loadGiveaways());
  const [view, setView] = useState(() => (loadUser() ? { name: "lobby", id: null } : { name: "login", id: null }));
  const [currentBlock, setCurrentBlock] = useState(850000);
  const [now, setNow] = useState(Date.now());
  const [user, setUser] = useState(() => loadUser());
  const confettiRef = useRef(null);
  const blockRef = useRef(currentBlock);

  useEffect(() => { saveGiveaways(storage); }, [storage]);

  useEffect(() => {
    const tick = () => { blockRef.current += 1; setCurrentBlock(blockRef.current); };
    const iv = setInterval(tick, BLOCK_POLL_INTERVAL_MS);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { const iv = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(iv); }, []);

  useEffect(() => { if (user) setView({ name: "lobby" }); }, [user]);

  const login = (name) => { if (!name) return; saveUser(name); setUser(name); setView({ name: "lobby" }); };
  const logout = () => { saveUser(""); setUser(null); setView({ name: "login" }); };

  const createGiveaway = ({ title, amount, blockDelay }) => {
    if (!user) { alert('Please login first'); return; }

    const timerAddress = generateTimerAddressMock(blockDelay);
    const id = 'giveaway_' + Date.now();

    const gw = {
      id,
      title: title || 'Mystery Prize',
      creator: user,
      timerAddress,
      prizeAmount: Number(amount) || 0,
      lockDelayBlocks: Number(blockDelay),
      createdBlock: currentBlock,
      unlockBlock: currentBlock + Number(blockDelay),
      status: 'waiting_funds',
      createdAt: nowISO(),
      fundedAmount: 0,
      claimer: null
    };
    setStorage(s => ({ ...s, giveaways: [gw, ...(s.giveaways || [])] }));
    setView({ name: 'giveaway', id });
  };

  const updateGiveaway = (id, patch) => setStorage(s => ({ ...s, giveaways: s.giveaways.map(g => g.id === id ? { ...g, ...patch } : g) }));

  const simulateFund = (id, amount) => {
    const g = (storage.giveaways || []).find(x => x.id === id);
    if (!g) return;
    updateGiveaway(id, { status: 'active', fundedAtBlock: currentBlock, fundedAmount: Number(amount) });
  };

  useEffect(() => {
    setStorage(s => ({
      ...s,
      giveaways: (s.giveaways || []).map(g => (g.status === 'active' && currentBlock >= g.unlockBlock) ? { ...g, status: 'unlocked' } : g)
    }));
  }, [currentBlock]);

  const attemptClaim = (id, claimerAddress) => {
    const g = (storage.giveaways || []).find(x => x.id === id);
    if (!g) return { ok: false, reason: 'not_found' };
    if (g.creator && user && g.creator === user) return { ok: false, reason: 'creator_cannot_claim' };
    if (g.status !== 'unlocked') return { ok: false, reason: 'locked' };
    if (g.status === 'claimed') return { ok: false, reason: 'already_claimed' };

    updateGiveaway(id, { status: 'claimed', claimer: claimerAddress || user || 'anonymous', claimedAt: nowISO() });
    const container = confettiRef.current;
    if (container) {
      for (let i = 0; i < 20; i++) {
        const el = document.createElement('div');
        el.style.position = 'absolute'; el.style.left = `${50 + (Math.random() * 200 - 100)}%`; el.style.top = `${40 + (Math.random() * 40 - 20)}%`;
        el.style.width = '8px'; el.style.height = '8px'; el.style.borderRadius = '50%'; el.style.background = '#16a34a';
        el.style.transition = 'transform 900ms, opacity 900ms'; container.appendChild(el);
        requestAnimationFrame(()=>{ el.style.transform = 'translateY(120px)'; el.style.opacity='0'; });
        setTimeout(()=>el.remove(), 1000);
      }
    }
    return { ok: true };
  };

  const deleteGiveaway = (id) => {
    if (window.confirm('Are you sure you want to delete this giveaway? This action cannot be undone.')) {
      setStorage(s => ({ ...s, giveaways: s.giveaways.filter(g => g.id !== id) }));
      if (view.name === 'giveaway' && view.id === id) {
        setView({ name: 'lobby' });
      }
    }
  };

  const openGiveaway = (id) => setView({ name: 'giveaway', id });

  const currentGw = view.name === 'giveaway' ? (storage.giveaways || []).find(g => g.id === view.id) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-green-300 p-2 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div ref={confettiRef} style={{ position: 'relative' }} />

        {user ? (
          <Header user={user} currentBlock={currentBlock} setView={setView} onLogout={logout} />
        ) : null}

        <main>
          <AnimatePresence>
            {view.name === 'login' && (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Login onLogin={login} />
              </motion.div>
            )}

            {view.name === 'lobby' && (
              <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Lobby giveaways={storage.giveaways || []} open={openGiveaway} onSimulateFund={simulateFund} currentBlock={currentBlock} />
              </motion.div>
            )}

            {view.name === 'history' && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <History giveaways={storage.giveaways || []} open={openGiveaway} />
              </motion.div>
            )}

            {view.name === 'create' && (
              <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CreateForm onCreate={createGiveaway} onBack={() => setView({ name: 'lobby' })} />
              </motion.div>
            )}

            {view.name === 'giveaway' && (
              <motion.div key={view.id || 'giveaway'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GiveawayPage gw={currentGw} currentBlock={currentBlock} user={user} onClaim={attemptClaim} onBack={() => setView({ name: 'lobby' })} onDelete={deleteGiveaway} />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}