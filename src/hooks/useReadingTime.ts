import { useState, useEffect, useRef } from 'react';

interface ReadingTimeStats {
  totalMinutes: number;
  lastUpdated: string;
  sessions: {
    date: string;
    minutes: number;
  }[];
}

const STORAGE_KEY = 'reading-time-stats';

export function useReadingTime() {
  const [stats, setStats] = useState<ReadingTimeStats>({
    totalMinutes: 0,
    lastUpdated: new Date().toISOString(),
    sessions: [],
  });
  const [isTracking, setIsTracking] = useState(false);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar stats do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar stats de leitura');
      }
    }
  }, []);

  // Salvar stats no localStorage
  const saveStats = (newStats: ReadingTimeStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    setStats(newStats);
  };

  // Iniciar rastreamento
  const startTracking = () => {
    if (isTracking) return;
    
    startTimeRef.current = Date.now();
    setIsTracking(true);

    // Atualizar a cada minuto
    intervalRef.current = setInterval(() => {
      const elapsedMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
      if (elapsedMinutes >= 1) {
        addMinutes(elapsedMinutes);
        startTimeRef.current = Date.now();
      }
    }, 60000); // Verifica a cada minuto
  };

  // Parar rastreamento
  const stopTracking = () => {
    if (!isTracking) return;

    // Adicionar tempo restante
    const elapsedMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
    if (elapsedMinutes >= 1) {
      addMinutes(elapsedMinutes);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTracking(false);
  };

  // Adicionar minutos ao total
  const addMinutes = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedStats = { ...stats };
    updatedStats.totalMinutes += minutes;
    updatedStats.lastUpdated = new Date().toISOString();

    // Atualizar sessão de hoje
    const todaySession = updatedStats.sessions.find(s => s.date === today);
    if (todaySession) {
      todaySession.minutes += minutes;
    } else {
      updatedStats.sessions.push({ date: today, minutes });
    }

    // Manter apenas últimos 30 dias
    updatedStats.sessions = updatedStats.sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return sessionDate >= thirtyDaysAgo;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    saveStats(updatedStats);
  };

  // Limpar interval ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Parar rastreamento quando a página não está visível
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTracking) {
        stopTracking();
      } else if (!document.hidden && !isTracking) {
        // Não reiniciar automaticamente
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTracking]);

  return {
    stats,
    isTracking,
    startTracking,
    stopTracking,
    formatTime: (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0) {
        return `${hours}h ${mins}min`;
      }
      return `${mins}min`;
    },
  };
}
