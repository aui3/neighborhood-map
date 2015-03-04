/* LOCATION MODEL*/
var Locations = function () {
  
  var self=this;

  self.locations = ko.observableArray();
  self.apiError = ko.observable(false);

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
        self.apiError(false);
        console.log("succes",self.apiError())

      }).fail ( function (){
          self.apiError(true);
          console.log("Error", self.apiError());
      });

    })();

}

/*Location View Model*/
var LocationsViewModel = function () {

  var self=this;


  self.mapError = ko.observable(false);//0 if no error

  self.location=ko.observable(new Locations());

  console.log(self.location().apiError());
  self.searchTerm = ko.observable(''); 

  self.test=ko.observable(0);

  /* MAP */
  self.mapOptions = {
      //disableDefaultUI: true
      center: { lat: 33.669444, lng: -117.823056},
      zoom: 14
  };

  if (typeof google === 'object'  && typeof google.maps === 'object') {
    
    self.map =  new google.maps.Map(document.getElementById('map'), self.mapOptions);


    self.map.setCenter({ lat: 33.669444, lng: -117.823056});
    self.lastInfoWindow = ko.observable ('');


    /* Display Filtered List*/
    self.displayList = ko.computed ( function ( ) {
        
        var allPlaces = self.location().locations();
        
        if (self.searchTerm() == '') { //display default list
          
          //setmap off all markers.
          for (var i = 0; i < allPlaces.length; i++) {

              allPlaces[i].marker.setMap(this.map);

              google.maps.event.addListener ( allPlaces[i].marker, 'click', (function(allPlacesCopy) {
                  
                  return function () {  
                    //self.test(allPlacesCopy.name);
                    //check if an info window is not open set this window as last open window
                    if(self.lastInfoWindow() == ''){
                          //self.currentInfoWindow.close();
                          self.lastInfoWindow(allPlacesCopy.infowindow);
                          allPlacesCopy.infowindow.open( self.map,this);
                          self.map.setCenter(this.getPosition());
                    }
                    else {//lastinfowindow open close this and set current info window as lastwindow open for the next iteration
          
                      self.lastInfoWindow().close();
                      allPlacesCopy.infowindow.open( self.map,this);
                      self.map.setCenter(this .getPosition());
                      self.lastInfoWindow(allPlacesCopy.infowindow);
                    }

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
      //handle click events in the list
      self.displayInfo = function () {
        //self.test(this.lat);
        //this.marker.setAnimation(google.maps.Animation.BOUNCE);//.setAnimation(google.maps.Animation.BOUNCE);
        google.maps.event.trigger(this.marker, 'click');
        //console.log(this.lat);

      };
       google.maps.event.addDomListener(window, "resize", function() {
     /* 
      var center; 
      
      if(self.lastInfoWindow() == '') {
        center = self.map.getCenter();
      }
      else
      { 
          console.log(self.lastInfoWindow().getPosition());
          center = self.lastInfoWindow().getPosition(); 

      }
      google.maps.event.trigger(self.map, "resize");
      self.map.setCenter(center); 
      */

      //var boundbox = new google.maps.LatLngBounds();
      //boundbox.extend(new google.maps.LatLng({ lat: 33.669444, lng: -117.823056}));
      //self.map.setCenter(boundbox.getCenter());
      //self.map.fitBounds(boundbox);


      var boundbox = new google.maps.LatLngBounds();
      for ( var i = 0; i < self.location().locations().length; i++ )
      {
        //console.log(self.location().locations()[i].marker.getPosition());
        boundbox.extend(self.location().locations()[i].marker.getPosition());
      }
      self.map.setCenter(boundbox.getCenter());
      self.map.fitBounds(boundbox);


});  



      self.mapError(false);      
  


  }   
  else
  {


    self.mapError(true);
         console.log("map error", self.mapError());   
  

  }

  // make sure the map bounds get updated on page resize
 

}

ko.applyBindings(new LocationsViewModel())