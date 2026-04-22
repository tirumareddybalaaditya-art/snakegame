
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import Visualizer from './components/Visualizer';
import { motion } from 'motion/react';
import { Cpu, Zap, Volume2, Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden selection:bg-[#ff00ff]/30 selection:text-white">
      <Visualizer />
      
      {/* Header */}
      <header className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#ff00ff] to-[#00f3ff] rounded-full animate-pulse shadow-[0_0_15px_rgba(255,0,255,0.4)]"></div>
          <h1 className="text-xl font-black tracking-tighter italic uppercase">Neon <span className="text-[#00f3ff]">Pulse</span></h1>
        </div>
        <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold">
          <span className="text-[#ff00ff] border-b border-[#ff00ff] pb-1">Snake Mode</span>
          <span className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity">Visualizer</span>
          <span className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity">Leaderboard</span>
          <div className="px-3 py-1 border border-white/20 rounded-full font-mono">Session: 00:42:15</div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Playlist (MusicPlayer Component integrated as aside) */}
        <aside className="w-80 border-r border-[#1a1a1a] bg-[#080808] flex flex-col z-40 overflow-hidden">
          <MusicPlayer layout="queue" />
        </aside>

        {/* Center Column: Game Grid */}
        <main className="flex-1 flex flex-col items-center justify-center bg-black relative">
          {/* Game Background Grid */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          <SnakeGame />
        </main>

        {/* Right Column: Controls Info */}
        <aside className="w-72 border-l border-[#1a1a1a] bg-[#080808] p-8 z-40 overflow-y-auto">
          <div className="mb-10">
            <h2 className="text-xs font-bold text-[#00f3ff] uppercase tracking-[0.2em] mb-6">Controls</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center group">
                <span className="text-[10px] opacity-60 uppercase transition-opacity group-hover:opacity-100">Move</span>
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono border border-white/5">W A S D</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-[10px] opacity-60 uppercase transition-opacity group-hover:opacity-100">Boost</span>
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono border border-white/5">SHIFT</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-[10px] opacity-60 uppercase transition-opacity group-hover:opacity-100">Pause</span>
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono border border-white/5">ESC</span>
              </div>
            </div>
          </div>

          <div className="p-5 border border-[#00f3ff]/20 bg-[#00f3ff]/5 rounded-xl">
            <div className="text-xs font-bold mb-3 uppercase italic text-[#00f3ff] flex justify-between">
              <span>Bonus Streak</span>
              <span className="font-mono">75%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                className="h-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"
              />
            </div>
            <div className="text-[10px] mt-3 opacity-50 uppercase tracking-widest italic">3x Multiplier Active</div>
          </div>

          <div className="mt-10 p-5 border border-[#ff00ff]/20 bg-[#ff00ff]/5 rounded-xl">
             <div className="text-[10px] uppercase text-zinc-500 mb-2">Internal Stats</div>
             <div className="space-y-2 font-mono text-[10px]">
                <div className="flex justify-between">
                   <span className="opacity-40">CPU_CORE:</span>
                   <span className="text-[#ff00ff]">STABLE_42%</span>
                </div>
                <div className="flex justify-between">
                   <span className="opacity-40">SYNC_LATENCY:</span>
                   <span className="text-[#ff00ff]">8MS</span>
                </div>
             </div>
          </div>
        </aside>
      </div>

      {/* Player Bar Footer */}
      <footer className="h-24 bg-[#0a0a0a] border-t border-[#1a1a1a] z-50">
        <MusicPlayer layout="footer" />
      </footer>
    </div>
  );
}

