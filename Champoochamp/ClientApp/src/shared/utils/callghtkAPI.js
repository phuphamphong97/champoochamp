import axios from "axios";
import { port } from "../constants";

const callghtkAPI = (url, method = 'POST', data = null) => axios({
  url: `${port.ghtkPort}${url}`,
  method,
  data
}).catch(error => console.log(`ERROR_CALL_GHTK_API from ${port.ghtkPort}${url}: ${error.message}`));

export default callghtkAPI;