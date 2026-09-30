import { useEffect, useId, useMemo, useState } from 'react'
import { UPLOAD_LIMITS } from '../../../lib/constants'
import Button from '../button/button'
import Alert from '../alert/alert'
import Icon from '../icon/icon'

function validateFiles(files, maxFiles, maxSizeMB) {
  if (files.length > maxFiles) return `Puedes subir como máximo ${maxFiles} fotos a la vez`
  const notImage = files.find((file) => !file.type.startsWith('image/'))
  if (notImage) return `"${notImage.name}" no es una imagen`
  const tooBig = files.find((file) => file.size > maxSizeMB * 1024 * 1024)
  if (tooBig) return `"${tooBig.name}" supera los ${maxSizeMB} MB`
  return null
}

// Selector de imagenes con validacion
function FileUploader({
  onUpload,
  onUploaded,
  label = 'Añadir fotos',
  maxFiles = UPLOAD_LIMITS.maxFiles,
  maxSizeMB = UPLOAD_LIMITS.maxSizeMB,
}) {
  const inputId = useId()
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files])
  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews])

  const handleChange = (event) => {
    const selected = Array.from(event.target.files || [])
    event.target.value = ''
    const validationError = validateFiles(selected, maxFiles, maxSizeMB)
    setError(validationError ? { message: validationError } : null)
    setFiles(validationError ? [] : selected)
  }

  const handleUpload = async () => {
    setUploading(true)
    setError(null)
    try {
      const result = await onUpload(files)
      setFiles([])
      onUploaded?.(result)
    } catch (err) {
      setError(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center gap-1 rounded-card border-2 border-dashed border-line-strong bg-surface-muted px-4 py-8 text-center transition-colors hover:border-primary"
      >
        <Icon name="add_a_photo" className="text-3xl text-primary" />
        <span className="text-sm font-bold text-primary-strong">{label}</span>
        <span className="text-xs text-fg-muted">
          Hasta {maxFiles} imágenes de {maxSizeMB} MB como máximo
        </span>
        <input id={inputId} type="file" accept="image/*" multiple className="sr-only" onChange={handleChange} />
      </label>

      {previews.length > 0 && (
        <>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {previews.map(({ file, url }) => (
              <li key={url} className="aspect-square overflow-hidden rounded-input bg-surface-muted">
                <img src={url} alt={file.name} className="size-full object-cover" />
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Button onClick={handleUpload} loading={uploading}>
              Subir {files.length} {files.length === 1 ? 'foto' : 'fotos'}
            </Button>
            <Button variant="ghost" onClick={() => setFiles([])} disabled={uploading}>
              Descartar
            </Button>
          </div>
        </>
      )}

      {error && <Alert error={error} />}
    </div>
  )
}

export default FileUploader
