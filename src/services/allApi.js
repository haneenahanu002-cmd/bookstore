import apiService from "../api/apiService";

//register api call
export const registerAPI= async (userData)=>{
    return await apiService('POST','/register',userData)

}
//login API call
export const loginAPI=async (userData)=>{
    return await apiService('POST','/login',userData)
}

export const googleloginAPI=async (userData)=>{
    return await apiService('POST','/google-login',userData)
}
export const userUpadateAPI = async (userId, userData) => {
  return await apiService(
    'PUT',
    `/user/edit/${userId}`,
    userData
  );
};
export const addBookAPI=async (bookDetails)=>{
    return await apiService('POST','/add-book',bookDetails)
}
//get homebooks api
export const getHomeBookAPI=async ()=>{
    return await apiService('GET','/home-books',{})
}

export const getAllBooksAPI = async () => {
  return await apiService("GET", "/all-books", {});
};
export const getMyBooksAPI = async () => {
  return await apiService("GET", "/my-books", {});
};
export const getSingleBookAPI = async (id) => {
  return await apiService("GET", `/single-book/${id}`, {});
};
export const removeBookAPI = async (id) => {
  return await apiService("DELETE", `/remove-book/${id}`, {});
};
export const paymentAPI = async (id) => {
  return await apiService("GET", `/make-payment/${id}`, {});
};
export const verifyPaymentAPI = async (reqBody) => {
  return await apiService("POST", "/verify-payment", reqBody);
};
//-------------ADMIN----------------
export const BooksAPI = async () => {
  return await apiService("GET", "/books", {});
};
// Approve a book
export const ApproveBookAPI = async (bookId) => {
  return await apiService("PATCH", `/books/${bookId}/approve`, {});


};
export const AllUsersAPI = async () => {
  return await apiService("GET", "/all-users", {});
};
export const getAbstractAPI = async (title) => {
  return await apiService("POST", "/books-ai", { title });
}
