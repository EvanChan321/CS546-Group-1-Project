let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 40.74279347637502, lng: -74.02666353900707 },
    zoom: 16,
  });
}
async function newMap(lat, lng) {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: lat, lng: lng },
    zoom: 16,
  });
}
initMap();

const staticForm = document.getElementById('Map');
if(staticForm){
  const lat = document.getElementById('lat');
  const lng = document.getElementById('lng');
  staticForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let latInput = lat.value.trim()
    let lngInput = lng.value.trim()
    latInput = parseFloat(latInput);
    lngInput = parseFloat(lngInput);
    newMap(latInput, lngInput)
    staticForm.reset();
  });
}