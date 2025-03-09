import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    validatePasswordStrength(formData.password);
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateForm(e.target.name, e.target.value);
  };

  const validateForm = (field, value) => {
    let newErrors = { ...errors };

    if (field === "username") {
      if (value.length < 8) {
        newErrors.username = "Username must be at least 8 characters";
      } else {
        delete newErrors.username;
      }
    }

    if (field === "email") {
      if (!value.includes("@")) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
      if (!passwordRegex.test(value)) {
        newErrors.password = "Password must contain uppercase, lowercase, and a special character";
      } else {
        delete newErrors.password;
      }
    }

    if (field === "confirmPassword") {
      if (value !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const validatePasswordStrength = (password) => {
    if (password.length >= 10) {
      setPasswordStrength("Strong");
    } else if (password.length >= 6) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError("");

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setAuthError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setAuthError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="fb">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {authError && <p className="error-message">{authError}</p>}

        <label>
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>

        <label>
          Password
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </label>

        
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>

        <p>
          Password Strength: <strong className={passwordStrength.toLowerCase()}>{passwordStrength}</strong>
        </p>

        <label>
          Confirm Password
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </label>

        
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="showConfirmPassword"
            checked={showConfirmPassword}
            onChange={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          <label htmlFor="showConfirmPassword">Show Confirm Password</label>
        </div>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="signin">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
      </div>
      
    </div>
  );
};

export default Signup;