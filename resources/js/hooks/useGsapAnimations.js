import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useHeroAnimation() {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-badge", { opacity: 0, y: 30, duration: 0.6 })
      .from(".hero-title", { opacity: 0, y: 50, duration: 0.8 }, "-=0.3")
      .from(".hero-sub", { opacity: 0, y: 30, duration: 0.7 }, "-=0.4")
      .from(".hero-cta", { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, "-=0.3")
      .from(".hero-trust", { opacity: 0, duration: 0.5 }, "-=0.2");
    return () => tl.kill();
  }, []);
}

export function useScrollReveal() {
  useEffect(() => {
    const elements = gsap.utils.toArray(".reveal");
    elements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        opacity: 0, y: 50, duration: 0.8, ease: "power3.out",
      });
    });
    const staggerGroups = gsap.utils.toArray(".reveal-group");
    staggerGroups.forEach((group) => {
      const children = group.querySelectorAll(".reveal-item");
      gsap.from(children, {
        scrollTrigger: { trigger: group, start: "top 85%", toggleActions: "play none none none" },
        opacity: 0, y: 40, stagger: 0.12, duration: 0.7, ease: "power3.out",
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);
}

export function useFloatingOrbs() {
  useEffect(() => {
    gsap.to(".orb-1", { x: 40, y: -30, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".orb-2", { x: -35, y: 40, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
    gsap.to(".orb-3", { x: 25, y: 25, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
  }, []);
}

export function useCounters() {
  useEffect(() => {
    const counters = gsap.utils.toArray(".counter");
    counters.forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const isDecimal = el.dataset.decimal === "true";
      gsap.from({ val: 0 }, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        val: target, duration: 2, ease: "power2.out",
        onUpdate: function() { el.textContent = isDecimal ? this.targets()[0].val.toFixed(1) : Math.round(this.targets()[0].val).toLocaleString(); },
      });
    });
  }, []);
}
