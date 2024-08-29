import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Resizer from 'react-image-file-resizer'
import { imageBufferToUrl } from '../utils/imageHandle'

const ImageInput = ({ handleImage, defaultImage=null, text='', size=1000, quality=80, compressFormat='JPEG' }) => {
  const [file, setFile] = useState(null)
  

  useEffect(() => {
    setFile({ data: defaultImage, url: imageBufferToUrl(defaultImage) })
  }, [])
  

  const updateFile = file => {
    setFile(file)
    if (file) {
      handleImage(file.data)
    } else {
      handleImage(null)
    }
  }

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      Resizer.imageFileResizer(
        file, // the file from input
        size, // max width
        size, // max height
        compressFormat, // compress format
        quality, // quality
        0, // rotation
        (uri) => {
          // This is your callback function where you handle the resized image uri
          updateFile({ data: uri, url: URL.createObjectURL(file) })
        },
        'base64' // output type
      );


    })
  }, [quality, size, compressFormat, updateFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    // maxSize: 1024 * 1000,
    onDrop
  })
  

  return (
    <div className='image-input'>
      { !(file && file.url) &&
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop image here</p> :
            <>
            { text === '' ?
              <p>Drag & drop image, or click to browse</p> :
              <p>{ text }</p>
            }
            </>
        }
        
      </div>
      }
      { (file && file.url) && 
      <div className='preview'>
        <div className='delete-image' onClick={ () => updateFile(null) }>&times;</div>
        <img src={file.url} alt='preview' />
      </div>
      }
    </div>
  )
}

export default ImageInput