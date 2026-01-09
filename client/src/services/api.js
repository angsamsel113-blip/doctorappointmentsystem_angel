const API_BASE_URL = 'http://localhost:5000';

async function request(path, options = {}, token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export const api = {
  register(body) {
    return request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) });
  },
  login(body) {
    return request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
  },
  getDoctors() {
    return request('/api/doctors');
  },
  createDoctor(body, token) {
    return request('/api/doctors', { method: 'POST', body: JSON.stringify(body) }, token);
  },
  getAppointments(token) {
    return request('/api/appointments', {}, token);
  },
  createAppointment(body, token) {
    return request('/api/appointments', { method: 'POST', body: JSON.stringify(body) }, token);
  },
  updateAppointment(id, body, token) {
    return request(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token);
  },
};


