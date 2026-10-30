/**
 * script.js – JavaScript chính cho trang Portfolio
 * Tác giả : Nguyễn Văn An
 *
 * Chức năng:
 *   1. Cập nhật năm bản quyền tự động
 *   2. Highlight nav link theo section đang hiển thị (Intersection Observer)
 *   3. Hiệu ứng xuất hiện (fade-in) khi cuộn đến phần tử (Intersection Observer)
 *   4. Thêm class .scrolled vào header khi cuộn xuống
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CẬP NHẬT NĂM BẢN QUYỀN
   Tự động hiển thị năm hiện tại, không cần sửa thủ công
   ───────────────────────────────────────────────────────────── */
(function updateCopyrightYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();


/* ─────────────────────────────────────────────────────────────
   2. ACTIVE NAV LINK – highlight đúng mục khi cuộn trang
   Dùng IntersectionObserver theo dõi các section,
   highlight nav link tương ứng khi section vào viewport
   ───────────────────────────────────────────────────────────── */
(function initActiveNav() {
  // Lấy tất cả nav link có href bắt đầu bằng '#'
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  // Lấy tất cả section, article, aside và footer có id
  const sections = document.querySelectorAll('section[id], article[id], aside[id], footer[id]');

  if (!navLinks.length || !sections.length) return;

  /**
   * Gán hoặc gỡ class 'active' cho nav link khớp với sectionId
   * @param {string} sectionId – id của section đang hiển thị
   */
  function setActiveLink(sectionId) {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('nav-link--active', isActive);
    });
  }

  // Tạo observer: kích hoạt khi section chiếm ≥ 40% viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-10% 0px -55% 0px' }  /* Điều chỉnh vùng nhạy cảm */
  );

  // Bắt đầu quan sát từng section
  sections.forEach(section => observer.observe(section));
})();


/* ─────────────────────────────────────────────────────────────
   3. SCROLL REVEAL – hiệu ứng fade-in khi phần tử vào viewport
   Thêm class 'reveal' vào các phần tử cần animate,
   observer sẽ thêm class 'is-visible' khi chúng xuất hiện
   ───────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  // Các phần tử cần có hiệu ứng xuất hiện
  // Bao gồm: skill-card (<article>), project-card (<article>),
  // stat-item, about-text (<article>), edu-item (<article> trong <aside>),
  // hero-info, hero-figure (<figure>)
  const revealTargets = document.querySelectorAll(
    '.skill-card, .project-card, .stat-item, .about-text, .edu-item, .hero-info, .hero-figure'
  );

  if (!revealTargets.length) return;

  // Thêm class 'reveal' vào mỗi phần tử (ẩn ban đầu qua CSS)
  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    // Delay stagger: mỗi phần tử xuất hiện trễ hơn 80ms
    el.style.transitionDelay = `${index * 80}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Ngừng quan sát sau khi đã hiện – tiết kiệm tài nguyên
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }  /* Kích hoạt khi 15% phần tử vào viewport */
  );

  revealTargets.forEach(el => revealObserver.observe(el));
})();


/* ─────────────────────────────────────────────────────────────
   4. HEADER SCROLL STATE – thêm class khi cuộn xuống
   CSS có thể dùng .scrolled để tăng độ tối/shadow của header
   ───────────────────────────────────────────────────────────── */
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // Dùng passive listener để không ảnh hưởng hiệu suất cuộn
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────────────────
   CSS đi kèm được inject tự động cho class 'reveal'
   (Có thể chuyển sang style.css nếu muốn tách biệt hoàn toàn)
   ───────────────────────────────────────────────────────────── */
(function injectRevealStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Trạng thái ẩn ban đầu của phần tử có class reveal */
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    /* Trạng thái hiện khi vào viewport */
    .reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    /* Nav link active */
    .nav-link--active {
      color: var(--color-text-heading) !important;
    }
    .nav-link--active::after {
      width: 100% !important;
    }
    /* Header scrolled state */
    .site-header.scrolled {
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
    }
  `;
  document.head.appendChild(style);
})();
