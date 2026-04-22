
import { motion } from 'motion/react';

export default function Visualizer() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505] overflow-hidden">
      {/* Radial Gradient Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0508_0%,#000000_100%)]" />
      
      {/* Pulsing Glows - Themed to Magenta/Cyan */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#ff00ff]/5 blur-[150px]"
      />
      
      <motion.div 
        animate={{ 
          scale: [1.3, 1, 1.3],
          opacity: [0.05, 0.2, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#00f3ff]/5 blur-[180px]"
      />

       {/* Static Scanline Effect */}
       <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
    </div>
  );
}
