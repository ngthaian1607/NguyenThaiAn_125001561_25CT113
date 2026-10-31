# 📘 Logic Explanation – JavaScript ES6+ Portfolio

> **Tác giả:** Nguyễn Văn An – MSSV: 125001561 – Lớp: 25CT113
> **File nguồn:** `js/script.js`
> **Ngày:** 31/10/2026

---

## 1. Tại Sao Dùng `const` / `let` Thay Vì `var`?

Đây là quyết định **nền tảng** của JavaScript ES6+, ảnh hưởng trực tiếp đến độ an toàn và khả năng đọc hiểu của code.

### 1.1 Vấn đề của `var`

```javascript
// ❌ Ví dụ lỗi điển hình với var
var hour = 9;
if (hour < 12) {
  var greeting = 'Chào buổi sáng!';
}
console.log(greeting); // → "Chào buổi sáng!" (không bị lỗi!)
// Vấn đề: `greeting` thoát ra ngoài block if {} nhờ "var hoisting"
```

`var` có **function scope** — biến được "kéo lên đầu" hàm (hoisting), khiến biến có thể truy cập ngoài block `{}` đã khai báo. Điều này gây ra nhiều lỗi khó debug.

### 1.2 `const` — Dùng khi giá trị **không bao giờ được gán lại**

```javascript
// ✅ Đúng cách: const cho mọi giá trị cố định
const currentHour   = new Date().getHours();   // Không đổi trong suốt hàm
const greetingConfig = { morning: {...}, ... }; // Object cấu hình tĩnh
const bannerEl      = document.getElementById('greeting-banner');
```

**Quy tắc:** Mặc định luôn dùng `const`. Chỉ chuyển sang `let` khi biết chắc cần gán lại.

**Lợi ích của `const`:**
- Trình biên dịch (V8 engine) tối ưu hoá bộ nhớ tốt hơn cho biến không đổi
- Người đọc code hiểu ngay "đây là giá trị cuối, không bị thay đổi ở đâu nữa"
- Tránh lỗi vô tình gán lại: `currentHour = 5` sẽ bị bắt ngay bằng `TypeError`

> **Lưu ý quan trọng:** `const` chỉ bảo vệ **tham chiếu** (reference), không bảo vệ nội dung bên trong object/array. Vẫn có thể làm `greetingConfig.morning = null` mà không lỗi.

### 1.3 `let` — Dùng khi giá trị **cần gán lại**

```javascript
// ✅ Đúng cách: let cho biến cần thay đổi qua if-else
let greetingKey;        // Chưa biết giá trị, sẽ gán trong nhánh rẽ

if (currentHour < 12) {
  greetingKey = 'morning';    // Gán lần 1
} else if (currentHour < 18) {
  greetingKey = 'afternoon';  // Gán lần 2
} else {
  greetingKey = 'evening';    // Gán lần 3
}
// → greetingKey đã được xác định sau chuỗi if-else
```

`let` có **block scope** — biến chỉ tồn tại trong cặp `{}` bao ngoài gần nhất, giống `const`. Khác với `const`, `let` cho phép gán lại giá trị.

### 1.4 Bảng So Sánh

| Đặc điểm | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | ✅ (giá trị `undefined`) | ❌ (TDZ error) | ❌ (TDZ error) |
| Gán lại (reassign) | ✅ | ✅ | ❌ |
| Khai báo lại | ✅ | ❌ | ❌ |
| Dùng trong dự án này | ❌ Không dùng | ✅ Cho biến thay đổi | ✅ Mặc định |

> **TDZ = Temporal Dead Zone:** Khoảng thời gian từ đầu block đến dòng khai báo `let`/`const`. Truy cập biến trong TDZ sẽ ném `ReferenceError`, giúp phát hiện lỗi sớm hơn `var`.

---

## 2. Luồng Điều Kiện – Lời Chào Thời Gian Thực

### 2.1 Sơ Đồ Luồng

```
new Date().getHours()
        │
        ▼
  currentHour (0–23)
        │
        ├─── < 12 ──────────────→ greetingKey = 'morning'
        │                          "Chào buổi sáng! 🌅"
        │
        ├─── >= 12 && < 18 ─────→ greetingKey = 'afternoon'
        │                          "Chào buổi chiều! ☀️"
        │
        └─── >= 18 ─────────────→ greetingKey = 'evening'
                                   "Chào buổi tối! 🌙"
```

### 2.2 Code và Giải Thích

```javascript
const currentHour = new Date().getHours();
// new Date()    → tạo đối tượng Date tại thời điểm gọi
// .getHours()   → trả về số nguyên 0–23 (giờ theo múi giờ hệ thống)

let greetingKey;  // let vì sẽ được gán trong nhánh if-else bên dưới

if (currentHour < 12) {
  // Nhánh 1: 0h → 11h59 (buổi sáng)
  // Điều kiện: currentHour < 12 (giờ nhỏ hơn 12 → buổi sáng)
  greetingKey = 'morning';

} else if (currentHour < 18) {
  // Nhánh 2: 12h → 17h59 (buổi chiều)
  // Lý do điều kiện chỉ cần < 18:
  // → Nhánh if đầu đã loại bỏ trường hợp < 12
  // → Chỉ cần kiểm tra "có nhỏ hơn 18 không?"
  greetingKey = 'afternoon';

} else {
  // Nhánh 3: 18h → 23h59 (buổi tối)
  // Không cần điều kiện: đây là trường hợp còn lại duy nhất
  greetingKey = 'evening';
}
```

### 2.3 Tại Sao Dùng `if–else if–else` thay vì `switch`?

`if–else if–else` phù hợp hơn `switch` khi:
- Điều kiện là **phép so sánh số học** (`< 12`, `< 18`), không phải so sánh bằng giá trị cố định
- `switch` chỉ dùng `===` (so sánh bằng), không thể dùng `<` hay `>=` trực tiếp
- Số lượng nhánh ít (3 nhánh) → `if–else` dễ đọc hơn

---

## 3. Luồng Điều Kiện – Máy Tính Xếp Loại Sinh Viên

### 3.1 Sơ Đồ Luồng

```
calcStudentGrade(score)
        │
        ├─── Kiểm tra kiểu → không phải số → throw TypeError
        ├─── Kiểm tra phạm vi → ngoài [0,10] → throw RangeError
        │
        ▼
  score hợp lệ (0.0 – 10.0)
        │
        ├─── >= 9.0 ──→ A+ (Xuất sắc)
        ├─── >= 8.5 ──→ A  (Giỏi – Very Good)
        ├─── >= 8.0 ──→ B+ (Giỏi – Good)
        ├─── >= 7.0 ──→ B  (Khá)
        ├─── >= 6.5 ──→ C+ (Trung bình khá)
        ├─── >= 5.5 ──→ C  (Trung bình)
        ├─── >= 5.0 ──→ D+ (Yếu)
        ├─── >= 4.0 ──→ D  (Yếu – Poor)
        └─── else ───→ F  (Kém / Trượt)
```

### 3.2 Tại Sao Kiểm Tra Từ Cao Xuống Thấp?

```javascript
// ✅ Đúng: từ cao (9.0) xuống thấp (4.0)
if (score >= 9.0) {
  letterGrade = 'A+';
} else if (score >= 8.5) {   // Chỉ đến đây nếu score < 9.0
  letterGrade = 'A';
}
// ...

// ❌ Sai: nếu kiểm tra từ thấp lên cao
if (score >= 4.0) {
  letterGrade = 'D';  // score=9.5 cũng vào đây! → Sai hoàn toàn
}
```

Khi kiểm tra **từ cao xuống thấp** + dùng `else if`:
- JavaScript đánh giá điều kiện **tuần tự từ trên xuống**
- Khi 1 nhánh khớp, **toàn bộ chuỗi else if còn lại bị bỏ qua** → hiệu quả
- Không cần điều kiện kép như `score >= 8.5 && score < 9.0` → code ngắn hơn

### 3.3 Tại Sao Dùng `throw` thay vì `return null`?

```javascript
// ❌ Kém hơn: trả về null → caller phải kiểm tra null
function calcStudentGrade(score) {
  if (typeof score !== 'number') return null;
  // ...
}
const result = calcStudentGrade('abc');
if (result === null) { ... }  // Dễ quên kiểm tra

// ✅ Tốt hơn: ném lỗi → vấn đề được phát hiện ngay
function calcStudentGrade(score) {
  if (typeof score !== 'number') throw new TypeError('...');
  // ...
}
// Nếu quên try-catch, lỗi sẽ hiện ngay trong console → dễ debug
```

---

## 4. Kỹ Thuật IIFE (Immediately Invoked Function Expression)

Trong `script.js`, mỗi chức năng được bọc trong **IIFE**:

```javascript
(function initGreeting() {
  // Code bên trong...
})();   // ← Dấu () cuối gọi hàm ngay lập tức
```

### Tại sao dùng IIFE?

| Lợi ích | Giải thích |
|---|---|
| **Module scope** | Biến `const currentHour`, `let greetingKey` chỉ sống trong IIFE, không "rò rỉ" ra `window` global |
| **Tránh xung đột tên** | Nếu thêm thư viện bên ngoài cũng dùng tên `greeting`, sẽ không bị ghi đè |
| **Chạy ngay** | Không cần gọi thủ công `initGreeting()` sau khi khai báo |
| **Dễ đặt tên** | Tên hàm (`initGreeting`) giúp DevTools hiển thị đúng trong call stack |

---

## 5. Arrow Function vs. Function Declaration

```javascript
// Arrow function (=>): ngắn gọn, dùng cho callback ngắn
navLinks.forEach(link => {
  const isActive = link.getAttribute('href') === `#${sectionId}`;
  link.classList.toggle('nav-link--active', isActive);
});

// Function declaration: dùng cho hàm có tên, có JSDoc, được gọi nhiều nơi
function calcStudentGrade(score) {
  // ...
}
```

**Khi nào dùng arrow function?**
- Callback ngắn (`.forEach`, `.map`, `.filter`, event listeners)
- Không cần `this` binding (arrow function kế thừa `this` từ scope cha)

**Khi nào dùng function declaration?**
- Hàm có tên, cần JSDoc rõ ràng
- Hàm được gọi từ nhiều nơi trong file
- Cần function hoisting (gọi hàm trước khi khai báo)

---

## 6. Template Literals (Template Strings)

```javascript
// ❌ Cách cũ: nối chuỗi bằng +
console.log('[Greeting] Giờ hiện tại: ' + currentHour + 'h → ' + greeting.text);

// ✅ ES6+: template literal với backtick (`)
console.log(`[Greeting] Giờ hiện tại: ${currentHour}h → "${greeting.text}"`);
```

Template literal (dùng backtick `` ` ``) cho phép:
- Nhúng biểu thức JS trực tiếp bằng `${...}`
- Viết chuỗi nhiều dòng mà không cần `\n`
- Dễ đọc hơn nhiều so với nối chuỗi `+`

---

## 7. Tóm Tắt Các Quyết Định Thiết Kế

| Quyết định | Lý do |
|---|---|
| `'use strict'` ở đầu file | Bật chế độ nghiêm ngặt: bắt lỗi sớm, ngăn khai báo biến ngầm |
| `const` là mặc định | An toàn, rõ ràng, tối ưu hoá engine tốt hơn |
| `let` chỉ khi cần gán lại | Giới hạn phạm vi thay đổi, dễ trace bug |
| Không dùng `var` | `var` có quá nhiều đặc điểm kỳ lạ (hoisting, function scope) |
| IIFE cho mỗi chức năng | Cô lập scope, tránh ô nhiễm global namespace |
| Kiểm tra từ cao → thấp trong grade calc | Tối ưu, không cần điều kiện kép |
| `throw` thay vì `return null` | Lỗi được phát hiện sớm, không im lặng |
| `console.table()` cho test results | Hiển thị bảng đẹp trong DevTools, dễ so sánh |
| `{ passive: true }` cho scroll listener | Không chặn main thread, cuộn mượt hơn |

