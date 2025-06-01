import axios from 'axios';
import Swal from 'sweetalert2';
import { refreshToken } from './auth';
import { createPinia } from 'pinia';
import { useAppStore } from '@/stores/app';
import router from '@/router';

const baseUrl = window.__ENV__?.VITE_APP_BACKEND_URL;
const pinia = createPinia();
const store = useAppStore(pinia);

const api = axios.create({
  baseURL: `${baseUrl}/api`,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;

  return config;
});

let isRefreshing = false;
let failedQueue: (() => void)[] = [];

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        const data = {
          refresh_token: localStorage.getItem('refresh_token') ?? '',
        };        

        return refreshToken(data)
          .then(({ data: { refresh_token } }) => {
            localStorage.setItem('refresh_token', refresh_token);
            isRefreshing = false;

            // Mengulangi permintaan yang terjeda setelah token diperbarui
            if (failedQueue.length > 0) {
              const requests = failedQueue;
              failedQueue = [];

              requests.forEach((callback) => {
                callback();
              });
            }

            return api(error.config);
          })
          .catch(() => {
            isRefreshing = false;
          });
      } else {
        // Menunggu refresh token selesai, simpan permintaan yang gagal
        return new Promise((resolve) => {
          failedQueue.push(() => {
            resolve(api(error.config));
          });
        });
      }
    } else if (error.response.status === 403 || error.response.status === 429) {
      // logout()
      //   .then(() => {
      //   })
      //   .catch(() => {});
        store.addProfileGlobal(null);
        localStorage.removeItem('refresh_token');
        router.push('/');
      return new Promise((resolve, reject) => {
        reject(error);
      });
    } else if (error.response.status === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.errors[0],
        confirmButtonText: 'Ok',
        confirmButtonColor: '#007bff',
      });

      return Promise.reject(error);
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
);

export { api };
