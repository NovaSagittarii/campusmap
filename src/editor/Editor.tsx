import { useRef, useState } from "react";
import EditorContext, { ExternalFile } from "./EditorContext";
import FileList from "./FileList";
import { Container, Stage } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useEditorState } from "./EditorState";
import BuildingWrapper from "./BuildingWrapper";

function Editor() {
  const [files, setFiles] = useState<ExternalFile[]>([
    { name: "test", base64: "" },
  ]);

  const buildings = useEditorState((state) => state.buildings);
  const cameraRef = useRef<PIXI.Container>(null);
  const cameraX = useRef(0);
  const cameraY = useRef(0);

  return (
    <div className="w-screen h-screen">
      <EditorContext.Provider value={{ files, setFiles }}>
        <Stage
          className="m-auto w-full h-full object-contain block"
          onMouseMove={(event) => {
            if (event.buttons) {
              cameraRef.current?.position.set(
                (cameraX.current += event.movementX),
                (cameraY.current += event.movementY),
              );
            }
          }}
        >
          <Container ref={cameraRef}>
            {buildings.map((building, index) => (
              <BuildingWrapper building={building} key={index} />
            ))}
          </Container>
        </Stage>
        <FileList />
      </EditorContext.Provider>
    </div>
  );
}
export default Editor;
