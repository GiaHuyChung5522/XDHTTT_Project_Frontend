import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaMapMarkerAlt } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo + SĐT */}
        <div className="flex items-center space-x-2">
          <img src="/src/assets/logoPhone.png" alt="logo" className="h-10" />
          
          <div className="text-blue-700 font-semibold">
            <div>Nhom_7_UHT</div>
            <div className="text-sm">0987654321</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="hidden md:flex space-x-6 text-gray-800 font-medium">
          <a href="#" className="hover:text-blue-600">Giới thiệu</a>
          <a href="#" className="hover:text-blue-600">Khuyến mãi</a>
          <a href="#" className="hover:text-blue-600">Tin tức</a>
        </nav>

        {/* Search */}
        <div className="flex-1 mx-4 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm laptop và phụ kiện"
              className="w-full rounded-full border border-gray-300 px-5 py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring focus:border-blue-400"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Địa chỉ + Icons */}
        <div className="flex items-center space-x-4 text-sm text-gray-800">
          <a href="#" className="flex items-center space-x-1 hover:text-blue-600">
            <FaMapMarkerAlt className="text-blue-600" />
            <span className="hidden sm:inline">ĐỊA CHỈ CỬA HÀNG</span>
          </a>
          <div className="relative">
            <FaHeart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </div>
          <div className="relative">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </div>
          <FaUser className="text-xl" />
        </div>

      </div>
    </header>
  );
};

export default Header;
