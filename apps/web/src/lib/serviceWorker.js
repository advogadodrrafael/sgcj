export async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    console.log('✅ Service Worker registrado');
    return registration;
  } catch (error) {
    console.error('❌ Erro ao registrar Service Worker:', error);
  }
}

export async function unregisterServiceWorker() {
  const registration = await navigator.serviceWorker.ready;
  await registration.unregister();
  console.log('Service Worker desregistrado');
}
