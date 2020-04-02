//registering service worker
if('serviceWorker' in navigator){
	navigator.serviceWorker.register('/sw.js')
	.then(reg => console.log('serviceWorker resgistered', reg))
	.catch(err => console.log('serviceWorker not resgistered', err))
}