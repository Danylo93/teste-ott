import axios from 'axios';

// Crie uma instância do Axios com a base URL desejada
export const api = axios.create({
  baseURL: 'http://localhost:3333', // Sua base URL aqui
});