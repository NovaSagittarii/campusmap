import { useState } from "react";
import EditorContext, { ExternalFile } from "./EditorContext";
import FileList from "./FileList";

function Editor() {
  const [files, setFiles] = useState<ExternalFile[]>([
    { name: "test", base64: "" },
  ]);

  return (
    <EditorContext.Provider value={{ files, setFiles }}>
      <div>editor</div>
      <FileList />
    </EditorContext.Provider>
  );
}

export default Editor;
