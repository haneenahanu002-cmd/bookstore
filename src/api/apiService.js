import axiosInstance from "./axiosinstance";


const apiService = async (httpMethod,url,reqBody,reqHeader)=>{
    const reqConfig={
        method:httpMethod,
        url,
        data:reqBody,
        headers:reqHeader
    }
    try{
    const response= await axiosInstance(reqConfig)
    return response;
    }
    catch(err){
        throw err;
    }

};
export default apiService
