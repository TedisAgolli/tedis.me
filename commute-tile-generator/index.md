---
layout: layouts/post.njk
title: Commute time badge generator
excerpt_separator: <!--more-->
---

![example](/img/commute/exampleTile.png)

This form helps you generate a badge that displays the commute time between two points.

<!--more-->

It uses the [Google Maps API Distance Matrix](https://developers.google.com/maps/documentation/distance-matrix/intro) to get the travel distance and [shields.io](https://shields.io/) to generate the badge.

I built this for people who want to include a commute tile in their SharpTools dashboard, but the generated badge can be used for anything.

  <meta charset="utf-8" />
  <html>
  <script>
      function displayUrl() {
  let origLatLong = document.getElementById("origLatLong").value.trim();
  let destLatLong = document.getElementById("destLatLong").value.trim();
  let apiKey = "API_KEY_HERE";
  let googleParams = new URLSearchParams({
    origins: origLatLong,
    destinations: destLatLong,
    key: apiKey,
    departure_time: "now",
    mode: "driving",
    units: "imperial",
  }).toString();
  let googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?";
  let googleMapsUrl = googleMapsBaseUrl + googleParams;
  let shieldsVisualParams = {};
  let label = document.getElementById("label").value;
  ["logo", "color", "style"].forEach((e) => {
    let formVal = document.getElementById(e).value.trim();
    if (formVal != "") {
      shieldsVisualParams[e] = formVal;
    }
  });
  let shieldsParams = new URLSearchParams({
    label,
    ...shieldsVisualParams,
    url: googleMapsUrl,
    query: "$.rows[0].elements[0].duration_in_traffic.text",
  });
  let shieldsBaseQuery = "https://img.shields.io/badge/dynamic/json?";
  let shieldsFullQuery = shieldsBaseQuery + shieldsParams;
  let badge = document.getElementById("badge");
  badge.src = shieldsFullQuery;
  let genUrl = document.getElementById("generatedUrl");
  genUrl.value = shieldsFullQuery;
}
</script>

  <body>
    <div>
      <div class="row">
        <form>
          <h3 class="text-center text-xl text-semibold underline">Google Maps</h3>
          <ol>
              <li>1. Pick a place in maps and grab lat, long from the URL <em>/maps/place/$PLACE_NAME/@lat,long</em></li>
              <li>2. Replace API_KEY_HERE with your API in the generated route</li>
          </ol>
          <div class='mt-2'>
            <label for="origLatLong" class="block text-sm font-medium text-gray-700">Origin (Lat, Long)</label>
            <div class="mt-1">
              <input type="text" name="origLatLong" id="origLatLong" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border border-gray-400 rounded-md" >
            </div>
          </div>
          <div>
            <label for="destLatLong" class="block text-sm font-medium text-gray-700">Destination (Lat, Long)</label>
            <div class="mt-1">
              <input type="text" name="destLatLong" id="destLatLong" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-400 rounded-md" >
            </div>
        </div>
          <h3 class="text-center text-xl text-semibold underline"><a href='https://shields.io/'>Shields.io</a></h3>
          <p>The shields.io website has documentation on the possible values</p>
          <div>
            <label for="label" class="block text-sm font-medium text-gray-700">Label (optional)</label>
            <div class="mt-1">
              <input type="text" name="label" id="label" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-400 rounded-md" >
            </div>
          </div>
           <div>
            <label for="logo" class="block text-sm font-medium text-gray-700">Logo (optional)</label>
            <div class="mt-1">
              <input type="text" name="logo" id="logo" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-400 rounded-md" >
            </div>
          </div>
           <div>
            <label for="color" class="block text-sm font-medium text-gray-700">Color (optional)</label>
            <div class="mt-1">
              <input type="text" name="color" id="color" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-500 rounded-md" >
            </div>
          </div>
           <div>
            <label for="style" class="block text-sm font-medium text-gray-700">Style (optional)</label>
            <div class="mt-1">
              <input type="text" name="style" id="style" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-400 rounded-md" >
            </div>
          </div>
          <button type="button" class="mt-2 inline-flex items-center px-4 py-2 border text text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
             Generate
          </button>
        </form>
      </div>
        <img id="badge" class='mt-5' src='https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmaps.googleapis.com%2Fmaps%2Fapi%2Fdistancematrix%2Fjson%3Forigins%3D%26destinations%3D%26key%3DAPI_KEY_HERE%26departure_time%3Dnow%26mode%3Ddriving%26units%3Dimperial&query=%24.rows%5B0%5D.elements%5B0%5D.duration_in_traffic.text' />
        <textarea
            class="form-control w-full border border-gray-400 m-3"
            type="text"
            id="generatedUrl"
            rows="5"
        >https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmaps.googleapis.com%2Fmaps%2Fapi%2Fdistancematrix%2Fjson%3Forigins%3D%26destinations%3D%26key%3DAPI_KEY_HERE%26departure_time%3Dnow%26mode%3Ddriving%26units%3Dimperial&query=%24.rows%5B0%5D.elements%5B0%5D.duration_in_traffic.text
        </textarea>
    </div>

  </body>

</html>
