'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { PROGRAMS, ProgramItem } from '@/data/programs';

export type RadioMode = 'live' | 'autodj' | 'program';

interface RadioContextValue {
  mode: RadioMode;
  isPlaying: boolean;
  isLoading: boolean;
  autoplayBlocked: boolean;
  liveServerOnline: boolean;
  currentProgram: ProgramItem;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  sleepMinutes: number | null;
  sleepRemainingSeconds: number | null;
  togglePlay: () => Promise<void>;
  pauseAudio: () => void;
  playLive: () => Promise<void>;
  playAutoDj: () => Promise<void>;
  playProgram: (program: ProgramItem) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  seekTo: (timeSeconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  setSleepTimer: (minutes: number | null) => void;
}

const INITIAL_LIVE_URL =
  'https://sapircast.caster.fm:18243/s7Rhf?token=568f6c35837c77060df6bd2e49416bd3';

const RadioContext = createContext<RadioContextValue | null>(null);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<RadioMode>('live');
  const [liveStreamUrl, setLiveStreamUrl] = useState<string>(INITIAL_LIVE_URL);
  const [liveServerOnline, setLiveServerOnline] = useState<boolean>(false);
  const [currentProgram, setCurrentProgram] = useState<ProgramItem>(PROGRAMS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);
  const [sleepRemainingSeconds, setSleepRemainingSeconds] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modeRef = useRef<RadioMode>(mode);
  const currentProgramRef = useRef<ProgramItem>(currentProgram);
  const liveStreamUrlRef = useRef<string>(liveStreamUrl);
  const hasInitializedRef = useRef<boolean>(false);

  modeRef.current = mode;
  currentProgramRef.current = currentProgram;
  liveStreamUrlRef.current = liveStreamUrl;

  const playSource = useCallback(
    async (src: string, nextMode: RadioMode, program?: ProgramItem): Promise<boolean> => {
      const audio = audioRef.current;
      if (!audio) return false;

      setMode(nextMode);
      modeRef.current = nextMode;
      if (program) {
        setCurrentProgram(program);
        currentProgramRef.current = program;
      }

      try {
        setIsLoading(true);
        if (audio.src !== new URL(src, window.location.origin).href) {
          audio.src = src;
          audio.load();
        }
        audio.volume = isMuted ? 0 : volume;
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
        setIsLoading(false);
        return true;
      } catch (err) {
        setIsLoading(false);
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setAutoplayBlocked(true);
          setIsPlaying(false);
          return false;
        }
        // If live stream is currently offline, seamlessly fallback to Auto-DJ 24/7
        if (nextMode === 'live') {
          const fallbackProgram = currentProgramRef.current || PROGRAMS[0];
          return playSource(fallbackProgram.audio, 'autodj', fallbackProgram);
        }
        setIsPlaying(false);
        return false;
      }
    },
    [isMuted, volume]
  );

  // Initial mount: check stream status & trigger immediate autoplay
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Pick a time-based initial program for variety in Auto-DJ
    const hourIndex = new Date().getHours() % PROGRAMS.length;
    const initialProgram = PROGRAMS[hourIndex] || PROGRAMS[0];
    setCurrentProgram(initialProgram);
    currentProgramRef.current = initialProgram;

    let unlockCleanup: (() => void) | null = null;

    const registerFirstInteractionUnlock = () => {
      if (unlockCleanup) return;

      const handleUnlock = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        try {
          setIsLoading(true);
          await audio.play();
          setIsPlaying(true);
          setAutoplayBlocked(false);
          setIsLoading(false);
          if (unlockCleanup) {
            unlockCleanup();
            unlockCleanup = null;
          }
        } catch {
          setIsLoading(false);
        }
      };

      const events: (keyof DocumentEventMap)[] = ['click', 'touchstart', 'keydown'];
      events.forEach((evt) =>
        document.addEventListener(evt, handleUnlock, { passive: true })
      );

      unlockCleanup = () => {
        events.forEach((evt) => document.removeEventListener(evt, handleUnlock));
      };
    };

    const initAutoplay = async () => {
      try {
        const res = await fetch('/api/stream');
        const data = await res.json();
        if (data?.streamUrl) {
          setLiveStreamUrl(data.streamUrl);
          liveStreamUrlRef.current = data.streamUrl;
        }
        const isLiveReady = Boolean(data?.serverReady);
        setLiveServerOnline(isLiveReady);

        if (isLiveReady) {
          const ok = await playSource(
            data?.streamUrl || INITIAL_LIVE_URL,
            'live',
            initialProgram
          );
          if (!ok) registerFirstInteractionUnlock();
        } else {
          // Live encoder is offline -> start Auto-DJ 24/7 immediately so the radio always autoplays!
          const ok = await playSource(initialProgram.audio, 'autodj', initialProgram);
          if (!ok) registerFirstInteractionUnlock();
        }
      } catch {
        const ok = await playSource(initialProgram.audio, 'autodj', initialProgram);
        if (!ok) registerFirstInteractionUnlock();
      }
    };

    initAutoplay();

    return () => {
      if (unlockCleanup) unlockCleanup();
    };
  }, [playSource]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (modeRef.current === 'live') {
      await playSource(liveStreamUrlRef.current, 'live');
    } else {
      try {
        setIsLoading(true);
        if (!audio.src) {
          audio.src = currentProgramRef.current.audio;
        }
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setAutoplayBlocked(true);
        }
      }
    }
  }, [isPlaying, playSource]);

  const playLive = useCallback(async () => {
    await playSource(liveStreamUrlRef.current, 'live');
  }, [playSource]);

  const playAutoDj = useCallback(async () => {
    const prog = currentProgramRef.current || PROGRAMS[0];
    await playSource(prog.audio, 'autodj', prog);
  }, [playSource]);

  const playProgram = useCallback(
    async (program: ProgramItem) => {
      const audio = audioRef.current;
      // If clicking the exact same program that's already loaded in program/autodj mode, toggle play/pause
      if (
        audio &&
        (modeRef.current === 'program' || modeRef.current === 'autodj') &&
        currentProgramRef.current.id === program.id &&
        audio.src.endsWith(program.audio)
      ) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          setMode('program');
          await togglePlay();
        }
        return;
      }
      await playSource(program.audio, 'program', program);
    },
    [isPlaying, playSource, togglePlay]
  );

  const nextTrack = useCallback(async () => {
    const currentIndex = PROGRAMS.findIndex((p) => p.id === currentProgramRef.current.id);
    const nextIndex = (currentIndex + 1) % PROGRAMS.length;
    const nextProg = PROGRAMS[nextIndex];
    const nextMode = modeRef.current === 'live' ? 'autodj' : modeRef.current;
    await playSource(nextProg.audio, nextMode, nextProg);
  }, [playSource]);

  const prevTrack = useCallback(async () => {
    const currentIndex = PROGRAMS.findIndex((p) => p.id === currentProgramRef.current.id);
    const prevIndex = (currentIndex - 1 + PROGRAMS.length) % PROGRAMS.length;
    const prevProg = PROGRAMS[prevIndex];
    const nextMode = modeRef.current === 'live' ? 'autodj' : modeRef.current;
    await playSource(prevProg.audio, nextMode, prevProg);
  }, [playSource]);

  const seekTo = useCallback((timeSeconds: number) => {
    const audio = audioRef.current;
    if (!audio || modeRef.current === 'live') return;
    audio.currentTime = timeSeconds;
    setCurrentTime(timeSeconds);
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  const setSleepTimer = useCallback((minutes: number | null) => {
    setSleepMinutes(minutes);
    setSleepRemainingSeconds(minutes ? minutes * 60 : null);
  }, []);

  // Sleep Timer countdown
  useEffect(() => {
    if (sleepRemainingSeconds === null) return;
    if (sleepRemainingSeconds <= 0) {
      pauseAudio();
      setSleepMinutes(null);
      setSleepRemainingSeconds(null);
      return;
    }

    const timer = setInterval(() => {
      setSleepRemainingSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepRemainingSeconds, pauseAudio]);

  // Media Session API for mobile lock-screen & Bluetooth controls
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    const title =
      mode === 'live'
        ? 'Señal en Vivo • Radio Nostalgia Digital'
        : currentProgram.title;
    const artist =
      mode === 'live'
        ? 'Transmitiendo desde Mendoza, Argentina'
        : `${currentProgram.subtitle} • Radio Nostalgia`;
    const artworkUrl = mode === 'live' ? '/logo.png' : currentProgram.image;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist,
        album: 'Radio Nostalgia Digital',
        artwork: [
          { src: artworkUrl, sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        togglePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        pauseAudio();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextTrack();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        prevTrack();
      });
    } catch {
      // Ignore unsupported mediaSession actions on older browsers
    }
  }, [mode, currentProgram, togglePlay, pauseAudio, nextTrack, prevTrack]);

  return (
    <RadioContext.Provider
      value={{
        mode,
        isPlaying,
        isLoading,
        autoplayBlocked,
        liveServerOnline,
        currentProgram,
        volume,
        isMuted,
        currentTime,
        duration,
        sleepMinutes,
        sleepRemainingSeconds,
        togglePlay,
        pauseAudio,
        playLive,
        playAutoDj,
        playProgram,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleMute,
        setSleepTimer,
      }}
    >
      {children}
      {/* Persistent Global HTML5 Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
          setIsLoading(false);
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
        }}
        onLoadedMetadata={(e) => {
          const dur = e.currentTarget.duration;
          setDuration(Number.isFinite(dur) ? dur : 0);
        }}
        onEnded={() => {
          // Continuously advance to next program in Auto-DJ or Program mode
          nextTrack();
        }}
        onError={() => {
          setIsLoading(false);
          if (modeRef.current === 'live') {
            // Live stream is offline -> seamlessly switch to Auto-DJ 24/7
            const fallback = currentProgramRef.current || PROGRAMS[0];
            playSource(fallback.audio, 'autodj', fallback);
          } else {
            setIsPlaying(false);
          }
        }}
      />
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio debe usarse dentro de un RadioProvider');
  }
  return context;
}
