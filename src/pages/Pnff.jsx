import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routerContext } from "../context/RouterGuardContext.jsx";

function Pnff() {
 const context = React.useContext(routerContext);
 
   const role = context?.role || "";
   const authorizedUser = context?.authorizedUser || false;
 
   const navigate = useNavigate();
 
   const backToHome = () => {
     if (role === "admin") {
       navigate("/admin-dashboard");
     } else {
       navigate("/");
     }
   };
 
   return (
     <div
       style={{ height: "60vh", marginTop: "50px" }}
       className="d-flex align-items-center justify-content-center flex-column"
     >
       <img
         src="https://img.magnific.com/free-vector/glitch-error-404-page_23-2148105404.jpg?semt=ais_hybrid&w=740&q=80"
         alt="404 Page Not Found"
         width={300}
       />
 
       <h5>Sorry, we couldn't find the page</h5>
 
       {authorizedUser ? (
         <button
           onClick={backToHome}
           className="btn btn-dark mt-4"
         >
           Back to Home
         </button>
       ) : (
         <Link to="/" className="btn btn-dark mt-4">
           Back to Home
         </Link>
       )}
     </div>
   );
 }
 
export default Pnff