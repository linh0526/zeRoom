export function slugify(text: string): string {
  if (!text) return "";
  
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Chuyển sang dạng tổ hợp
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu sắc, huyền, hỏi, ngã, nặng
    .replace(/[đĐ]/g, "d") // Thay đ -> d
    .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt
    .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng -
    .replace(/-+/g, "-") // Thay nhiều - bằng một -
    .replace(/^-+|-+$/g, ""); // Xóa - ở đầu và cuối
}
