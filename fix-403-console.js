// Quick Fix: Admin Login Script
// Chạy script này trong browser console để fix lỗi 403 Forbidden

console.log('🔧 Quick Fix: Admin Login Script');

// 1. Auto login admin
async function quickLoginAdmin() {
    try {
        console.log('🔄 Đang đăng nhập admin...');
        
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        const data = await response.json();
        
        if (response.ok && data.statusCode === 200) {
            const token = data.data.accessToken;
            
            // Lưu token vào localStorage với nhiều key
            localStorage.setItem('adminToken', token);
            localStorage.setItem('access_token', token);
            localStorage.setItem('token', token);
            localStorage.setItem('auth', JSON.stringify({ token: token }));
            
            console.log('✅ Đăng nhập thành công!');
            console.log('🔑 Token:', token.substring(0, 30) + '...');
            console.log('💾 Đã lưu vào localStorage');
            
            return token;
        } else {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }
    } catch (error) {
        console.error('❌ Lỗi đăng nhập:', error.message);
        return null;
    }
}

// 2. Test create product
async function testCreateProduct() {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        console.log('⚠️ Chưa có token. Đang đăng nhập...');
        const newToken = await quickLoginAdmin();
        if (!newToken) return;
    }
    
    try {
        console.log('🧪 Testing tạo sản phẩm...');
        
        const testProduct = {
            name: 'Test Product ' + Date.now(),
            brand: 'Test Brand',
            model: 'Test Model',
            price: 1000000,
            stock: 10,
            description: 'Sản phẩm test từ console',
            categories: 'Laptop văn phòng',
            isActive: true,
            isOnPromotion: false
        };

        const response = await fetch('http://localhost:3000/api/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(testProduct)
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Test tạo sản phẩm thành công!');
            console.log('📦 Sản phẩm:', testProduct.name);
            console.log('🆔 ID:', data._id);
        } else {
            console.error('❌ Test thất bại:', data.message);
        }
    } catch (error) {
        console.error('❌ Lỗi test:', error.message);
    }
}

// 3. Test delete product
async function testDeleteProduct(productId) {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        console.log('⚠️ Chưa có token. Đang đăng nhập...');
        const newToken = await quickLoginAdmin();
        if (!newToken) return;
    }
    
    if (!productId) {
        console.error('❌ Vui lòng cung cấp productId');
        return;
    }
    
    try {
        console.log(`🗑️ Testing xóa sản phẩm: ${productId}`);
        
        const response = await fetch(`http://localhost:3000/api/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Test xóa sản phẩm thành công!');
            console.log('📦 Response:', data);
        } else {
            console.error('❌ Test xóa thất bại:', data.message);
        }
    } catch (error) {
        console.error('❌ Lỗi test xóa:', error.message);
    }
}

// 4. Check authentication status
function checkAuth() {
    const tokens = {
        adminToken: localStorage.getItem('adminToken'),
        access_token: localStorage.getItem('access_token'),
        token: localStorage.getItem('token'),
        auth: localStorage.getItem('auth')
    };
    
    console.log('🔍 Authentication Status:');
    Object.entries(tokens).forEach(([key, value]) => {
        console.log(`  ${key}: ${value ? '✅' : '❌'}`);
    });
    
    const hasToken = Object.values(tokens).some(token => token && token !== 'null');
    
    if (hasToken) {
        console.log('✅ Có authentication token - có thể tạo/xóa sản phẩm');
    } else {
        console.log('❌ Không có token - cần đăng nhập admin');
    }
    
    return hasToken;
}

// 5. Main fix function
async function fix403Error() {
    console.log('🚀 Starting 403 Error Fix...');
    
    // Check current auth
    const hasAuth = checkAuth();
    
    if (!hasAuth) {
        console.log('🔐 Đang đăng nhập admin...');
        const token = await quickLoginAdmin();
        
        if (token) {
            console.log('✅ Fix hoàn tất! Bây giờ có thể tạo/xóa sản phẩm.');
            console.log('💡 Hãy thử lại chức năng tạo/xóa sản phẩm trong admin panel.');
        } else {
            console.log('❌ Không thể fix. Kiểm tra backend có chạy không.');
        }
    } else {
        console.log('✅ Đã có token. Vấn đề có thể do khác.');
    }
}

// Export functions to window
window.quickLoginAdmin = quickLoginAdmin;
window.testCreateProduct = testCreateProduct;
window.testDeleteProduct = testDeleteProduct;
window.checkAuth = checkAuth;
window.fix403Error = fix403Error;

console.log('📋 Available functions:');
console.log('  - fix403Error() - Fix lỗi 403 nhanh');
console.log('  - quickLoginAdmin() - Đăng nhập admin');
console.log('  - testCreateProduct() - Test tạo sản phẩm');
console.log('  - testDeleteProduct(productId) - Test xóa sản phẩm');
console.log('  - checkAuth() - Kiểm tra authentication');

console.log('💡 Để fix nhanh, chạy: fix403Error()');
