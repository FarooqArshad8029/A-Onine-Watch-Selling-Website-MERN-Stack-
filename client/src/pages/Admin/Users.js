import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [auth, setAuth] = useAuth();
  const [role, setRole] = useState([
    0,
    1,
  ]);
  const [changeRole, setChangeRole] = useState("");

  const getUsers = async () => {

    try {
      const { data } = await axios.get("/all-users");
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("user:", users);

  useEffect(() => {
    if (auth?.token) {
      getUsers();
    }
  }, [auth?.token]);

  // Move the console.log outside of getUsers function to see updated users
  console.log("users outside of getUsers:", users);
  const handleChange = async (userId, value) => {
    try {
      const { data } = await axios.put(`/user-role/${userId}`, {
        role: value,
      });
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Users</h1>
            <div className="border shadow">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">name</th>
                    <th scope="col">email</th>
                    <th scope="col">phone</th>
                    <th scope="col">address</th>
                    <th scope="col">role</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td>{u?.name}</td>
                      <td>{u?.email}</td>
                      <td>{u?.phone}</td>
                      <td>{u?.address}</td>
                      <td>
                      <Select
                          bordered={false}
                          onChange={(value) => handleChange(u._id, value)}
                          defaultValue={u?.role}
                        >
                          {role.map((r, i) => (
                            <Option key={i} value={r}>
                              {r}
                            </Option>
                          ))}
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
