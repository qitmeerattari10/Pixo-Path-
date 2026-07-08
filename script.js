/* =========================================================
   PIXO PATH — MAIN JAVASCRIPT
   Clean, single version — no duplicates
   ========================================================= */

// ===== LOADER =====
window.addEventListener('load', function () {
  setTimeout(function () {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 1500);
});


// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

if (hamburger && navbar) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navbar.classList.toggle('show');
  });

  // close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navbar.classList.remove('show');
    }
  });

  // close menu when a nav link is clicked
  navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navbar.classList.remove('show');
    });
  });
}


// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');

if (cursor) {
  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.background = 'rgba(255,0,77,0.2)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'transparent';
    });
  });
}


// ===== RIGHT CLICK DISABLE =====
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});


// ===== COUNTER ANIMATION =====
const counterSection = document.querySelector('.counter-container');
const counters = document.querySelectorAll('.number');

if (counterSection && counters.length > 0) {
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;

    const sectionTop = counterSection.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (sectionTop < screenHeight * 0.9) {
      countersStarted = true;

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const duration = 1500;
        const steps = target > 0 ? target : 1;
        const interval = Math.max(10, Math.floor(duration / steps));

        const timer = setInterval(() => {
          count++;
          counter.innerText = count;
          if (count >= target) clearInterval(timer);
        }, interval);
      });

      window.removeEventListener('scroll', startCounters);
    }
  };

  window.addEventListener('scroll', startCounters);
  startCounters(); // check on load too
}


// ===== RESUME TABS =====
(function () {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length === 0) return;

  function animateTab(tabEl) {
    tabEl.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.classList.remove('show');
      setTimeout(() => item.classList.add('show'), i * 120);
    });
    tabEl.querySelectorAll('.skill-item').forEach((item, i) => {
      item.classList.remove('show');
      const fill = item.querySelector('.skill-fill');
      if (fill) fill.style.width = '0%';
      setTimeout(() => {
        item.classList.add('show');
        if (fill) fill.style.width = fill.dataset.width + '%';
      }, i * 100);
    });
  }

  function activateTab(tabId) {
    tabBtns.forEach(btn => btn.classList.remove('active'));
    const btnEl = document.querySelector(`[data-tab="${tabId}"]`);
    if (btnEl) btnEl.classList.add('active');

    tabContents.forEach(c => c.classList.remove('active'));
    const active = document.getElementById(tabId);
    if (active) {
      active.classList.add('active');
      setTimeout(() => animateTab(active), 50);
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  const resumeSection = document.querySelector('.resume');
  if (resumeSection) {
    const resumeObserver = new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) animateTab(activeTab);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    resumeObserver.observe(resumeSection);
  }
})();


// ===== CV DOWNLOAD =====
const downloadCV = document.getElementById('downloadCV');

if (downloadCV) {
  downloadCV.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');

    fetch(href)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CV.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        // fallback: agar fetch fail ho to normal download try karo
        window.open(href, '_blank');
      });
  });
}


// ===== CONTACT FORM — Web3Forms (email aapko milti hai) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.className = 'form-status';
    formStatus.style.color = '#bdbdc7';
    formStatus.textContent = 'Please wait...';

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (result.success) {
        formStatus.classList.add('success');
        formStatus.textContent = 'Message sent successfully!';
        submitBtn.textContent = 'Sent';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-arrow-right"></i>';
          formStatus.textContent = '';
        }, 4000);

      } else {
        formStatus.classList.add('error');
        formStatus.textContent = 'Failed! Please try again.';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-arrow-right"></i>';
      }

    } catch (error) {
      formStatus.classList.add('error');
      formStatus.textContent = 'Network error. Please try again.';
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-arrow-right"></i>';
    }
  });
}


// ===== FOOTER YEAR =====
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


// ===== SCROLL REVEAL (sequential — top se neeche jaise scroll karo waise aaye) =====
document.addEventListener('DOMContentLoaded', function () {
  const revealSelectors = [
    '.hero-text',
    '.hero-image',
    '.social-links',
    '.about-image',
    '.about-text',
    '.services > h1',
    '.services > p',
    '.services-box > div',
    '.projects > h1',
    '.projects > p',
    '.project-card',
    '.resume-header',
    '.resume-tabs',
    '.contact-heading',
    '.contact-info',
    '.contact-form'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(','));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach((el) => revealObserver.observe(el));
});