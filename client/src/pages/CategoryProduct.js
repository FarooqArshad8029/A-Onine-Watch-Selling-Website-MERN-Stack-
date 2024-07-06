import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/CategoryProductStyles.css";
import axios from "axios";
const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(`/product-category/${params.slug}`);
      setProducts(data?.products);
      setCategory(data?.category);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mt-3 category">
        {loading ? ( // Conditionally render loading indicator
          <h4 className="text-center">Loading...</h4>
        ) : (
          <>
            <h4 className="text-center">Category - {category?.name}</h4>
            <h6 className="text-center">{products?.length} result found </h6>
            <div className="row">
              <div className="col-md-12 offset-1">
                <div className="d-flex flex-wrap">
                  {products?.map((p) => (
                    <div className="card m-2" key={p._id}>
                      <img
                        src={`/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                      />
                      <div className="card-body">
                        <div className="card-name-price">
                          <h5 className="card-title">{p.name}</h5>
                          <h5 className="card-title card-price">
                            {p.price.toLocaleString("en-PK", {
                              style: "currency",
                              currency: "PKR",
                            })}
                          </h5>
                        </div>
                        <p className="card-text ">
                          {p.description.substring(0, 60)}...
                        </p>
                        <div className="card-name-price">
                          <button
                            className="btn btn-info ms-1"
                            onClick={() => navigate(`/product/${p.slug}`)}
                          >
                            More Details
                          </button>
                          {/* <button
                    className="btn btn-dark ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div> */}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
