import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../userPageCss/ProductList.css'; // Import the CSS file
import ProductCard from '../userPageComponents/productCard';
import Spinner from '../components/spinner'; // Spinner component to indicate loading
import UserNavBar from '../userPageComponents/navBarUserPage.jsx';
import SearchProductByType from '../components/searchProductByType.jsx';

const ProductList = () => {
  const { restaurantId } = useParams(); 
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(''); // State for selected food type

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://dreamsdeluxeapi.azurewebsites.net/client/getproducts/${restaurantId}`);
        setProducts(response.data);
        setFilteredProducts(response.data); // Initially show all products
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [restaurantId]);

  // Function to handle filtering based on the selected food type
  const handleFilterByType = (typeName) => {
    setSelectedType(typeName);

    // Filter products by the type property
    if (typeName) {
      const filtered = products.filter(product => product.type === typeName);
      setFilteredProducts(filtered);
    } else {
      // If no type selected, show all products
      setFilteredProducts(products);
    }
  };

  if (loading) return <Spinner />;

  return (
    <> 
      <h1 className="menu-title">Menu</h1>

      <SearchProductByType adminId={restaurantId} onFilter={handleFilterByType} />

      <div className="menu-container">
        <div className="product-container">
          {/* Render filtered products */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                imageUrl={product.imageUrl}
                description={product.description} // Assuming this field exists; if not, remove it
                price={product.price}
                name={product.name}
              />
            ))
          ) : (
            <p>No products found for this type.</p> // Message when no products found
          )}
        </div>
      </div>
      <UserNavBar />
    </>
  );
};

export default ProductList;
