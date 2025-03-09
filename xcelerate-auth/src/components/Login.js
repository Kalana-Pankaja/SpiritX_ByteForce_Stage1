import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("username");
        if (loggedInUser) {
            navigate("/welcome");
        }
    }, [navigate]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                setLoading(false);

                if (response.ok) {
                    localStorage.setItem("username", formData.username);
                    navigate("/welcome"); 
                } else {
                    setErrors({ form: data.message || "Invalid username or password" });
                }
            } catch (error) {
                setLoading(false);
                setErrors({ form: "Something went wrong. Please try again." });
            }
        }
    };

    return (
        <div className="container">
            <form className="form-box" onSubmit={handleSubmit}>
                <h2>Login</h2>

                {errors.form && <p className="error-message">{errors.form}</p>}

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

                <label className="password-label">
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

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                
                <p className="signin">
                    Don't have an account? <Link to="/">Sign up here</Link>.
                </p>
            </form>
        </div>
    );
};

export default Login;