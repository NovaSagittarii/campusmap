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
    <div className="fixed left-0 top-0 flex flex-col bg-blue-300 rounded-md w-48 p-4 gap-4 max-h-14 hover:max-h-full overflow-hidden transition-all">
      {"External files"}
      <input
        className="bg-white/20 p-4 rounded-sm"
        type="file"
        onChange={async (event) => {
          const uploadedFiles = event.target.files;
          if (!uploadedFiles) return;
          for (const file of uploadedFiles) {
            const { name } = file;
            const base64 = (await blobToBase64(file)) as string;
            setFiles([...files, { name, base64, }]); // prettier-ignore
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
