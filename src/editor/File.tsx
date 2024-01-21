import { useContext } from "react";
import EditorContext from "./EditorContext";

interface FileProps {
  name: string;
}

const ExternalFile: React.FC<FileProps> = ({ name }: FileProps) => {
  const { files, setFiles } = useContext(EditorContext);
  return (
    <div
      className="hover:text-red-700 hover:line-through transition-colors text-clip"
      onClick={() => {
        setFiles(files.filter((x) => x.name !== name));
      }}
    >
      {name}
    </div>
  );
};

export default ExternalFile;
