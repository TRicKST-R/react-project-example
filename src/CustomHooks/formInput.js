import { useState } from 'react'

export const useFormInput = initVal => {
	const [value, setValue] = useState(initVal)

	const handleChange = e => setValue(e.target.value)

	return { value, onChange: handleChange }
}
