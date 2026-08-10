import "./loading.css";

const Loading = ({ message = "Loading..." }:{ message:string }) => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loading;