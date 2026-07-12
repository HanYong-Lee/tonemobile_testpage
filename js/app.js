(() => {
  "use strict";

  const config = window.EVENT_CONFIG;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function normalizePhone(phone) {
    return String(phone || "").replace(/[^\d+]/g, "");
  }

  function bindConfig() {
    const phoneNumber = normalizePhone(config.phone);
    const encodedMessage = encodeURIComponent(config.smsMessage || "");

    $$(".js-reservation-link").forEach(el => el.href = config.reservationUrl);
    $$(".js-phone-link").forEach(el => el.href = `tel:${phoneNumber}`);
    $$(".js-sms-link").forEach(el => el.href = `sms:${phoneNumber}?body=${encodedMessage}`);
    $$(".js-phone-text").forEach(el => {
      el.href = `tel:${phoneNumber}`;
      el.textContent = config.phone;
    });
    $$(".js-map-link").forEach(el => el.href = config.mapUrl);

    setText("#storeAddress", config.store.address);
    setText("#storeHours", config.store.hours);
    setText("#managerName", config.manager.name);
    setText("#managerMessage", config.manager.message);
    setText("#year", new Date().getFullYear());

    renderTimeline();
  }

  function renderTimeline() {
    const container = $("#timeline");
    if (!container) return;

    container.innerHTML = config.schedule.map(item => `
      <article class="timeline-item reveal">
        <div class="timeline-dot" aria-hidden="true">${item.icon}</div>
        <div class="timeline-card">
          <span class="timeline-date">${item.date}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </article>
    `).join("");
  }

  function initCountdown() {
    const target = new Date(config.eventStart);
    const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "short",
      hour: "2-digit", minute: "2-digit"
    });

    setText("#eventDateText", `${dateFormatter.format(target)} 행사 시작`);

    function update() {
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      const dayMs = 86400000;

      if (diff <= 0) {
        setText("#heroDday", "NOW OPEN");
        setText("#topDday", "행사 진행 중");
        setText("#desktopBarMessage", "지금 바로 예약하고 방문하세요!");
        ["#days", "#hours", "#minutes", "#seconds"].forEach(selector => setText(selector, "00"));
        return;
      }

      const days = Math.floor(diff / dayMs);
      diff %= dayMs;
      const hours = Math.floor(diff / 3600000);
      diff %= 3600000;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const ddayText = days === 0 ? "D-DAY" : `D-${days}`;
      setText("#heroDday", ddayText);
      setText("#topDday", `${ddayText} · 사전예약 중`);
      setText("#days", String(days).padStart(2, "0"));
      setText("#hours", String(hours).padStart(2, "0"));
      setText("#minutes", String(minutes).padStart(2, "0"));
      setText("#seconds", String(seconds).padStart(2, "0"));
    }

    update();
    window.setInterval(update, 1000);
  }

  function initTheme() {
    const root = document.documentElement;
    const toggle = $("#themeToggle");
    const icon = $("#themeIcon");
    const saved = localStorage.getItem("t1-theme");
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = saved || (preferredDark ? "dark" : "light");

    function apply(theme) {
      root.dataset.theme = theme;
      icon.textContent = theme === "dark" ? "☀" : "☾";
      toggle.setAttribute("aria-label", theme === "dark" ? "라이트모드 전환" : "다크모드 전환");
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content",
        theme === "dark" ? "#0f1b2d" : "#0877f9"
      );
    }

    apply(initialTheme);

    toggle?.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("t1-theme", next);
      apply(next);
      showToast(next === "dark" ? "다크모드로 변경했습니다." : "라이트모드로 변경했습니다.");
    });
  }

  function initReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    $$(".reveal").forEach(el => observer.observe(el));
  }

  function initFixedBar() {
    const bar = $("#desktopReservationBar");
    const reservationSection = $("#reservation");
    if (!bar || !reservationSection) return;

    function update() {
      const reservationTop = reservationSection.getBoundingClientRect().top;
      const show = window.scrollY > 520 && reservationTop > window.innerHeight * 0.8;
      bar.classList.toggle("visible", show);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function initLinkValidation() {
    const placeholderUrls = ["https://m.booking.naver.com/", "https://map.naver.com/"];

    $$("a[target='_blank']").forEach(link => {
      link.addEventListener("click", event => {
        if (placeholderUrls.includes(link.href)) {
          event.preventDefault();
          showToast("js/config.js에서 실제 링크를 입력해주세요.");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindConfig();
    initCountdown();
    initTheme();
    initReveal();
    initFixedBar();
    initLinkValidation();
  });
})();
