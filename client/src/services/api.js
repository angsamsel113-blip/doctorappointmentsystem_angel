const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
  deleteAppointment(id, token) {
    return request(`/api/appointments/${id}`, { method: 'DELETE' }, token);
  },
  getDoctor(id) {
    return request(`/api/doctors/${id}`);
  },
  updateDoctor(id, body, token) {
    return request(`/api/doctors/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token);
  },
  deleteDoctor(id, token) {
    return request(`/api/doctors/${id}`, { method: 'DELETE' }, token);
  },
  getUsers(token) {
    return request('/api/users', {}, token);
  },
  getUser(id, token) {
    return request(`/api/users/${id}`, {}, token);
  },
  updateUser(id, body, token) {
    return request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }, token);
  },
  deleteUser(id, token) {
    return request(`/api/users/${id}`, { method: 'DELETE' }, token);
  },
  createPayment(body, token) {
    return request('/api/payments', { method: 'POST', body: JSON.stringify(body) }, token);
  },
  getPayments(token) {
    return request('/api/payments', {}, token);
  },
  getPayment(id, token) {
    return request(`/api/payments/${id}`, {}, token);
  },
  getPaymentByAppointment(appointmentId, token) {
    return request(`/api/payments/appointment/${appointmentId}`, {}, token);
  },
};


