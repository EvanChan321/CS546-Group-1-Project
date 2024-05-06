function getColor(num){
  let normalizedValue = (1000-num) / 1000;
  let color = Math.round(255 * normalizedValue);  
  color = Math.min(color, 175); 
  let Hex = color.toString(16).padStart(2, '0');  
  let colorHex = '#' + 'FF' + Hex + Hex;  
  return colorHex;
}

async function initMap(shops) {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );
  const lat = document.getElementById('latitude');
  const long = document.getElementById('longitude');
  let latInput = lat.value.trim();
  let longInput = long.value.trim();
  latInput = parseFloat(latInput)
  longInput = parseFloat(longInput)
  const map = new Map(document.getElementById("map"), {
    center: { lat: latInput, lng: longInput },
    zoom: 15,
    mapId: "4504f8b37365c3d0",
  });
  const infoWindow = new InfoWindow();
  shops.forEach(({ position, title, url, color }, i) => {
    const pin = new PinElement({
      glyph: `${title}`,
      background: getColor(color),
      borderColor: "#000000",
      scale: 1.6
    });
    const marker = new AdvancedMarkerElement({
      position,
      map,
      title: `${i + 1}. ${title}`,
      content: pin.element,
    });
  
    // Track if the info window is open.
    let infoWindowOpen = false;
  
    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      if (!infoWindowOpen) {
        // Open the info window on the first click.
        infoWindow.setContent(marker.title);
        infoWindow.open(marker.map, marker);
        infoWindowOpen = true;
      } else {
        infoWindowOpen = false;
        window.location.href = url;
      }
    });
  });
}

async function fetchDataAndRenderMap(address, distance) {
  try {
    const response = await $.ajax({
      url: '/map',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        address: address,
        distance: distance
      })
    });
    const { lat, lng, shops } = response;
    $('#latitude').val(lat);
    $('#longitude').val(lng);
    initMap(shops);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

$(document).ready(function() {
  initMap(shops);
  $('#Map').submit(async function(event) {
    event.preventDefault();
    const address = $('#address').val();
    const distance = $('#distance').val();
    await fetchDataAndRenderMap(address, distance);
  });
});