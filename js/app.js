/* LOCATION MODEL*/
var Locations = function () {
  
  var self=this;

  self.locations = ko.observableArray();
  self.error = ko.observable(0);

  //IIFE to load data and set up locations
  self.loadData = (function () {
    
    var foursquare="https://api.foursquare.com/v2/venues/explore?client_id=TCESTHYEP5B4JGEU2IHGJVXSQL3ONR0ZGML5DJY0OTEIJZ3X&client_secret=UBF0HHQEQG3K01KKTGXZLPGKBCPLKFK1VQFRBJ4GAMKKYDZ3&v=20130815&ll=33.669444,-117.823056&section=food&limit=10";  
    
    $.getJSON(foursquare,

      function(data) {
      
        var places=data.response.groups[0].items;
      
        for (var i=0; i<places.length; i++) {
          
          var marker = new google.maps.Marker({
                        position: { lat: data.response.groups[0].items[i].venue.location.lat , 
                          lng : data.response.groups[0].items[i].venue.location.lng },
                        title : data.response.groups[0].items[i].venue.name
                      });
          
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
              //'lat': data.response.groups[0].items[i].venue.location.lat ,
              //'lng': data.response.groups[0].items[i].venue.location.lng
          });    
        }
        //self.error(0);
      }).fail ( function (){
          self.error(1);
          console.log("Error");
      });

    })();

}

/*Location View Model*/
var LocationsViewModel = function () {

  var self=this;


  self.mapError = ko.observable(0);//0 if no error

  self.location=ko.observable(new Locations());

  self.searchTerm = ko.observable(''); 

  self.test=ko.observable(0);

  /* MAP */
  self.mapOptions = {
      //disableDefaultUI: true
      center: { lat: 33.669444, lng: -117.823056},
      zoom: 13
  };

  self.map =  new google.maps.Map(document.getElementById('map'), self.mapOptions);

  if (typeof google === 'object' && typeof google.maps === 'object') {

    console.log(self.mapError());

  self.map.setCenter({ lat: 33.669444, lng: -117.823056});

   //var bounds = new google.maps.LatLngBounds();
   //bounds.extend(new google.maps.LatLng(33.669444, -117.823056));
   //self.map.fitBounds(bounds);

  /* Display Filtered List*/
  self.displayList = ko.computed ( function ( ) {
      
      var allPlaces=self.location().locations();
      
      if (self.searchTerm() =='') { //display default list
        
        //setmap off all markers.
        for (var i=0; i< allPlaces.length; i++) {

            allPlaces[i].marker.setMap(this.map);

            google.maps.event.addListener ( allPlaces[i].marker, 'click', (function(allPlacesCopy) {
                
                return function () {
                  //self.test(allPlacesCopy.name);
        
                  allPlacesCopy.infowindow.open( self.map,this);
                  self.map.setCenter(this .getPosition());

                }
              //console.log(allPlaces[i].name);
                //allPlaces[i].infowindow.open( self.map,this);
            })(allPlaces[i]) );

        }
        //console.log(self.location().locations());
        return allPlaces;
      
      }
      else { //search term given
       
        var filteredList=[];
        //search for places matching the search term
        for (var i=0; i<allPlaces.length; i++) {
          
          if ( allPlaces[i]['name'].toLowerCase().indexOf(self.searchTerm().toLowerCase()) != -1 ) { 
          
              filteredList.push(allPlaces[i]);
          
          }
          else { //hide the marker

            allPlaces[i].marker.setMap(null);
          }

        }
      }
      
      return filteredList; //display list will be this filtered list

    },self);

    self.displayInfo = function () {
      //self.test(this.lat);
      //this.marker.setAnimation(google.maps.Animation.BOUNCE);//.setAnimation(google.maps.Animation.BOUNCE);
      google.maps.event.trigger(this.marker, 'click');
      //console.log(this.lat);

    };
  }
  else
  {

    
    self.mapError(1);
    console.log("error",self.mapError);
  }

}

ko.applyBindings(new LocationsViewModel())