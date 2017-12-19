// currently jquery.  have set up webpack/react basic model for rewrite
// client-side js
// run by the browser each time your view template is loaded



$(function() {
  console.log(Date.now());  
  $('#geolocate').click(function() {    
    var x = document.getElementById("demo"); 
    if (navigator.geolocation) {      
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

function showPosition(position) {  
  //console.log(position);
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;  
  httpGetAsync('/search?'+ $.param({lat:position.coords.latitude, long:position.coords.longitude}), listDisplay);
  }
  } )
  
/*
  $('form').submit(function(event) {     
    event.preventDefault();
    var location = $('#loc').val();    
    //straight js function instead of jquery seems better for reusability here  and in the geolocate above
    httpGetAsync('/search?'+ $.param({location: location}), listDisplay);
    

           
  });
  */
  
  function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
 /* 
 //logit function for testing delete when not needed
  function logit(ret){
    var data=JSON.parse(ret);    
      alert(data[0].name+"  "+data[0].headcount+" are going.");
      $('#loc').val('');
      $('input').focus();
  }
  */
  
  function listDisplay(ret){    
    var data=JSON.parse(ret);
    data.forEach(function(item){      
      $('<li>'+item.name+'<span class="hidden">'+item.id+'</span>     '+item.headcount+' are going'+'</li>').appendTo("#venuelist");      
      })       
    $('#loc').val('');
    $('input').focus();
  }
  

});
