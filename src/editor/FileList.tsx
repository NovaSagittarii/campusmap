import { useContext } from "react";
import EditorContext from "./EditorContext";
import { blobToBase64 } from "./util";
import ExternalFile from "./File";

/**
 * External file manager, allows uploading files and converts those into base64 data-urls.
 */
function FileList() {
  const { files, setFiles } = useContext(EditorContext);
  return (
    <div className="flex flex-col bg-blue-300 rounded-md w-48 p-4 gap-4">
      <input
        className="bg-white/20 p-4 rounded-sm"
        type="file"
        onChange={async (event) => {
          const uploadedFiles = event.target.files;
          if (!uploadedFiles) return;
          for (const file of uploadedFiles) {
            const { name } = file;
            const base64 = (await blobToBase64(file)) as string;
            setFiles([
              ...files,
              {
                name,
                base64,
              },
            ]);
          }
        }}
      ></input>
      <div className="bg-white/20 p-4 rounded-sm">
        {files.map((file, index) => (
          <ExternalFile name={file.name} key={index} />
        ))}
      </div>
    </div>
  );
}

export default FileList;
