/* LOCATION MODEL holds all information for the locations to be displayed*/
var Locations = function () {
  
  var self=this;

  self.locations = ko.observableArray();
  self.apiError = ko.observable(false);

  //IIFE to load data and set up locations Array
  self.loadData = (function () {
    
    //get top 10 restaurants for Irvine,CA
    var foursquare="https://api.foursquare.com/v2/venues/explore?client_id=TCESTHYEP5B4JGEU2IHGJVXSQL3ONR0ZGML5DJY0OTEIJZ3X&client_secret=UBF0HHQEQG3K01KKTGXZLPGKBCPLKFK1VQFRBJ4GAMKKYDZ3&v=20130815&ll=33.669444,-117.823056&section=food&limit=10";  
    
    $.getJSON(foursquare,

      function(data) {
      
        var places=data.response.groups[0].items;
      
        for (var i=0; i<places.length; i++) {
          //add marker for this location
          var marker = new google.maps.Marker({
                        position: { lat: data.response.groups[0].items[i].venue.location.lat , 
                          lng : data.response.groups[0].items[i].venue.location.lng },
                        title : data.response.groups[0].items[i].venue.name
                      });
          //add infor window to this location
          var infoWindow = new google.maps.InfoWindow ( { 
                            content : '<p><strong>'+data.response.groups[0].items[i].venue.name+ '</strong></p>'+
                                      '<p>'+data.response.groups[0].items[i].venue.contact.formattedPhone+'</p>'+
                                      //'<p>'+data.response.groups[0].items[i].venue.menu.url+'</p>'+
                                      '<p>'+data.response.groups[0].items[i].venue.url+'</p>'
                            });
                
          self.locations.push({ 
              'venue' : data.response.groups[0].items[i].venue,
              'name' : data.response.groups[0].items[i].venue.name, 
              'marker': marker,
              'infowindow' : infoWindow
          });    
        }

        self.apiError(false);

      }).fail ( function (){
          //getJSON failed, display error message
          self.apiError(true);
      });
    })();

}

/*Location View Model*/
var LocationsViewModel = function () {

  var self=this;

  self.mapError = ko.observable(false);//0 if no error

  //array of all the places and all info pretaining to each place such as marker, info window etc 
  self.location=ko.observable(new Locations());

  self.searchTerm = ko.observable(''); 

  //controls if list is hidden or displayed
  self.toggleListBoolean = ko.observable(true);

  /* MAP */
  self.mapOptions = {
        //center at Irvine, CA's latitude and longitude
        center: { lat: 33.669444, lng: -117.823056},
      zoom: 12
  };

  if (typeof google === 'object'  && typeof google.maps === 'object') {
    
    self.map =  new google.maps.Map(document.getElementById('map'), self.mapOptions);

    self.map.setCenter({ lat: 33.669444, lng: -117.823056});
    self.lastInfoWindow = ko.observable ('');

    /* Display Filtered List, computed based on the search term*/
    self.displayList = ko.computed ( function ( ) {
        
        var allPlaces = self.location().locations();
        
        if (self.searchTerm() == '') { //display default list i.e all locations
          
          //setmap of all markers. (add all makers to this map)
          for (var i = 0; i < allPlaces.length; i++) {

              allPlaces[i].marker.setMap(this.map);

              //event listener to trigger opening of infowindow  
              google.maps.event.addListener ( allPlaces[i].marker, 'click', (function(allPlacesCopy) {
                  
                return function () {  
        
                  //check if an info window is not open set this window as last open window
                  if(self.lastInfoWindow() == ''){
                    self.lastInfoWindow(allPlacesCopy.infowindow);
                    allPlacesCopy.infowindow.open( self.map,this);
                    self.map.setCenter(this.getPosition());
                  }
                  //lastinfowindow open close this and set current info window as lastwindow open for the next iteration
                  else {
    
                    self.lastInfoWindow().close();
                    allPlacesCopy.infowindow.open( self.map,this);
                    self.map.setCenter(this .getPosition());
                    self.lastInfoWindow(allPlacesCopy.infowindow);
                  }

                }
            })(allPlaces[i]) );

          }
          google.maps.event.trigger(self.map, 'resize');
          return allPlaces;
        }
        //search term given, filter according to this term
        else { 
         
          var filteredList=[];
          //search for places matching the search term
          for (var i=0; i<allPlaces.length; i++) {
            
            if ( allPlaces[i]['name'].toLowerCase().indexOf(self.searchTerm().toLowerCase()) != -1 ) { 
            
                filteredList.push(allPlaces[i]);
            
            }
            else { //hide the marker since this is not a display list item

              allPlaces[i].marker.setMap(null);
            }

          }
        }
        
        return filteredList; //display list will be this filtered list

      },self);
      //handle click events in the list
    self.displayInfo = function () {
      
      google.maps.event.trigger(this.marker, 'click');
      
    };
    
    //set the bounds of the map on window resize to ensure all markers are displayed
     // make sure the map bounds get updated on page resize
    google.maps.event.addDomListener(window, "resize", function() {
   
      var boundbox = new google.maps.LatLngBounds();
      for ( var i = 0; i < self.location().locations().length; i++ )
      {
        boundbox.extend(self.location().locations()[i].marker.getPosition());
      }
      self.map.setCenter(boundbox.getCenter());
      self.map.fitBounds(boundbox);

    });  
    //no error
    self.mapError(false);      
  }   
  //error in loading map, display error
  else
  {
    self.mapError(true);

  }

  //hide or display list
  self.toggleList = function () {

      self.toggleListBoolean() ? self.toggleListBoolean(false) : self.toggleListBoolean(true);

  }
 

}

ko.applyBindings(new LocationsViewModel())