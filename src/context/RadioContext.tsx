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
  liveTitle: string;
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
  notifyExternalCasterClick: () => void;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  seekTo: (timeSeconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  setSleepTimer: (minutes: number | null) => void;
}

const LIVE_PROXY_URL = '/api/live';

const RadioContext = createContext<RadioContextValue | null>(null);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<RadioMode>('live');
  const [liveServerOnline, setLiveServerOnline] = useState<boolean>(true);
  const [liveTitle, setLiveTitle] = useState<string>('Señal en Vivo • Mendoza');
  const [currentProgram, setCurrentProgram] = useState<ProgramItem>(PROGRAMS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // Start spinning vinyl immediately on entry
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
  const hasInitializedRef = useRef<boolean>(false);
  const waitingForGestureUnmuteRef = useRef<boolean>(false);

  modeRef.current = mode;
  currentProgramRef.current = currentProgram;

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
        // Add cache-busting query param for live stream so it always connects to the live edge
        const targetSrc =
          nextMode === 'live' ? `${LIVE_PROXY_URL}?t=${Date.now()}` : src;

        audio.src = targetSrc;
        audio.muted = isMuted;
        audio.volume = isMuted ? 0 : volume;
        audio.load();

        await audio.play();
        waitingForGestureUnmuteRef.current = false;
        setIsPlaying(true);
        setAutoplayBlocked(false);
        setIsLoading(false);
        return true;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          // Browser blocked unmuted autoplay on initial load:
          // Start muted autoplay immediately so the stream connects and vinyl spins right away,
          // then unmute on the very first click/tap/keypress anywhere on the page.
          try {
            audio.muted = true;
            await audio.play();
            waitingForGestureUnmuteRef.current = true;
            setIsPlaying(true);
            setAutoplayBlocked(true);
            setIsLoading(false);
            return false;
          } catch {
            waitingForGestureUnmuteRef.current = true;
            setAutoplayBlocked(true);
            setIsLoading(false);
            return false;
          }
        }

        setIsLoading(false);
        // If live stream is offline (503), fallback to Auto-DJ 24/7 so music always plays
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

  // Initial mount: immediately start playing Live Stream ("Señal en Vivo") & spin vinyl
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const hourIndex = new Date().getHours() % PROGRAMS.length;
    const initialProgram = PROGRAMS[hourIndex] || PROGRAMS[0];
    setCurrentProgram(initialProgram);
    currentProgramRef.current = initialProgram;

    // Fetch live metadata in parallel without delaying immediate autoplay
    fetch('/api/stream')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.serverReady === 'boolean') {
          setLiveServerOnline(data.serverReady);
        }
        if (data?.liveTitle) {
          setLiveTitle(data.liveTitle);
        }
      })
      .catch(() => {});

    let unlockCleanup: (() => void) | null = null;

    const registerFirstInteractionUnlock = () => {
      if (unlockCleanup) return;

      const handleUnlock = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
          audio.muted = false;
          audio.volume = volume;
          setIsMuted(false);

          if (audio.paused) {
            if (!audio.src) {
              audio.src = `${LIVE_PROXY_URL}?t=${Date.now()}`;
            }
            await audio.play();
          }

          waitingForGestureUnmuteRef.current = false;
          setIsPlaying(true);
          setAutoplayBlocked(false);
          setIsLoading(false);

          if (unlockCleanup) {
            unlockCleanup();
            unlockCleanup = null;
          }
        } catch {
          // Will retry on next direct click
        }
      };

      const events: (keyof DocumentEventMap)[] = [
        'pointerdown',
        'click',
        'touchstart',
        'keydown',
      ];
      events.forEach((evt) =>
        document.addEventListener(evt, handleUnlock, { passive: true })
      );

      unlockCleanup = () => {
        events.forEach((evt) => document.removeEventListener(evt, handleUnlock));
      };
    };

    // Start Live Stream immediately on page open
    playSource(LIVE_PROXY_URL, 'live', initialProgram).then((ok) => {
      if (!ok) {
        registerFirstInteractionUnlock();
      }
    });

    return () => {
      if (unlockCleanup) unlockCleanup();
    };
  }, [playSource, volume]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  // When the user interacts directly with the embedded Caster.fm iframe player:
  // pause our internal HTML5 audio to avoid double audio, but keep mode='live' and vinyl spinning
  const notifyExternalCasterClick = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setMode('live');
    setIsPlaying(true);
    setAutoplayBlocked(false);
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // If audio was playing muted due to browser autoplay policy, unmute it on first Play click
    if (waitingForGestureUnmuteRef.current || autoplayBlocked) {
      audio.muted = false;
      audio.volume = volume;
      setIsMuted(false);
      waitingForGestureUnmuteRef.current = false;
      setAutoplayBlocked(false);
      if (audio.paused) {
        await playSource(
          modeRef.current === 'live' ? LIVE_PROXY_URL : currentProgramRef.current.audio,
          modeRef.current
        );
      } else {
        setIsPlaying(true);
      }
      return;
    }

    if (isPlaying && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (modeRef.current === 'live') {
      await playSource(LIVE_PROXY_URL, 'live');
    } else {
      await playSource(currentProgramRef.current.audio, modeRef.current, currentProgramRef.current);
    }
  }, [autoplayBlocked, isPlaying, playSource, volume]);

  const playLive = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      setIsMuted(false);
      waitingForGestureUnmuteRef.current = false;
    }
    await playSource(LIVE_PROXY_URL, 'live');
  }, [playSource]);

  const playAutoDj = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      setIsMuted(false);
      waitingForGestureUnmuteRef.current = false;
    }
    const prog = currentProgramRef.current || PROGRAMS[0];
    await playSource(prog.audio, 'autodj', prog);
  }, [playSource]);

  const playProgram = useCallback(
    async (program: ProgramItem) => {
      const audio = audioRef.current;
      if (audio) {
        audio.muted = false;
        setIsMuted(false);
        waitingForGestureUnmuteRef.current = false;
      }
      if (
        audio &&
        (modeRef.current === 'program' || modeRef.current === 'autodj') &&
        currentProgramRef.current.id === program.id &&
        audio.src.endsWith(program.audio)
      ) {
        if (isPlaying && !audio.paused) {
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
      audioRef.current.muted = clamped === 0;
      audioRef.current.volume = clamped;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
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
        ? `${liveTitle} • Radio Nostalgia Digital`
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
        artwork: [{ src: artworkUrl, sizes: '512x512', type: 'image/png' }],
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
  }, [mode, liveTitle, currentProgram, togglePlay, pauseAudio, nextTrack, prevTrack]);

  return (
    <RadioContext.Provider
      value={{
        mode,
        isPlaying,
        isLoading,
        autoplayBlocked,
        liveServerOnline,
        liveTitle,
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
        notifyExternalCasterClick,
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
        playsInline
        onPlay={() => {
          setIsPlaying(true);
          setIsLoading(false);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
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
          if (modeRef.current === 'live') {
            // Reconnect automatically if live stream chunk ends
            playSource(LIVE_PROXY_URL, 'live');
          } else {
            nextTrack();
          }
        }}
        onError={() => {
          setIsLoading(false);
          if (modeRef.current === 'live') {
            // If live stream is offline, fallback seamlessly to Auto-DJ 24/7
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
