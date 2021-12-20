import axios from "axios";
import { Toast } from "zarm";

const MODE = import.meta.env.MODE;

axios.defaults.baseURL =
  MODE == "development" ? "" : "http://api.chennick.wang";
axios.defaults.withCredentials = true;
axios.defaults.withCredentials = true;
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Authorization"] = `${
  localStorage.getItem("token") || null
}`;
axios.defaults.headers.get["Content-Type"] =
  "application/x-www-form-urlencoded";
axios.defaults.headers.post["Content-Type"] = "application/json";

// 响应拦截器
axios.interceptors.response.use((res) => {
  if (typeof res.data !== "object") {
    Toast.show("服务端异常！");
    return Promise.reject(res);
  }

  if (res.data.code !== 200) {
    if (res.data.msg) Toast.show(res.data.msg);

    if (res.data.code == 401) {
      window.location.href = "/login";
    }

    return Promise.reject(res.data);
  }

  return res.data;
});

export default axios;
