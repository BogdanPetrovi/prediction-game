import axios from "axios";

export default axios.create({
  baseURL: 'https://api.countersite.gg',
  withCredentials: true
});
