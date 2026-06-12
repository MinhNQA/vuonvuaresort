function initTheme() {
  const saved = localStorage.getItem('vv_theme');
  const isDark = saved !== 'light';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = isDark ? '🌙' : '☀️';

  const btn = document.getElementById('themeSwitch');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vv_theme', next);
    if (icon) icon.textContent = next === 'dark' ? '🌙' : '☀️';
    showNotification(next === 'dark' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng');
  });
}

function showNotification(msg) {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}
