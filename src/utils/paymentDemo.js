// Payment Demo Utilities
// Các function hỗ trợ demo payment system

export const paymentMethods = {
  CASH: 'cash',
  BANK: 'bank', 
  CARD: 'card'
};

export const paymentStatuses = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
};

export const orderStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Simulate payment processing
export const simulatePayment = async (paymentMethod, amount) => {
  const processingTime = {
    [paymentMethods.CASH]: 1000,
    [paymentMethods.BANK]: 2000,
    [paymentMethods.CARD]: 3000
  };

  await new Promise(resolve => setTimeout(resolve, processingTime[paymentMethod]));
  
  // 90% success rate for demo
  const success = Math.random() > 0.1;
  
  return {
    success,
    transactionId: success ? generateTransactionId(paymentMethod) : null,
    error: success ? null : 'Payment processing failed'
  };
};

// Generate transaction ID
export const generateTransactionId = (paymentMethod) => {
  const prefix = {
    [paymentMethods.CASH]: 'COD',
    [paymentMethods.BANK]: 'BANK',
    [paymentMethods.CARD]: 'TXN'
  };
  
  return prefix[paymentMethod] + Date.now().toString().slice(-8);
};

// Validate card number (Luhn algorithm)
export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Format card number with spaces
export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  return formatted;
};

// Format expiry date
export const formatExpiryDate = (value) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
  }
  return cleaned;
};

// Get payment method display name
export const getPaymentMethodName = (method) => {
  const names = {
    [paymentMethods.CASH]: 'Tiền mặt (COD)',
    [paymentMethods.BANK]: 'Chuyển khoản ngân hàng',
    [paymentMethods.CARD]: 'Thẻ tín dụng/ghi nợ'
  };
  return names[method] || 'Không xác định';
};

// Get payment status display name
export const getPaymentStatusName = (status) => {
  const names = {
    [paymentStatuses.PENDING]: 'Chờ thanh toán',
    [paymentStatuses.PAID]: 'Đã thanh toán',
    [paymentStatuses.FAILED]: 'Thanh toán thất bại'
  };
  return names[status] || 'Không xác định';
};

// Get order status display name
export const getOrderStatusName = (status) => {
  const names = {
    [orderStatuses.PENDING]: 'Chờ xác nhận',
    [orderStatuses.CONFIRMED]: 'Đã xác nhận',
    [orderStatuses.SHIPPED]: 'Đang giao hàng',
    [orderStatuses.DELIVERED]: 'Đã giao hàng',
    [orderStatuses.CANCELLED]: 'Đã hủy'
  };
  return names[status] || 'Không xác định';
};

// Demo bank account info
export const bankInfo = {
  bankName: 'Vietcombank',
  accountNumber: '1234567890',
  accountHolder: 'CÔNG TY 7N FASHION',
  branch: 'Chi nhánh TP.HCM'
};

// Demo card types
export const cardTypes = {
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
  AMEX: 'American Express'
};

// Detect card type from number
export const detectCardType = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleaned)) return cardTypes.VISA;
  if (/^5[1-5]/.test(cleaned)) return cardTypes.MASTERCARD;
  if (/^3[47]/.test(cleaned)) return cardTypes.AMEX;
  
  return 'Unknown';
};
