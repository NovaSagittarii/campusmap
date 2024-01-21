import { useState } from "react";
import EditorContext, { ExternalFile } from "./EditorContext";
import FileList from "./FileList";
import { Stage } from "@pixi/react";

function Editor() {
  const [files, setFiles] = useState<ExternalFile[]>([
    { name: "test", base64: "" },
  ]);

  return (
    <div className="w-screen h-screen">
      <EditorContext.Provider value={{ files, setFiles }}>
        <Stage className="m-auto w-full h-full object-contain block"></Stage>
        <FileList />
      </EditorContext.Provider>
    </div>
  );
}

export default Editor;
