import { RouterProvider } from "react-router-dom";
import router from "./router";

import { UploadProvider } from "./contexts/UploadContext";
import GlobalUploadProgress from "./components/common/GlobalUploadProgress";

function App() {
  return (
    <UploadProvider>
      <RouterProvider router={router} />
      <GlobalUploadProgress />
    </UploadProvider>
  );
}

export default App;
