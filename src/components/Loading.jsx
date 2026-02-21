import { Oval } from 'react-loader-spinner';

export default function Loading({ isLoading = false }) {
  return (
    <Oval
      visible={isLoading}
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="oval-loading"
      wrapperStyle={{ zIndex: 2000, inset: 0 }}
      wrapperClass="position-fixed bg-white bg-opacity-50 justify-content-center align-items-center"
    />
  );
}
