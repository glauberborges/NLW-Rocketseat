import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './style.css'
import {FiUpload} from 'react-icons/fi'
import {divIcon} from "leaflet";

interface FileInterface {
    onFileUploaded: (file : File) => void
}

const Dropzone : React.FC<FileInterface> = (props) => {
    const [ selectFile, setSelectFile] = useState('');


    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        const  fileUrl = URL.createObjectURL(file);

        setSelectFile(fileUrl);

        props.onFileUploaded(file)

    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: 'image/*'
    })


    return (
        <>
            <div className='dropzone' {...getRootProps()}>

                <input {...getInputProps()}  accept='image/*'/>

                {selectFile
                    ? <img src={selectFile}/>
                    : (
                        <p > <FiUpload/>  Araste e solte seus arquivos aqui <br/> OU clique aqui paar adicionar sua imagem</p>
                    )
                }
            </div>
        </>
    )
}

export default Dropzone;