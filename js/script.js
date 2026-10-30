/**
 * script.js – JavaScript chính cho trang Portfolio
 * Tác giả : Nguyễn Văn An
 *
 * Chức năng:
 *   1. Cập nhật năm bản quyền tự động
 *   2. Highlight nav link theo section đang hiển thị (Intersection Observer)
 *   3. Thêm class .scrolled vào header khi cuộn xuống
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
   3. HEADER SCROLL STATE – thêm class khi cuộn xuống
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
   CSS cho trạng thái active và header được inject vào document
   ───────────────────────────────────────────────────────────── */
(function injectStateStyles() {
  const style = document.createElement('style');
  style.textContent = `
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
