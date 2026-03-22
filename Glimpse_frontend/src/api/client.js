const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_ORIGIN = new URL(API_BASE_URL).origin;

const buildUrl = (path, searchParams) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
};

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: async (path, searchParams) => {
    const response = await fetch(buildUrl(path, searchParams));
    return parseResponse(response);
  },
  post: async (path, body, options = {}) => {
    const config = {
      method: 'POST',
      ...options,
    };

    if (body instanceof FormData) {
      config.body = body;
    } else {
      config.headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
      config.body = JSON.stringify(body);
    }

    const response = await fetch(buildUrl(path), config);
    return parseResponse(response);
  },
  patch: async (path, body) => {
    const response = await fetch(buildUrl(path), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },
  delete: async (path, searchParams) => {
    const response = await fetch(buildUrl(path, searchParams), {
      method: 'DELETE',
    });

    return parseResponse(response);
  },
};

export const urlFor = (image) => {
  const rawUrl = image?.asset?.url;

  if (!rawUrl) {
    return '';
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }

  if (rawUrl.startsWith('/')) {
    return `${API_ORIGIN}${rawUrl}`;
  }

  return `${API_ORIGIN}/${rawUrl}`;
};
