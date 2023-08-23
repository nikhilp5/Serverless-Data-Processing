import { useNavigate } from "react-router-dom";

const Startup = () => {
  const navigate = useNavigate();

  const routeRegister = () => {
    navigate("/register");
  };
  const routeLogin = () => {
    navigate("/login");
  };

  return (
    <div className="center">
      <button onClick={routeRegister}>Register</button>
      <button onClick={routeLogin}>Login</button>
    </div>
  );
};

export default Startup;
