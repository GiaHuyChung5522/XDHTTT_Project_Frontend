import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, message, Spin, Table } from 'antd';
import { adminService } from '../services/adminService';
import { productsAPI } from '../api/products.api';

const { Title, Text } = Typography;

const TestApiIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [products, setProducts] = useState([]);

  const runTests = async () => {
    setLoading(true);
    const results = [];

    try {
      // Test 1: Get Products
      console.log('🧪 Testing: Get Products');
      const productsResult = await adminService.getProducts({ page: 1, limit: 5 });
      results.push({
        test: 'Get Products',
        status: productsResult.success ? '✅ PASS' : '❌ FAIL',
        data: productsResult.success ? `${productsResult.data.products.length} products` : productsResult.error,
      });

      // Test 2: Get Categories
      console.log('🧪 Testing: Get Categories');
      const categoriesResult = await adminService.getProductCategories();
      results.push({
        test: 'Get Categories',
        status: categoriesResult.success ? '✅ PASS' : '❌ FAIL',
        data: categoriesResult.success ? `${categoriesResult.data.length} categories` : categoriesResult.error,
      });

      // Test 3: Get Brands
      console.log('🧪 Testing: Get Brands');
      const brandsResult = await adminService.getProductBrands();
      results.push({
        test: 'Get Brands',
        status: brandsResult.success ? '✅ PASS' : '❌ FAIL',
        data: brandsResult.success ? `${brandsResult.data.length} brands` : brandsResult.error,
      });

      // Test 4: Filter Products
      console.log('🧪 Testing: Filter Products');
      const filterResult = await adminService.getProducts({ 
        page: 1, 
        limit: 3, 
        category: 'Laptop',
        brand: 'Dell'
      });
      results.push({
        test: 'Filter Products',
        status: filterResult.success ? '✅ PASS' : '❌ FAIL',
        data: filterResult.success ? `${filterResult.data.products.length} filtered products` : filterResult.error,
      });

      // Test 5: Get Users
      console.log('🧪 Testing: Get Users');
      const usersResult = await adminService.getUsers({ page: 1, limit: 3 });
      results.push({
        test: 'Get Users',
        status: usersResult.success ? '✅ PASS' : '❌ FAIL',
        data: usersResult.success ? `${usersResult.data.users.length} users` : usersResult.error,
      });

      // Test 6: Direct API call
      console.log('🧪 Testing: Direct API call');
      try {
        const directResult = await productsAPI.getProducts({ page: 1, limit: 2 });
        results.push({
          test: 'Direct API Call',
          status: '✅ PASS',
          data: `Direct API response received`,
        });
      } catch (error) {
        results.push({
          test: 'Direct API Call',
          status: '❌ FAIL',
          data: error.message,
        });
      }

    } catch (error) {
      console.error('Test error:', error);
      results.push({
        test: 'General Error',
        status: '❌ FAIL',
        data: error.message,
      });
    }

    setTestResults(results);
    setLoading(false);
    message.success('Tests completed!');
  };

  const loadSampleProducts = async () => {
    setLoading(true);
    try {
      const result = await adminService.getProducts({ page: 1, limit: 10 });
      if (result.success) {
        setProducts(result.data.products);
        message.success(`Loaded ${result.data.products.length} products`);
      } else {
        message.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      message.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Test Name',
      dataIndex: 'test',
      key: 'test',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Text style={{ color: status.includes('PASS') ? 'green' : 'red' }}>
          {status}
        </Text>
      ),
    },
    {
      title: 'Data/Error',
      dataIndex: 'data',
      key: 'data',
    },
  ];

  const productColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₫${price?.toLocaleString() || 'N/A'}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>API Integration Test</Title>
      <Text type="secondary">
        Test các API calls để đảm bảo Frontend có thể kết nối với Backend
      </Text>

      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '24px' }}>
        <Card>
          <Space>
            <Button type="primary" onClick={runTests} loading={loading}>
              Run API Tests
            </Button>
            <Button onClick={loadSampleProducts} loading={loading}>
              Load Sample Products
            </Button>
          </Space>
        </Card>

        {testResults.length > 0 && (
          <Card title="Test Results">
            <Table
              columns={columns}
              dataSource={testResults}
              pagination={false}
              size="small"
            />
          </Card>
        )}

        {products.length > 0 && (
          <Card title="Sample Products from API">
            <Spin spinning={loading}>
              <Table
                columns={productColumns}
                dataSource={products}
                pagination={false}
                size="small"
              />
            </Spin>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default TestApiIntegration;
