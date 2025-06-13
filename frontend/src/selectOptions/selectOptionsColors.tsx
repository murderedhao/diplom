export const operatorColors: Record<string, string> = {
	Рудакова: 'bg-[#00B69B] bg-opacity-20 text-[#00B69B]',
	Дашко: 'bg-[#6226EF] bg-opacity-20 text-[#6226EF]',
	Королева: 'bg-[#EF3826] bg-opacity-20 text-[#EF3826]',
	Ильина: 'bg-[#FFA756] bg-opacity-20 text-[#FFA756]',
	Радько: 'bg-[#BA29FF] bg-opacity-20 text-[#BA29FF]',
}
export const getOperatorColorClass = (operatorName: string): string => {
	return operatorColors[operatorName]
}
