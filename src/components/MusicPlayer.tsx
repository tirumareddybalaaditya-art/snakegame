
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';
import { TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ListMusic } from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';


interface MusicPlayerProps {
  layout: 'queue' | 'footer';
}

export default function MusicPlayer({ layout }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [currentTrackIndex, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (layout === 'queue') {
    return (
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <h2 className="text-xs font-bold text-[#ff00ff] uppercase tracking-[0.2em] mb-8">Queue Interface</h2>
        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-4">
            {TRACKS.map((track, i) => (
              <button
                key={track.id}
                onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
                className={`w-full p-4 flex gap-4 transition-all border-l-2 text-left rounded-r-md ${
                  currentTrackIndex === i 
                    ? 'bg-white/10 border-[#ff00ff] text-white' 
                    : 'bg-transparent border-transparent text-zinc-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-xs font-mono">
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-bold truncate">{track.title}</div>
                  <div className="text-[10px] opacity-50 uppercase tracking-widest truncate">{track.artist} • {formatTime(track.duration)}</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-8 p-5 bg-gradient-to-br from-[#111] to-[#000] border border-white/10 rounded-2xl">
          <div className="text-[10px] uppercase mb-3 opacity-40 tracking-widest font-bold font-mono text-white/50">Input Selected</div>
          <div className="flex gap-4 items-center overflow-hidden">
            <motion.div 
              key={currentTrack.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 rounded bg-[#ff00ff] shadow-[0_0_20px_rgba(255,0,255,0.4)] overflow-hidden shrink-0"
            >
              <img src={currentTrack.cover} className="w-full h-full object-cover" />
            </motion.div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate leading-tight mb-1 text-white">{currentTrack.title}</div>
              <div className="text-[10px] text-[#00f3ff] uppercase tracking-widest border border-[#00f3ff]/20 px-1 inline-block rounded">Live Stream</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full px-12 flex items-center gap-16 relative">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      {/* Playback Status */}
      <div className="flex items-center gap-8">
        <button onClick={prevTrack} className="opacity-60 hover:opacity-100 hover:text-[#00f3ff] transition-all text-white">
          <SkipBack className="w-5 h-5 fill-current" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center text-xl hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all text-white"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>
        <button onClick={nextTrack} className="opacity-60 hover:opacity-100 hover:text-[#00f3ff] transition-all text-white">
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between text-[10px] uppercase font-black tracking-[0.2em] mb-1">
          <span className="opacity-40 text-white">{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span className="text-[#ff00ff] italic">Transmitting: {currentTrack.title}</span>
          <span className="opacity-40 text-white">{formatTime(currentTrack.duration)}</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full relative overflow-visible group">
          <motion.div 
             className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff00ff] to-[#00f3ff] rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"
             animate={{ width: `${progress}%` }}
          />
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] z-10"
            animate={{ left: `calc(${progress}% - 8px)` }}
          />
           <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={(v) => {
              if (audioRef.current) {
                audioRef.current.currentTime = (v[0] / 100) * audioRef.current.duration;
                setProgress(v[0]);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
          />
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Frequency</span>
          <div className="w-32 h-1 bg-white/10 rounded-full relative overflow-hidden group">
            <Slider
              value={[volume]}
              max={100}
              onValueChange={(v) => setVolume(v[0])}
              className="absolute inset-0 z-20 h-full opacity-0"
            />
            <div className="absolute inset-y-0 left-0 bg-white transition-all pointer-events-none" style={{ width: `${volume}%` }} />
          </div>
        </div>
        <button className="text-zinc-600 hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
