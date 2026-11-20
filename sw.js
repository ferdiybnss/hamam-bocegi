/* Hamam Böceği service worker: ağ öncelikli, bildirim düğmeleri (mola / dönüş) */
var CACHE='hamam-bocegi-v7';
self.addEventListener('install',function(e){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r.ok){var c=r.clone();caches.open(CACHE).then(function(x){x.put(e.request,c)})}
    return r;
  }).catch(function(){return caches.match(e.request)}));
});
self.addEventListener('notificationclick',function(e){
  e.notification.close();
  var act=e.action||'open';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){
    if(list.length){
      list[0].postMessage({type:'hb-action',action:act});
      return list[0].focus();
    }
    return self.clients.openWindow('./?aksiyon='+encodeURIComponent(act));
  }));
});
