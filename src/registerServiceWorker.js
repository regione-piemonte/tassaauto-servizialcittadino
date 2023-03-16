import { SERVICE_WORKER_NAME } from '@/common/config'
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  register('/' + SERVICE_WORKER_NAME, {
    registrationOptions: { scope: './' },
    ready (registration) {
      console.log('Service worker is active.', { registration })
    },
    registered (registration) {
      console.log('Service worker has been registered.', { registration })
    },
    cached (registration) {
      console.log('Content has been cached for offline use.', { registration })
    },
    updatefound (registration) {
      console.log('New content is downloading.', { registration })
    },
    updated (registration) {
      console.log('New content is available; please refresh.', { registration })
      // An update is triggered if any of the following happens: ... A navigation to an in-scope page (index.html)

      // registration.waiting.postMessage({ action: 'skipWaiting' })
      // precedente istruzione sostituita da (workbox-webpack-plugin) GenerateSW({skipWaiting: true})

      navigator.serviceWorker.addEventListener('controllerchange', event => {
        // This fires when the service worker controlling this page
        // changes, eg a new worker has skipped waiting and become the new active worker
        console.log('[Service Worker event][controllerchange]', { event })
        location.reload()
      })
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', { error })
    }
  })
}
