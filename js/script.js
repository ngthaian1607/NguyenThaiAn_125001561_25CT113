/**
 * ═══════════════════════════════════════════════════════════════════
 * script.js – JavaScript ES6+ cho trang Portfolio
 * Tác giả  : Nguyễn Văn An – MSSV: 125001561 – Lớp: 25CT113
 * Cập nhật : 2026-10-31
 *
 * Danh sách chức năng:
 *   §1. Cập nhật năm bản quyền tự động
 *   §2. Lời chào thời gian thực (Real-time Greeting)
 *   §3. Máy tính xếp loại sinh viên (Grade Calculator)
 *   §4. Data Model – Mảng dữ liệu dự án (Array of Objects)
 *   §5. renderProjects() – Hàm tự động sinh giao diện (Render Function)
 *   §6. initProjectFilter() – Bộ lọc danh mục dự án
 *   §7. Active Nav Link (Intersection Observer)
 *   §8. Header Scroll State
 *   §9. Inject dynamic CSS cho trạng thái UI
 *
 * Lý do dùng 'use strict':
 *   - Bật chế độ nghiêm ngặt: ngăn khai báo biến ngầm (undeclared),
 *     bắt lỗi sớm hơn, tối ưu hóa tốt hơn từ JavaScript engine.
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';


/* ─────────────────────────────────────────────────────────────────
   §1. CẬP NHẬT NĂM BẢN QUYỀN
   ─────────────────────────────────────────────────────────────────
   Tại sao dùng const?
   → yearEl và getFullYear() chỉ cần gán 1 lần, không bao giờ
     bị gán lại (reassign). Dùng const để trình biên dịch biết
     đây là "tham chiếu cố định" → tối ưu bộ nhớ và ngăn lỗi
     vô tình gán lại giá trị sai.
   ───────────────────────────────────────────────────────────────── */
(function updateCopyrightYear() {
  // const: tham chiếu đến DOM element, không đổi trong suốt hàm
  const yearEl = document.getElementById('current-year');

  if (yearEl) {
    // new Date().getFullYear() trả về số nguyên 4 chữ số (vd: 2026)
    yearEl.textContent = new Date().getFullYear();
  }
})();


/* ─────────────────────────────────────────────────────────────────
   §2. LỜI CHÀO THỜI GIAN THỰC – Real-time Greeting
   ─────────────────────────────────────────────────────────────────
   Luồng điều kiện:
   ┌────────────────────────────────────────────────────────────┐
   │  currentHour < 12            → "Chào buổi sáng! 🌅"       │
   │  currentHour >= 12 && < 18   → "Chào buổi chiều! ☀️"      │
   │  currentHour >= 18           → "Chào buổi tối! 🌙"        │
   └────────────────────────────────────────────────────────────┘

   Tại sao dùng const cho greetingMap?
   → Đây là object hằng số cấu hình, không bao giờ bị gán lại.
     Dùng const ngăn vô tình viết greetingMap = {...} ở nơi khác.

   Tại sao dùng let cho greetingKey?
   → greetingKey cần được gán lại tùy theo nhánh if-else if-else,
     nên phải dùng let thay vì const.

   Tại sao KHÔNG dùng var?
   → var có function scope (không phải block scope), dễ gây lỗi
     "hoisting" khó debug. let/const có block scope, an toàn hơn.
   ───────────────────────────────────────────────────────────── */
(function initGreeting() {
  // Lấy giờ hiện tại của hệ thống (0–23)
  // const: currentHour không bao giờ thay đổi trong lần chạy này
  const currentHour = new Date().getHours();

  // Cấu hình bảng lời chào: key → { text, emoji, period }
  // Dùng const vì object này là cấu hình tĩnh, không bị reassign
  const greetingConfig = {
    morning: { text: 'Chào buổi sáng!',  emoji: '🌅', period: 'Buổi sáng' },
    afternoon: { text: 'Chào buổi chiều!', emoji: '☀️',  period: 'Buổi chiều' },
    evening: { text: 'Chào buổi tối!',   emoji: '🌙', period: 'Buổi tối'  },
  };

  // let: greetingKey phải được gán lại qua if-else, nên không thể dùng const
  let greetingKey;

  // ── Rẽ nhánh if – else if – else ─────────────────────────────
  if (currentHour < 12) {
    // Trước 12h: buổi sáng (0h → 11h59)
    greetingKey = 'morning';
  } else if (currentHour < 18) {
    // Từ 12h đến 17h59: buổi chiều
    greetingKey = 'afternoon';
  } else {
    // Từ 18h đến 23h59: buổi tối
    greetingKey = 'evening';
  }

  // Lấy config tương ứng sau khi xác định được greetingKey
  // const: greeting là tham chiếu đến 1 object cụ thể, không đổi
  const greeting = greetingConfig[greetingKey];

  // ── Cập nhật DOM ─────────────────────────────────────────────
  // Tìm element banner lời chào trong HTML (id="greeting-banner")
  const bannerEl    = document.getElementById('greeting-banner');
  const greetingEl  = document.getElementById('greeting-text');
  const periodEl    = document.getElementById('greeting-period');

  if (bannerEl && greetingEl) {
    // Cập nhật nội dung text (textContent an toàn hơn innerHTML)
    greetingEl.textContent = `${greeting.emoji} ${greeting.text}`;

    // Cập nhật sub-text "Buổi sáng / chiều / tối"
    if (periodEl) {
      periodEl.textContent = `${greeting.period} · ${_formatTime(currentHour)}`;
    }

    // Hiện banner (ban đầu hidden bằng CSS)
    bannerEl.removeAttribute('hidden');

    // Thêm data attribute để CSS có thể thay màu theo thời gian
    bannerEl.setAttribute('data-period', greetingKey);
  }

  // Ghi log ra console để kiểm tra (hữu ích khi debug)
  console.log(
    `[Greeting] Giờ hiện tại: ${currentHour}h → Kỳ: ${greeting.period} → Lời chào: "${greeting.text}"`
  );
})();

/**
 * Hàm nội bộ: format giờ hiện tại thành chuỗi HH:MM
 * Dùng underscore prefix (_) theo convention "private helper"
 * @param {number} hour - Giờ hiện tại (0–23)
 * @returns {string} Chuỗi định dạng "HH:MM"
 */
function _formatTime(hour) {
  // const: now chỉ cần tạo 1 lần trong hàm này
  const now = new Date();
  // padStart(2, '0') đảm bảo luôn có 2 chữ số: "9" → "09"
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}


/* ─────────────────────────────────────────────────────────────────
   §3. MÁY TÍNH XẾP LOẠI SINH VIÊN – Grade Calculator
   ─────────────────────────────────────────────────────────────────
   Mục đích: Tính xếp loại học lực theo thang điểm 10 của Bộ GD-ĐT.

   Bảng xếp loại:
   ┌───────────────┬──────────────┬────────────────────────────────┐
   │ Điểm (thang 10)│ Điểm chữ (GPA)│ Xếp loại                   │
   ├───────────────┼──────────────┼────────────────────────────────┤
   │   9.0 – 10.0  │     A+       │ Xuất sắc (Excellent)           │
   │   8.5 –  8.9  │     A        │ Giỏi (Very Good)               │
   │   8.0 –  8.4  │     B+       │ Giỏi (Good)                    │
   │   7.0 –  7.9  │     B        │ Khá (Above Average)            │
   │   6.5 –  6.9  │     C+       │ Trung bình khá (Average+)      │
   │   5.5 –  6.4  │     C        │ Trung bình (Average)           │
   │   5.0 –  5.4  │     D+       │ Yếu (Below Average)            │
   │   4.0 –  4.9  │     D        │ Yếu (Poor)                     │
   │    < 4.0      │     F        │ Kém / Trượt (Fail)             │
   └───────────────┴──────────────┴────────────────────────────────┘

   Luồng điều kiện:
   → Kiểm tra hợp lệ (0 ≤ score ≤ 10) trước → ném TypeError sớm
   → Dùng chuỗi if–else if theo thứ tự từ cao xuống thấp
   → Tại sao từ cao xuống thấp? → Nếu score = 9.5 thì điều kiện
     >= 9.0 sẽ khớp trước khi rơi xuống các nhánh thấp hơn →
     hiệu quả hơn và đọc dễ hơn.

   Tại sao dùng const cho letterGrade và rankLabel?
   → Sau khi xác định trong hàm, giá trị KHÔNG bao giờ thay đổi.
     Dùng const để trình đọc code hiểu ngay "đây là giá trị cuối".
   ───────────────────────────────────────────────────────────── */

/**
 * Tính xếp loại sinh viên theo thang điểm 10
 * @param {number} score - Điểm trung bình (0.0 – 10.0)
 * @returns {{ letterGrade: string, rankLabel: string, rankEn: string }}
 * @throws {RangeError} Nếu điểm nằm ngoài khoảng [0, 10]
 * @throws {TypeError} Nếu score không phải số
 */
function calcStudentGrade(score) {
  // ── Kiểm tra kiểu dữ liệu đầu vào ─────────────────────────
  // typeof kiểm tra xem score có phải Number không
  // isNaN phát hiện giá trị NaN (Not a Number) ẩn
  if (typeof score !== 'number' || isNaN(score)) {
    throw new TypeError(`Điểm phải là số, nhận được: ${typeof score}`);
  }

  // ── Kiểm tra phạm vi hợp lệ ────────────────────────────────
  if (score < 0 || score > 10) {
    throw new RangeError(`Điểm phải trong khoảng [0, 10], nhận được: ${score}`);
  }

  // let: letterGrade và rankLabel sẽ được gán qua if-else
  let letterGrade;
  let rankLabel;
  let rankEn;

  // ── Rẽ nhánh xếp loại (thứ tự: cao → thấp) ────────────────
  if (score >= 9.0) {
    letterGrade = 'A+';
    rankLabel   = 'Xuất sắc';
    rankEn      = 'Excellent';
  } else if (score >= 8.5) {
    letterGrade = 'A';
    rankLabel   = 'Giỏi';
    rankEn      = 'Very Good';
  } else if (score >= 8.0) {
    letterGrade = 'B+';
    rankLabel   = 'Giỏi';
    rankEn      = 'Good';
  } else if (score >= 7.0) {
    letterGrade = 'B';
    rankLabel   = 'Khá';
    rankEn      = 'Above Average';
  } else if (score >= 6.5) {
    letterGrade = 'C+';
    rankLabel   = 'Trung bình khá';
    rankEn      = 'Average+';
  } else if (score >= 5.5) {
    letterGrade = 'C';
    rankLabel   = 'Trung bình';
    rankEn      = 'Average';
  } else if (score >= 5.0) {
    letterGrade = 'D+';
    rankLabel   = 'Yếu';
    rankEn      = 'Below Average';
  } else if (score >= 4.0) {
    letterGrade = 'D';
    rankLabel   = 'Yếu';
    rankEn      = 'Poor';
  } else {
    // Nhánh cuối: score < 4.0 → Kém / Trượt
    letterGrade = 'F';
    rankLabel   = 'Kém / Trượt';
    rankEn      = 'Fail';
  }

  // Trả về object chứa kết quả đầy đủ
  // const: result là tham chiếu đến object vừa tạo, không đổi
  const result = { score, letterGrade, rankLabel, rankEn };
  return result;
}

/* ── Kiểm thử (Test Cases) – In kết quả ra console ────────────────
   Mục đích: Xác minh hàm hoạt động đúng với các ca biên và ca điển hình.
   Sử dụng console.table() thay vì console.log() để hiển thị dạng bảng
   đẹp hơn trong DevTools. */
(function runGradeTests() {
  // const: testCases là mảng cấu hình không thay đổi
  const testCases = [
    { input: 9.5,  expected: 'A+' },   // Ca biên: điểm cao nhất
    { input: 9.0,  expected: 'A+' },   // Ca biên: đúng ngưỡng 9.0
    { input: 8.7,  expected: 'A'  },   // Ca điển hình
    { input: 8.0,  expected: 'B+' },   // Ca biên: đúng ngưỡng 8.0
    { input: 7.3,  expected: 'B'  },   // Ca điển hình
    { input: 6.5,  expected: 'C+' },   // Ca biên
    { input: 5.5,  expected: 'C'  },   // Ca biên
    { input: 5.0,  expected: 'D+' },   // Ca biên
    { input: 4.0,  expected: 'D'  },   // Ca biên
    { input: 3.9,  expected: 'F'  },   // Ca biên: vừa dưới ngưỡng 4.0
    { input: 0.0,  expected: 'F'  },   // Ca biên: điểm thấp nhất
    { input: 10.0, expected: 'A+' },   // Ca biên: điểm tối đa
  ];

  console.group('📊 [Grade Calculator] Kết quả kiểm thử');

  // Dùng let vì allPassed cần được cập nhật trong vòng lặp
  let allPassed = true;

  // Tạo mảng kết quả để in dạng bảng
  const results = testCases.map(({ input, expected }) => {
    // const: result và passed chỉ cần gán 1 lần trong vòng lặp này
    const result = calcStudentGrade(input);
    const passed = result.letterGrade === expected;

    if (!passed) allPassed = false;

    return {
      'Điểm':       input,
      'Điểm chữ':   result.letterGrade,
      'Xếp loại':   result.rankLabel,
      'Kỳ vọng':    expected,
      'Kết quả':    passed ? '✅ PASS' : '❌ FAIL',
    };
  });

  // console.table: hiển thị mảng object dưới dạng bảng trong DevTools
  console.table(results);

  // Tổng kết
  if (allPassed) {
    console.log('✅ Tất cả test cases đều PASS!');
  } else {
    console.warn('⚠️ Có test case FAIL – Kiểm tra lại hàm calcStudentGrade()');
  }

  // Kiểm thử xử lý lỗi (error handling)
  console.group('🚨 Test xử lý đầu vào không hợp lệ');
  try {
    calcStudentGrade('abc');  // Truyền string → phải ném TypeError
  } catch (e) {
    console.log(`[TypeError caught] ${e.message}`);
  }
  try {
    calcStudentGrade(11);     // Vượt quá giới hạn → phải ném RangeError
  } catch (e) {
    console.log(`[RangeError caught] ${e.message}`);
  }
  console.groupEnd();

  console.groupEnd();
})();


/* ─────────────────────────────────────────────────────────────────
   §4. DATA MODEL – MẢNG DỮ LIỆU DỰ ÁN (Array of Objects)
   ─────────────────────────────────────────────────────────────────
   NGUYÊN TẮC DRY (Don't Repeat Yourself):
   Dữ liệu được khai báo MỘT LẦN DUY NHẤT ở đây, hàm renderProjects()
   sẽ dùng mảng này để tạo HTML tự động – không cần sửa HTML thủ công.

   Phạm vi biến (Scope):
   → PROJECT_DATA khai báo ở module scope (ngoài mọi hàm/IIFE)
   → Có thể truy cập từ bất kỳ hàm nào trong file này
   → Dùng const vì mảng này không bao giờ bị gán lại (reassign),
     mặc dù nội dung bên trong có thể push/pop – nhưng ta không làm vậy.

   Cấu trúc mỗi object dự án:
   {
     id        : số nguyên, định danh duy nhất (dùng để tạo id DOM)
     title     : tên dự án
     description: mô tả ngắn
     category  : nhóm danh mục để filter ('fullstack'|'frontend'|'tool')
     tags      : mảng string – công nghệ sử dụng
     image     : { src, alt, seed } – thông tin ảnh
     links     : { github, demo } – đường dẫn
     date      : { display, datetime } – thời gian hoàn thành
   }
   ───────────────────────────────────────────────────────────────── */

// const: mảng dữ liệu nguồn – không bao giờ reassign
const PROJECT_DATA = [
  {
    id: 1,
    title: 'ShopVN – E-commerce App',
    description:
      'Ứng dụng mua sắm trực tuyến full-stack với React, Node.js và MongoDB. ' +
      'Tích hợp thanh toán VNPay, tìm kiếm real-time và bảng quản trị admin.',
    category: 'fullstack',
    tags: ['React', 'Node.js', 'MongoDB', 'VNPay API'],
    image: {
      src: 'https://picsum.photos/seed/ecommerce/600/340',
      alt: 'Giao diện trang E-commerce ShopVN trên màn hình desktop',
    },
    links: {
      github: 'https://github.com/nguyenvanan/shopvn',
      demo:   'https://shopvn.demo.com',
    },
    date: { display: 'Tháng 3, 2024', datetime: '2024-03' },
  },
  {
    id: 2,
    title: 'Analytics Dashboard',
    description:
      'Bảng điều khiển phân tích dữ liệu real-time với Chart.js, kết nối REST API, ' +
      'hỗ trợ xuất báo cáo CSV/PDF và chế độ dark mode.',
    category: 'frontend',
    tags: ['React', 'Chart.js', 'REST API', 'Tailwind CSS'],
    image: {
      src: 'https://picsum.photos/seed/dashboard/600/340',
      alt: 'Giao diện Dashboard Analytics hiển thị biểu đồ và số liệu thống kê',
    },
    links: {
      github: 'https://github.com/nguyenvanan/dashboard',
      demo:   'https://dashboard.demo.com',
    },
    date: { display: 'Tháng 10, 2023', datetime: '2023-10' },
  },
  {
    id: 3,
    title: 'TaskFlow – Quản lý công việc',
    description:
      'Ứng dụng quản lý công việc theo phương pháp Kanban. Kéo-thả task giữa ' +
      'các cột, lưu trạng thái bằng LocalStorage, hỗ trợ đa người dùng.',
    category: 'frontend',
    tags: ['Vanilla JS', 'Drag & Drop API', 'LocalStorage', 'CSS Grid'],
    image: {
      src: 'https://picsum.photos/seed/taskflow/600/340',
      alt: 'Giao diện ứng dụng TaskFlow với bảng Kanban 3 cột',
    },
    links: {
      github: 'https://github.com/nguyenvanan/taskflow',
      demo:   'https://taskflow.demo.com',
    },
    date: { display: 'Tháng 6, 2023', datetime: '2023-06' },
  },
  {
    id: 4,
    title: 'DevBlog – Nền tảng blog kỹ thuật',
    description:
      'Blog cá nhân về lập trình với hệ thống CMS tự xây dựng, hỗ trợ Markdown, ' +
      'tìm kiếm full-text và tối ưu SEO đạt Lighthouse score 98/100.',
    category: 'fullstack',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    image: {
      src: 'https://picsum.photos/seed/devblog/600/340',
      alt: 'Giao diện trang blog DevBlog với danh sách bài viết kỹ thuật',
    },
    links: {
      github: 'https://github.com/nguyenvanan/devblog',
      demo:   'https://devblog.demo.com',
    },
    date: { display: 'Tháng 1, 2024', datetime: '2024-01' },
  },
  {
    id: 5,
    title: 'CSS Gradient Generator',
    description:
      'Công cụ tạo gradient CSS trực quan: chọn màu, điều chỉnh góc, xem live preview ' +
      'và copy code CSS chỉ với 1 click. Không cần cài đặt, chạy hoàn toàn trên trình duyệt.',
    category: 'tool',
    tags: ['Vanilla JS', 'CSS Custom Properties', 'Clipboard API'],
    image: {
      src: 'https://picsum.photos/seed/cssgradient/600/340',
      alt: 'Giao diện công cụ CSS Gradient Generator với bảng chọn màu',
    },
    links: {
      github: 'https://github.com/nguyenvanan/css-gradient-gen',
      demo:   'https://gradient.demo.com',
    },
    date: { display: 'Tháng 8, 2023', datetime: '2023-08' },
  },
];


/* ─────────────────────────────────────────────────────────────────
   §5. RENDER FUNCTION – Tự động sinh HTML từ dữ liệu
   ─────────────────────────────────────────────────────────────────
   ┌─────────────────────────────────────────────────────────────┐
   │  GIẢI THÍCH THAM SỐ & GIÁ TRỊ TRẢ VỀ (cho function_logic) │
   │                                                             │
   │  Tham số (Parameter):                                       │
   │    projectList – Array of Objects                           │
   │    → Kiểu: Array<Object>                                    │
   │    → Đây là bản sao tham chiếu (reference copy), không phải│
   │      deep copy. Hàm ĐỌC nhưng không sửa mảng gốc.          │
   │                                                             │
   │  Giá trị trả về (Return value):                             │
   │    → Hàm không có lệnh return → mặc định trả về undefined  │
   │    → Đây là "side-effect function": mục tiêu là tác động    │
   │      lên DOM (innerHTML), không cần trả về giá trị.         │
   │                                                             │
   │  Phạm vi biến (Scope):                                      │
   │    → container : local scope của hàm – chỉ dùng trong đây  │
   │    → html       : local scope – chuỗi tích lũy qua forEach  │
   │    → project    : block scope của forEach callback          │
   │    → PROJECT_DATA : module scope – đọc được từ bên trong   │
   └─────────────────────────────────────────────────────────────┘

   Tại sao dùng innerHTML thay vì createElement?
   → Template literal tạo chuỗi HTML dài dễ đọc hơn nhiều lệnh
     createElement/appendChild nối tiếp nhau.
   → Phù hợp với dữ liệu tĩnh (không có user input) – không có
     nguy cơ XSS vì mọi giá trị đều đến từ PROJECT_DATA nội bộ.
   → Nếu dữ liệu đến từ API/user: phải dùng textContent hoặc
     sanitize trước khi set innerHTML.

   Tại sao dùng forEach thay vì for...of hay for cổ điển?
   → forEach là phương thức của Array.prototype, cú pháp khai báo
     rõ ý định "duyệt qua từng phần tử" hơn vòng lặp index.
   → Không cần biến đếm i, không có nguy cơ off-by-one error.
   → for...of cũng tốt tương đương; forEach phổ biến hơn trong
     codebase React/Vue nên được chọn cho nhất quán.
   ───────────────────────────────────────────────────────────── */

/**
 * Tạo chuỗi HTML cho MỘT thẻ tag (badge công nghệ)
 * → Tách thành hàm riêng theo nguyên tắc Single Responsibility.
 * → Hàm thuần túy (pure function): cùng input → luôn cùng output,
 *   không có side-effect, không đụng vào DOM.
 *
 * @param {string} tagName - Tên công nghệ (ví dụ: "React")
 * @returns {string} Chuỗi HTML một thẻ <li class="tag">
 */
function createTagHTML(tagName) {
  // Template literal: nhúng tagName trực tiếp vào chuỗi HTML
  return `<li class="tag">${tagName}</li>`;
}

/**
 * Tạo chuỗi HTML cho một card dự án đầy đủ
 * → Pure function: nhận object project, trả về string HTML.
 * → Không đụng vào DOM – chỉ xây chuỗi văn bản.
 *
 * @param {Object} project - Object dự án từ PROJECT_DATA
 * @param {number} project.id
 * @param {string} project.title
 * @param {string} project.description
 * @param {string} project.category
 * @param {string[]} project.tags
 * @param {{src:string, alt:string}} project.image
 * @param {{github:string, demo:string}} project.links
 * @param {{display:string, datetime:string}} project.date
 * @returns {string} Chuỗi HTML hoàn chỉnh của một <article> card
 */
function createProjectCardHTML(project) {
  // Destructuring: tách các thuộc tính cần dùng từ object project
  // → Scope: các biến này chỉ tồn tại trong hàm này
  const { id, title, description, category, tags, image, links, date } = project;

  // Dùng Array.map() + join() để chuyển mảng tags thành chuỗi HTML liền mạch
  // map()  : áp dụng createTagHTML() cho từng phần tử → trả về Array<string>
  // join(''): nối tất cả phần tử thành 1 chuỗi, không có ký tự ngăn cách
  const tagsHTML = tags.map(createTagHTML).join('');

  // Template literal nhiều dòng (multi-line template literal)
  // → Backtick ` cho phép xuống dòng tự nhiên mà không cần \n
  // → ${...} nhúng biến JS vào giữa chuỗi HTML
  // → Toàn bộ card là 1 chuỗi văn bản, chưa đụng vào DOM
  return `
    <article
      class="project-card"
      role="listitem"
      aria-labelledby="proj${id}-title"
      data-category="${category}"
      data-aos="fade-up"
    >
      <figure class="project-figure">
        <img
          src="${image.src}"
          alt="${image.alt}"
          class="project-img"
          width="600"
          height="340"
          loading="lazy"
        />
        <figcaption class="project-figcaption">
          Demo giao diện ${title}
        </figcaption>
      </figure>

      <div class="project-card__body">
        <h3 id="proj${id}-title" class="project-card__name">${title}</h3>

        <p class="project-card__meta">
          Hoàn thành: <time datetime="${date.datetime}">${date.display}</time>
        </p>

        <p class="project-card__desc">${description}</p>

        <ul class="project-tags" aria-label="Công nghệ sử dụng">
          ${tagsHTML}
        </ul>

        <div class="project-links">
          <a
            href="${links.github}"
            class="btn btn--outline btn--sm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Xem source code ${title} trên GitHub (mở tab mới)"
          >GitHub</a>
          <a
            href="${links.demo}"
            class="btn btn--primary btn--sm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Xem demo live ${title} (mở tab mới)"
          >Live Demo</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * HÀNG RÀO RENDER CHÍNH – renderProjects(projectList)
 * ─────────────────────────────────────────────────────
 * Tham số   : projectList (Array of Objects) – danh sách dự án cần hiển thị
 * Trả về    : undefined (side-effect function – mục tiêu là cập nhật DOM)
 * Side-effect: Cập nhật innerHTML của #projects-container
 *
 * Luồng thực thi:
 *   1. Tìm container trong DOM
 *   2. Nếu không tìm thấy → dừng sớm (early return) để tránh lỗi
 *   3. Kiểm tra projectList rỗng → hiện thông báo "không có dự án"
 *   4. Dùng forEach duyệt qua từng project → gọi createProjectCardHTML()
 *   5. Gộp tất cả chuỗi HTML lại → gán vào innerHTML một lần duy nhất
 *      (tránh reflow/repaint nhiều lần nếu set innerHTML trong vòng lặp)
 *
 * @param {Object[]} projectList - Mảng các object dự án
 */
function renderProjects(projectList) {
  // ── Bước 1: Tìm container trong DOM ──────────────────────────
  // const: container là tham chiếu DOM, không đổi trong hàm này
  const container = document.getElementById('projects-container');

  // ── Bước 2: Early return – bảo vệ khỏi lỗi null ─────────────
  // Nếu không có element nào có id="projects-container" → dừng ngay
  // Tránh lỗi: "Cannot set properties of null (setting 'innerHTML')"
  if (!container) {
    console.warn('[renderProjects] Không tìm thấy #projects-container trong DOM.');
    return; // return sớm → thoát hàm, không thực thi các dòng bên dưới
  }

  // ── Bước 3: Xử lý danh sách rỗng ────────────────────────────
  if (!Array.isArray(projectList) || projectList.length === 0) {
    container.innerHTML = `
      <p class="projects-empty" role="status">
        Không có dự án nào phù hợp với bộ lọc hiện tại.
      </p>`;
    return;
  }

  // ── Bước 4+5: Tạo HTML và chèn vào DOM ──────────────────────
  // let: html là chuỗi tích lũy, cần được += trong forEach
  let html = '';

  // forEach: duyệt qua từng phần tử trong mảng projectList
  // → project là tham số của callback – block scope, chỉ sống trong {}
  // → index là tham số thứ 2 (tuỳ chọn) – vị trí trong mảng
  projectList.forEach((project, index) => {
    // Gọi hàm createProjectCardHTML() với project hiện tại
    // → Trả về string HTML của 1 card
    // → Cộng dồn vào biến html (string concatenation)
    html += createProjectCardHTML(project);

    // Log tiến trình để debug (có thể xóa ở production)
    console.log(`[renderProjects] Đã xử lý dự án ${index + 1}/${projectList.length}: "${project.title}"`);
  });

  // Gán innerHTML MỘT LẦN DUY NHẤT sau khi vòng lặp hoàn tất
  // → Tối ưu hơn set innerHTML nhiều lần trong vòng lặp
  //   vì trình duyệt chỉ phải parse HTML và tính toán layout 1 lần
  container.innerHTML = html;

  // Khởi động lại AOS để các card mới được animate
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }

  console.log(`[renderProjects] ✅ Đã render ${projectList.length} dự án vào #projects-container.`);
}


/* ─────────────────────────────────────────────────────────────────
   §6. PROJECT FILTER – Bộ lọc danh mục dự án
   ─────────────────────────────────────────────────────────────────
   NGUYÊN TẮC ĐÓNG GÓI (Encapsulation):
   Toàn bộ logic filter nằm trong IIFE này, không rò rỉ ra ngoài.

   Luồng hoạt động:
     Click nút filter
       → Đọc data-filter attribute
       → Lọc PROJECT_DATA bằng Array.filter()
       → Gọi renderProjects() với kết quả đã lọc
   ───────────────────────────────────────────────────────────── */
(function initProjectFilter() {
  // const: filterButtons là NodeList cố định sau khi query
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Nếu không có nút lọc nào → không cần làm gì
  if (!filterButtons.length) return;

  // Gán event listener cho mỗi nút lọc
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      // ── Cập nhật trạng thái active của các nút ────────────
      // Xóa class active khỏi TẤT CẢ nút trước
      filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
      // Thêm class active cho nút vừa được click (this)
      this.classList.add('filter-btn--active');

      // ── Đọc giá trị filter từ data-filter attribute ───────
      // const: filterValue không đổi trong xử lý click này
      const filterValue = this.getAttribute('data-filter');

      // ── Lọc dữ liệu bằng Array.filter() ──────────────────
      // Array.filter(): trả về mảng MỚI chứa các phần tử thoả điều kiện
      // → Không làm thay đổi PROJECT_DATA gốc (immutable pattern)
      // → filtered: let vì được gán từ biểu thức điều kiện ternary
      let filtered;

      if (filterValue === 'all') {
        // 'all': hiển thị toàn bộ → không cần lọc, truyền thẳng
        filtered = PROJECT_DATA;
      } else {
        // Lọc: chỉ giữ lại project có category khớp với filterValue
        // p.category === filterValue: so sánh bằng nghiêm ngặt (===)
        filtered = PROJECT_DATA.filter(p => p.category === filterValue);
      }

      // Gọi renderProjects() với danh sách đã lọc
      // → Đây là ví dụ điển hình của "truyền tham số hàm"
      renderProjects(filtered);
    });
  });

  // ── Gọi render lần đầu khi trang tải xong ─────────────────
  // Truyền toàn bộ PROJECT_DATA (chưa lọc) → hiển thị tất cả dự án
  // Đây là lần gọi hàm đầu tiên, minh chứng cho nguyên tắc DRY:
  // "Dữ liệu khai báo 1 lần, hàm gọi ở nhiều nơi"
  renderProjects(PROJECT_DATA);

  console.log('[initProjectFilter] ✅ Đã khởi tạo bộ lọc và render lần đầu.');
})();


/* ─────────────────────────────────────────────────────────────────
   ─────────────────────────────────────────────────────────────────
   Dùng IntersectionObserver API (hiệu suất cao hơn scroll listener):
   → Không chặn main thread khi cuộn
   → Trình duyệt tự tính toán intersection ở thread riêng
   ───────────────────────────────────────────────────────────── */
(function initActiveNav() {
  // const: navLinks và sections chỉ cần query 1 lần
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id], article[id], aside[id], footer[id]');

  if (!navLinks.length || !sections.length) return;

  /**
   * Gán/gỡ class 'nav-link--active' cho nav link khớp sectionId
   * @param {string} sectionId - id của section đang trong viewport
   */
  function setActiveLink(sectionId) {
    navLinks.forEach(link => {
      // Dùng === so sánh chính xác chuỗi href
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('nav-link--active', isActive);
    });
  }

  // rootMargin: '-10% 0px -55% 0px'
  // → Chỉ kích hoạt khi section đi vào vùng giữa viewport (10%–45%)
  // → Tránh kích hoạt khi section chỉ mới ló ra ở đỉnh/đáy màn hình
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-10% 0px -55% 0px' }
  );

  sections.forEach(section => observer.observe(section));
})();


/* ─────────────────────────────────────────────────────────────────
   §8. HEADER SCROLL STATE
   ─────────────────────────────────────────────────────────────────
   Thêm class .scrolled vào header khi user cuộn xuống > 50px
   CSS dùng .scrolled để tăng shadow, giúp header "nổi" hơn
   ───────────────────────────────────────────────────────────── */
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // { passive: true }: cam kết với trình duyệt rằng listener không
  // gọi preventDefault() → trình duyệt tối ưu hoá cuộn mượt hơn
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────────────────────
   §9. INJECT DYNAMIC CSS CHO TRẠNG THÁI UI
   ─────────────────────────────────────────────────────────────────
   Lý do inject qua JS thay vì viết trong style.css:
   → Các class này chỉ tồn tại khi JS chạy (progressive enhancement)
   → Tách biệt "style do JS tạo ra" khỏi stylesheet tĩnh
   ───────────────────────────────────────────────────────────── */
(function injectStateStyles() {
  const style = document.createElement('style');
  style.setAttribute('data-source', 'script.js');  // Dễ debug trong DevTools

  style.textContent = `
    /* ── Nav link active state ── */
    .nav-link--active {
      color: var(--primary-color) !important;
      font-weight: 600;
    }

    /* ── Header scrolled state ── */
    .site-header.scrolled {
      box-shadow: var(--shadow-md);
      background-color: var(--bg-header-glass);
    }

    /* ── Greeting banner: ẩn mặc định, JS sẽ removeAttribute('hidden') ── */
    #greeting-banner {
      transition: opacity 0.4s ease;
    }
    #greeting-banner[data-period="morning"] {
      background: linear-gradient(135deg,
        color-mix(in srgb, #f59e0b 12%, transparent),
        color-mix(in srgb, #fbbf24  6%, transparent)
      );
      border-color: color-mix(in srgb, #f59e0b 30%, transparent);
    }
    #greeting-banner[data-period="afternoon"] {
      background: linear-gradient(135deg,
        color-mix(in srgb, #06b6d4 10%, transparent),
        color-mix(in srgb, #0ea5e9  5%, transparent)
      );
      border-color: color-mix(in srgb, #06b6d4 30%, transparent);
    }
    #greeting-banner[data-period="evening"] {
      background: linear-gradient(135deg,
        color-mix(in srgb, #6366f1 12%, transparent),
        color-mix(in srgb, #8b5cf6  6%, transparent)
      );
      border-color: color-mix(in srgb, #6366f1 30%, transparent);
    }
  `;

  document.head.appendChild(style);
})();

