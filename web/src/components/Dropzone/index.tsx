import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './styles.css'
import { FiUpload } from 'react-icons/fi'

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {

  const [selectedFileUrl, setSelecterFileUrl] = useState('');

  const onDrop = useCallback(acceptedFiles => {

    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);

    setSelecterFileUrl(fileUrl);
    onFileUploaded(file);

  }, [onFileUploaded])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept:'image/*'
  })

  return (
    <div  className= "dropzone" style={selectedFileUrl? { height: 'auto'} : {}}  {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {
        selectedFileUrl ?
          <img src={selectedFileUrl} alt="Point thumbnail" /> :
          (
            isDragActive ?
              <p>Solte a imagem aqui...</p> :
              <p> 
                <FiUpload/>
                Clique para selecionar a imagem do estabelecimento ou arraste-a até aqui
              </p>
          )
      }
    </div>
  )
}

export default Dropzone;