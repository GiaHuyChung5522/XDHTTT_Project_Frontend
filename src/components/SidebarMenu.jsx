const SidebarMenu = () => {
  const categories = [
    "Máy tính xách tay",
    "Laptop Gaming - Đồ Họa",
    "Laptop Văn phòng",
    "Laptop Lập trình",
    "Laptop cao cấp",
    "Apple Macbook",
    "RAM - SSD",
    "Kho phụ kiện",
    "Cổng chuyển",
    "Tản nhiệt laptop"
  ];

  return (
    <div className="bg-white shadow rounded-lg p-3">
      <h2 className="font-bold text-white bg-blue-800 p-2 rounded mb-2">DANH MỤC</h2>
      <ul className="space-y-2">
        {categories.map((cat, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-gray-800 hover:text-blue-600 cursor-pointer">
            <span>🔹</span> {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
