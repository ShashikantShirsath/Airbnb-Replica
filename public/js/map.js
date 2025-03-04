
Radar.initialize('prj_test_pk_5c29c6373293c1205a22457c8f1e6d6c8b21fb1b');

// create a new map
const map = Radar.ui.map({
    container: 'map',
    style: 'radar-default-v1',
    // omit center and zoom to use default IP address location
    center: listing.geometry.coordinates,
    zoom: 9,
});

console.log(listing);

const popup = Radar.ui.popup({
    html: `<h5>${listing.location}</h5>Exact location will be provided after login.`,
});

// create marker and add to map
const marker = Radar.ui.marker({ color: 'red', marker: 'icons8-home-address-50 (1).png' })
    .setLngLat(listing.geometry.coordinates)   //Listing.geometry.coordinates
    .setPopup(popup) 
    .addTo(map);
