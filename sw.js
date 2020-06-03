const appShell = 'app-shell-data-new';
const assets = [
	'/',
	'/index.html',
	'/css/index.css',
	'/js/index.js',
	'/js/app.js',
	'/js/modules.js',
	'/questions_file.json',
	'/fonts/Roboto-Regular.ttf',
	'/fontawesome/css/all.min.css',
	'/fontawesome/webfonts/fa-solid-900.ttf',
	'/fontawesome/webfonts/fa-solid-900.woff',
	'/fontawesome/webfonts/fa-solid-900.woff2',
	'/fontawesome/webfonts/fa-brands-400.ttf',
	'/fontawesome/webfonts/fa-brands-400.woff',
	'/fontawesome/webfonts/fa-brands-400.woff2'
];

//listening to install event
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(appShell).then(cache => {
			cache.addAll(assets)
		})
	)
})


//listening to activate event
self.addEventListener('activate', e => {
	// console.log('serviceWorkder has been activated');
	e.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== appShell)
				.map(key => caches.delete(key))
			)
		})
	)
})

//listening to fetch event
self.addEventListener('fetch', e => {
	e.respondWith(
	    caches.match(e.request).then(response => {
	        return response || fetch(e.request)
	    })
	)
})