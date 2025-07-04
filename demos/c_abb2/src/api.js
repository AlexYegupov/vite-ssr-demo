import { API_URL } from './config'

export async function fetchApi(url, options={}) {
  const fullUrl = API_URL + url;
  return await fetch(fullUrl, options);
}

export default fetchApi;
