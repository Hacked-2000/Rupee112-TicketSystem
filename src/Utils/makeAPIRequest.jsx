import axios from "axios";
import { useSelector } from "react-redux";

const baseurl = import.meta.env.VITE_APP_REACT_APP_BASE_URL;

const axiosInstance = axios.create({
    
    withCredentials: true,
   
  });

export const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  }
};

const makeApiRequest = async (url, options, header, dispatch,token,globalloader) => {
  const localData = token;
  const { method, data } = options;
  const lowerCaseMethod = method.toLowerCase();
  console.log(header)
  const headers = {
    "Content-Type":header,
    Authorization: localData && `Bearer ${localData}`,
  };

  const finalUrl = url;


  try {
    if(globalloader){
      dispatch({ type: "auth/loadingStart" });
    }
     // Dispatch global loading start
    const response = await axiosInstance({
      method: lowerCaseMethod,
      url: finalUrl,
      ...(data && { data }),
      headers,
    });
    // console.log(response)
    return response.data;
  } catch (error) {
    
    return error.response.data;
  } finally {
    if(globalloader){
      dispatch({ type: "auth/loadingEnd" }); 
    }
    // Dispatch global loading end
  }
};

export default makeApiRequest;
