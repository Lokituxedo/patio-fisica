import { useRef, useCallback } from 'react';

type SoundType = 'pickup' | 'drop' | 'snap' | 'complete' | 'pop' | 'whoosh';

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) => {
    try {
      const ctx = getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Silently fail - audio is not critical
    }
  }, [getContext]);

  const play = useCallback((sound: SoundType) => {
    switch (sound) {
      case 'pickup':
        // Gentle ascending tone - "picking up"
        playTone(440, 0.15, 'sine', 0.1);
        setTimeout(() => playTone(550, 0.1, 'sine', 0.08), 50);
        break;
      
      case 'drop':
        // Soft descending tone - "putting down"
        playTone(350, 0.2, 'sine', 0.08);
        break;
      
      case 'snap':
        // Satisfying click - piece in place
        playTone(600, 0.08, 'sine', 0.12);
        setTimeout(() => playTone(800, 0.12, 'sine', 0.1), 40);
        break;
      
      case 'complete':
        // Celebration melody - ascending happy notes
        playTone(523, 0.2, 'sine', 0.12); // C5
        setTimeout(() => playTone(659, 0.2, 'sine', 0.12), 120); // E5
        setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 240); // G5
        setTimeout(() => playTone(1047, 0.4, 'sine', 0.15), 360); // C6
        break;
      
      case 'pop':
        // Quick pop sound
        playTone(800, 0.06, 'sine', 0.1);
        break;
      
      case 'whoosh':
        // Soft whoosh for disassembly
        playTone(200, 0.3, 'sine', 0.06);
        setTimeout(() => playTone(300, 0.2, 'sine', 0.04), 100);
        break;
    }
  }, [playTone]);

  return { play };
}
