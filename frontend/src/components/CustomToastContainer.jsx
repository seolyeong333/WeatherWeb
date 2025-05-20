import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CustomToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

export default CustomToastContainer;