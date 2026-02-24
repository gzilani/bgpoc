import { isWithinGeofence } from '@restaurant/shared'
import { useStore } from '../store/useStore'

// Restaurant location — update these in production from Supabase config
const RESTAURANT_LAT = 40.7128
const RESTAURANT_LNG = -74.006
const GEOFENCE_RADIUS = 100 // meters

let watchId: number | null = null

/**
 * Start watching the device's GPS position using the browser Geolocation API.
 * Updates the store's isInGeofence flag and auto-signs in/out as appropriate.
 */
export async function startLocationTracking(): Promise<boolean> {
    if (!('geolocation' in navigator)) {
        console.warn('[GPS] Geolocation not supported in this browser.')
        return false
    }

    return new Promise((resolve) => {
        // Request permission first by doing a one-shot getCurrentPosition
        navigator.geolocation.getCurrentPosition(
            () => {
                // Permission granted — start continuous watching
                watchId = navigator.geolocation.watchPosition(
                    ({ coords: { latitude, longitude } }) => {
                        const store = useStore.getState()
                        const inZone = isWithinGeofence(
                            latitude,
                            longitude,
                            RESTAURANT_LAT,
                            RESTAURANT_LNG,
                            GEOFENCE_RADIUS
                        )

                        if (inZone !== store.isInGeofence) {
                            store.setIsInGeofence(inZone)

                            if (inZone && !store.attendance.isSignedIn) {
                                const hour = new Date().getHours()
                                if (hour >= 6 && hour <= 22) {
                                    store.signIn()
                                    console.log('[GPS] Auto sign-in triggered')
                                }
                            }

                            if (!inZone && store.attendance.isSignedIn) {
                                store.signOut()
                                console.log('[GPS] Auto sign-out triggered')
                            }
                        }
                    },
                    (err) => console.error('[GPS] Watch error:', err.message),
                    { enableHighAccuracy: true, maximumAge: 10000 }
                )
                resolve(true)
            },
            (err) => {
                console.warn('[GPS] Permission denied or error:', err.message)
                resolve(false)
            },
            { enableHighAccuracy: true, timeout: 8000 }
        )
    })
}

export function stopLocationTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
        watchId = null
    }
}

/**
 * One-shot current position — used for the manual Sign In button check.
 */
export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
        if (!('geolocation' in navigator)) {
            resolve(null)
            return
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 8000 }
        )
    })
}
