import axios from 'axios';
import { BaseURL } from '../Resources/BaseURL';


export default axios.create({baseURL : BaseURL});

export const axiosPrivate = axios.create({
    baseURL : BaseURL,
    headers:{"Content-type":"application/json"},
    withCredentials: true
})