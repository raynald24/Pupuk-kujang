import { useSelector } from "react-redux";
function Welcome({ children }) {
  const {user} = useSelector((state)=> state.auth);
  return (
    <div className="p-5 text-2xl text-black bg-gray-200 font-semibold h-screen bg-linear-to-r">
      <h1 className="mb-4">Welcome to the dashboard, <strong>{user && user.name}</strong> </h1>
      {children} 
    </div>
  );
}

export default Welcome;