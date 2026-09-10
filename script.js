const IMAGE_PATH = "images/birthday.jpg";
const BIRTHDAY_MONTH = 8;
const BIRTHDAY_DAY = 1;

const loader = document.getElementById("loader");
const progressBar = document.getElementById("progressBar");
const typingTitle = document.getElementById("typingTitle");
const balloonField = document.getElementById("balloonField");
const confettiStrip = document.getElementById("confettiStrip");
const giftBox = document.getElementById("giftBox");
const giftWrap = document.getElementById("giftWrap");
const celebrateAgain = document.getElementById("celebrateAgain");
const shareBtn = document.getElementById("shareBtn");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const wishModal = document.getElementById("wishModal");
const modalClose = document.getElementById("modalClose");
const countdownMessage = document.getElementById("countdownMessage");
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const galleryPhoto = document.getElementById("galleryPhoto");
const sideNav = document.getElementById("sideNav");
const modalConfetti = document.getElementById("modalConfetti");

let audioContext;
let melodyTimers = [];
let musicPlaying = false;
let fireworksActiveUntil = 0;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function bootLoader() {
  let progress = 0;
  const sparkles = document.getElementById("loaderSparkles");

  for (let i = 0; i < 28; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "loader-sparkle";
    sparkle.style.left = `${random(4, 96)}%`;
    sparkle.style.top = `${random(4, 96)}%`;
    sparkle.style.animationDelay = `${random(0, 2)}s`;
    sparkles.appendChild(sparkle);
  }

  const interval = setInterval(() => {
    progress = Math.min(progress + random(8, 18), 100);
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("loaded");
        typeText("Happy Birthday Abhay & Ayansh ❤️", typingTitle, 72);
      }, 420);
    }
  }, 180);
}

function typeText(text, element, speed) {
  let index = 0;
  element.textContent = "";

  const timer = setInterval(() => {
    element.textContent += text[index] || "";
    index += 1;

    if (index > text.length) {
      clearInterval(timer);
    }
  }, speed);
}

function createBalloons() {
  const colors = ["#ff8fbd", "#f875aa", "#d8c7ff", "#ffd56e", "#ffffff"];

  for (let i = 0; i < 13; i += 1) {
    const balloon = document.createElement("span");
    balloon.className = "balloon";
    balloon.style.setProperty("--balloon-color", colors[i % colors.length]);
    balloon.style.setProperty("--duration", `${random(7, 12)}s`);
    balloon.style.left = `${random(-4, 96)}%`;
    balloon.style.top = `${random(8, 88)}%`;
    balloon.style.animationDelay = `${random(-8, 0)}s`;
    balloonField.appendChild(balloon);
  }
}

function createConfetti() {
  const colors = ["#f875aa", "#d9a441", "#d8c7ff", "#ffffff", "#b92f68"];

  for (let i = 0; i < 70; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.setProperty("--confetti-color", colors[i % colors.length]);
    confetti.style.setProperty("--duration", `${random(7, 15)}s`);
    confetti.style.left = `${random(0, 100)}%`;
    confetti.style.animationDelay = `${random(-15, 0)}s`;
    confetti.style.transform = `rotate(${random(0, 180)}deg)`;
    confettiStrip.appendChild(confetti);
  }
}

function setupReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function getBirthdayTarget() {
  const now = new Date();
  let target = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);

  if (now > new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 23, 59, 59)) {
    target = new Date(now.getFullYear() + 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
  }

  return target;
}

function updateCountdown() {
  const now = new Date();
  const birthdayStart = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
  const birthdayEnd = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 23, 59, 59);
  const isToday = now >= birthdayStart && now <= birthdayEnd;
  const units = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  if (isToday) {
    countdownMessage.textContent = "🎉 Today is Abhay and Ayansh's birthday!";
  } else {
    const distance = Math.max(getBirthdayTarget() - now, 0);
    units.days = Math.floor(distance / 86400000);
    units.hours = Math.floor((distance % 86400000) / 3600000);
    units.minutes = Math.floor((distance % 3600000) / 60000);
    units.seconds = Math.floor((distance % 60000) / 1000);
    countdownMessage.textContent = "Until their special day";
  }

  Object.entries(units).forEach(([unit, value]) => {
    const flipInner = document.querySelector(`.flip-box-inner [data-unit="${unit}"]`)?.closest(".flip-box-inner");
    if (!flipInner) return;
    const topSpan = flipInner.querySelector(".flip-top [data-unit=" + unit + "]");
    const bottomSpan = flipInner.querySelector(".flip-bottom [data-unit=" + unit + "]");
    if (!topSpan || !bottomSpan) return;
    const nextValue = String(value).padStart(2, "0");

    if (topSpan.textContent !== nextValue) {
      flipInner.classList.add("tick");
      setTimeout(() => {
        topSpan.textContent = nextValue;
        bottomSpan.textContent = nextValue;
        flipInner.classList.remove("tick");
      }, 200);
    }
  });
}

function createHeart(x = random(8, 92), y = 100, burst = false) {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = "❤️";
  heart.style.left = `${x}${typeof x === "number" && x <= 100 ? "%" : "px"}`;
  heart.style.top = `${y}${typeof y === "number" && y <= 100 ? "%" : "px"}`;
  heart.style.fontSize = `${random(burst ? 18 : 12, burst ? 34 : 24)}px`;
  heart.style.opacity = random(0.38, 0.86);
  heart.style.setProperty("--heart-speed", `${random(burst ? 2.2 : 5.5, burst ? 4.5 : 9)}s`);
  heart.style.setProperty("--heart-drift", `${random(-70, 70)}px`);
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 9500);
}

function setupHearts() {
  setInterval(() => createHeart(), 900);
}

function setupRipples() {
  document.querySelectorAll(".ripple").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "tap-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 720);
    });
  });
}

function setupCursorSparkles() {
  if (!matchMedia("(pointer: fine)").matches) return;

  let lastSparkle = 0;
  window.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - lastSparkle < 45) return;
    lastSparkle = now;

    const sparkle = document.createElement("span");
    sparkle.className = "cursor-sparkle";
    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 820);
  });
}

function setupParticlesCanvas() {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const particles = [];
  let width;
  let height;

  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  function seed() {
    particles.length = 0;
    const amount = Math.min(90, Math.floor(window.innerWidth / 5));
    for (let i = 0; i < amount; i += 1) {
      particles.push({
        x: random(0, width),
        y: random(0, height),
        radius: random(1, 3.8) * devicePixelRatio,
        speed: random(0.06, 0.24) * devicePixelRatio,
        alpha: random(0.18, 0.62),
        hue: random(326, 45)
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += Math.sin((particle.y + particle.radius) * 0.008) * 0.16;

      if (particle.y < -20) {
        particle.y = height + 20;
        particle.x = random(0, width);
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 85%, 72%, ${particle.alpha})`;
      ctx.shadowColor = "rgba(255,255,255,0.9)";
      ctx.shadowBlur = 14 * devicePixelRatio;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  seed();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });
  draw();
}

function setupFireworksCanvas() {
  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");
  const fireworks = [];
  let width;
  let height;

  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  function burst(x = random(width * 0.18, width * 0.82), y = random(height * 0.14, height * 0.58)) {
    const colors = ["#ff72ad", "#ffd56e", "#d8c7ff", "#ffffff", "#ff9f7a"];
    const count = 62;

    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = random(1.8, 6.5) * devicePixelRatio;
      fireworks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: random(0.012, 0.024),
        color: colors[Math.floor(random(0, colors.length))]
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    if (performance.now() < fireworksActiveUntil && Math.random() < 0.05) {
      burst();
    }

    for (let i = fireworks.length - 1; i >= 0; i -= 1) {
      const spark = fireworks[i];
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.035 * devicePixelRatio;
      spark.life -= spark.decay;

      ctx.globalAlpha = Math.max(spark.life, 0);
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, 2.2 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = spark.color;
      ctx.shadowColor = spark.color;
      ctx.shadowBlur = 18 * devicePixelRatio;
      ctx.fill();

      if (spark.life <= 0) fireworks.splice(i, 1);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();

  return {
    celebrate() {
      fireworksActiveUntil = performance.now() + 5200;
      for (let i = 0; i < 5; i += 1) {
        setTimeout(() => burst(), i * 260);
      }
    }
  };
}

function setupMusic() {
  const melody = [
    { note: 392.00, length: 0.18 }, { note: 392.00, length: 0.18 }, { note: 440.00, length: 0.36 }, { note: 392.00, length: 0.36 },
    { note: 523.25, length: 0.36 }, { note: 493.88, length: 0.72 },
    { note: 392.00, length: 0.18 }, { note: 392.00, length: 0.18 }, { note: 440.00, length: 0.36 }, { note: 392.00, length: 0.36 },
    { note: 587.33, length: 0.36 }, { note: 523.25, length: 0.72 },
    { note: 392.00, length: 0.18 }, { note: 392.00, length: 0.18 }, { note: 783.99, length: 0.36 }, { note: 659.25, length: 0.36 },
    { note: 523.25, length: 0.36 }, { note: 493.88, length: 0.36 }, { note: 440.00, length: 0.72 },
    { note: 698.46, length: 0.18 }, { note: 698.46, length: 0.18 }, { note: 659.25, length: 0.36 }, { note: 523.25, length: 0.36 },
    { note: 587.33, length: 0.36 }, { note: 523.25, length: 0.9 }
  ];

  function clearMelodyTimers() {
    melodyTimers.forEach((timer) => clearTimeout(timer));
    melodyTimers = [];
  }

  function playNote(frequency, duration) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.04);
  }

  function playMelodyLoop() {
    clearMelodyTimers();
    let delay = 0;

    melody.forEach(({ note, length }) => {
      const timer = setTimeout(() => playNote(note, length), delay * 1000);
      melodyTimers.push(timer);
      delay += length + 0.08;
    });

    const loopTimer = setTimeout(() => {
      if (musicPlaying) playMelodyLoop();
    }, (delay + 0.8) * 1000);
    melodyTimers.push(loopTimer);
  }

  function startMusic() {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    musicPlaying = true;
    musicToggle.classList.add("playing");
    musicIcon.textContent = "♫";
    musicToggle.setAttribute("aria-label", "Pause birthday music");
    playMelodyLoop();
  }

  function stopMusic() {
    musicPlaying = false;
    musicToggle.classList.remove("playing");
    musicIcon.textContent = "♪";
    musicToggle.setAttribute("aria-label", "Play birthday music");
    clearMelodyTimers();
  }

  musicToggle.addEventListener("click", () => {
    if (musicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  return { startMusic, stopMusic };
}
function confettiExplosion() {
  for (let i = 0; i < 90; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.position = "fixed";
    confetti.style.left = "50%";
    confetti.style.top = "54%";
    confetti.style.zIndex = "10";
    confetti.style.setProperty("--confetti-color", ["#f875aa", "#d9a441", "#d8c7ff", "#fff"][i % 4]);
    confetti.style.setProperty("--duration", `${random(1.8, 3.2)}s`);
    confetti.animate([
      { transform: "translate(-50%, -50%) scale(0.6) rotate(0deg)", opacity: 1 },
      { transform: `translate(${random(-190, 190)}px, ${random(-260, 180)}px) scale(1) rotate(${random(180, 740)}deg)`, opacity: 0 }
    ], { duration: random(1500, 2600), easing: "cubic-bezier(.16,.84,.38,1)" });
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2700);
  }
}

function setupSurprise(fireworks, music) {
  function triggerSurprise() {
    fireworks.celebrate();
    confettiExplosion();
    music.startMusic();
    document.body.classList.add("shake");
    wishModal.hidden = false;
    spawnModalConfetti();

    if (giftBox) giftBox.classList.add("opened");

    for (let i = 0; i < 28; i += 1) {
      setTimeout(() => createHeart(random(18, 82), random(74, 92), true), i * 45);
    }

    setTimeout(() => document.body.classList.remove("shake"), 460);
  }

  if (giftBox) {
    giftBox.addEventListener("click", triggerSurprise);
    giftBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerSurprise();
      }
    });
  }

  modalClose.addEventListener("click", () => {
    wishModal.hidden = true;
  });

  wishModal.addEventListener("click", (event) => {
    if (event.target === wishModal) wishModal.hidden = true;
  });
}

function setupCelebrateAgain(fireworks) {
  celebrateAgain.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fireworks.celebrate();
    confettiExplosion();
  });
}

function spawnModalConfetti() {
  if (!modalConfetti) return;
  modalConfetti.innerHTML = "";
  const colors = ["#f875aa", "#d9a441", "#d8c7ff", "#ffffff", "#ff8fbd"];

  for (let i = 0; i < 30; i += 1) {
    const particle = document.createElement("span");
    particle.className = "modal-particle";
    particle.style.left = `${random(10, 90)}%`;
    particle.style.top = "0";
    particle.style.background = colors[i % colors.length];
    particle.style.animationDelay = `${random(0, 1.2)}s`;
    particle.style.animationDuration = `${random(1.8, 3.2)}s`;
    particle.style.width = `${random(4, 8)}px`;
    particle.style.height = particle.style.width;
    modalConfetti.appendChild(particle);
  }
}

function setupSideNav() {
  if (!sideNav) return;

  const sections = document.querySelectorAll(".section[id]");
  const dots = sideNav.querySelectorAll(".nav-dot");

  /* Show nav after scrolling past hero */
  const heroObserver = new IntersectionObserver(([entry]) => {
    sideNav.classList.toggle("visible", !entry.isIntersecting);
  }, { threshold: 0.3 });

  const hero = document.getElementById("top");
  if (hero) heroObserver.observe(hero);

  /* Track active section */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        dots.forEach((dot) => {
          dot.classList.toggle("active", dot.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));

  /* Smooth scroll on click */
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(dot.dataset.section);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function setupLightbox() {
  if (!galleryPhoto || !lightbox) return;

  galleryPhoto.style.cursor = "pointer";
  galleryPhoto.addEventListener("click", () => {
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-backdrop").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

function setupShare() {
  if (!shareBtn) return;

  shareBtn.addEventListener("click", async () => {
    const shareData = {
      title: "Happy Birthday Abhay & Ayansh",
      text: "🎉 Happy Birthday Abhay & Ayansh! Two little stars, one special day. ❤️",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (_) {
        /* user cancelled */
      }
    } else {
      /* Fallback: copy link */
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        shareBtn.textContent = "Copied!";
        setTimeout(() => {
          shareBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share Wish`;
        }, 2000);
      } catch (_) {
        /* clipboard not available */
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bootLoader();
  createBalloons();
  createConfetti();
  setupReveals();
  setupHearts();
  setupRipples();
  setupCursorSparkles();
  setupParticlesCanvas();
  const fireworks = setupFireworksCanvas();
  const music = setupMusic();
  setupSurprise(fireworks, music);
  setupCelebrateAgain(fireworks);
  setupSideNav();
  setupLightbox();
  setupShare();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  document.querySelectorAll("img").forEach((image) => {
    image.src = IMAGE_PATH;
  });
});


