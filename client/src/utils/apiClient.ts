import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:31577/api';

export const apiClient = api(aspida(axios.create({ withCredentials: true, baseURL })));
