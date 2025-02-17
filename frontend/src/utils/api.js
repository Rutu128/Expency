import axios from "axios";
import { toast } from "react-toastify";
const url = import.meta.env.VITE_BACKEND_URL;

export const postApi = async (path, body) => {
  let response;

  await axios
    .post(url + path, {
      ...body,
      withCredentials: true,
    })
    .then((Response) => {
      response = Response;
    })
    .catch((err) => {
      console.error(err);
      toast.error(err.response.data.message);
      response = err;
    });

  return response;
};

export const getApi = async (path, parameters) => {
  axios.defaults.withCredentials = true;
  let response;
  await axios
    .get(url + path, {
      ...parameters,
      withCredentials: true,
    })
    .then((Response) => {
      response = Response;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.message);
      response = err;
    });
  return response;
};

export async function putApi(path, data, parameters = {}) {
  axios.defaults.withCredentials = true;
  let response;
  await axios
    .put(url + path, data, {
      ...parameters,
      withCredentials: true,
    })
    .then((Response) => {
      response = Response;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.message);
      response = err;
    });
  return response;
}

export async function deleteApi(path, parameters) {
  axios.defaults.withCredentials = true;
  let response; 
  await axios
    .delete(url + path, {
      ...parameters,
      withCredentials: true,
    })
    .then((Response) => {
      response = Response;
    })
    .catch((err) => {
      console.log(err);
      toast.error(err.response.data.message);
      response = err;
    });
  return response;
}
