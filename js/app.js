var Locations = function () {
  var self=this;
  
  self.searchTerm = ko.observable('');
  self.locations = ko.observableArray([{'name': 'Irvine', 'year' : 2012},
                                        {'name':'Anaheim', 'year' : 2013},
                                        {'name': 'Houston' ,'year' : 2010}
                                        ]);

   self.searchResult = ko.computed (function() {

    
    //console.log(self.locations());
    for (var y in self.locations())
    {
      
      //console.log(self.locations()[y]['name']);
      //console.log(self.searchTerm());
      if (self.locations()[y]['name'] == self.searchTerm() ){
        console.log (self.locations()[y]['year']);
      }
    }


   },self);

}

var LocationsViewModel = function () {

  this.location=ko.observable(new Locations());


}

ko.applyBindings(new LocationsViewModel())