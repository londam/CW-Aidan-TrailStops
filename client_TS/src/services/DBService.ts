import { SettingsData } from '../types/settingsData';
import { UserMarker } from '../types/userMarker';

async function getMarkers(user_id: string, trail_id: string) {
  try {
    const response: Response = await fetch(
      `http://localhost:3001/mapMarkers?user_id=${user_id}&trail_id=${trail_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    const data: string = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching markers:', error);
  }
}

async function addMarker(marker: UserMarker, updatedMarkers: UserMarker[]) {
  try {
    const response = await fetch('http://localhost:3001/mapMarkers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        marker: marker,
        updatedMarkers: updatedMarkers,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error adding marker:', error);
  }
}

async function updateAllMarkers(markers: { [key: string]: UserMarker }) {
  try {
    const response = await fetch('http://localhost:3001/updateAllMarkers', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ markers: markers }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error updating markers:', error);
  }
}

async function registerUser(name: string, email: string, password: string) {
  try {
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error registering user:', error.message);
    throw error;
  }
}

async function loginUser(email: string, password: string) {
  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error logging in user:', error);
  }
}

async function getUser(email: string) {
  try {
    const response = await fetch(`http://localhost:3001/user?email=${email}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching user:', error);
  }
}

async function getAccommodation(email: string, markerId: string) {
  try {
    const response = await fetch(
      `http://localhost:3001/accommodation?user_id=${email}&markerId=${markerId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching accommodation:', error);
  }
}

async function addAccommodation(
  email: string,
  hotel: string,
  markerId: string
) {
  try {
    const response = await fetch('http://localhost:3001/accommodation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        user_id: email,
        hotel: hotel,
        markerId: markerId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error adding accommodation:', error);
  }
}

async function removeMarker(userId: string, markerId: string) {
  try {
    const response = await fetch('http://localhost:3001/mapMarkers', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ user_id: userId, _id: markerId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error removing marker:', error);
  }
}

const DBService = {
  getMarkers,
  addMarker,
  updateAllMarkers,
  registerUser,
  loginUser,
  getUser,
  getAccommodation,
  addAccommodation,
  removeMarker,
};

export default DBService;
