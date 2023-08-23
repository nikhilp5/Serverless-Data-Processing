import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const allInitialValues = {
    email: "",
    password: "",
  };

  const [allValues, setAllValues] = useState(allInitialValues);
  const [allErrors, setAllErrors] = useState({});
  const [indicatorMessage, setIndicator] = useState("");

  const handleChange = (event) => {
    setAllValues({ ...allValues, [event.target.name]: event.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    setIndicator("Logging in...");
    event.preventDefault();
    let currentErrors = validateInputs(allValues);
    setAllErrors(currentErrors);
    if (Object.keys(currentErrors).length === 0) {
      axios
        .post("https://container-2-oz5xmfjb6q-nn.a.run.app/login", allValues)
        .then((result) => {
          navigate("/homepage", { state: result.data });
        })
        .catch((error) => {
          if (!error.response) {
            setIndicator("Network Error");
          } else {
            setIndicator(error.response.data.message);
          }
        });
    }
  };
  useEffect(() => {}, [allErrors]);
  const validateInputs = (currentValues) => {
    const errors = {};
    let email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //[2] RegExr,“email address validation”,RegExr. [Online]. Available: https://regexr.com/3e48o. [Accessed: 05-Jul-2023].
    let password = /^[ A-Za-z0-9_@./#&+-]*$/; //[3] Stack Overflow,“Regex to accept alphanumeric and some special character in Javascript?”,Stack Overflow. [Online]. Available: https://stackoverflow.com/. [Accessed: 05-Jul-2023].
    if (currentValues.email.length <= 0 || !email.test(currentValues.email)) {
      errors.email = "Email is empty/not valid";
    }
    if (
      currentValues.password.length <= 0 ||
      !password.test(currentValues.password)
    ) {
      errors.password = "Password is empty/not valid";
    }
    return errors;
  };
  return (
    <div className="center">
      <p>{indicatorMessage}</p>
      <form onSubmit={handleSubmit}>
        <label>Email : </label>
        <input
          type="email"
          name="email"
          id="emailInput"
          placeholder="Enter Email"
          value={allValues.email}
          onChange={handleChange}
        />
        <p>{allErrors.email}</p>
        <label>Password : </label>
        <input
          type="password"
          name="password"
          id="passwordInput"
          placeholder="Enter password"
          value={allValues.password}
          onChange={handleChange}
        />
        <p>{allErrors.password}</p>
        <button type="submit">Login</button>
      </form>
      <button
        onClick={() => {
          navigate("/register");
        }}
      >
        Not registered yet?Go to Register
      </button>
    </div>
  );
};

export default Login;
