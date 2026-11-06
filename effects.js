// Анимации: появление блоков при прокрутке и свечение за курсором
document.documentElement.classList.add("js");

const items = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((el, i) => {
    // Небольшая задержка, чтобы соседние блоки появлялись по очереди
    el.style.transitionDelay = (i % 4) * 0.1 + "s";
    observer.observe(el);
  });
} else {
  items.forEach((el) => el.classList.add("visible"));
}

// Свечение внутри стеклянных карточек следует за курсором
document.querySelectorAll(".card.glass").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });
});

// Параллакс для hero-секции
let heroSection = document.querySelector(".hero");
if (heroSection) {
  window.addEventListener("scroll", () => {
    let scrolled = window.pageYOffset;
    let rate = scrolled * 0.5;
    heroSection.style.transform = `translate3d(0, ${rate}px, 0)`;
  });
}

// Анимация цифр в статистике при появлении
const stats = document.querySelectorAll(".stat b");
const animateNumber = (el, target) => {
  let current = 0;
  const increment = target === "∞" ? null : Math.ceil(target / 30);
  const timer = setInterval(() => {
    if (target === "∞") {
      el.textContent = "∞";
      clearInterval(timer);
    } else if (current >= target) {
      el.textContent = target + (target === 100 ? "%" : target === 24 ? "ч" : "");
      clearInterval(timer);
    } else {
      current += increment;
      el.textContent = Math.min(current, target) + (target === 100 ? "%" : "");
    }
  }, 40);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const text = entry.target.textContent.trim();
      if (text.includes("–")) {
        // Диапазон типа "3–14"
        setTimeout(() => {
          entry.target.textContent = text;
        }, 200);
      } else if (text === "∞") {
        animateNumber(entry.target, "∞");
      } else if (text.includes("%")) {
        animateNumber(entry.target, 100);
      } else if (text.includes("ч")) {
        animateNumber(entry.target, 24);
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

stats.forEach((stat) => statsObserver.observe(stat));

