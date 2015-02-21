var Locations = function () {
  var self=this;
  
 /* self.searchTerm = ko.observable('');
  self.locations = ko.observableArray([{'name': 'Irvine', 'year' : 2012},
                                        {'name':'Anaheim', 'year' : 2013},
                                        {'name': 'Houston' ,'year' : 2010}
                                        ]);

  
  
  //IIFE to load data and set up locations
  self.loadData = (function () {

      self.locations.push({'name': 'Lahore', 'year':2009});
  

  })();
    
  //self.searchResult = ko.computed (function() {  
    //console.log(self.locations());
    //for (var y in self.locations())
   // {
      
      //console.log(self.locations()[y]['name']);
      //console.log(self.searchTerm());
     // if (self.locations()[y]['name'] == self.searchTerm() ){
       // console.log (self.locations()[y]['year']);
     // }
   // }


   //},self);
*/


  self.locations = ko.observableArray();
  self.test1 = ko.observable(2);
  //self.searchTerm = ko.observable('');

  //IIFE to load data and set up locations
  self.loadData = (function () {
    var foursquare="https://api.foursquare.com/v2/venues/explore?client_id=TCESTHYEP5B4JGEU2IHGJVXSQL3ONR0ZGML5DJY0OTEIJZ3X&client_secret=UBF0HHQEQG3K01KKTGXZLPGKBCPLKFK1VQFRBJ4GAMKKYDZ3&v=20130815&ll=33.669444,-117.823056&section=food&limit=10";  
    $.getJSON(foursquare,
    
    function(data) {
      
        var places=data.response.groups[0].items;
        //console.log(places);
        for (var i=0; i<places.length; i++) {
            self.locations.push({ 
                'venue'  :data.response.groups[0].items[i].venue,
                'name': data.response.groups[0].items[i].venue.name, 
                'lat': data.response.groups[0].items[i].venue.location.lat ,
                'lng':data.response.groups[0].items[i].venue.location.lng
            });    
        }
        //console.log(self.locations());
      }).fail ( function (){
          console.log ("Error");
      });

    })();

}

var LocationsViewModel = function () {

  var self=this;

  self.location=ko.observable(new Locations());

  //self.clickCounter =ko.observable(0);

  /*self.mapOptions = {
      //disableDefaultUI: true33.669444, -117.823056
      center: { lat: 33.669444, lng: -117.823056},
      zoom: 14
    };
  self.map =  new google.maps.Map(document.getElementById('map'), self.mapOptions);
  self.map.setCenter({ lat: 33.669444, lng: -117.823056});
 */
 // self.displayList = ko.observableArray();

  self.searchTerm = ko.observable('');

  //this.location().loadData();
  //console.log(self.location().locations());
  //self.displayList = ko.observableArray([]);
  self.test=ko.observable(0);
  self.displayList = ko.computed ( function ( ) {
      
      var allPlaces=self.location().locations();
      if (self.searchTerm() =='') { //display default list
        return allPlaces;

      }

      var allPlaces=self.location().locations();
      var filteredList=[];
      for (var i=0; i<allPlaces.length; i++) {
        if ( allPlaces[i]['name'].toLowerCase().indexOf(self.searchTerm().toLowerCase()) != -1 ) {
          //if (i==2) {  
            filteredList.push(allPlaces[i]);
        }

      }
      

      return filteredList;

    },self);

    self.displayInfo = function () {
      self.test(this.lat);
      //console.log(this.lat);

    };

  

  //console.log(self.displayList().pop());
  



  //create a displayList which will default to the locations[] initially but filter based on search results
  
  /*self.displayList = ko.observableArray ([{'name': 'Irvine', 'year' : 2012},
                                        {'name':'Anaheim', 'year' : 2013},
                                        {'name': 'Houston' ,'year' : 2010}
                                        ]); //initially contains all data
  *///console.log(self.displayList());


}

ko.applyBindings(new LocationsViewModel())