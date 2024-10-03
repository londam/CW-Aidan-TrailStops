import { useState } from "react";
import DBService from "../../services/DBService";
import { useNavigate } from "react-router-dom";
import { FormControl, TextField, Button, Select, MenuItem } from "@mui/material";
import "./registerScreen.css";

interface FormData {
  name: string;
  email: string;
  password: string;
  route: string;
}

function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    route: "0",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(""); // To track password errors

  const MIN_PASSWORD_LENGTH = 8; // Define the minimum password length

  // Handle password change and validate its length
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });

    // Check password length
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    } else {
      setPasswordError(""); // Clear error if the password is valid
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    // Check if there's a password error before proceeding
    if (passwordError) {
      setErrorMessage("Please fix the errors before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Get register service
      const response = await DBService.registerUser(
        formData.name,
        formData.email,
        formData.password
      );

      // If registration goes through, store token and go to map
      if (response) {
        localStorage.setItem("authToken", response.token);
        navigate("/map", { state: { email: formData.email } });
      } else {
        setErrorMessage("Registration failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registerScreen">
      <div className="registerFormBox">
        <img
          className="backpackRegisterImg"
          src="backpack.png"
          alt="brown backpack open at the front showing a wilderness scene inside"
        />
        <h1>TrailStops</h1>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <FormControl className="registerForm">
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              value={formData.password}
              onChange={handlePasswordChange} // Validate password length on change
              margin="normal"
              type="password"
              error={!!passwordError} // Show red outline if there's an error
              helperText={passwordError} // Display password error message
              required
            />
            <Select
              value={formData.route}
              labelId="RouteSelect"
              id="route"
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <MenuItem value="0">Select First Route</MenuItem>
              <MenuItem value="1">WHW</MenuItem>
              <MenuItem value="2" disabled sx={{ fontStyle: "italic" }}>
                CDT - Coming Soon...
              </MenuItem>
              <MenuItem value="3" disabled sx={{ fontStyle: "italic" }}>
                TMB - Unavailable
              </MenuItem>
            </Select>

            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting || !!passwordError} // Disable button if there's a password error
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </FormControl>
        </form>
      </div>
    </div>
  );
}

export default RegisterScreen;
