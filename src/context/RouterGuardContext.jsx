import React, { createContext, useState , useEffect} from 'react'



export const routerContext = createContext()

function RouterGuardContext({children}) {
    const [ role,setRole]=useState('')
    const [authorizedUser,setAuthorizedUser]=useState(false)
    useEffect(()=>{
        if(sessionStorage.getItem("user")&&sessionStorage.getItem("token")){
            const user=JSON.parse(sessionStorage.getItem("user"))
            setRole(user.role)
            setAuthorizedUser(true)
        }
    },[])
  return (
    <>
    <routerContext.Provider value={{ role, setRole, authorizedUser, setAuthorizedUser }}>
        {children}
    </routerContext.Provider>
    </>
  )
}

export default RouterGuardContext