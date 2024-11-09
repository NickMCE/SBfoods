import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';

const RestaurantMenu = () => {
  const userId = localStorage.getItem('userId');

  const [availableCategories, setAvailableCategories] = useState([]);
  const [restaurant, setRestaurant] = useState();
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);

  const fetchCategories = useCallback(async () => {
    await axios.get('http://localhost:6001/fetch-categories').then((response) => {
      setAvailableCategories(response.data);
    });
  }, []);

  const fetchRestaurant = useCallback(async () => {
    await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`).then((response) => {
      setRestaurant(response.data);
    });
  }, [userId]);

  const fetchItems = useCallback(async () => {
    await axios.get('http://localhost:6001/fetch-items').then((response) => {
      setItems(response.data);
      setVisibleItems(response.data);
    });
  }, []);

  useEffect(() => {
    fetchRestaurant();
    fetchCategories();
    fetchItems();
  }, [fetchRestaurant, fetchCategories, fetchItems]);

  const [categoryFilter, setCategoryFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter((size) => size !== value));
    }
  };

  const handleTypeCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setTypeFilter([...typeFilter, value]);
    } else {
      setTypeFilter(typeFilter.filter((size) => size !== value));
    }
  };

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    const sortedItems = [...visibleItems].sort((a, b) => {
      if (value === 'low-price') return a.price - b.price;
      if (value === 'high-price') return b.price - a.price;
      if (value === 'discount') return b.discount - a.discount;
      if (value === 'rating') return b.rating - a.rating;
      return 0;
    });
    setVisibleItems(sortedItems);
  };

  useEffect(() => {
    if (categoryFilter.length > 0 && typeFilter.length > 0) {
      setVisibleItems(
        items.filter(
          (product) =>
            categoryFilter.includes(product.menuCategory) &&
            typeFilter.includes(product.category)
        )
      );
    } else if (categoryFilter.length === 0 && typeFilter.length > 0) {
      setVisibleItems(items.filter((product) => typeFilter.includes(product.category)));
    } else if (categoryFilter.length > 0 && typeFilter.length === 0) {
      setVisibleItems(items.filter((product) => categoryFilter.includes(product.menuCategory)));
    } else {
      setVisibleItems(items);
    }
  }, [categoryFilter, typeFilter, items]);

  return (
    <div className="AllRestaurantsPage" style={{ marginTop: '14vh' }}>
      <div className="restaurants-container">
        <div className="filters">
          <div className="category-filter">
            <h3>Category Filter</h3>
            {availableCategories.map((category) => (
              <div key={category}>
                <label>
                  <input
                    type="checkbox"
                    value={category}
                    onChange={handleCategoryCheckBox}
                  />
                  {category}
                </label>
              </div>
            ))}
          </div>

          <div className="type-filter">
            <h3>Type Filter</h3>
            <div>
              <label>
                <input
                  type="checkbox"
                  value="Veg"
                  onChange={handleTypeCheckBox}
                />
                Veg
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Non-Veg"
                  onChange={handleTypeCheckBox}
                />
                Non-Veg
              </label>
            </div>
          </div>

          <div className="sort-filter">
            <h3>Sort Filter</h3>
            <select onChange={handleSortFilterChange}>
              <option value="low-price">Low Price</option>
              <option value="high-price">High Price</option>
              <option value="discount">Discount</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <div className="restaurant-details">
          {restaurant && (
            <div>
              <h2>{restaurant.name}</h2>
              <p>{restaurant.description}</p>
            </div>
          )}
        </div>

        <div className="items-container">
          <h3>Menu Items</h3>
          <div className="items-list">
            {visibleItems.map((item) => (
              <div key={item.id} className="item">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>Price: ${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
