import { request } from './request';

export function addAddress(params) {
  return request({
    url: '/api/address',
    method: 'post',
    params
  })
}
export function editAddress(id,params) {
  return request({
    url: `/api/address/${id}`,
    method: 'put',
    params
  })
}
export function deleteAddress(id) {
  return request({
    url: `/api/address/${id}`,
    method: 'delete'
  })
}
export function getAddressList() {
  return request({
    url: '/api/address'
  })
}
export function getAddressDetail(id) {
  return request({
    url: `/api/address/${id}`
  })
}