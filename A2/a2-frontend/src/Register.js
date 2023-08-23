import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const allInitialValues = {
    name: "",
    password: "",
    email: "",
    location: "",
  };

  const [allValues, setAllValues] = useState(allInitialValues);
  const [allErrors, setAllErrors] = useState({});
  const [indicatorMessage, setIndicator] = useState("");

  const handleChange = (event) => {
    setAllValues({ ...allValues, [event.target.name]: event.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let currentErrors = validateInputs(allValues);
    setAllErrors(currentErrors);
    if (Object.keys(currentErrors).length === 0) {
      setIndicator("Registering...");
      axios
        .post("https://container-1-oz5xmfjb6q-nn.a.run.app/register", allValues)
        .then((result) => {
          setIndicator(result.data.message);
        })
        .catch((error) => {
          if (!error.response) {
            setIndicator("Network Error");
          } else {
            setIndicator(error.response.data.message);
          }
        });
    } else {
      setIndicator("Resolve errors");
    }
  };

  useEffect(() => {}, [allErrors]);
  const validateInputs = (currentValues) => {
    const errors = {};
    let letters = /^[a-zA-Z ]+$/; //[1] Stack Overflow,“Check if string contains only letters in javascript”,Stack Overflow. [Online]. Available: https://stackoverflow.com/questions/23476532/check-if-string-contains-only-letters-in-javascript. [Accessed: 05-Jul-2023].
    let email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //[2] RegExr,“email address validation”,RegExr. [Online]. Available: https://regexr.com/3e48o. [Accessed: 05-Jul-2023].
    let passloc = /^[ A-Za-z0-9_@./#&+-]*$/; //[3] Stack Overflow,“Regex to accept alphanumeric and some special character in Javascript?”,Stack Overflow. [Online]. Available: https://stackoverflow.com/. [Accessed: 05-Jul-2023].
    if (currentValues.name.length <= 0 || !letters.test(currentValues.name)) {
      errors.name = "Name is empty/not valid";
    }

    if (currentValues.email.length <= 0 || !email.test(currentValues.email)) {
      errors.email = "Email is empty/not valid";
    }
    if (
      currentValues.password.length <= 0 ||
      !passloc.test(currentValues.password)
    ) {
      errors.password = "Password is empty/not valid";
    }
    if (
      currentValues.location.length <= 0 ||
      !passloc.test(currentValues.location)
    ) {
      errors.location = "Location is empty/not valid";
    }
    return errors;
  };

  return (
    <div className="center">
      <p>{indicatorMessage}</p>
      <form onSubmit={handleSubmit}>
        <label> Name : </label>
        <input
          type="text"
          name="name"
          id="nameInput"
          placeholder="Enter name"
          value={allValues.name}
          onChange={handleChange}
        />
        <p>{allErrors.name}</p>
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
        <label>Location : </label>
        <input
          type="text"
          name="location"
          id="locationInput"
          placeholder="Enter location"
          value={allValues.location}
          onChange={handleChange}
        />
        <p>{allErrors.location}</p>
        <button type="submit">Submit</button>
      </form>
      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        Registered already?Go to Login
      </button>
    </div>
  );
};

export default Register;
