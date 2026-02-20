// Service Worker + basic offline detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered → scope:', reg.scope))
      .catch(err => console.warn('Service Worker failed:', err));
  });
}

window.addEventListener('online',  () => {
  document.body.classList.remove('offline');
  console.log('Back online');
});
window.addEventListener('offline', () => {
  document.body.classList.add('offline');
  console.log('Offline now');
});
