if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/DiscoBuddy/sw.js', { scope: '/DiscoBuddy/' });
  });
}
