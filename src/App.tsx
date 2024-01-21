import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./map/MainPage";
import Editor from "./editor/Editor";
import { P5Editor } from "./editor2/P5Editor";
import { P5EditorGraph } from "./editor2/P5EditorGraph";

function App() {
  return (
    <MainPage />
  );
}

export default App;
