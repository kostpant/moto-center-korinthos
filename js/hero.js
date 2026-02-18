// ─────────────────────────────────────────────────────────
//  HERO FRAME SEQUENCE — SCROLL ANIMATION
//  Plays JPG frames from @hero_animation like a video
//  driven by scroll position (Apple-style)
// ─────────────────────────────────────────────────────────

(function() {

  // ── CONFIG ── adjust these to match your folder ────────
  const TOTAL_FRAMES = 240;        // 240 frames total
  const FRAMES_PATH  = './hero_animation/'; // Path relative to index.html
  
  // Filename builder: ezgif-frame-001.jpg pattern
  function frameName(index) {
    // Zero-pad to 3 digits: 1 → "001"
    const pad = String(index).padStart(3, '0');
    return `${FRAMES_PATH}ezgif-frame-${pad}.jpg`; 
  }

  // ── ELEMENTS ────────────────────────────────────────────
  const canvas   = document.getElementById('heroCanvas');
  const ctx      = canvas.getContext('2d');
  const pin      = document.getElementById('heroPin');
  const content  = document.getElementById('heroContent');
  const scroll   = document.getElementById('heroScroll');
  const progress = document.getElementById('heroProgress');

  // ── CANVAS RESIZE ────────────────────────────────────────
  // Canvas must always match viewport — critical for cover fit
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw current frame after resize
    if (images[currentFrame] && images[currentFrame].complete) {
      drawFrame(images[currentFrame]);
    }
  }

  // ── DRAW FRAME (cover fit) ───────────────────────────────
  // This replicates object-fit: cover for the canvas
  function drawFrame(img) {
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }

  // ── PRELOAD ALL FRAMES ───────────────────────────────────
  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;
  let animationStarted = false;

  function preloadFrames() {
    // Load first frame immediately for instant display
    const firstImg = new Image();
    firstImg.onload = function() {
      images[0] = firstImg;
      resizeCanvas();
      drawFrame(firstImg);
      // Show content after first frame loads
      revealContent();
    };
    firstImg.src = frameName(1); // frames start at 1

    // Load remaining frames (start from 2)
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const index = i - 1; // 0-based array index
      img.onload = function() {
        images[index] = this;
        loadedCount++;
      };
      img.onerror = function() {
        // Skip missing frames silently
        loadedCount++;
      };
      img.src = frameName(i);
    }
  }

  // ── REVEAL CONTENT (GSAP-style animation for massive text) ─────────────
  function revealContent() {
    // Set initial states
    const eyebrow = document.querySelector('.hero__eyebrow');
    const line1 = document.querySelector('.hero__line--1');
    const line2 = document.querySelector('.hero__line--2');
    const line3 = document.querySelector('.hero__line--3');
    const sub = document.querySelector('.hero__sub');
    const ctaGroup = document.querySelector('.hero__cta-group');
    const brands = document.querySelector('.hero__brands');
    
    // Initial hidden states
    if (eyebrow) eyebrow.style.cssText = 'opacity:0; transform:translateY(20px); transition: all 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
    if (line1) line1.style.cssText = 'opacity:0; transform:translateY(80px); transition: all 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
    if (line2) line2.style.cssText = 'opacity:0; transform:translateY(80px); transition: all 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
    if (line3) line3.style.cssText = 'opacity:0; transform:translateY(40px); transition: all 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
    if (sub) sub.style.cssText = 'opacity:0; transform:translateY(20px); transition: all 0.7s cubic-bezier(0.33, 1, 0.68, 1)';
    if (ctaGroup) ctaGroup.style.cssText = 'opacity:0; transform:translateY(20px); transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
    if (brands) brands.style.cssText = 'opacity:0; transition: opacity 0.6s ease';
    
    // Trigger animations with delays
    setTimeout(() => {
      if (eyebrow) eyebrow.style.cssText = 'opacity:1; transform:translateY(0); transition: all 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
    }, 300);
    
    setTimeout(() => {
      if (line1) line1.style.cssText = 'opacity:1; transform:translateY(0); transition: all 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
    }, 600);
    
    setTimeout(() => {
      if (line2) line2.style.cssText = 'opacity:1; transform:translateY(0); transition: all 1.1s cubic-bezier(0.33, 1, 0.68, 1)';
    }, 850);
    
    setTimeout(() => {
      if (line3) line3.style.cssText = 'opacity:1; transform:translateY(0); transition: all 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
    }, 1000);
    
    setTimeout(() => {
      if (sub) sub.style.cssText = 'opacity:1; transform:translateY(0); transition: all 0.7s cubic-bezier(0.33, 1, 0.68, 1)';
    }, 1150);
    
    setTimeout(() => {
      if (ctaGroup) ctaGroup.style.cssText = 'opacity:1; transform:translateY(0); transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 1300);
    
    setTimeout(() => {
      if (brands) brands.style.cssText = 'opacity:1; transition: opacity 0.6s ease';
    }, 1450);
    
    setTimeout(() => {
      scroll.classList.add('visible');
      animationStarted = true;
    }, 1650);
  }

  // ── SCROLL HANDLER ───────────────────────────────────────
  function onScroll() {
    const pinRect  = pin.getBoundingClientRect();
    const pinTop   = pin.offsetTop;
    const pinH     = pin.offsetHeight;
    const stickyH  = window.innerHeight;
    const scrollY  = window.scrollY;

    // How far through the pin section are we? (0 → 1)
    const scrollable = pinH - stickyH;
    const scrolled   = Math.max(0, scrollY - pinTop);
    const t          = Math.min(1, Math.max(0, scrolled / scrollable));

    // Map t (0→1) to frame index (0 → TOTAL_FRAMES-1)
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.floor(t * TOTAL_FRAMES)
    );

    // Update progress bar
    if (progress) progress.style.width = (t * 100) + '%';

    // Hide scroll indicator once user starts scrolling
    if (animationStarted && scrolled > 40) {
      scroll.classList.remove('visible');
    } else if (animationStarted && scrolled <= 10) {
      scroll.classList.add('visible');
    }

    // Only redraw if frame changed
    if (frameIndex !== currentFrame) {
      currentFrame = frameIndex;
      if (images[frameIndex] && images[frameIndex].complete) {
        drawFrame(images[frameIndex]);
      } else {
        // Frame not loaded yet — find nearest loaded frame
        for (let offset = 1; offset < 10; offset++) {
          const prev = frameIndex - offset;
          if (prev >= 0 && images[prev] && images[prev].complete) {
            drawFrame(images[prev]);
            break;
          }
        }
      }
    }

    // ── TEXT PARALLAX on scroll ──────────────────────────
    // Content fades + floats up as user scrolls through hero
    if (t > 0.6) {
      const fadeT  = (t - 0.6) / 0.35; // 0→1 in the last 35%
      const clampT = Math.min(1, fadeT);
      content.style.opacity   = 1 - clampT;
      content.style.transform = `translateY(${-clampT * 60}px)`;
    } else {
      content.style.opacity   = '1';
      content.style.transform = 'translateY(0)';
    }
  }

  // ── INIT ─────────────────────────────────────────────────
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', onScroll,     { passive: true });

  // Set initial canvas size
  resizeCanvas();

  // Start loading frames
  preloadFrames();

  // Run once in case page loaded mid-scroll
  onScroll();

})();
