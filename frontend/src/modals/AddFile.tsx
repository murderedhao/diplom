import { useRef, useState } from 'react'
import arrowButton from '../assets/buttonArrowModal.svg'
import closeModal from '../assets/closeModal.svg'
import fileButton from '../assets/fileButtonModal.svg'
import fileIcon from '../assets/fileIconModal.svg'
import { postFn } from '../service/api'

interface Props {
	isActive: boolean
	setIsActive: (v: boolean) => void
	onFileUploaded?: () => void
}

const AddFile = ({ isActive, setIsActive, onFileUploaded }: Props) => {
	const fileInput = useRef<HTMLInputElement>(null)
	const [file, setFile] = useState<File | null>(null)
	const [fileName, setFileName] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [uploadProgress, setUploadProgress] = useState<number>(0)
	const [isUploading, setIsUploading] = useState<boolean>(false)
	const [uploadStatus, setUploadStatus] = useState<
		'idle' | 'uploading' | 'success' | 'error'
	>('idle')

	if (!isActive) return null

	const resetFile = () => {
		setFile(null)
		setFileName(null)
		setUploadProgress(0)
		setUploadStatus('idle')
		setError(null)
		if (fileInput.current) {
			fileInput.current.value = ''
		}
	}

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) setIsActive(false)
	}

	const handleFileChange = (selectedFile: File) => {
		if (selectedFile.size > 20 * 1024 * 1024) {
			setError('Файл слишком большой. Максимальный размер: 20 МБ.')
			resetFile()
			return
		}

		setError(null)
		setFile(selectedFile)
		setFileName(selectedFile.name)
		setUploadStatus('idle')
		setUploadProgress(0)
	}

	const handleFileButtonClick = () => {
		fileInput.current?.click()
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		const droppedFile = e.dataTransfer.files[0]
		if (droppedFile) {
			handleFileChange(droppedFile)
		}
	}

	const handleUpload = async () => {
		if (!file) {
			setError('Сначала выберите файл')
			return
		}

		const token = localStorage.getItem('token')
		if (!token) {
			setError('Вы не авторизованы')
			setUploadStatus('error')
			return
		}

		const formData = new FormData()
		formData.append('file', file)

		setIsUploading(true)
		setUploadStatus('uploading')
		setUploadProgress(0)

		try {
			const response = await postFn('/files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: progressEvent => {
					if (!progressEvent.total) return
					const percent = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					)
					setUploadProgress(percent)
				},
			})

			if (response.status !== 200) {
				throw new Error(response.statusText || 'Ошибка при загрузке файла')
			}
			console.log('Файл успешно загружен:', response.data)

			setUploadStatus('success')
			setUploadProgress(100)
		} catch (err) {
			setUploadStatus('error')
			setError(
				err instanceof Error ? err.message : 'Ошибка соединения с сервером'
			)
		} finally {
			setIsUploading(false)

			onFileUploaded?.()
		}
	}

	const handleComplete = () => {
		setIsActive(false)
		resetFile()
	}

	return (
		<div
			className='fixed top-0 left-0 w-full h-full bg-[#1F1F1F]/30 z-[99998] flex justify-center items-center px-4 sm:px-[168px]'
			onClick={handleOverlayClick}
		>
			<div
				className='bg-white rounded-[12px] border border-[#B9B9B9] py-6 px-8 w-full max-w-[800px]'
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<div className='flex justify-end'>
					<button onClick={() => setIsActive(false)}>
						<img src={closeModal} alt='закрыть' />
					</button>
				</div>
				<div className='flex flex-col sm:flex-row items-center justify-between mt-4 gap-2 pr-[78px]'>
					<input
						type='file'
						ref={fileInput}
						className='hidden'
						onChange={e => {
							const f = e.target.files?.[0]
							if (f) handleFileChange(f)
						}}
					/>
					<button
						onClick={handleFileButtonClick}
						className='flex justify-center items-center bg-[#1A1A1A] text-white py-3 px-6 rounded-[8px] w-full hover:bg-[#333333] transition-colors'
					>
						<img src={fileButton} alt='' className='mr-2' />
						<p className='text-[14px] font-openSans font-semibold'>
							Выбрать файл
						</p>
						<img src={arrowButton} alt='->' className='ml-2' />
					</button>
					<span className='text-[#9FA6B2] text-[16px] font-openSans whitespace-nowrap sm:ml-4'>
						{fileName || 'Файл не выбран'}
					</span>
				</div>

				{error && (
					<p className='mt-2 text-sm text-center text-red-500'>{error}</p>
				)}
				{file && (
					<div className='mt-4'>
						<div className='w-full bg-gray-200 rounded-[10px] h-[48px] relative overflow-hidden'>
							<div
								className={`h-full flex items-center justify-between px-4 transition-all duration-300 ${
									uploadStatus === 'success'
										? 'bg-green-500'
										: uploadStatus === 'error'
										? 'bg-red-500'
										: 'bg-blue-500'
								}`}
								style={{
									width: `${uploadProgress}%`,
									minWidth: '48px',
								}}
							>
								<div className='flex items-center gap-2'>
									<img src={fileIcon} alt='file' className='w-5 h-5' />
									<span className='text-white text-sm truncate max-w-[200px]'>
										{file.name}
									</span>
								</div>
								{uploadStatus !== 'uploading' && (
									<button
										className='ml-2 text-lg text-white'
										onClick={resetFile}
									>
										×
									</button>
								)}
							</div>
						</div>
						<p className='text-sm text-[#9FA6B2] mt-1'>
							{uploadStatus === 'uploading'
								? `Загрузка: ${uploadProgress}%`
								: uploadStatus === 'success'
								? 'Загрузка завершена'
								: uploadStatus === 'error'
								? 'Ошибка загрузки'
								: 'Готово к отправке'}
						</p>
					</div>
				)}

				{uploadStatus === 'success' ? (
					<div className='mt-3'>
						<button
							onClick={handleComplete}
							className='w-full flex justify-center items-center p-4 gap-2 rounded-[15px] bg-green-500 hover:bg-green-600 transition-all'
						>
							<p className='text-white font-openSans text-[16px]'>Готово</p>
						</button>
					</div>
				) : (
					<div className='mt-3'>
						<button
							disabled={isUploading || !file}
							onClick={handleUpload}
							className={`${
								isUploading || !file
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-[#9FA6B2] hover:bg-[#7C8695]'
							} w-full flex justify-center items-center p-4 gap-2 rounded-[15px] transition-all`}
						>
							<p className='text-white font-openSans text-[16px]'>
								{isUploading ? 'Загрузка...' : 'Загрузить'}
							</p>
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default AddFile
