<h1>Neighborhood Map Irvive, CA</h1>

============================

<b>Instructions to run the project</b>


<b>GitHub Pages Link:</b> http://aui3.github.io/neighborhood-map/ 


<b>GitHub Repo:</b> https://github.com/aui3/neighborhood-map


Alternately, the app can be run by opening in <b>index.html</b> file located inside the project folder.

=============================

Libraries used: Knockout

The app uses the Foursquare API's <b>venues/explore</b> endpoint to get the list of ten restaurants in Irvine, CA. I am doing this by providing the category <em>food</em> to the <em>section</em> parameter in the API request to Foursquare.


The four square data is displayed in a <b>list format</b> and also as markers on the map using the Google Maps API.

Additional information about each location is given in an <b>info box window</b> which appears when either the list item, or the marker is clicked for a particular location.


The <b>search bar</b> provides functionality to filter results from the list. You may filter the list based upon the <b>name</b> of the restaurant.

When a restaurant name is clicked, the <b>marker</b> corresponding to the retaurant is <b>centered in the map</b>.

The <b>Toggle Display List</b> button will hide or display the list view of the places.