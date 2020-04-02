const appShell = 'app-shell';
const assests = [
	'/',
	'/index.html',
	'/js/index.js',
	'/js/app.js',
	'/js/modules.js',
	'/css/index.css',
	'/questions_file.json',
	'/fonts/Roboto-Regular.ttf'
];

//listening to install event
self.addEventListener('install', e => {
	// console.log('serviceWorkder has been installed');
	e.waitUntil(
		caches.open(appShell).then(chache => {
			cache.addAll(assets)
		})
	)
})


//listening to activate event
self.addEventListener('activate', e => {
	console.log('serviceWorkder has been activated');
})

//fetch
self.addEventListener('fetch', e => {
	e.respondWith(
	    caches.match(e.request).then(response => {
	        return response || fetch(e.request)
	    })
	)
})