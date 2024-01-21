import { createContext } from "react";

export interface ExternalFile {
  /** file name as an identifier */
  name: string;

  /** file contents in base64 to be loaded to pixi */
  base64: string;
}

interface EditorContextType {
  /**
   * External resource files.
   */
  files: ExternalFile[];
  setFiles: (arg0: ExternalFile[]) => void;
}

const EditorContext = createContext<EditorContextType>(null!);
export default EditorContext;
