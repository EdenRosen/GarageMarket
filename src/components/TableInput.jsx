import React, { useEffect, useState } from 'react'

const TableInput = ({ handleTable, defaultTable=[] }) => {
	const [table, setTable] = useState([])

	useEffect(() => {
		handleTable(defaultTable)
		setTable([...defaultTable,{key:'',value:''}])
	}, [])
	
	
	
	const handleChange = e => {
		const id = e.target.id.replace('table-input','')
		const place = id.split('-')
		const row = parseInt(place[0])
		const col = place[1]
		var newTable = [...table]
		newTable[row][col] = e.target.value
		
		if (newTable[table.length-1].key != null && newTable[table.length-1].key !== '') {
			newTable.push({key:'',value:''})
		} else {
			while (newTable.length >= 2 && (newTable[newTable.length-2].key === '' ||
				newTable[newTable.length-2].key == null)) {
				newTable.pop()
			}
		}
		const finalTable = newTable.filter(row => row.key !== '')
		handleTable(finalTable)
		setTable(newTable)
	}

	return (
		<div className='table-input'>
			{ table.map((row, index) => {
				// console.log(table);
				return (
					<div className='row' key={index}>
						<input
							id={`table-input${index}-key`}
							type='text'
							placeholder="Key"
							onChange={handleChange}
							// defaultValue={table[index][0]}
							value={table[index].key}
						/>
						<input
							id={`table-input${index}-value`}
							type='text'
							placeholder="Value"
							onChange={handleChange}
							// defaultValue={table[index][1]}
							value={table[index].value}
						/>
					</div>
				)
			})}
		</div>
	)
}

export default TableInput