import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layouts/UserMenu";
import Layout from "../../components/Layouts/Layout";

import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/orders");
      setOrders(data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    products.forEach((p) => {
      totalPrice += p.price;
    });
    return totalPrice;
  };
  return (
    <Layout title={"Your Orders"}>
      <div className="container-flui p-3 m-3 dashboard">
        {loading ? ( // Conditionally render loading indicator
          <h4 className="text-center">Loading...</h4>
        ) : (
          <>
            <div className="row">
              <div className="col-md-3">
                <UserMenu />
              </div>
              <div className="col-md-9">
                <h1 className="text-center">All Orders</h1>
                {orders?.map((o, i) => {
                  return (
                    <div className="border shadow">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className=" border " scope="col">
                              #
                            </th>
                            <th className=" border " scope="col">
                              Status
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
                            <td className=" border ">{i + 1}</td>
                            <td className=" border ">{o?.status}</td>
                            <td className=" border ">{o?.buyer?.name}</td>
                            <td className=" border ">
                              {moment(o?.createdAt).fromNow()}
                            </td>
                            <td className=" border ">
                              {o?.payment.success ? "Success" : "Failed"}
                            </td>
                            <td className=" border ">
                              {calculateTotalPrice(o?.products)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="container">
                        {o?.products?.map((p, i) => (
                          <div
                            className="row mb-2 p-3 card flex-row"
                            key={p._id}
                          >
                            <div className="col-md-4">
                              <img
                                src={`/product-photo/${p._id}`}
                                className="card-img-top"
                                alt={p.name}
                                width="100px"
                                height={"100px"}
                              />
                            </div>
                            <div className="col-md-8">
                              <p>{p.name}</p>
                              <p>{p.description.substring(0, 30)}</p>
                              <p>
                                {" "}
                                {p.price.toLocaleString("en-PK", {
                                  style: "currency",
                                  currency: "PKR",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
