const API_URL = 'http://localhost:5000/api';

export const api = {
  async getData() {
    const res = await fetch(`${API_URL}/data`);
    return res.json();
  },

  async getCollection(key) {
    const res = await fetch(`${API_URL}/${key}`);
    return res.json();
  },

  async updateCollection(key, data) {
    const res = await fetch(`${API_URL}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateItem(key, item) {
    const res = await fetch(`${API_URL}/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async deleteItem(key, id) {
    const res = await fetch(`${API_URL}/${key}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
