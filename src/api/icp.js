import request from '@/utils/request'

const api = {
  Login: '/icp/ptApi/login',
  queryAppUserPage: '/icp/ptApi/queryAppUserPage',
  recharge: '/icp/ptApi/recharge',
  queryGradePage: '/icp/ptApi/queryGradePage'
}

export function login (parameter) {
  return request({
    url: api.Login,
    method: 'post',
    data: parameter
  })
}

export function queryAppUserPage (parameter) {
  return request({
    url: api.queryAppUserPage,
    method: 'post',
    data: parameter
  })
}
export function queryGradePage (parameter) {
  return request({
    url: api.queryGradePage,
    method: 'post',
    data: parameter
  })
}
export function recharge (parameter) {
  return request({
    url: api.recharge,
    method: 'post',
    data: parameter
  })
}
