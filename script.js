// ========================================
// SVstem — Interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile nav toggle ---
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Close nav on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
      });
    });
  }

  // --- Fade-in on scroll ---
  const fadeEls = document.querySelectorAll('.about-card, .team-card, .chapter-card, .calendar-wrapper');
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));

  // --- Calendar ---
  const calDays = document.getElementById('cal-days');
  const calLabel = document.getElementById('cal-month-label');
  const calPrev = document.getElementById('cal-prev');
  const calNext = document.getElementById('cal-next');

  if (calDays && calLabel) {
    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function renderCalendar(year, month) {
      calDays.innerHTML = '';
      calLabel.textContent = `${monthNames[month]} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrev = new Date(year, month, 0).getDate();

      const today = new Date();
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

      // Previous month trailing days
      for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrev - i;
        calDays.appendChild(day);
      }

      // Current month days
      for (let d = 1; d <= daysInMonth; d++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        if (isCurrentMonth && d === today.getDate()) {
          day.classList.add('today');
        }
        day.textContent = d;
        calDays.appendChild(day);
      }

      // Next month leading days
      const totalCells = firstDay + daysInMonth;
      const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
      for (let i = 1; i <= remaining; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calDays.appendChild(day);
      }
    }

    renderCalendar(currentYear, currentMonth);

    if (calPrev && calNext) {
      calPrev.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
      });

      calNext.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
      });
    }
  }

  // --- Chapter card: expand/collapse details (photo stays visible) ---
  document.querySelectorAll('.chapter-name-toggle').forEach(btn => {
    const panelId = btn.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      btn.setAttribute('aria-expanded', String(next));
      panel.hidden = !next;
    });
  });

  // --- Event photo slideshows ---
  document.querySelectorAll('[data-slideshow]').forEach(root => {
    const track = root.querySelector('.slide-track');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const prev = root.querySelector('.slide-prev');
    const next = root.querySelector('.slide-next');
    const dotsWrap = root.querySelector('.slide-dots');
    if (!track || slides.length === 0) return;

    // Single image: no controls needed
    if (slides.length <= 1) {
      if (prev) prev.style.display = 'none';
      if (next) next.style.display = 'none';
      return;
    }

    let index = 0;
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
      dot.addEventListener('click', () => go(i));
      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });

    function go(n) {
      index = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    if (prev) prev.addEventListener('click', () => go(index - 1));
    if (next) next.addEventListener('click', () => go(index + 1));
  });

  // --- Mobile Dropdown Toggle ---
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      // On mobile, toggle the dropdown instead of navigating
      if (window.innerWidth <= 768) {
        e.preventDefault();
        trigger.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });
});
