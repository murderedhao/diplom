import { useNavigate } from 'react-router-dom'
import internalError from '../assets/error500.svg'
import styles from '../styles/Errors.module.css'

const InternalServerErrorPage = () => {
	const navigate = useNavigate()
	return (
		<>
			<div className={styles.background__error}>
				<div className='flex items-center justify-center min-h-screen p-4'>
					<div className='bg-[#FFFFFF] rounded-md border-[0.5px] border-[#B9B9B9] py-7 w-full max-w-[498px] mx-auto my-8'>
						<div className='flex flex-col items-center text-center'>
							<img
								className='max-w-full md:max-w-[390px px-2'
								src={internalError}
								alt='500'
							/>
							<h1 className='mt-6 text-2xl font-bold md:text-3xl font-openSans'>
								Ошибка сервера
							</h1>
							<div className='px-[40px] w-full'>
								<button
									className='mt-6 font-bold font-openSans text-[20px] w-full px-5 py-4 bg-[#007AFF] text-white rounded-md hover:bg-[#005bb5] transition-colors'
									onClick={() => navigate(-1)}
								>
									Вернуться
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default InternalServerErrorPage
