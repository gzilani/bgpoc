/**
 * Web Notifications API wrapper — replaces expo-notifications.
 */

export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('[Notifications] Not supported in this browser.')
        return false
    }
    const result = await Notification.requestPermission()
    return result === 'granted'
}

export function sendLocalNotification(title: string, body: string, icon = '/icon-192.png') {
    if (Notification.permission !== 'granted') return
    new Notification(title, { body, icon })
}
