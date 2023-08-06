import axios from 'axios';
// 跨域认证信息 header 名
const xsrfHeaderName = 'token';
axios.defaults.timeout = 50000;
axios.defaults.withCredentials = true;

/**
 * axios请求
 * @param url 请求地址
 * @param method http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params, config) {
   let token = JSON.parse(localStorage.getItem("token"))
  if (config) {
    config.headers = {
      [xsrfHeaderName]: token
    };
  } else {
    config = {
      headers: {
        [xsrfHeaderName]: token
      },
    };
  }


  switch (method) {
    case 'get':
      return axios.get(url, { params, ...config });
    case 'post':
      return axios.post(url, params, config);
    default:
      return axios.get(url, { params, ...config });
  }
}



/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const { request, response } = interceptors;
  // 加载请求拦截器
  request.forEach(item => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = config => config;
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error);
    }
    axios.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    );
  });
  // 加载响应拦截器
  response.forEach(item => {
    let { onFulfilled, onRejected } = item;
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = response => response;
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error);
    }
    axios.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    );
  });
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {};
  if (!url || url === '' || typeof url !== 'string') {
    return params;
  }
  const paramsStr = url.split('?')[1];
  if (!paramsStr) {
    return params;
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ');
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1];
    params[paramsArr[i * 2]] = value === 'true' ? true : value === 'false' ? false : value;
  }
  return params;
}

export {
  request,
  loadInterceptors,
  parseUrlParams,
};
