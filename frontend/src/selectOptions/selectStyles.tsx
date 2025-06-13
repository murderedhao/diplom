import { StylesConfig } from 'react-select'

type OptionType = { value: string; label: string }

export const customStyles: StylesConfig<OptionType> = {
	control: provided => ({
		...provided,
		borderRadius: '8px',
		borderColor: '#C4C4C4',
		padding: '5px 10px',
		boxShadow: 'none',
		'&:hover': { borderColor: '#A0A0A0' },
	}),
	menu: provided => ({
		...provided,
		borderRadius: '8px',
		border: '0.5px solid #C4C4C4',
		overflow: 'hidden',
	}),
	option: (provided, state) => ({
		...provided,
		padding: '10px',
		backgroundColor: state.isSelected ? '#F5F6FA' : '#FFFFFF',
		color: '#000',
		'&:hover': { backgroundColor: '#E8E8E8' },
	}),
	indicatorsContainer: provided => ({
		...provided,
		color: '#000',
	}),
	dropdownIndicator: provided => ({
		...provided,
		padding: '0 8px',
		color: '#000',
		'&:hover': { color: '#555' },
	}),
	indicatorSeparator: () => ({
		display: 'none',
	}),
}
