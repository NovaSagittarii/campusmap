import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./map/MainPage";
import Editor from "./editor/Editor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
