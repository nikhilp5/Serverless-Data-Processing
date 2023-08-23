import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { state } = useLocation();
  const currentUserDetails = state;
  const [users, setUsers] = useState([]);
  const [indicatorMessage, setIndicator] = useState("");

  useEffect(() => {
    console.log(currentUserDetails);
    axios
      .post(
        "https://container-3-oz5xmfjb6q-nn.a.run.app/details",
        currentUserDetails
      )
      .then((response) => {
        console.log(response);
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
        setIndicator(error.response.data.message);
      });
  }, [currentUserDetails]);

  const navigate = useNavigate();

  const handleLogout = (id) => {
    axios
      .post("https://container-3-oz5xmfjb6q-nn.a.run.app/logout", { id })
      .then((result) => {
        navigate("/");
      })
      .catch((error) => {
        if (!error.response) {
          setIndicator("Network Error");
        } else {
          setIndicator(error.config.data.message);
        }
      });
  };

  return (
    <div className="center">
      <p>{indicatorMessage}</p>
      <h1>Hi, {currentUserDetails.name} you are logged in</h1>
      <button onClick={() => handleLogout(currentUserDetails.id)} type="submit">
        Logout
      </button>

      {users.length > 0 ? (
        <>
          <h1>Here are other users who are online</h1>
          <ul style={{ border: "5px solid black" }}>
            {users.map((user) => (
              <li
                style={{ fontSize: "20px", right: "20px !important" }}
                key={user.userId}
              >
                {user.userData.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <h2>No Users Online</h2>
      )}
    </div>
  );
};

export default Login;
