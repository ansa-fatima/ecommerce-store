const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Products API
export const productsAPI = {
  getAll: () => apiCall('/products'),
  create: (product: any) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id: string, product: any) => apiCall('/products', {
    method: 'PUT',
    body: JSON.stringify({ id, ...product }),
  }),
  delete: (id: string) => apiCall(`/products?id=${id}`, {
    method: 'DELETE',
  }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiCall('/categories'),
  create: (category: any) => apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  update: (id: string, category: any) => apiCall('/categories', {
    method: 'PUT',
    body: JSON.stringify({ id, ...category }),
  }),
  delete: (id: string) => apiCall(`/categories?id=${id}`, {
    method: 'DELETE',
  }),
};











