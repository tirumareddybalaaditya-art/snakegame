
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GameStatus } from '../types';
import { GAME_CONFIG } from '../constants';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(GAME_CONFIG.INITIAL_SPEED);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Point>({ x: 1, y: 0 });

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
        y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 10 });
    setDirection({ x: 1, y: 0 });
    lastDirectionRef.current = { x: 1, y: 0 };
    setScore(0);
    setSpeed(GAME_CONFIG.INITIAL_SPEED);
    setStatus('playing');
  };

  const moveSnake = useCallback(() => {
    if (status !== 'playing') return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GAME_CONFIG.GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GAME_CONFIG.GRID_SIZE
      ) {
        setStatus('gameover');
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('gameover');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
        setSpeed((prev) => Math.max(GAME_CONFIG.MIN_SPEED, prev - GAME_CONFIG.SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
    
    lastDirectionRef.current = direction;
  }, [direction, food, status, generateFood]);

  useEffect(() => {
    if (status === 'playing') {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed, status]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      
      const lastDir = lastDirectionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="relative flex flex-col items-center gap-12 group">
      {/* Score Floating Panel */}
      <div className="flex gap-16 z-20">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Current Score</div>
          <div className="text-5xl font-black font-mono text-[#00f3ff] drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            {score.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">High Score</div>
          <div className="text-5xl font-black font-mono text-[#ff00ff] drop-shadow-[0_0_15px_rgba(255,0,255,0.4)]">
            {highScore.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Game Viewport */}
      <div 
        className="relative z-10 border-4 border-[#00f3ff] shadow-[0_0_50px_rgba(0,243,255,0.15)] bg-[#050505] overflow-hidden"
        style={{
          width: '512px',
          height: '512px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GAME_CONFIG.GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GAME_CONFIG.GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Background Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
           <div className="text-[140px] font-black italic select-none text-white whitespace-nowrap">PULSE</div>
        </div>

        {/* Snake Rendering */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            className="absolute rounded-[1px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              backgroundColor: i === 0 ? '#ff00ff' : `rgba(255, 0, 255, ${0.8 - (i * 0.05)})`,
              boxShadow: i === 0 ? '0 0 15px #ff00ff' : '0 0 5px rgba(255,0,255,0.3)'
            }}
            style={{
              width: `${100 / GAME_CONFIG.GRID_SIZE}%`,
              height: `${100 / GAME_CONFIG.GRID_SIZE}%`,
              left: `${(segment.x * 100) / GAME_CONFIG.GRID_SIZE}%`,
              top: `${(segment.y * 100) / GAME_CONFIG.GRID_SIZE}%`,
              zIndex: i === 0 ? 10 : 1,
            }}
          />
        ))}

        {/* Food Rendering */}
        <motion.div
          className="absolute bg-[#00f3ff] rounded-full shadow-[0_0_15px_#00f3ff]"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{
            width: `${(100 / GAME_CONFIG.GRID_SIZE) * 0.7}%`,
            height: `${(100 / GAME_CONFIG.GRID_SIZE) * 0.7}%`,
            left: `${(food.x * 100) / GAME_CONFIG.GRID_SIZE + (100 / GAME_CONFIG.GRID_SIZE) * 0.15}%`,
            top: `${(food.y * 100) / GAME_CONFIG.GRID_SIZE + (100 / GAME_CONFIG.GRID_SIZE) * 0.15}%`,
          }}
        />

        {/* Status Overlays */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050505]/90 flex flex-col items-center justify-center p-8 text-center z-50 backdrop-blur-md"
            >
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic line-clamp-2">Ready to Sync?</h2>
              <p className="text-zinc-500 mb-10 text-xs uppercase tracking-widest max-w-xs leading-relaxed">
                Navigation authority required. Use WASD or Arrows to initialize sequence.
              </p>
              <Button 
                onClick={resetGame}
                className="bg-[#ff00ff] hover:bg-[#ff00ff]/80 text-white font-black uppercase tracking-[0.2em] px-12 h-14 rounded-none shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all"
              >
                Initalize Core
              </Button>
            </motion.div>
          )}

          {status === 'gameover' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-8 text-center z-50 backdrop-blur-xl border-4 border-[#ff00ff]/20"
            >
              <span className="text-[#ff00ff] text-[10px] font-mono uppercase tracking-[0.5em] mb-4 text-center block">Connection Severed</span>
              <h2 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase italic line-clamp-2">Process Failure</h2>
              <div className="flex flex-col items-center mb-10">
                <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-2">Cycle Harvested</span>
                <span className="text-5xl font-black text-[#00f3ff] font-mono drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">{score}</span>
              </div>
              <Button 
                onClick={resetGame}
                className="bg-transparent border-2 border-white/20 hover:border-[#ff00ff] hover:text-[#ff00ff] text-white font-black uppercase tracking-[0.3em] px-12 h-14 rounded-none transition-all"
              >
                Reconnect
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button
           onClick={() => setStatus(status === 'playing' ? 'paused' : 'playing')}
           disabled={status === 'idle' || status === 'gameover'}
           variant="ghost"
           className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-[#00f3ff] transition-colors"
        >
          {status === 'paused' ? 'Resume Protocol' : 'Halt Sequence'}
        </Button>
      </div>
    </div>
  );
}
