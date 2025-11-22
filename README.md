# BCH GIVEAWAY

A small React app that simulates timed giveaways entirely in the browser. It’s intended as a UI prototype: create a giveaway, fund it, wait a simulated block timer, then claim the prize. No backend, no wallet, just P2S lyla Upgrade.

## Quick summary
- Create giveaways with a title, prize amount and an unlock block height.
- Fund a giveaway using the “Simulate Fund” action to mark it active.
- A block counter runs in the app; giveaways unlock automatically at their target block.
- The creator cannot claim their own giveaway; any other user can claim after unlock.

## Features
- Mock login to switch between users.
- Simulated block height that increments automatically.
- Persistent state via localStorage (giveaways + current user).
- Smooth UI with Framer Motion and TailwindCSS.
- Confetti/celebration on successful claim.

## How it works
- All state lives in the browser (React useState/useEffect).
- A setInterval updates a block counter; unlocking logic runs against that counter.
- localStorage stores giveaways and the current user so the session survives refresh.

## Getting started (developer)
1. Clone the repo and open the project:
   clone repo
   cd giveaway-platform
2. Install dependencies:
   npm install
3. Start the frontend:
   npm run dev

## Typical flows
- Creator: create → copy contract address → simulate funding → wait for unlock.
- Claimer: browse giveaways → enter address → claim after unlock → transaction simulated and UI updates.

## Tests & checks
- Creator cannot claim their own giveaway.
- A claim before unlock is rejected.
- Unfunded giveaways remain pending until funded.

## Development notes
- Components are simple React function components using hooks.
- Styling is Tailwind; animations via Framer Motion.
- To reset app state, clear localStorage or open the app in a private window.

## Next steps
- waiting for CashScript to support P2S
- Also waiting for BCH.JS to be updated
- Integrate a backend and real block data.
- Replace mock logic with on-chain contracts.
- Add wallet integration for real signing and broadcasting.



