import React from "react";
import Layout from "../components/Layouts/Layout";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

import { useSearch } from "../context/search";
const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Resuts</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text">
                    {" "}
                    {p.price.toLocaleString("en-PK", {
                      style: "currency",
                      currency: "PKR",
                    })}
                  </p>
                  <button
                    class="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    More Details
                  </button>
                  <button
                    className={`btn btn-dark ms-1 ${
                      p.quantity > 0 ? "" : "disabled"
                    }`}
                    onClick={() => {
                      if (p.quantity > 0) {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to Cart");
                      }
                    }}
                    disabled={p.quantity <= 0}
                  >
                    {p.quantity > 0 ? "ADD TO CART" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
