import axios from 'axios'
import { merge } from 'lodash'
import { AXIOS_DEFAULT_HEADERS } from './constants.js'

const returnData = response => {
  return response.data
}

const throwError = error => {
  let message = ''
  let err
  if(error.response) {
    error.response.data.errors.forEach(err => {
      message += err.detail + ' '
    })
    if(!message.length) {
      message = error.response.data.statusText
    }
    err = new Error(message.trim())
    err.response = error.response
    err.name = error.response.data.errors[0].code
  } else {
    err = new Error('No response')
    err.name = 'no_response'
  }
  throw err;
}

const request = (url, options) => {
  const optionsWithUrl = merge(options, { url: url })

  // Setting data to {} prevents Content-Type from being removed if no data is passed.
  // It's fixed but not released yet.
  // See https://github.com/mzabriskie/axios/issues/362 and https://github.com/mzabriskie/axios/pull/195
  const optionsWithData = merge({ data: {} }, optionsWithUrl)

  return axios(merge(AXIOS_DEFAULT_HEADERS, optionsWithData))
    .then(returnData)
    .catch(throwError)
}

export const get = (url, options) => {
  return request(url, merge({ method: "GET" }, options))
}