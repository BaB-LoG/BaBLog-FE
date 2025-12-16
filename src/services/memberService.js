import apiClient from './apiClient';

export const signup = (payload) => apiClient.post('/members/signup', payload);

export const login = (payload) => apiClient.post('/members/login', payload);
