import Loader from "./Loader";

const PulseBackdrop = () => {
  return (
    <div style={{opacity: 1, "--bs-backdrop-bg": "#00000080", zIndex: "1060"}} className="modal-backdrop fade show d-flex justify-content-center align-items-center">
      <Loader loaderColor="white" />
    </div>
  );
};

export default PulseBackdrop;
