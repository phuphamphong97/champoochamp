import axios from "axios";
import { port } from "../constants";

const callAPI = (url, query = '', method = 'GET', data = null) => axios({
  url: `${port.apiPort}/api/${url}${query}`,
  method,
  data
}).catch(error => console.log(`ERROR_CALL_API from ${url}: ${error.message}`));

export default callAPI;