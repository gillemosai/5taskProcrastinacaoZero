import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useNativeCapabilities = ({
  darkMode,
  activeModalsCount,
  onCloseModals
}: {
  darkMode: boolean;
  activeModalsCount: number;
  onCloseModals: () => void;
}) => {
  // 1. Configurar Status Bar do Android
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({
        style: darkMode ? Style.Dark : Style.Light
      }).catch((e) => console.warn('StatusBar style error:', e));

      StatusBar.setBackgroundColor({
        color: darkMode ? '#020617' : '#f8fafc'
      }).catch((e) => console.warn('StatusBar color error:', e));
    }
  }, [darkMode]);

  // 2. Manipular o Botão Voltar Físico do Android
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backButtonListener = CapApp.addListener('backButton', () => {
      if (activeModalsCount > 0) {
        onCloseModals();
      } else {
        CapApp.minimizeApp();
      }
    });

    return () => {
      backButtonListener.then((listener) => listener.remove());
    };
  }, [activeModalsCount, onCloseModals]);

  // 3. Solicitar Permissões de Notificação no Android
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      LocalNotifications.requestPermissions().catch((e) =>
        console.warn('Permissão de notificação não concedida:', e)
      );
    }
  }, []);

  // Helper para feedback háptico (Vibração)
  const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      if (type === 'success') {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (type === 'warning') {
        await Haptics.notification({ type: NotificationType.Warning });
      } else if (type === 'error') {
        await Haptics.notification({ type: NotificationType.Error });
      } else {
        const styleMap = {
          light: ImpactStyle.Light,
          medium: ImpactStyle.Medium,
          heavy: ImpactStyle.Heavy
        };
        await Haptics.impact({ style: styleMap[type] || ImpactStyle.Light });
      }
    } catch (e) {
      console.warn('Erro ao disparar haptic:', e);
    }
  };

  // Helper para agendar notificação local anti-procrastinação
  const scheduleExpirationNotification = async (taskId: string, taskTitle: string, delayMinutes: number) => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const notifId = Math.abs(hashCode(taskId));
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '🧠 5task - Einstein Alerta!',
            body: `Sua tarefa "${taskTitle}" está entrando na zona de perigo de procrastinação!`,
            id: notifId,
            schedule: { at: new Date(Date.now() + delayMinutes * 60 * 1000) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (e) {
      console.warn('Erro ao agendar notificação:', e);
    }
  };

  return { triggerHaptic, scheduleExpirationNotification };
};

// Funçao simples de Hash para ID numérico
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}
