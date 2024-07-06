import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

// ... (imports and other code)

const AdminOrders = () => {
  // ... (useState and other declarations)
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [orderId, setOrderId] = useState("");
  const [results, setResults] = useState([]); // Store search results here
  const [searchResults, setSearchResults] = useState([]); // Store search results here
  const navigate = useNavigate();
  // ... (search and handleChange functions)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/search-Order/${orderId}`);
      console.log("data-handleSubmit:", data);
      setSearchResults([data]);
      console.log("searchResults-handleSubmit:", searchResults);
      // navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("results-effect:", searchResults); // This will show the updated state
  }, [searchResults]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/all-orders");
      console.log("data-getOrders:", data);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    products.forEach((p) => {
      totalPrice += p.price;
    });
    return totalPrice;
  };
  // ... (calculateTotalPrice function)

  const renderOrderDetails = (order, index) => {
    return (
      <div>
        <table className="table border">
          <thead>
            <tr>
              <th className=" border " scope="col">
                #
              </th>
              <th className=" border " scope="col">
                Status
              </th>
              <th className=" border " scope="col">
                Order-ID
              </th>
              <th className=" border" scope="col">
                Buyer
              </th>
              <th className=" border" scope="col">
                Date
              </th>
              <th className=" border" scope="col">
                Payment
              </th>
              <th className=" border" scope="col">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className=" border ">{index + 1}</td>
              <td className=" border ">
                <Select
                  bordered={false}
                  onChange={(value) => handleChange(order._id, value)}
                  defaultValue={order?.status}
                >
                  {status.map((s, i) => (
                    <Option key={i} value={s}>
                      {s}
                    </Option>
                  ))}
                </Select>
              </td>
              <td className=" border ">{order?._id}</td>
              <td className=" border ">{order?.buyer?.name}</td>
              <td className=" border ">{moment(order?.createdAt).fromNow()}</td>
              <td className=" border ">
                {order?.payment.success ? "Success" : "Failed"}
              </td>
              <td className=" border ">
                {calculateTotalPrice(order?.products)}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="container mb-5">
          {order?.products?.map((p, i) => (
            <div className="row mb-2 p-3 card flex-row" key={p._id}>
              <div className="col-md-4">
                <img
                  src={`/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  width="100px"
                  height="100px"
                />
              </div>
              <div className="col-md-8">
                <p>{p.name}</p>
                <p>{p.description.substring(0, 30)}</p>
                <p>Price: {p.price}</p>
              </div>
            </div>
          ))}
        </div>
        <h1 className="ms-5">
          ----------------------------------------------------------
        </h1>
      </div>
    );
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-8">
          <h1 className="text-center">Search Order</h1>
          <div className="col-md-8">
            <form
              className="d-flex search-form"
              role="search"
              onSubmit={handleSubmit}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)} // Fix syntax here
              />
              <button className="btn searchBtn" type="submit">
                Search
              </button>
            </form>
            <div>
              {searchResults.length > 0 ? (
                <div>
                  <h5>Search Result</h5>
                  {searchResults.map((order, index) => (
                    <div className="border " key={order._id}>
                      {renderOrderDetails(order, index)}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No results found</p>
              )}
            </div>
          </div>
          <h1 className="text-center">All Orders</h1>
          {orders?.map((o, i) => (
            <div className="border shadow" key={o._id}>
              {renderOrderDetails(o, i)}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
