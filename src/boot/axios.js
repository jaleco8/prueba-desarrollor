import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/test-data/'
})

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance
}

export { axiosInstance }
