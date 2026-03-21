const img = document.getElementById("scrollImage");
let hoverOffset = 0; // dịch khi hover
let scrollOffset = 0; // dịch khi scroll


img.parentElement.addEventListener("mouseenter", () => {
  hoverOffset = -5; // dịch lên 5% chiều cao ảnh
  updateTransform();
});

img.parentElement.addEventListener("mouseleave", () => {
  hoverOffset = 0; // trở lại vị trí ban đầu
  updateTransform();
});

// Scroll: dịch ảnh theo vị trí cuộn
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  // Giới hạn tối đa 10% để không lộ nền trắng
  scrollOffset = Math.min(scrollY / 100, 10);
  updateTransform();
});

// Hàm cập nhật transform kết hợp hover + scroll
function updateTransform() {
  img.style.transform = `translateY(${hoverOffset - scrollOffset}%)`;
}
