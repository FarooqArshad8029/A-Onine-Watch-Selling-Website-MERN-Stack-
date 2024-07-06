import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import axios from "axios";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { AiOutlineReload } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/ProductDetailStyle.css";
import "../Styles/Homepage.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [auth, setAuth] = useAuth();
  const [visible, setVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [massege, setMassege] = useState("");
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //initalp details
  useEffect(() => {
    if (params?.id) {
      getProduct();
      fetchRatingAndReview();
    }
  }, [params?.id]);

  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/get-product/${params.id}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
      // fetchRatingAndReview();
    } catch (error) {
      console.log(error);
    }
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  // reviews
  // const fetchRatingAndReview = async () => {
  //   try {
  //     const response = await axios.get(`/get-rating-review/${params.id}`);
  //     console.log("response-fetchRatingAndReview:", response);

  //     if (response.data) {
  //       const { averageRating, reviews, ratingCount } = response.data;
  //       setTotalReviews(ratingCount);
  //       setAverageRating(averageRating);
  //       setReviews(reviews);
  //       console.log("averageRating:", averageRating);
  //       console.log("reviews:", reviews);
  //       console.log("TotalReviews:", response.data.ratingCount); // Log the value directly from the response
  //     } else {
  //       console.log("else check-fetchRatingAndReview");

  //       setAverageRating(0);
  //       setReviews([]);
  //       setTotalReviews(0);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const fetchRatingAndReview = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `/get-rating-review/${page}/${params.id}`
      );
      console.log("response-fetchRatingAndReview:", response);
      setLoading(false);

      if (response.data) {
        const { averageRating, reviews, ratingCount } = response.data;
        setTotalReviews(ratingCount);
        setAverageRating(averageRating);
        setReviews(reviews);
        console.log("averageRating:", averageRating);
        console.log("reviews:", reviews);
        console.log("TotalReviews:", response.data.ratingCount); // Log the value directly from the response
      } else {
        console.log("else check-fetchRatingAndReview");

        setAverageRating(0);
        setReviews([]);
        setTotalReviews(0);
      }
    } catch (error) {
      setLoading(false);

      console.error(error);
    }
  };
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  const loadMore = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/get-rating-review/${page}/${params.id}`
      );
      setLoading(false);
      setReviews([...reviews, ...response?.reviews]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/rating-review/${params.id}`, {
        userId: auth?.user?._id,
        userName: auth?.user?.name,
        rating: rating,
        review: massege,
      });
      if (response.status === 201) {
        console.log("Rating and review submitted successfully.");
        setMassege("");
        setVisible(false);
        getProduct();
      }
    } catch (error) {
      console.error("Error submitting rating and review:", error);
    }
  };
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? "filled" : ""}`}
          onClick={() => handleRatingChange(i)}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };
  const showRating = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= ratingValue ? "filled" : ""}`}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6> Rating: {showRating(averageRating)}</h6>

          <h6>
            Price :
            {product?.price?.toLocaleString("en-PK", {
              style: "currency",
              currency: "PKR",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
            className={`btn btn-dark ms-1 ${
              product.quantity > 0 ? "" : "disabled"
            }`}
            onClick={() => {
              if (product.quantity > 0) {
                setCart([...cart, product]);
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product])
                );
                toast.success("Item Added to Cart");
              }
            }}
            disabled={product.quantity <= 0}
          >
            {product.quantity > 0 ? "ADD TO CART" : "Out of Stock"}
          </button>
        </div>
      </div>
      <hr />
      {/* Review and rating */}
      <button
        className="btn btn-primary ms-2"
        onClick={() => {
          setVisible(true);
        }}
      >
        Write A Review
      </button>
      <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="rating-container">
            <p>Rate this product:</p>
            {renderStars()}
          </div>

          <div className="mb-3">
            <textarea
              type="text"
              className="form-control"
              placeholder="Enter Review"
              value={massege}
              onChange={(e) => setMassege(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </Modal>{" "}
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h3>Reviews</h3>
            <div className="list-group">
              {reviews.length === 0 ? (
                <p className="list-group-item">Be the first to Review!</p>
              ) : (
                reviews.map((review, index) => (
                  <div className="list-group-item" key={index}>
                    <h6>{review.userName}</h6>
                    <div className="rating-container">
                      {showRating(review.rating)}
                    </div>
                    <p className="mb-1">{review.review}</p>
                    <small>
                      {new Date(review.createdAt).toISOString().split("T")[0]}
                    </small>
                  </div>
                ))
              )}
            </div>
            <div className="m-2 p-3">
              {console.log("reviews.length:", reviews.length)}
              {console.log("totalReviews:", totalReviews)}
              {reviews && reviews.length < totalReviews && (
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
      </div>
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
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
                    onClick={() => {
                      navigate(`/product/${p._id}`);
                    }}
                  >
                    More Details
                  </button>
                  {/* <button
                  className="btn btn-dark ms-1"x  
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
      </div>
    </Layout>
  );
};

export default ProductDetails;
