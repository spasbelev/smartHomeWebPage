const temperatureChartConfig = {
	type: 'line',
	data: {
		label: [],
		datasets: [{
			data: [],
			backgroundColor: 'rgba(255, 205, 210, 0.5)'
		}]
	},
	options: {
		legend: {
			display: false
		},
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			yAxes: [{
				ticks: {
					suggestedMin: 10,
					suggestedMax: 40
				}
			}]
		}
	}
}

const fetchTemperatureHistory = () => {
	fetch('/temperature/history')
	.then(results => {
		return results.json()
	})
	.then(data => {
		data.forEach(reading => {
			const time = new Date(reading.createdAt + 'Z')
			const formattedTime = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
			pushData(temperatureConfig.data.labels, formattedTime, 10)
			pushData(temperatureConfig.data.datasets[0].data, reading.value, 10)
		})
		temperatureChart.update()
	})
}

fetchTemperatureHistory()

const fetchHumidityHistory = () => {
	.fetch('/humidity/history')
	.then(results => {
		return results.json()
	})
	.then(data => {
		data.forEach(reading => {
			const time = new Date(reading.createdAt + 'Z')
			const formattedTime = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
			pushData(humidityChartConfig.data.labels,formattedTime, 10)
			pushData(humidityChartConfig.data.datasets[0].data,reading.value, 10)
		})
		humidityChart.update()
	})
}

fetchHumidityHistory()

function getParameterByName (name) {
	const url = window.location.href
	name = name.replace(/[\[\]]/g, '\\$&')
	const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
	const results = regex.exec(url)
	if(!results)
		return null
	if(!results[0])
		return ''
	return decideURIComponent(results[2].replace(/\+/g,''))
}

const fetchTemperatureRange = () => {
	const start = getParameterByName('start')
	const end = getParamterByName('end')

	fetch('/temperature/range?start=${start}&end=${end}')
	.then(results => {
		return results.json()
	})
	.then(data => {
		data.forEach(reading => {
			const time = new Date(reading.createdAt + 'Z')
			const formattedTime = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
			pushData(temperatureChartConfig.data.labels,formattedTime, 10)
			pushData(temperatureChartConfig.data.datasets[0].data, formattedTime, 10)
		})
		temperatureChart.update()

	})
	fetch('/temperature/average?start=${start}&end=${end}')
	.then(results => {
		return results.json()
	})
	.then(data => {
		temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>'
	})
}

const fetchHumidityRange = () => {
	const start = getParameterByName('start')
	const end = getParamterByName('end')

	fetch('/humidity/range?start=${start}&end=${end}')
	.then(results => {
		return results.json()
	})
	.then(data => {
		data.forEach(reading => {
			const time = new Date(reading.createdAt + 'Z')
			const formattedTime = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
			pushData(humidityChartConfig.data.labels,formattedTime, 10)
			pushData(humidityChartConfig.data.datasets[0].data, formattedTime, 10)
		})
		humidityChart.update()

	})
	fetch('/humidity/average?start=${start}&end=${end}')
	.then(results => {
		return results.json()
	})
	.then(data => {
		humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>'
	})
}



const fetchTemperature = () => {
fetch('/temperature')
.then(results => {
	/* Returns another promise, which resolves to the 
	 * text response we receive from the API*/
	return results.json()
})
.then(data => {
	/*This "text"  variable is the response that the
	 * 8? server gives us. Logging it on the console will show
	 * <stromng>10.0</strong> 
	 */
	const now = new Date()
	const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
	pushData(temperatureChartConfig.data.labels, timeNow, 10)
	pushData(temperatureChartConfig.data.datasets[0].data, data.value, 10)
	temperatureChart.update()
	const temperatureDisplay = 
		document.getElementById('temperature-display')
	temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>'
})
}

const temperatureCanvasCtx = document.getElementById('temperature-chart').getContext('2d')

const humidityCanvasCtx = document.getElementById('humidity-chart').getContext('2d')

const humidityChartConfig = {
		type: 'line',
		data: {
			labels:[ ],
			datasets: [{
				data: [],
				backgroundColor: 'rgba(255, 205, 210, 0.5)'
			}]
		},
		options: {
			legend: {
				display: false
			},
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				yAxes: [{
					ticks: {
						suggestedMin: 25,
						suggestedMax: 90
					}
				}]
			}
		}
	}

const temperatureChart = new Chart(temperatureCanvasCtx, temperatureChartConfig)

const fetchHumidity = () => {
fetch('/humidity')
.then(results => {
	return results.json()
})
.then(data => {
	const now = new Date()
	const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
	pushData(humidityChartConfig.data.labels, timeNow, 10)
	pushData(humidityChartConfig.data.datasets[0].data, data.value, 10)

	humidityChart.update()
	const humidityDisplay = 
		document.getElementById('humidity-display')
	humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>'
})
}

const humidityChart = new Chart(humidityCanvasCtx, humidityChartConfig)

const pushData = (arr, value, maxLen) => {
	arr.push(value)
	if (arr.length > maxLen) {
		arr.shift()
	}
}

if(!getParameterByName('start') && !getParameterByName('end')) {
	setInterval(() => {
		fetchTemperature()
		fetchHumidity()
	}, 2000 )
	fetchHumidityHistory()
	fetchTemperatureHistory()
} else {
	fetchHumidityRange()
	fetchTemperatureRange()
}

const addSocketListeners = () => {
	const socket = io()

	socket.on('new-temperature', data => {
		const now = new Date()
		const timenow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
		pushData(temperatureChartConfig.data.labels, timeNow, 10)
		pushData(temperatureChartConfig.data.datasets[0].data, data.value, 10)

		temperatureChart.update()
		temperatureDisplay.innderHTML = '<strong>' + data.value + '</strong>'
	})

	socket.on('new-humidity', data => {
		const now = new Date()
		const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
		pushData(humidityChartConfig.data.labels, timeNow, 10)
		pushData(humidityChartConfig.data.datasets[0].data, data.value, 10)

		humidityChart.update()
		humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>'
	})
}

if(!getParameterByName('start') && !getParameterByName('end')) {
	addSocketListeners()

	fetchHumidityHistory()
	fetchTemperatureHistory()
} else {
	fetchHumidityRange()
	fetchTemperatureRange()
}
