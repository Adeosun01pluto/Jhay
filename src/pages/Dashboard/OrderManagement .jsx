import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust the import path as needed
import useAuth from '../../hooks/useAuth';
import { ThreeDots } from 'react-loader-spinner';
import { FaSpinner } from 'react-icons/fa';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // Store user details
  const { user, isAdmin, loading:mainLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // For filtering by status
  const [filteredOrders, setFilteredOrders] = useState([]);
  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        let ordersQuery;

        if (isAdmin) {
          ordersQuery = collection(db, 'orders'); // Fetch all orders for admin
        } else {
          ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid) // Fetch only user's orders
          );
        }

        const ordersSnapshot = await getDocs(ordersQuery);
        const fetchedOrders = ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, isAdmin]);

   // Filter orders based on search term and status
   useEffect(() => {
    const filtered = orders.filter(order => {
      const matchesSearchTerm = order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.token.symbol.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter ? order.status === statusFilter : true;

      return matchesSearchTerm && matchesStatus;
    });

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);


  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    try {
      const userDoc = await getDoc(doc(db, 'users', order.userId)); // Assuming users collection
      if (userDoc.exists()) {
        setUserDetails(userDoc.data()); // Save user details
      } else {
        console.error('No such user found!');
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
    }
  };
  const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);
  const [notifyUserLoading, setNotifyUserLoading] = useState(false);

  const handleConfirmPayment = async (orderId) => {
    setConfirmOrderLoading(true);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'paid',
      });
      setOrders(orders.map(o => (o.id === orderId ? { ...o, status: 'paid' } : o)));
      alert('Payment confirmed successfully.');
      // Notify the user (You can integrate notification logic here)
    } catch (error) {
      console.error('Error confirming payment: ', error);
      alert('Failed to confirm payment.');
    } finally {
      setConfirmOrderLoading(false);
    }
  };

  const handleNotifyUser = async (orderId) => {
    setNotifyUserLoading(true);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'payment_not_received',
      });
      setOrders(orders.map(o => (o.id === orderId ? { ...o, status: 'payment_not_received' } : o)));
      alert('User notified about payment not received.');
      // Notify the user (You can integrate notification logic here)
    } catch (error) {
      console.error('Error notifying user: ', error);
      alert('Failed to notify the user.');
    } finally {
      setNotifyUserLoading(false);
    }
  };

  const handlePokeAdmin = async (orderId) => {
    try {
      // Update the order document in Firestore with the poke field
      await updateDoc(doc(db, 'orders', orderId), {
        poke: true,
      });
      setOrders(orders.map(o => (o.id === orderId ? { ...o, poke: true } : o)));
      alert('Admin has been poked about your order.');
    } catch (error) {
      console.error('Error poking the admin: ', error);
      alert('Failed to poke the admin.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancelled',
      });
      setOrders(orders.map(o => (o.id === orderId ? { ...o, status: 'cancelled' } : o)));
      alert('Order has been cancelled.');
    } catch (error) {
      console.error('Error cancelling order: ', error);
      alert('Failed to cancel the order.');
    }
  };



  if (loading) return <div className="text-center w-[100%] flex items-center justify-center">
  <ThreeDots
    visible={true}
    height="100"
    width="100"
    color="#FF900D"
    ariaLabel="three-circles-loading"
    wrapperStyle={{}}
    wrapperClass=""
    />
  </div>;

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }
  console.log(selectedOrder)

  return (
    <div className="bg-white dark:bg-gray-800 shadow md:rounded-lg p-4">
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Manage Orders</h2>
      <div className="mb-4 flex flex-col sm:flex-row w-full justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search Bar */}
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 w-full sm:w-7/12"
          placeholder="Search by order code, token, or user"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Status Filter */}
        <select
          className="border border-gray-300 rounded-md p-2 w-full sm:w-5/12"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="payment_not_received">Payment Not Received</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className={`${
              order.action === "buy" ? "bg-green-100 dark:bg-green-700" : "bg-red-100 dark:bg-red-700"
            } p-4 rounded-lg shadow dark:border dark:border-gray-600`}
          >
            {/* Show the poke icon if the admin has been poked */}
            {isAdmin && order.poke && (
              <div className="text-red-600 dark:text-red-400 flex justify-end mb-2">
                Poked
              </div>
            )}
            
            <h3 className="font-semibold text-md md:text-lg mb-2 text-gray-900 dark:text-gray-100">Order ID: {order.orderCode}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 break-words">User: {order?.userId}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Token: {order.token.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Token Amount to be {order.action === "buy" ? "Bought" : "Sold"}: {order.tokenAmount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Operation: {order.action.toUpperCase()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Amount in {order.currency}: {order.currency === "usd" ? "$" : String.fromCharCode(8358) }{Number(order.amount).toLocaleString()} Only</p>
            <p className="text-sm font-medium mb-2">
              Status: <span className={
                order.status === 'paid' ? "text-green-600 dark:text-green-400" :
                order.status === 'payment_not_received' ? "text-red-600 dark:text-red-400" :
                order.status === 'cancelled' ? "text-gray-600 dark:text-gray-400" :
                "text-yellow-600 dark:text-yellow-400"
              }>
                {order.status}
              </span>
            </p>
            {(order.status === 'pending' || order.status === 'payment_not_received') && ( 
              <button
                onClick={() => handleViewOrder(order)}
                className="w-full bg-black/70 dark:bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-black/70 dark:hover:bg-gray-500 transition duration-300 mb-2"
              >
                View Details
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative mx-auto p-2 md:p-5 border w-full max-w-md sm:max-w-lg lg:max-w-xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-1 md:mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Order Details</h3>
              {/* Show the poke icon if the admin has been poked */}
              {isAdmin && selectedOrder.poke && (
                <div className="text-red-600 dark:text-red-400 flex justify-end mb-2">
                  Poked
                </div>
              )}
              <div className="mt-1 md:mt-2 px-2 md:px-4 py-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-all">
                  Order ID: {selectedOrder.orderCode}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Operation: {selectedOrder.action.toUpperCase()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                  User: {selectedOrder?.userId}
                </p>
                { selectedOrder?.adminWalletAddress &&
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                      Admin Wallet Address: {selectedOrder?.adminWalletAddress}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                      Admin Network: {selectedOrder?.adminNetwork}
                    </p>
                  </>
                }
                { selectedOrder?.adminAccountNumber &&
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                      Admin Account Number: {selectedOrder?.adminAccountNumber}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                      Admin Account Name and Bank: {selectedOrder?.adminAccountNameandBank}
                    </p>
                  </>
                }
                {userDetails && (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      User Name: {userDetails.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                       Phone Number: {userDetails.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      User Email: {userDetails.email}
                    </p>
                  </>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Token: {selectedOrder.token.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Token Amount : {selectedOrder.tokenAmount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Amount in {selectedOrder.currency}: {selectedOrder.currency === "usd" ? "$" : String.fromCharCode(8358)}{Number(selectedOrder.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Status: {selectedOrder.status}
                </p>
                {selectedOrder.userWalletAddress && (
                  <>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                    User Wallet: {selectedOrder.userWalletAddress}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                    User Wallet Network: {selectedOrder.userNetwork}
                  </p>
                  </>
                )}
                {selectedOrder.userAccountNumber && (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                      User Account Number : {selectedOrder.userAccountNumber}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words">
                      User Account Number : {selectedOrder.userAccountNameAndBank}
                    </p>
                  </>
                )}
                <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => handleConfirmPayment(selectedOrder.id)}
                        className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-600 dark:hover:bg-green-500 w-full sm:w-auto flex items-center justify-center"
                        disabled={confirmOrderLoading}
                      >
                        {confirmOrderLoading && <FaSpinner className="animate-spin mr-2" />}
                        Confirm Payment
                      </button>
                      
                      <button
                        onClick={() => handleNotifyUser(selectedOrder.id)}
                        className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-600 dark:hover:bg-red-500 w-full sm:w-auto flex items-center justify-center mt-2 sm:mt-0 sm:ml-2"
                        disabled={notifyUserLoading}
                      >
                        {notifyUserLoading && <FaSpinner className="animate-spin mr-2" />}
                        Notify User
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handlePokeAdmin(selectedOrder.id)}
                        className="bg--500 dark:bg-[#FF900D]/60 text-white px-4 py-2 rounded text-sm hover:bg-[#FF900D]/60 dark:hover:bg-[#FF900D]/50 w-full sm:w-auto"
                      >
                        Poke Admin
                      </button>
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-600 dark:hover:bg-red-500 w-full sm:w-auto"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                className="px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
