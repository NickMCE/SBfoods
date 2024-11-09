import React, { useEffect, useState, useCallback } from 'react';  // Import useCallback
import '../../styles/RestaurantHome.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestaurantHome = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [restaurant, setRestaurant] = useState('pending');
  const [ItemsCount, setItemsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [restaurantData, setRestaurantData] = useState();

  // Use useCallback to memoize fetchUserData to avoid unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    await axios.get(`http://localhost:6001/fetch-user-details/${userId}`).then(
      (response) => {
        setRestaurant(response.data);
        console.log(response.data._id);
      }
    );
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);  // No warning here since fetchUserData is memoized

  // Memoize fetchRestaurantData with useCallback
  const fetchRestaurantData = useCallback(async () => {
    await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`).then(
      (response) => {
        setRestaurantData(response.data);
        console.log(response.data);
      }
    );
  }, [userId]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);  // fetchRestaurantData is memoized, no warning

  // Memoize fetchItems with useCallback
  const fetchItems = useCallback(async () => {
    await axios.get('http://localhost:6001/fetch-items').then((response) => {
      setItemsCount(response.data.filter(item => item.restaurantId === restaurantData._id).length);
    });
  }, [restaurantData]);

  // Memoize fetchOrders with useCallback
  const fetchOrders = useCallback(async () => {
    await axios.get('http://localhost:6001/fetch-orders').then((response) => {
      setOrdersCount(response.data.filter(item => item.restaurantId === restaurantData._id).length);
    });
  }, [restaurantData]);

  useEffect(() => {
    if (restaurantData) {
      fetchItems();
      fetchOrders();
    }
  }, [restaurantData, fetchItems, fetchOrders]);  // No warnings due to memoization

  return (
    <div className="restaurantHome-page">
      {restaurant.approval === 'pending' ?
        <div className="restaurant-approval-required">
          <h3>Approval required!!</h3>
          <p>You need to get approval from the admin to make this work. Please be patient!!!</p>
        </div>
        :
        <>
          <div>
            <div className="admin-home-card">
              <h5>All Items</h5>
              <p>{ItemsCount}</p>
              <button onClick={() => navigate('/restaurant-menu')}>View all</button>
            </div>
          </div>

          <div>
            <div className="admin-home-card">
              <h5>All Orders</h5>
              <p>{ordersCount}</p>
              <button onClick={() => navigate('/restaurant-orders')}>View all</button>
            </div>
          </div>

          <div>
            <div className="admin-home-card">
              <h5>Add Item</h5>
              <p>(new)</p>
              <button onClick={() => navigate('/new-product')}>Add now</button>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default RestaurantHome;
