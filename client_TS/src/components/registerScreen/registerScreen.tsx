import { useState } from 'react';
import DBService from '../../services/DBService';
import { useNavigate } from 'react-router-dom';
import { FormControl, TextField, Button, Select, MenuItem } from '@mui/material';
import './registerScreen.css';

function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({name:"",email:"", password:"", route:"0"});
  // function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    DBService.addUser(formData.name, formData.email, formData.password);
    navigate('/map', {state: { email: formData.email }});
  }

  return (
    <div className="registerScreen">
      <div className='registerFormBox'>
      <img className='backpackRegisterImg' src='backpack.png' alt='brown backpack open at the front showing a wilderness scene inside'/>
      <h1>TrailStops</h1>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
      <FormControl className='registerForm'>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          margin='normal'
          required
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          margin='normal'
          required
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          margin='normal'
          type='password'
          required
        />
        <Select
          value={formData.route}
          labelId="RouteSelect"
          id="route"
          onChange={(e) => setFormData({...formData, route: e.target.value})}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <MenuItem value="0">Select First Route</MenuItem>
          <MenuItem value="1">WHW</MenuItem>
          <MenuItem value="2" disabled sx={{ fontStyle: 'italic' }}>CDT-Unavailable</MenuItem>
          <MenuItem value="3" disabled sx={{ fontStyle: 'italic' }}>TMB-Unavailable</MenuItem>
        </Select>

        <Button variant="contained" type="submit">Register</Button>
      </FormControl>
      </form>
      </div>
    </div>
  )
}

export default RegisterScreen;