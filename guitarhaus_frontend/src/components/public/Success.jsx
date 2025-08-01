import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);

  // Helper to get query params
  const getQueryParam = (name) => {
    return new URLSearchParams(location.search).get(name);
  };

  // Clean up old processed sessions (older than 24 hours)
  const cleanupProcessedSessions = () => {
    try {
      const processedSessions = JSON.parse(localStorage.getItem('processedSessions') || '[]');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      // Keep only sessions from the last 24 hours
      const recentSessions = processedSessions.filter(sessionId => {
        // Extract timestamp from session ID if possible, or keep all for now
        return true; // For now, keep all sessions
      });
      
      if (recentSessions.length !== processedSessions.length) {
        localStorage.setItem('processedSessions', JSON.stringify(recentSessions));
        console.log('🧹 Cleaned up old processed sessions');
      }
    } catch (error) {
      console.error('Error cleaning up processed sessions:', error);
    }
  };

  useEffect(() => {
    // Clean up old processed sessions
    cleanupProcessedSessions();
    
    const session_id = getQueryParam("session_id");
    if (session_id) {
      // Check if we've already processed this session
      const processedSessions = JSON.parse(localStorage.getItem('processedSessions') || '[]');
      if (processedSessions.includes(session_id)) {
        console.log('Session already processed:', session_id);
        setStatus('Paid');
        setOrderCreated(true);
        setLoading(false);
        return;
      }
      
      // Stripe payment flow
      handleStripeSuccess(session_id);
    } else {
      setError("No payment session found.");
      setLoading(false);
    }
  }, [location.search]);

  const handleStripeSuccess = async (sessionId) => {
    try {
      // First, verify the payment with Stripe
      const stripeResponse = await axios.get(`/api/v1/guitars/stripe-session/${sessionId}`);
      
      if (stripeResponse.data.status === 'paid') {
        setStatus('Paid');
        setPaymentDetails(stripeResponse.data.session);
        
        // Create order in database
        await createOrderFromSession(stripeResponse.data.session);
      } else {
        setError("Payment verification failed.");
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError("Failed to verify Stripe payment.");
    } finally {
      setLoading(false);
    }
  };

  const createOrderFromSession = async (session) => {
    try {
      console.log('=== CREATING ORDER FROM SESSION ===');
      console.log('Session ID:', session.id);
      console.log('Payment Intent:', session.payment_intent);
      console.log('Full session:', session);
      
      const { customer_email, metadata, line_items } = session;
      const { customer_name, customer_phone, total_amount } = metadata;
      
      console.log('Extracted data:', {
        customer_email,
        customer_name,
        customer_phone,
        total_amount,
        line_items_count: line_items?.data?.length || 0
      });
      
      // Prepare order data
      const orderData = {
        customerInfo: {
          name: customer_name || 'Unknown Customer',
          email: customer_email,
          phone: customer_phone || '0'
        },
        items: [],
        totalAmount: parseFloat(total_amount),
        paymentMethod: 'credit-card', // Use valid enum value
        paymentId: session.payment_intent
      };

      // Handle different line_items structures
      if (line_items && line_items.data && line_items.data.length > 0) {
        orderData.items = line_items.data.map(item => ({
          name: item.description?.replace('Brand: ', '') || 'Guitar',
          price: item.amount_total / 100, // Convert from cents
          quantity: item.quantity
        }));
        console.log('Using line_items.data:', orderData.items);
      } else if (line_items && Array.isArray(line_items)) {
        orderData.items = line_items.map(item => ({
          name: item.description?.replace('Brand: ', '') || 'Guitar',
          price: item.amount_total / 100,
          quantity: item.quantity
        }));
        console.log('Using line_items array:', orderData.items);
      } else {
        // Fallback: create a single item from metadata
        orderData.items = [{
          name: 'Guitar Purchase',
          price: parseFloat(total_amount),
          quantity: 1
        }];
        console.log('Using fallback item:', orderData.items);
      }

      console.log('Final order data to create:', orderData);

      // Create order via API with timeout
      console.log('Making API call to create order...');
      const orderResponse = await Promise.race([
        axios.post('/api/v1/orders/create-from-stripe', orderData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Order creation timeout')), 10000)
        )
      ]);
      
      console.log('Order creation response:', orderResponse.data);
      
      if (orderResponse.data.success) {
        console.log('✅ Order created successfully:', orderResponse.data.order);
        setOrderCreated(true);
        
        // Mark this session as processed to prevent duplicate orders
        const processedSessions = JSON.parse(localStorage.getItem('processedSessions') || '[]');
        if (!processedSessions.includes(session.id)) {
          processedSessions.push(session.id);
          localStorage.setItem('processedSessions', JSON.stringify(processedSessions));
          console.log('✅ Session marked as processed:', session.id);
        }
      } else {
        console.error('❌ Failed to create order:', orderResponse.data);
        setError('Order creation failed. Please contact support.');
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.message === 'Order creation timeout') {
        setError('Order creation is taking longer than expected. Please check the admin panel.');
      } else {
        setError('Failed to create order. Please contact support with your payment ID.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-md w-full mx-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-green-700 mb-4 text-center">Payment Successful!</h1>
        {loading ? (
          <p className="text-gray-700 mb-6">Verifying payment status...</p>
        ) : error ? (
          <div className="text-center mb-6">
            <p className="text-red-600 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Please contact support if you believe this is an error.</p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-2">
              Stripe Payment Status: <span className="font-bold text-green-600">{status}</span>
            </p>
            {paymentDetails && (
              <div className="text-sm text-gray-500 mt-2">
                <p>Amount: ₹{(paymentDetails.amount_total / 100).toFixed(2)}</p>
                <p>Payment ID: {paymentDetails.payment_intent}</p>
              </div>
            )}
            {orderCreated && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-semibold">
                  ✅ Order has been created successfully!
                </p>
                <p className="text-green-600 text-xs mt-1">
                  Your order will appear in the admin panel within a few seconds.
                </p>
              </div>
            )}
            {!orderCreated && !loading && !error && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm font-semibold">
                  ⚠️ Order creation in progress...
                </p>
                <p className="text-yellow-600 text-xs mt-1">
                  Please wait while we create your order.
                </p>
              </div>
            )}
          </div>
        )}
        <Link 
          to="/home" 
          className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-green-700 hover:shadow-xl transition duration-200 transform hover:scale-105 border-2 border-green-600 hover:border-green-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Success; 