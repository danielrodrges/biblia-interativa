// Sistema de notificações push espirituais

export interface SpiritualNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  timestamp: number;
}

// Mensagens espirituais para notificações
export const spiritualMessages = [
  {
    title: "Momento de Reflexão 🙏",
    body: "Dedique alguns minutos para ler a Palavra hoje. Sua alma agradece!"
  },
  {
    title: "Versículo do Dia 📖",
    body: "Uma nova mensagem de esperança te espera. Venha descobrir!"
  },
  {
    title: "Paz Interior ✨",
    body: "Que tal fortalecer sua fé com uma leitura inspiradora?"
  },
  {
    title: "Crescimento Espiritual 🌱",
    body: "Continue sua jornada de aprendizado e fé. Vamos juntos!"
  },
  {
    title: "Palavra de Encorajamento 💪",
    body: "Deus tem uma mensagem especial para você hoje."
  },
  {
    title: "Momento com Deus ⏰",
    body: "Reserve um tempo para estar na presença do Senhor."
  },
  {
    title: "Sabedoria Divina 💡",
    body: "Busque conhecimento nas Escrituras. Elas iluminam o caminho!"
  },
  {
    title: "Fé que Transforma 🔥",
    body: "Sua leitura diária pode mudar sua vida. Não perca!"
  },
  {
    title: "Amor e Esperança ❤️",
    body: "Encontre conforto e esperança na Palavra de Deus."
  },
  {
    title: "Comunhão Espiritual 🕊️",
    body: "Conecte-se com Deus através da leitura bíblica hoje."
  }
];

// Solicitar permissão para notificações
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Enviar notificação local
export function sendLocalNotification(notification: SpiritualNotification): void {
  if (Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.body,
      icon: notification.icon || '/icon-192x192.png',
      tag: notification.tag || 'spiritual-notification',
      badge: '/icon-192x192.png',
      requireInteraction: false,
    });
  }
}

// Obter mensagem aleatória
export function getRandomSpiritualMessage(): SpiritualNotification {
  const message = spiritualMessages[Math.floor(Math.random() * spiritualMessages.length)];
  return {
    id: Date.now().toString(),
    title: message.title,
    body: message.body,
    timestamp: Date.now(),
  };
}

// Agendar notificações diárias
export function scheduleDailyNotifications(): void {
  // Verificar se já existe um agendamento
  const hasScheduled = localStorage.getItem('notifications-scheduled');
  
  if (hasScheduled) {
    return;
  }

  // Horários para notificações (em horas): 8h, 12h, 18h, 21h
  const notificationTimes = [8, 12, 18, 21];

  notificationTimes.forEach(hour => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, 0, 0, 0);

    // Se o horário já passou hoje, agendar para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      const notification = getRandomSpiritualMessage();
      sendLocalNotification(notification);
      
      // Reagendar para o próximo dia
      setInterval(() => {
        const notification = getRandomSpiritualMessage();
        sendLocalNotification(notification);
      }, 24 * 60 * 60 * 1000); // 24 horas
    }, timeUntilNotification);
  });

  localStorage.setItem('notifications-scheduled', 'true');
}

// Cancelar todas as notificações
export function cancelAllNotifications(): void {
  localStorage.removeItem('notifications-scheduled');
}

// Verificar se notificações estão habilitadas
export function areNotificationsEnabled(): boolean {
  return Notification.permission === 'granted';
}

// Registrar Service Worker para notificações
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado com sucesso:', registration);
      return registration;
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
      return null;
    }
  }
  return null;
}
