# Tuần 10 – Thao tác DOM và xử lý sự kiện

Tài liệu này giải thích cách `index.html`, `css/style.css` và `js/script.js`
phối hợp để đổi giao diện và tìm kiếm dự án theo thời gian thực.

## 1. Chuyển giao diện Sáng/Tối bằng sự kiện `click`

1. Nút `#theme-toggle` nằm trong thanh điều hướng của header.
2. `initThemeToggle()` dùng `document.querySelector()` để lấy nút và lấy
   `document.body`.
3. Chỉ khi cả hai phần tử tồn tại, JavaScript mới đăng ký
   `addEventListener('click', ...)`. Điều kiện này ngăn lỗi truy cập phần tử
   `null` nếu một trang khác dùng chung file script nhưng không có nút.
4. Khi người dùng click, `classList.toggle('dark-theme')` thêm class nếu chưa
   có và xóa class nếu đã có. Giá trị boolean trả về cho biết theme hiện tại.
5. Giá trị đó được ghi vào `aria-pressed`, giúp trạng thái nút được thông báo
   rõ ràng với công nghệ hỗ trợ.
6. CSS định nghĩa lại các custom properties trong `.dark-theme`. Vì class được
   gắn lên `body`, các biến màu được kế thừa bởi nội dung của trang; transition
   làm màu nền, chữ và đường viền thay đổi mượt mà.

## 2. Tìm kiếm real-time bằng sự kiện `input`

1. Ô `#search-input` đặt ngay phía trên danh sách dự án.
2. `initProjectFilter()` kiểm tra ô tìm kiếm tồn tại trước khi đăng ký
   `addEventListener('input', ...)`.
3. Mỗi ký tự được nhập, xóa hoặc dán sẽ cập nhật `searchTerm` từ
   `event.currentTarget.value`.
4. `renderFilteredProjects()` gọi `PROJECT_DATA.filter()`. Tìm kiếm không phân
   biệt chữ hoa/thường, sau khi chuẩn hóa chuỗi, và khớp trên tiêu đề, danh mục
   hoặc tags công nghệ của từng dự án.
5. Kết quả tìm kiếm được kết hợp với danh mục đang chọn. Do đó, thao tác tìm
   kiếm không làm mất bộ lọc danh mục và ngược lại.
6. Mảng kết quả được truyền vào `renderProjects()`. Hàm này chịu trách nhiệm
   cập nhật `#projects-container`, bao gồm thông báo khi không có kết quả.
   `PROJECT_DATA` gốc không bị thay đổi.

## 3. Sơ đồ luồng chung

```text
Click #theme-toggle
  -> kiểm tra nút và body
  -> toggle body.dark-theme
  -> cập nhật aria-pressed
  -> CSS đổi biến màu và chuyển màu mượt

Nhập #search-input hoặc click .filter-btn
  -> cập nhật từ khóa hoặc danh mục
  -> PROJECT_DATA.filter(...)
  -> renderProjects(kết quả)
  -> cập nhật #projects-container
```

Các guard `if (themeToggle && pageBody)`, `if (searchInput)` và kiểm tra từng
nút lọc bảo đảm listener chỉ được gắn khi phần tử DOM tương ứng tồn tại.
