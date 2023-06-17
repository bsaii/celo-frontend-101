import { useContractCall } from '@/hooks/contract';
import React, { useState } from 'react'
import { Product } from './Product';
import { ErrorAlert, LoadingAlert, SuccessAlert } from './alerts';

export const ProductList = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState<string | null>("");
  
  const { data } = useContractCall("getProductsLength", [], true);
  const productLength = data ? Number(data.toString()) : 0;
  const clear = () => {
    setError("");
    setSuccess("");
    setLoading("");
  };

  const getProducts = () => {
    // If there are no products, return null
    if (!productLength) return null;
    const products = [];
    // Loop through the products, return the Product component and push it to the products array
    for (let i = 0; i < productLength; i++) {
      products.push(
        <Product
          key={i}
          id={i}
          // setSuccess={setSuccess}
          setError={setError}
          setLoading={setLoading}
          // loading={loading}
          clear={clear}
        />
      );
    }
    return products;
  };
  
  return (
    <div>
      {/* If there is an alert, display it */}
      {error && <ErrorAlert message={error} clear={clear} />}
      {success && <SuccessAlert message={success} />}
      {loading && <LoadingAlert message={loading} />}
      {/* Display the products */}
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Loop through the products and return the Product component */}
          {getProducts()}
        </div>
      </div>
    </div>
  );
}
