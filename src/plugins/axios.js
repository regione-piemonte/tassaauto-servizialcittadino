import axios from 'axios'
import { API_URL } from '@/common/config'

const axiosPublicConfig = { baseURL: API_URL }

const axiosPublicInstance = axios.create(axiosPublicConfig)

export { axiosPublicInstance }
