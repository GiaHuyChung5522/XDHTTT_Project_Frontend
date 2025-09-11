// Test Delete Product Script
// Chạy script này trong browser console tại http://localhost:5173/admin/products

console.log('🧪 Testing Delete Product Functionality...');

// 1. Kiểm tra adminService có tồn tại không
if (typeof adminService === 'undefined') {
    console.error('❌ adminService không tồn tại. Hãy import từ services/adminService.js');
} else {
    console.log('✅ adminService đã sẵn sàng');
}

// 2. Kiểm tra token authentication
function checkAuth() {
    const tokens = {
        adminToken: localStorage.getItem('adminToken'),
        access_token: localStorage.getItem('access_token'),
        token: localStorage.getItem('token'),
        auth: localStorage.getItem('auth')
    };
    
    console.log('🔑 Authentication tokens:', tokens);
    
    const hasToken = Object.values(tokens).some(token => token && token !== 'null');
    
    if (!hasToken) {
        console.warn('⚠️ Không có authentication token. Cần đăng nhập admin trước.');
        return false;
    }
    
    console.log('✅ Có authentication token');
    return true;
}

// 3. Test delete product function
async function testDeleteProduct(productId) {
    if (!checkAuth()) {
        console.error('❌ Không thể test delete - thiếu authentication');
        return;
    }
    
    if (!productId) {
        console.error('❌ Vui lòng cung cấp productId');
        return;
    }
    
    try {
        console.log(`🗑️ Testing delete product: ${productId}`);
        
        const result = await adminService.deleteProduct(productId);
        
        console.log('✅ Delete result:', result);
        
        if (result.success) {
            console.log('🎉 Xóa sản phẩm thành công!');
        } else {
            console.error('❌ Xóa sản phẩm thất bại:', result.message);
        }
        
        return result;
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        return { success: false, error: error.message };
    }
}

// 4. Lấy danh sách sản phẩm để test
async function getProductsForTest() {
    try {
        console.log('📦 Getting products for testing...');
        
        const result = await adminService.getProducts({ page: 1, limit: 5 });
        
        if (result.success && result.data.products.length > 0) {
            console.log('✅ Found products:', result.data.products);
            
            // Lấy product đầu tiên để test delete
            const firstProduct = result.data.products[0];
            console.log(`🎯 Sử dụng sản phẩm đầu tiên để test: ${firstProduct.name} (ID: ${firstProduct.id})`);
            
            return firstProduct;
        } else {
            console.warn('⚠️ Không tìm thấy sản phẩm nào');
            return null;
        }
    } catch (error) {
        console.error('❌ Error getting products:', error);
        return null;
    }
}

// 5. Test complete flow
async function runDeleteTest() {
    console.log('🚀 Starting complete delete test...');
    
    // Check auth
    if (!checkAuth()) {
        console.log('💡 Để test delete, hãy đăng nhập admin trước:');
        console.log('   - Vào http://localhost:5173/admin/login');
        console.log('   - Hoặc chạy: await authService.login({email: "admin@example.com", password: "admin123"})');
        return;
    }
    
    // Get products
    const product = await getProductsForTest();
    
    if (!product) {
        console.log('💡 Không có sản phẩm để test. Hãy thêm sản phẩm trước.');
        return;
    }
    
    // Test delete
    const deleteResult = await testDeleteProduct(product.id);
    
    if (deleteResult.success) {
        console.log('🎉 Test delete thành công!');
        
        // Verify deletion
        console.log('🔍 Verifying deletion...');
        const verifyResult = await adminService.getProducts({ page: 1, limit: 5 });
        
        if (verifyResult.success) {
            const stillExists = verifyResult.data.products.find(p => p.id === product.id);
            if (stillExists) {
                console.warn('⚠️ Sản phẩm vẫn còn trong danh sách (có thể do cache)');
            } else {
                console.log('✅ Sản phẩm đã được xóa khỏi danh sách');
            }
        }
    }
}

// 6. Helper functions
window.testDeleteProduct = testDeleteProduct;
window.getProductsForTest = getProductsForTest;
window.runDeleteTest = runDeleteTest;
window.checkAuth = checkAuth;

console.log('📋 Available test functions:');
console.log('  - checkAuth() - Kiểm tra authentication');
console.log('  - getProductsForTest() - Lấy sản phẩm để test');
console.log('  - testDeleteProduct(productId) - Test xóa sản phẩm cụ thể');
console.log('  - runDeleteTest() - Chạy test hoàn chỉnh');

console.log('💡 Để test nhanh, chạy: runDeleteTest()');
