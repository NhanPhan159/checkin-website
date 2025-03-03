import {useSearchParams } from "react-router-dom";

const User = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return ( 
    <>
      <p>{searchParams.get("name")}</p>
      <p>{searchParams.get("email")}</p>
    </>

   );
}
 
export default User;