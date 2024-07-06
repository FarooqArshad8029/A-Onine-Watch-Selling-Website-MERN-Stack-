import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from ".././components/Prices";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from ".././components/Layouts/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../Styles/Homepage.css";
import MessegingPage from "./MessegingPage";
import AdminMesseges from "./Admin/AdminMesseges";

const HomePage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const [cart, setCart] = useCart();
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  // send mail handler
  const subscribeNewslettersHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("subscribe-Newsletters", {
        email,
      });
      if (data?.success) {
        toast.success(data?.message);
        setEmail("");
      } else {
        toast.error("Failed to send emails");
      }
    } catch (error) {
      console.log("subscribe-Newsletters error:", error);
      if (error.response && error.response.data) {
        console.log("Server error response:", error.response.data);
      }
    }
  };

  return (
    <>
      <Layout title={"ALl Products - Best offers "}>
        {/* banner image */}
        <img
          src="/images/1.jpg"
          className="banner-img"
          alt="bannerimage"
          width={"100%"}
        />
        {/* banner image */}
        <div className="container-fluid row mt-3 home-page">
          <div className="col-md-2 filters">
            <h4 className="text-center">Filter By Category</h4>
            <div className="d-flex flex-column">
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>
            {/* price filter */}
            <h4 className="text-center mt-4">Filter By Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="d-flex flex-column">
              <button
                className="btn btn-danger"
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </button>
            </div>
          </div>
          <div className="col-md-10 ">
            <h1 className="text-center">All Products</h1>
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
                </div>
              ))}
            </div>
            <div className="m-2 p-3">
              {console.log("products.length:", products.length)}
              {console.log("total:", total)}
              {products && products.length < total && (
                <button
                  className="btn loadmore"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? (
                    "Loading ..."
                  ) : (
                    <>
                      {" "}
                      Loadmore <AiOutlineReload />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="Footop-newsletter">
          <div className="container">
            <div className="row text-center">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="Footop-title">
                  <h5>Subscribe to our Newsletter</h5>
                </div>
                <form onSubmit={subscribeNewslettersHandler}>
                  <input
                    type="text"
                    id="mc_email1"
                    className="field-input"
                    name="{email}"
                    placeholder=" Enter Your Email Address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="subscribe-btn bgcolor"
                    id="btn_newsletter_1"
                    type="submit"
                    defaultValue="Sign Up"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      {auth?.user?.role === 1 ? (
        <AdminMesseges />
      ) : auth?.user?.role === 0 ? (
        <MessegingPage />
      ) : null}
    </>
  );
};

export default HomePage;
