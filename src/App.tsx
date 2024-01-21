import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./map/MainPage";
import Editor from "./editor/Editor";
import { P5Editor } from "./editor2/P5Editor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor2" element={<P5Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
