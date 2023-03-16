import axios from 'axios'
import { API_URL, AUTH_API_URL, AUTH_AREA_URL } from '@/common/config'

const axiosPublicConfig = { baseURL: API_URL }
const axiosAuthApiConfig = { baseURL: AUTH_API_URL }
const axiosAuthAreaConfig = { baseURL: AUTH_AREA_URL }

const axiosPublicInstance = axios.create(axiosPublicConfig)
const axiosAuthApiInstance = axios.create(axiosAuthApiConfig)
const axiosAuthAreaInstance = axios.create(axiosAuthAreaConfig)

export { axiosPublicInstance, axiosAuthApiInstance, axiosAuthAreaInstance }
