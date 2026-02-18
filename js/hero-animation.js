/**
 * hero-animation.js - GSAP ScrollTrigger animation for the Hero section
 * FIX 4 — COMPLETE REWRITE
 */

// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the homepage and GSAP is available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }
  
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  // Set initial states BEFORE the timeline runs
  gsap.set(".hero__eyebrow", { opacity: 0, y: 25 });
  gsap.set(".hero__line--1", { opacity: 0, y: 70 });
  gsap.set(".hero__line--2", { opacity: 0, y: 70 });
  gsap.set(".hero__line--3", { opacity: 0, y: 40 });
  gsap.set(".hero__sub",     { opacity: 0, y: 25 });
  gsap.set(".hero__cta-group", { opacity: 0, y: 25 });
  gsap.set(".hero__brands",  { opacity: 0 });
  gsap.set(".hero__scroll",  { opacity: 0 });
  gsap.set(".hero__bg-img",  { opacity: 0, scale: 1.12 });
  
  // ── ENTRANCE TIMELINE (fires once on page load) ──────────
  const heroTL = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.2
  });
  
  heroTL
    // 1. Background photo fades + unzooms in (Ken Burns intro)
    .to(".hero__bg-img", {
      opacity: 1,
      scale: 1,
      duration: 2.2,
      ease: "power2.out"
    })
    // 2. Eyebrow label slides up
    .to(".hero__eyebrow", {
      opacity: 1,
      y: 0,
      duration: 0.7,
    }, "-=1.6")
    // 3. First title line slams in from below
    .to(".hero__line--1", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power4.out",
    }, "-=0.4")
    // 4. Second title line (outline) slams in, slight delay
    .to(".hero__line--2", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power4.out",
    }, "-=0.65")
    // 5. Third line (MOTO CENTER) fades in softer
    .to(".hero__line--3", {
      opacity: 1,
      y: 0,
      duration: 0.7,
    }, "-=0.5")
    // 6. Subtitle paragraph
    .to(".hero__sub", {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, "-=0.3")
    // 7. CTA buttons pop in with spring
    .to(".hero__cta-group", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.4)",
    }, "-=0.3")
    // 8. Brand strip fades last
    .to(".hero__brands", {
      opacity: 1,
      duration: 0.5,
    }, "-=0.2")
    // 9. Scroll indicator appears last
    .to(".hero__scroll", {
      opacity: 1,
      duration: 0.6,
    }, "-=0.2");
  
  // ── SCROLL PARALLAX (fires as user scrolls past hero) ────
  
  // Background moves slower than scroll — creates depth
  gsap.to(".hero__bg-img", {
    yPercent: 25,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    }
  });
  
  // Content drifts up and fades as hero scrolls out of view
  gsap.to(".hero__content", {
    y: -80,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "15% top",
      end: "75% top",
      scrub: true,
    }
  });
  
  // Scroll indicator disappears immediately on first scroll
  gsap.to(".hero__scroll", {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "3% top",
      end: "18% top",
      scrub: true,
    }
  });
});
