var main = function() {



    $(function() {
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 130,
            values: [ 0, 130 ],
            slide: function( event, ui ) {
                var minTemperature=parseInt(ui.values[0]);
                var maxTemperature=parseInt(ui.values[1]);
                $( "#temperatureRange" ).val(minTemperature+ " F - "+maxTemperature+" F");                 
                if($('#weatherMonthTitle').text()!='Month'){
                    $('.infoBoxTemperature').each(function(){
                        var minTemperatureCampground=parseInt($(this).text().split(' ')[1].split('/')[0]);
                        var maxTemperatureCampground=parseInt($(this).text().split(' ')[1].split('/')[1]);
                        if(parseInt(maxTemperatureCampground)>parseInt(maxTemperature)){
                            $(this).parents('.infoBox').find('.infoPic').css("opacity","0.1");
                            $(this).parents('.infoBox').css("color","grey");
                            $(this).parents('.infoBox').addClass('excludedMaxTemperature');
                        }
                        else{
                            $(this).parents('.infoBox').not('.excludedYelp').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').find('.infoPic').css("opacity","1");
                            $(this).parents('.infoBox').not('.excludedYelp').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').css("color","#337ab7");
                            $(this).parents('.infoBox').removeClass('excludedMaxTemperature');
                            }
                        if(parseInt(minTemperatureCampground)<parseInt(minTemperature)){
                            $(this).parents('.infoBox').find('.infoPic').css("opacity","0.1");
                            $(this).parents('.infoBox').css("color","grey");
                            $(this).parents('.infoBox').addClass('excludedMinTemperature');
                        }   
                        else{
                            $(this).parents('.infoBox').not('.excludedYelp').not('.excludedBooking').not('.excludedDistance').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
                            $(this).parents('.infoBox').not('.excludedYelp').not('.excludedBooking').not('.excludedDistance').not('.excludedMaxTemperature').css("color","#337ab7");
                            $(this).parents('.infoBox').removeClass('excludedMinTemperature');
                            }
                    });//each
                }
            }
        });
        $( "#temperatureRange" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
          " F - " + $( "#slider-range" ).slider( "values", 1 ) + " F");
      });

      $(function() {
        $( "#sliderDistance" ).slider({
            range: "max",
            min: 1,
            max: 20,
            value: 5,
            step: 1,
            slide: function( event, ui ) {
                var maxDistance=parseInt(ui.value);
                $( "#distanceRange" ).val(maxDistance+ " hr");
                if($('#startLocationTitle').text()!='Start Location'){
                    $('.infoBoxDistance').each(function(){
                        if(parseInt($(this).text().split(' ')[1])>=parseInt(maxDistance)){
                            $(this).parents('.infoBox').find('.infoPic').css("opacity","0.1");
                            $(this).parents('.infoBox').css("color","grey");
                            $(this).parents('.infoBox').addClass('excludedDistance');
                        }
                        else{
                            $(this).parents('.infoBox').not('.excludedYelp').not('.excludedBooking').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
                            $(this).parents('.infoBox').not('.excludedYelp').not('.excludedBooking').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
                            $(this).parents('.infoBox').removeClass('excludedDistance');
                        }              
                    });//each
                }
            }
        });
        $( "#distanceRange" ).val($( "#sliderDistance" ).slider("value")+" hr");
      });

      $(document).on('mouseover','.availableMouseover',function(){
        if(!$(this).hasClass('overselect')) {//on mouseover, add class that will bold letters
            $(this).addClass('overselect');
            $(this).find('div').popover({ trigger: "hover" });
        }
    });//availableMouseover

    /**********************************/

    $(document).on('click','#clearAll',function(){
        $('.infoBox').each(function(){
            $(this).find('.infoBoxDistance').text('Distance:');
            $(this).find('.infoBoxTemperature').text('minT/maxT:');
            $(this).removeClass('excludedDistance');
            $(this).removeClass('excludedYelp');
            $(this).removeClass('excludedBooking');
            $(this).removeClass('excludedMinTemperature');
            $(this).removeClass('excludedMaxTemperature');
            $(this).find('.infoPic').css("opacity","1");
            $(this).css("color","#337ab7");
        });
        $('#startLocationTitle').text('Start Location')
        $('#weatherMonthTitle').text('Month');
        $('#yelp1').removeClass('btn-warning');
        $('#yelp2').removeClass('btn-warning');
        $('#yelp3').removeClass('btn-warning');
        $('#yelp4').removeClass('btn-warning');
        $('#yelp5').removeClass('btn-warning');
        $('#booking1').removeClass('btn-warning');
        $('#booking2').removeClass('btn-warning');
        $('#booking3').removeClass('btn-warning');
        $('#booking4').removeClass('btn-warning');
    });


    $(document).on('mouseout','.availableMouseover',function(){
        if($(this).hasClass('overselect')) {//on mouseout, deselect the text back to normal font
            $(this).removeClass('overselect');
        }
    });//availableMouseover

    $(document).on('click','.weatherMonth',function(){
        var weatherMonth=$(this).text();
        $('#weatherMonthTitle').text(weatherMonth);
        $.ajax({
            type: 'POST',
            // Provide correct Content-Type, so that Flask will know how to process it.
            contentType: 'application/json',
            // Encode data as JSON.
            data: JSON.stringify({
              'weatherMonth': weatherMonth, 'pageID': $(document).find('html').attr('id')
            }),
            // This is the type of data expected back from the server.
            dataType: 'json',
            url: '/_weatherMonth',
            success: function (ret) {
                for(i in ret['nameID']){
                    $('#infoBox'+ret['nameID'][i]).find('.infoBoxTemperature').text('minT/maxT: '+parseInt(ret['minTemp'][i]/10.0)+'/'+parseInt(ret['maxTemp'][i]/10.0)+' F');
                    var maxTemperatureCampground=parseInt(ret['maxTemp'][i]/10.0);
                    var minTemperatureCampground=parseInt(ret['minTemp'][i]/10.0);
                    var minTemperature=$('#temperatureRange').val().split(' ')[0]; 
                    var maxTemperature=$('#temperatureRange').val().split(' ')[3];
                    if(maxTemperatureCampground>maxTemperature){
                        $('#infoBox'+ret['nameID'][i]).find('.infoPic').css("opacity","0.1");
                        $('#infoBox'+ret['nameID'][i]).css("color","grey");
                        $('#infoBox'+ret['nameID'][i]).addClass('excludedMaxTemperature');
                    }
                    else{
                        $('#infoBox'+ret['nameID'][i]).not('.excludedYelp').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').find('.infoPic').css("opacity","1");
                        $('#infoBox'+ret['nameID'][i]).not('.excludedYelp').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').css("color","#337ab7");
                        $('#infoBox'+ret['nameID'][i]).removeClass('excludedMaxTemperature');
                    }
                    if(minTemperatureCampground<minTemperature){
                        $('#infoBox'+ret['nameID'][i]).find('.infoPic').css("opacity","0.1");
                        $('#infoBox'+ret['nameID'][i]).css("color","grey");
                        $('#infoBox'+ret['nameID'][i]).addClass('excludedMinTemperature');
                    }
                    else{
                        $('#infoBox'+ret['nameID'][i]).not('.excludedYelp').not('.excludedBooking').not('.excludedDistance').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
                        $('#infoBox'+ret['nameID'][i]).not('.excludedYelp').not('.excludedBooking').not('.excludedDistance').not('.excludedMaxTemperature').css("color","#337ab7");
                        $('#infoBox'+ret['nameID'][i]).removeClass('excludedMinTemperature');
                    }

                }//for
            }//success
        });//ajax
    });//on

    $(document).on('click','.startLocation',function(){
        var startLocation=$(this).text();
        $('#startLocationTitle').text(startLocation)
        if($('.infoBox').length!=0){
            $.ajax({
                type: 'POST',
                // Provide correct Content-Type, so that Flask will know how to process it.
                contentType: 'application/json',
                // Encode data as JSON.
                data: JSON.stringify({
                  'startLocation': startLocation, 'pageID': $(document).find('html').attr('id')
                }),
                // This is the type of data expected back from the server.
                dataType: 'json',
                url: '/_locationChoice',
                success: function (ret) {
                    for(i in ret['nameID']){
                        $('#infoBox'+ret['nameID'][i]).find('.infoBoxDistance').text('Distance: '+ret['distance'][i]);
                        var maxDistance=$('#distanceRange').val().split(' ')[0];
                        if($('#infoBox'+ret['nameID'][i]).find('.infoBoxDistance').text().split(' ').length==5 && parseInt($('#infoBox'+ret['nameID'][i]).find('.infoBoxDistance').text().split(' ')[1])>=parseInt(maxDistance)){
                            $('#infoBox'+ret['nameID'][i]).find('.infoPic').css("opacity","0.1");
                            $('#infoBox'+ret['nameID'][i]).css("color","grey");
                            $('#infoBox'+ret['nameID'][i]).addClass('excludedDistance');
                        }
                        else{
                            $('#infoBox'+ret['nameID'][i]).not('.excludedYelp').not('.excludedBooking').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
                            $('#infoBox'+ret['nameID'][i]).not('.excludedYelp').not('.excludedBooking').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
                            $('#infoBox'+ret['nameID'][i]).removeClass('excludedDistance');
                        }
                    }
                }//success
            });//ajax
        }
    });//on


    $('#booking1').popover({ trigger: "hover" });
    $('#booking2').popover({ trigger: "hover" });
    $('#booking3').popover({ trigger: "hover" });
    $('#booking4').popover({ trigger: "hover" });
    $('#yelp1').popover({ trigger: "hover" });
    $('#yelp2').popover({ trigger: "hover" });
    $('#yelp3').popover({ trigger: "hover" });
    $('#yelp4').popover({ trigger: "hover" });
    $('#yelp5').popover({ trigger: "hover" });
    $('#startLocationTitle').popover({ trigger: "hover" });
    $('#maxDistanceTitle').popover({ trigger: "hover" });
    $('#weatherMonthTitle').popover({ trigger: "hover" });
    $('#minTemperatureTitle').popover({ trigger: "hover" });
    $('#maxTemperatureTitle').popover({ trigger: "hover" });

    $(document).on('mouseover','.infoBox',function(){
        if(!$(this).hasClass('excludedYelp') && !$(this).hasClass('excludedBooking') && !$(this).hasClass('excludedDistance') && !$(this).hasClass('excludedMaxTemperature') && !$(this).hasClass('excludedMinTemperature')){
            $(this).find('.infoPic').css("opacity","0.2");}
        $(this).find('.infoText').css("display","inline");
    });

    $(document).on('mouseout','.infoBox',function(){
        if(!$(this).hasClass('excludedYelp') && !$(this).hasClass('excludedBooking') && !$(this).hasClass('excludedDistance') && !$(this).hasClass('excludedMaxTemperature') && !$(this).hasClass('excludedMinTemperature')){
            $(this).find('.infoPic').css("opacity","1");}
        $(this).find('.infoText').css("display","none");
    });

    $(document).on('click','#yelp1',function(){
        $('#yelp5').removeClass('btn-warning');
        $('#yelp4').removeClass('btn-warning');
        $('#yelp3').removeClass('btn-warning');
        $('#yelp2').removeClass('btn-warning');
        $('#yelp1').addClass('btn-warning');

        $('.yelp1').removeClass('excludedYelp');
        $('.yelp2').removeClass('excludedYelp');
        $('.yelp3').removeClass('excludedYelp');
        $('.yelp4').removeClass('excludedYelp');
        $('.yelp5').removeClass('excludedYelp');

        $('.yelp1').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp1').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp2').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp2').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp3').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp3').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp4').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp4').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
    });

    $(document).on('click','#yelp2',function(){
        $('#yelp5').removeClass('btn-warning');
        $('#yelp4').removeClass('btn-warning');
        $('#yelp3').removeClass('btn-warning');
        $('#yelp2').addClass('btn-warning');
        $('#yelp1').addClass('btn-warning');

        $('.yelp1').addClass('excludedYelp');
        $('.yelp2').removeClass('excludedYelp');
        $('.yelp3').removeClass('excludedYelp');
        $('.yelp4').removeClass('excludedYelp');
        $('.yelp5').removeClass('excludedYelp');

        $('.yelp1').find('.infoPic').css("opacity","0.1");
        $('.yelp1').css("color","grey");

        $('.yelp2').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp2').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp3').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp3').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp4').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp4').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
    });

    $(document).on('click','#yelp3',function(){
        $('#yelp5').removeClass('btn-warning');
        $('#yelp4').removeClass('btn-warning');
        $('#yelp3').addClass('btn-warning');
        $('#yelp2').addClass('btn-warning');
        $('#yelp1').addClass('btn-warning');

        $('.yelp1').addClass('excludedYelp');
        $('.yelp2').addClass('excludedYelp');
        $('.yelp3').removeClass('excludedYelp');
        $('.yelp4').removeClass('excludedYelp');
        $('.yelp5').removeClass('excludedYelp');

        $('.yelp1').find('.infoPic').css("opacity","0.1");
        $('.yelp1').css("color","grey");
        $('.yelp2').find('.infoPic').css("opacity","0.1");
        $('.yelp2').css("color","grey");

        $('.yelp3').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp3').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp4').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp4').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
    });


    $(document).on('click','#yelp4',function(){
        $('#yelp5').removeClass('btn-warning');
        $('#yelp4').addClass('btn-warning');
        $('#yelp3').addClass('btn-warning');
        $('#yelp2').addClass('btn-warning');
        $('#yelp1').addClass('btn-warning');

        $('.yelp1').addClass('excludedYelp');
        $('.yelp2').addClass('excludedYelp');
        $('.yelp3').addClass('excludedYelp');
        $('.yelp4').removeClass('excludedYelp');
        $('.yelp5').removeClass('excludedYelp');

        $('.yelp1').find('.infoPic').css("opacity","0.1");
        $('.yelp1').css("color","grey");
        $('.yelp2').find('.infoPic').css("opacity","0.1");
        $('.yelp2').css("color","grey");
        $('.yelp3').find('.infoPic').css("opacity","0.1");
        $('.yelp3').css("color","grey");

        $('.yelp4').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp4').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
    });

    $(document).on('click','#yelp5',function(){
        $('#yelp5').addClass('btn-warning');
        $('#yelp4').addClass('btn-warning');
        $('#yelp3').addClass('btn-warning');
        $('#yelp2').addClass('btn-warning');
        $('#yelp1').addClass('btn-warning');

        $('.yelp1').addClass('excludedYelp');
        $('.yelp2').addClass('excludedYelp');
        $('.yelp3').addClass('excludedYelp');
        $('.yelp4').addClass('excludedYelp');
        $('.yelp5').removeClass('excludedYelp');

        $('.yelp1').find('.infoPic').css("opacity","0.1");
        $('.yelp1').css("color","grey");
        $('.yelp2').find('.infoPic').css("opacity","0.1");
        $('.yelp2').css("color","grey");
        $('.yelp3').find('.infoPic').css("opacity","0.1");
        $('.yelp3').css("color","grey");
        $('.yelp4').find('.infoPic').css("opacity","0.1");
        $('.yelp4').css("color","grey");

        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.yelp5').not('.excludedBooking').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
    });

    $(document).on('click','#booking1',function(){
        $('#booking4').removeClass('btn-warning');
        $('#booking3').removeClass('btn-warning');
        $('#booking2').removeClass('btn-warning');
        $('#booking1').addClass('btn-warning');

        $('.booking1').removeClass('excludedBooking');
        $('.booking2').addClass('excludedBooking');
        $('.booking3').addClass('excludedBooking');
        $('.booking4').addClass('excludedBooking');

        $('.booking1').not('.excludedYelp').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.booking1').not('.excludedYelp').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");

        $('.booking2').find('.infoPic').css("opacity","0.1");
        $('.booking2').css("color","grey");
        $('.booking3').find('.infoPic').css("opacity","0.1");
        $('.booking3').css("color","grey");
        $('.booking4').find('.infoPic').css("opacity","0.1");
        $('.booking4').css("color","grey");

    });


    $(document).on('click','#booking2',function(){
        $('#booking4').removeClass('btn-warning');
        $('#booking3').removeClass('btn-warning');
        $('#booking2').addClass('btn-warning');
        $('#booking1').removeClass('btn-warning');

        $('.booking1').addClass('excludedBooking');
        $('.booking2').removeClass('excludedBooking');
        $('.booking3').addClass('excludedBooking');
        $('.booking4').addClass('excludedBooking');

        $('.booking2').not('.excludedYelp').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.booking2').not('.excludedYelp').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.booking1').find('.infoPic').css("opacity","0.1");
        $('.booking1').css("color","grey");
        $('.booking3').find('.infoPic').css("opacity","0.1");
        $('.booking3').css("color","grey");
        $('.booking4').find('.infoPic').css("opacity","0.1");
        $('.booking4').css("color","grey");
    });

    $(document).on('click','#booking3',function(){
        $('#booking4').removeClass('btn-warning');
        $('#booking3').addClass('btn-warning');
        $('#booking2').removeClass('btn-warning');
        $('#booking1').removeClass('btn-warning');

        $('.booking1').addClass('excludedBooking');
        $('.booking2').addClass('excludedBooking');
        $('.booking3').removeClass('excludedBooking');
        $('.booking4').addClass('excludedBooking');

        $('.booking3').not('.excludedYelp').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.booking3').not('.excludedYelp').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.booking1').find('.infoPic').css("opacity","0.1");
        $('.booking1').css("color","grey");
        $('.booking2').find('.infoPic').css("opacity","0.1");
        $('.booking2').css("color","grey");
        $('.booking4').find('.infoPic').css("opacity","0.1");
        $('.booking4').css("color","grey");
    });

    $(document).on('click','#booking4',function(){
        $('#booking4').addClass('btn-warning');
        $('#booking3').removeClass('btn-warning');
        $('#booking2').removeClass('btn-warning');
        $('#booking1').removeClass('btn-warning');

        $('.booking1').addClass('excludedBooking');
        $('.booking2').addClass('excludedBooking');
        $('.booking3').addClass('excludedBooking');
        $('.booking4').removeClass('excludedBooking');

        $('.booking4').not('.excludedYelp').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').find('.infoPic').css("opacity","1");
        $('.booking4').not('.excludedYelp').not('.excludedDistance').not('.excludedMinTemperature').not('.excludedMaxTemperature').css("color","#337ab7");
        $('.booking1').find('.infoPic').css("opacity","0.1");
        $('.booking1').css("color","grey");
        $('.booking2').find('.infoPic').css("opacity","0.1");
        $('.booking2').css("color","grey");
        $('.booking3').find('.infoPic').css("opacity","0.1");
        $('.booking3').css("color","grey");
    });




    /*****Map Functions*****/
    function createMap(){
        setTimeout(function() {//we wait for the tab to appear
            var myLatlng = new google.maps.LatLng(37,-120);//create a new map assuming we are centered on california
            var mapOptions = {
                zoom: 6,//zoom out so we can see every thing
                center: myLatlng//center defined above
            };
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);//create the map with the options above
            var infowindow = new google.maps.InfoWindow();
            $.ajax({//call flask to get the locations on the map
                type: 'POST',// Provide correct Content-Type, so that Flask will know how to process it.
                contentType: 'application/json',// Encode data as JSON.
                data: JSON.stringify({//tell flask which page we are on
                    'pageID': $(document).find('html').attr('id')
                }),// This is the type of data expected back from the server.
                dataType: 'json',
                url: '/_mapMarkers',//this is the url with the info
                success: function (ret) {//if we succeeded
                    for(item in ret['markers']){//go through each 
                        var myLatlng = new google.maps.LatLng(ret['markers'][item]['latitude'],ret['markers'][item]['longitude']);
                        if(ret['markers'][item]['color']=='blue'){
                            var marker = new google.maps.Marker({
                                position: myLatlng,
                                map: map,
                                icon: '/blueMarker'
                            });
                        }
                        else if(ret['markers'][item]['color']=='green'){
                            var marker = new google.maps.Marker({
                                position: myLatlng,
                                map: map,
                                icon: '/greenMarker'
                            });
                        }
                        marker.excludedBooking=0;
                        marker.excludedYelp=0;
                        marker.excludedDistance=0;
                        marker.excludedMinTemperature=0;
                        marker.excludedMaxTemperature=0;
                        marker.distanceString=''
                        marker.temperatureString=''
                        marker.contentString='<a href="/campground/'+ret['markers'][item]['nameID']+'" id="'+ret['markers'][item]['nameID']+'" '+
                            'class="yelpRating'+ret['markers'][item]['yelpRating'][0]+' bookingDifficulty'+ret['markers'][item]['bookingDifficulty']+'">'+
                            '<h6>'+ret['markers'][item]['name']+'</h6>'+
                            '<div class="row"><div class="col-md-12"><b>Distance:</b> '+marker.distanceString+'</div></div>'+
                            '<div class="row"><div class="col-md-12"><b>minT/maxT:</b> '+marker.temperatureString+'</div></div>'+
                            '<div class="row"><div class="col-md-12"><b>Yelp Rating:</b>'+ret['markers'][item]['yelpRating']+'</div></div>';
                            if(ret['markers'][item]['bookingDifficulty']==1)
                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Usually space the next weekend.</div></div>';
                            if(ret['markers'][item]['bookingDifficulty']==2)
                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of weeks ahead of time.</div></div>';
                            if(ret['markers'][item]['bookingDifficulty']==3)
                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of months ahead of time.</div></div>';
                            if(ret['markers'][item]['bookingDifficulty']==4)
                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book as soon as booking is allowed.</div></div>';
                            marker.contentString+='<div class="row"><div class="col-md-8"><b>Climate:</b> '+ret['markers'][item]['climate']+'</div></div></a>';
                        google.maps.event.addListener(marker, 'mouseover', (function(marker, item) {
                            return function() {
                                infowindow.setContent(marker.contentString);
                                infowindow.open(map, marker);
                            };
                        })(marker, item));

                        $(document).on('click','#clearAll',(function(marker,item,infowindow){
                            return function(){
                                marker.excludedBooking=0;
                                marker.excludedYelp=0;
                                marker.excludedDistance=0;
                                marker.excludedMinTemperature=0;
                                marker.excludedMaxTemperature=0;
                                marker.distanceString=''
                                marker.temperatureString=''
                                marker.contentString='<a href="/campground/'+ret['markers'][item]['nameID']+'" id="'+ret['markers'][item]['nameID']+'" '+
                                    'class="yelpRating'+ret['markers'][item]['yelpRating'][0]+' bookingDifficulty'+ret['markers'][item]['bookingDifficulty']+'">'+
                                    '<h6>'+ret['markers'][item]['name']+'</h6>'+
                                    '<div class="row"><div class="col-md-12"><b>Distance:</b> '+marker.distanceString+'</div></div>'+
                                    '<div class="row"><div class="col-md-12"><b>minT/maxT:</b> '+marker.temperatureString+'</div></div>'+
                                    '<div class="row"><div class="col-md-12"><b>Yelp Rating:</b>'+ret['markers'][item]['yelpRating']+'</div></div>';
                                    if(ret['markers'][item]['bookingDifficulty']==1)
                                        marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Usually space the next weekend.</div></div>';
                                    if(ret['markers'][item]['bookingDifficulty']==2)
                                        marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of weeks ahead of time.</div></div>';
                                    if(ret['markers'][item]['bookingDifficulty']==3)
                                        marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of months ahead of time.</div></div>';
                                    if(ret['markers'][item]['bookingDifficulty']==4)
                                        marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book as soon as booking is allowed.</div></div>';
                                    marker.contentString+='<div class="row"><div class="col-md-8"><b>Climate:</b> '+ret['markers'][item]['climate']+'</div></div></a>';
                                marker.setIcon("/blueMarker");
                            };
                        })(marker,item,infowindow));

                        $(document).on('click','.weatherMonth',(function(marker,item,infowindow){
                            return function(){
                                    var weatherMonth=$(this).text();
                                    $.ajax({
                                        type: 'POST',
                                        // Provide correct Content-Type, so that Flask will know how to process it.
                                        contentType: 'application/json',
                                        // Encode data as JSON.
                                        data: JSON.stringify({
                                          'weatherMonth': weatherMonth, 'nameID': ret['markers'][item]['nameID'], 'pageID': $(document).find('html').attr('id')
                                        }),
                                        // This is the type of data expected back from the server.
                                        dataType: 'json',
                                        url: '/_weatherMonthSingle',
                                        success: function (ret2) {

                                            marker.temperatureString=parseInt(ret2['minTemp']/10.0)+'/'+parseInt(ret2['maxTemp']/10.0)+' F'
                                            marker.contentString='<a href="/campground/'+ret['markers'][item]['nameID']+'" id="'+ret['markers'][item]['nameID']+'" '+
                                                    'class="yelpRating'+ret['markers'][item]['yelpRating'][0]+' bookingDifficulty'+ret['markers'][item]['bookingDifficulty']+'">'+
                                                    '<h6>'+ret['markers'][item]['name']+'</h6>'+
                                                    '<div class="row"><div class="col-md-12"><b>Distance:</b> '+marker.distanceString+'</div></div>'+
                                                    '<div class="row"><div class="col-md-12"><b>minT/maxT:</b> '+marker.temperatureString+'</div></div>'+
                                                    '<div class="row"><div class="col-md-12"><b>Yelp Rating:</b>'+ret['markers'][item]['yelpRating']+'</div></div>';
                                            if(ret['markers'][item]['bookingDifficulty']==1)
                                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Usually space the next weekend.</div></div>';
                                            if(ret['markers'][item]['bookingDifficulty']==2)
                                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of weeks ahead of time.</div></div>';
                                            if(ret['markers'][item]['bookingDifficulty']==3)
                                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of months ahead of time.</div></div>';
                                            if(ret['markers'][item]['bookingDifficulty']==4)
                                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book as soon as booking is allowed.</div></div>';
                                            marker.contentString+='<div class="row"><div class="col-md-8"><b>Climate:</b> '+ret['markers'][item]['climate']+'</div></div></a>';
                                            var minTemperature=parseInt($('#slider-range').slider('values',0));
                                            var maxTemperature=parseInt($('#slider-range').slider('values',1))
                                            if(parseInt(ret2['minTemp']/10.0)<minTemperature){
                                                    marker.excludedMinTemperature=1;
                                            }
                                            else{marker.excludedMinTemperature=0;}
                                            if(parseInt(ret2['maxTemp']/10.0)>maxTemperature){
                                                marker.excludedMaxTemperature=1;
                                            }
                                            else{marker.excludedMaxTemperature=0;}
                                            if(!(parseInt(ret2['minTemp']/10.0)<minTemperature) &&
                                            !(parseInt(ret2['maxTemp']/10.0)>maxTemperature) &&
                                            marker.excludedDistance!=1 && marker.excludedBooking!=1 && marker.excludedYelp!=1){
                                                marker.setIcon("/blueMarker");
                                            }
                                            else{
                                                var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                                marker.setIcon(pinIcon);
                                            }
                                        }
                                    });//ajax  
                            };
                        })(marker,item,infowindow));

                        $(document).on('slide','#slider-range',(function(marker,item){
                            return function(){
                                var minTemperature=parseInt($('#slider-range').slider('values',0));
                                var maxTemperature=parseInt($('#slider-range').slider('values',1));
                                if($('#weatherMonthTitle').text()!='Month'){
                                    var minTemperatureCampground=parseInt(marker.temperatureString.split(' ')[0].split('/')[0]);
                                    var maxTemperatureCampground=parseInt(marker.temperatureString.split(' ')[0].split('/')[1]);
                                    if(minTemperatureCampground<minTemperature){
                                        var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                        marker.setIcon(pinIcon);
                                        marker.excludedMinTemperature=1;
                                    }
                                    else if(marker.excludedDistance!=1 && marker.excludedBooking!=1 && marker.excludedYelp!=1 &&
                                    marker.excludedMaxTemperature!=1){
                                        marker.excludedMinTemperature=0;
                                        marker.setIcon("/blueMarker");
                                    }
                                    else{marker.excludedMinTemperature=0;}
                                    if(maxTemperatureCampground>maxTemperature){
                                        var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                        marker.setIcon(pinIcon);
                                        marker.excludedMaxTemperature=1;
                                    }
                                    else if(marker.excludedDistance!=1 && marker.excludedBooking!=1 && marker.excludedYelp!=1 &&
                                    marker.excludedMinTemperature!=1){
                                        marker.excludedMaxTemperature=0;
                                        marker.setIcon("/blueMarker");
                                    }
                                    else{marker.excludedMaxTemperature=0;}
                                }
                            };
                        })(marker,item));

                        $(document).on('slide','#sliderDistance',(function(marker,item){
                            return function(){
                                if($('#startLocationTitle').text()!='Start Location'){
                                    var maxDistance=parseInt($('#sliderDistance').slider('value'));
                                    var startLocation=$('#startLocationTitle').text();
                                    $.ajax({
                                        type: 'POST',
                                        // Provide correct Content-Type, so that Flask will know how to process it.
                                        contentType: 'application/json',
                                        // Encode data as JSON.
                                        data: JSON.stringify({
                                          'startLocation': startLocation, 'nameID': ret['markers'][item]['nameID'],'pageID': $(document).find('html').attr('id')
                                        }),
                                        // This is the type of data expected back from the server.
                                        dataType: 'json',
                                        url: '/_locationChoiceSingle',
                                        success: function (ret2) {
                                            marker.distanceString=ret2['distance'];
                                            marker.contentString='<a href="/campground/'+ret['markers'][item]['nameID']+'" id="'+ret['markers'][item]['nameID']+'" '+
                                                        'class="yelpRating'+ret['markers'][item]['yelpRating'][0]+' bookingDifficulty'+ret['markers'][item]['bookingDifficulty']+'">'+
                                                        '<h6>'+ret['markers'][item]['name']+'</h6>'+
                                                        '<div class="row"><div class="col-md-12"><b>Distance:</b> '+marker.distanceString+'</div></div>'+
                                                        '<div class="row"><div class="col-md-12"><b>minT/maxT:</b> '+marker.temperatureString+'</div></div>'+
                                                        '<div class="row"><div class="col-md-12"><b>Yelp Rating:</b>'+ret['markers'][item]['yelpRating']+'</div></div>';
                                            if(ret['markers'][item]['bookingDifficulty']==1)
                                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Usually space the next weekend.</div></div>';
                                            if(ret['markers'][item]['bookingDifficulty']==2)
                                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of weeks ahead of time.</div></div>';
                                            if(ret['markers'][item]['bookingDifficulty']==3)
                                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of months ahead of time.</div></div>';
                                            if(ret['markers'][item]['bookingDifficulty']==4)
                                                marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book as soon as booking is allowed.</div></div>';
                                            marker.contentString+='<div class="row"><div class="col-md-8"><b>Climate:</b> '+ret['markers'][item]['climate']+'</div></div></a>';
                                            if(ret2['distance'].split(' ').length==4 && parseInt(ret2['distance'].split(' ')[0])>=parseInt(maxDistance)){
                                                var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                                marker.setIcon(pinIcon);
                                                marker.excludedDistance=1;
                                            }
                                            else if(marker.excludedBooking!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1
                                            && marker.excludedYelp!=1){
                                                marker.setIcon("/blueMarker");
                                                marker.excludedDistance=0;
                                            }
                                            else{marker.excludedDistance=0;}
                                        }//success
                                    });//ajax
                                }//if location chosen
                            };
                        })(marker,item));


                        $(document).on('click','.startLocation',(function(marker,item){
                            return function(){
                                var startLocation=$(this).text();
                                $.ajax({
                                    type: 'POST',
                                    // Provide correct Content-Type, so that Flask will know how to process it.
                                    contentType: 'application/json',
                                    // Encode data as JSON.
                                    data: JSON.stringify({
                                    'startLocation': startLocation, 'nameID': ret['markers'][item]['nameID'],'pageID': $(document).find('html').attr('id')
                                    }),
                                    // This is the type of data expected back from the server.
                                    dataType: 'json',
                                    url: '/_locationChoiceSingle',
                                    success: function (ret2) {
                                        var maxDistance=parseInt($("#sliderDistance").slider("value"));
                                        marker.distanceString=ret2['distance'];
                                        marker.contentString='<a href="/campground/'+ret['markers'][item]['nameID']+'" id="'+ret['markers'][item]['nameID']+'" '+
                                                    'class="yelpRating'+ret['markers'][item]['yelpRating'][0]+' bookingDifficulty'+ret['markers'][item]['bookingDifficulty']+'">'+
                                                    '<h6>'+ret['markers'][item]['name']+'</h6>'+
                                                    '<div class="row"><div class="col-md-12"><b>Distance:</b> '+marker.distanceString+'</div></div>'+
                                                    '<div class="row"><div class="col-md-12"><b>minT/maxT:</b> '+marker.temperatureString+'</div></div>'+
                                                    '<div class="row"><div class="col-md-12"><b>Yelp Rating:</b>'+ret['markers'][item]['yelpRating']+'</div></div>';
                                        if(ret['markers'][item]['bookingDifficulty']==1)
                                            marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Usually space the next weekend.</div></div>';
                                        if(ret['markers'][item]['bookingDifficulty']==2)
                                            marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of weeks ahead of time.</div></div>';
                                        if(ret['markers'][item]['bookingDifficulty']==3)
                                            marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book a couple of months ahead of time.</div></div>';
                                        if(ret['markers'][item]['bookingDifficulty']==4)
                                            marker.contentString+='<div class="row"><div class="col-md-12"><b>Booking Difficulty:</b> Book as soon as booking is allowed.</div></div>';
                                        marker.contentString+='<div class="row"><div class="col-md-8"><b>Climate:</b> '+ret['markers'][item]['climate']+'</div></div></a>';
                                        if(ret2['distance'].split(' ').length==4 && parseInt(ret2['distance'].split(' ')[0])>=parseInt(maxDistance)){
                                            var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                            marker.setIcon(pinIcon); 
                                            marker.excludedDistance=1; 
                                        }
                                        else if(marker.excludedBooking!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1
                                        && marker.excludedYelp!=1){
                                            marker.setIcon("/blueMarker");
                                            marker.excludedDistance=0;
                                        }
                                        else{marker.excludedDistance=0;}  
                                    }//success
                                });//ajax
                            };
                        })(marker,item));

                        $(document).on('click','#yelp1',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['yelpRating'][0]>=1){marker.excludedYelp=0;}
                                else{marker.excludedYelp=1;}

                                if(ret['markers'][item]['yelpRating'][0]>=1 && marker.excludedBooking!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                    marker.setIcon("/blueMarker");
                                }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                }
                            };
                        })(marker,item));

                        $(document).on('click','#yelp2',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['yelpRating'][0]>=2){marker.excludedYelp=0;}
                                else{marker.excludedYelp=1;}

                                if(ret['markers'][item]['yelpRating'][0]>=2 && marker.excludedBooking!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                    marker.setIcon("/blueMarker");
                                }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                }
                            };
                        })(marker,item));

                        $(document).on('click','#yelp3',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['yelpRating'][0]>=3){marker.excludedYelp=0;}
                                else{marker.excludedYelp=1;}

                                if(ret['markers'][item]['yelpRating'][0]>=3 && marker.excludedBooking!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                    marker.setIcon("/blueMarker");
                                }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                }
                            };
                        })(marker,item));

                        $(document).on('click','#yelp4',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['yelpRating'][0]>=4){marker.excludedYelp=0;}
                                else{marker.excludedYelp=1;}

                                if(ret['markers'][item]['yelpRating'][0]>=4 && marker.excludedBooking!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                    marker.setIcon("/blueMarker");
                                }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                }
                            };
                        })(marker,item));

                        $(document).on('click','#yelp5',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['yelpRating'][0]>=5){marker.excludedYelp=0;}
                                else{marker.excludedYelp=1;}

                                if(ret['markers'][item]['yelpRating'][0]>=5 && marker.excludedBooking!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                    marker.setIcon("/blueMarker");
                                }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                }
                            };
                        })(marker,item));



                        $(document).on('click','#booking1',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['bookingDifficulty']==1){marker.excludedBooking=0;}
                                else{marker.excludedBooking=1;}

                                if(ret['markers'][item]['bookingDifficulty']==1 && marker.excludedYelp!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                   marker.setIcon("/blueMarker");
                                    marker.excludedBooking=0;                        }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                    marker.excludedBooking=1;
                                }
                            };
                        })(marker,item));

                        $(document).on('click','#booking2',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['bookingDifficulty']==2){marker.excludedBooking=0;}
                                else{marker.excludedBooking=1;}

                                if(ret['markers'][item]['bookingDifficulty']==2 && marker.excludedYelp!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                   marker.setIcon("/blueMarker");
                                    marker.excludedBooking=0;                        }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                    marker.excludedBooking=1;
                                }
                            };
                        })(marker,item));

                        $(document).on('click','#booking3',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['bookingDifficulty']==3){marker.excludedBooking=0;}
                                else{marker.excludedBooking=1;}

                                if(ret['markers'][item]['bookingDifficulty']==3 && marker.excludedYelp!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                   marker.setIcon("/blueMarker");
                                    marker.excludedBooking=0;                        }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                    marker.excludedBooking=1;
                                }
                            };
                        })(marker,item));

                        $(document).on('click','#booking4',(function(marker,item){
                            return function(){
                                if(ret['markers'][item]['bookingDifficulty']==4){marker.excludedBooking=0;}
                                else{marker.excludedBooking=1;}

                                if(ret['markers'][item]['bookingDifficulty']==4 && marker.excludedYelp!=1
                                && marker.excludedDistance!=1 && marker.excludedMaxTemperature!=1 && marker.excludedMinTemperature!=1){
                                   marker.setIcon("/blueMarker");
                                    marker.excludedBooking=0;                        }
                                else{
                                    var pinIcon = new google.maps.MarkerImage("/greyMarker",null,null,null,new google.maps.Size(18,31.5));
                                    marker.setIcon(pinIcon);
                                    marker.excludedBooking=1;
                                }
                            };
                        })(marker,item));

                    }//for
                }//success
            });//ajax
            if($('#nearbyTable').length!=0){
                $.ajax({//call flask to get the locations on the map
                    type: 'POST',// Provide correct Content-Type, so that Flask will know how to process it.
                    contentType: 'application/json',// Encode data as JSON.
                    data: JSON.stringify({//tell flask which page we are on
                        'pageID': $(document).find('html').attr('id'),
                    }),// This is the type of data expected back from the server.
                    dataType: 'json',
                    url: '/_getNearby',//this is the url with the info
                    success: function (ret) {//if we succeeded
                        for(index=0;index<ret['name'].length;index++){
                            var line='<tr id="nearby'+ret['nameID'][index]+'"><td><div class="row"><a><div class="col-xs-7">'+ret['name'][index]+'</div>';
                            line+='<div class="col-xs-5">'+ret['distHour'][index]+' hrs '+ret['distMinute'][index]+' mins</div>';
                            line+='</a><div></td></tr>';
                            $('#nearbyTable').append(line);
                            var myLatlngNearby = new google.maps.LatLng(ret['latitude'][index],ret['longitude'][index]);
                            
                            var markerNearby = new google.maps.Marker({
                                position: myLatlngNearby,
                                map: map,
                                icon: '/greenMarker'
                            });
                            google.maps.event.addListener(markerNearby, 'mouseover', (function(markerNearby, index) {
                                return function() {
                                    markerNearby.contentString='<a href="/campground/'+ret['nameID'][index]+'" id="'+ret['nameID'][index]+'" '+
                                                'class="yelpRating'+ret['yelpRating'][index][0]+' bookingDifficulty'+ret['bookingDifficulty'][index]+'">'+
                                                '<h6>'+ret['name'][index]+'</h6>'+
                                                '<div class="row"><div class="col-md-12">Distance: '+ret['distHour'][index]+' hrs '+ret['distMinute'][index]+' mins'+'</div></div>'+
                                                '<div class="row"><div class="col-md-12">minT/maxT (current month): '+ret['minTemp'][index]+'/'+ret['maxTemp'][index]+' F</div></div>'+
                                                '<div class="row"><div class="col-md-12">Yelp Rating:'+ret['yelpRating'][index]+'</div></div>';
                                    if(ret['markers'][item]['bookingDifficulty']==1)
                                        marker.contentString+='<div class="row"><div class="col-md-12">Booking Difficulty: Usually space the next weekend.</div></div></a>';
                                    if(ret['markers'][item]['bookingDifficulty']==2)
                                        marker.contentString+='<div class="row"><div class="col-md-12">Booking Difficulty: Book a couple of weeks ahead of time.</div></div></a>';
                                    if(ret['markers'][item]['bookingDifficulty']==3)
                                        marker.contentString+='<div class="row"><div class="col-md-12">Booking Difficulty: Book a couple of months ahead of time.</div></div></a>';
                                    if(ret['markers'][item]['bookingDifficulty']==4)
                                        marker.contentString+='<div class="row"><div class="col-md-12">Booking Difficulty: Book as soon as booking is allowed.</div></div></a>';
                                    infowindow.setContent(markerNearby.contentString);
                                    infowindow.open(map, markerNearby);
                                };
                            })(markerNearby, index));
                          $(document).on('mouseover','#nearby'+ret['nameID'][index],(function(markerNearby,index){
                                return function() {
                                    markerNearby.setIcon("/redMarker");
                                    //markerNearby.setAnimation(google.maps.Animation.BOUNCE);
                                };
                            })(markerNearby,index));

                            $(document).on('mouseout','#nearby'+ret['nameID'][index],(function(markerNearby,index){
                                return function() {
                                    markerNearby.setIcon("/greenMarker");
                                    //if (markerNearby.getAnimation() != null) {
                                    //markerNearby.setAnimation(null);}
                                };
                            })(markerNearby,index));
                        }//for
                    }//success
                });//ajax
            }//if
        },2500);//timeout
    };//map function
    /****End Map Functions******/



        if($('#map').length!=0){
            createMap();
        }
        $(document).on('click','#mapTab',function() {
            createMap();
        }); 

        if($('#similarTable').length!=0){
              $.ajax({//call flask to get the locations on the map
                type: 'POST',// Provide correct Content-Type, so that Flask will know how to process it.
                contentType: 'application/json',// Encode data as JSON.
                data: JSON.stringify({//tell flask which page we are on
                    'pageID':$(document).find('html').attr('id')
                }),// This is the type of data expected back from the server.
                dataType: 'json',
                url: '/_getSimilar',//this is the url with the info
                success: function (ret) {//if we succeeded
                for (var i = 0; i < ret['name'].length; i++) {
                    if(i%3==0){
                        $('#similarTable').append('<div class="row" style="padding-top:50px"><div class="col-md-12">');
                    }
                    stringLine='<div class="col-md-4"><a class="infoBox" href="/campground/'+ret['nameID'][i]+'">';
                    stringLine+='<img class="infoPic" src="/photos/'+ret['nameID'][i]+'" style="width:304px;height:228px;">';
                    stringLine+='<div class="infoText" style="top:0;left:0;position:absolute;padding:50px;display:None">';
                    stringLine+='<div class="row"><div class="col-md-12 infoBoxDistance">Distance: '+ret['distance'][i]+'</div></div>';
                    stringLine+='<div class="row"><div class="col-md-12 infoBoxTemperature">minT/maxT (current month): '+ret['temperature'][i]+'</div></div>';
                    stringLine+='<div class="row"><div class="col-md-12">Yelp Rating: '+ret['yelpRating'][i]+'</div></div>';
                    stringLine+='<div class="row"><div class="col-md-12">Booking Difficulty:</div></div><div class="row"><div class="col-md-12">'
                    stringLine+=ret['bookingDifficulty'][i]+'</div></div>';
                    stringLine+='</div><h2>'+ret['name'][i]+'</h2></a></div>';
                    $('#similarTable').append(stringLine);
                    if((i+1)%3==0){
                        $('#similarTable').append('</div></div>');
                    }//if
                }//for
            }//success
        });//ajax
    }//if


    /******Calendar Functions********/
    $(document).on('click','.month.noclick',function() {
        fillMonth($(this));
    });

    /********************/

    $(document).on('click','#calendarTab',function() {
        window.open("/calendarWindow/"+$('html').attr('id'));
    });


    /********************/

    function fillMonth(monthElement){
        $.ajax({//call flask to get the locations on the map
            type: 'POST',// Provide correct Content-Type, so that Flask will know how to process it.
            contentType: 'application/json',// Encode data as JSON.
            data: JSON.stringify({//tell flask which page we are on
                'month': $('.month.noclick.active').text().split(" ")[0],
                'year':$('.month.noclick.active').text().split(" ")[1],
                'pageID':$(document).find('html').attr('id')
            }),// This is the type of data expected back from the server.
            dataType: 'json',
            url: '/_getCalendarMonth',//this is the url with the info
            beforeSend:function(){$('#content'+monthElement.attr('id')).prepend('<div class="loading"><img class="img-responsive center-block" src="'+$SCRIPT_ROOT+'/loading" alt="Loading..." width=200 height=200></img></div>');},
            success: function (ret) {//if we succeeded
                $('.loading').remove();
                for(week=0;week<6;week++){//go through each 
                    for(day=0;day<7;day++){
                        cell=$('#content'+monthElement.attr('id')).find('#'+week+'-'+day);
                        if(ret['avaliArray'][week][day]>0){
                            cell.addClass('success availableDate dateChose availableMouseover');
                            cell.find('div').attr("data-toggle","popover");
                            cell.find('div').attr("data-trigger","hover");
                            cell.find('div').attr("data-placement","top");
                            cell.find('div').attr("data-content",ret['avaliArray'][week][day]+" Available");
                            cell.find('div').text(ret['monthArray'][week][day]);
                        }
                        else if(ret['monthArray'][week][day]!=''){
                            cell.addClass("active");
                            cell.find('div').text(ret['monthArray'][week][day]);
                        }
                    }//for
                }//for
                $('#content'+monthElement.attr('id')).find('div').css('visibility','visible').hide().fadeIn('fast');
                monthElement.removeClass('noclick');
            }//success
        });//ajax
    };//fillMonth

    /**********************************/
    $(document).on('click','#calendarPrev',function(){
        $(this).removeClass('active');
        //$(document).find('#calendarPanel').find('.tab-pane.active').hide();
        $(document).find('#calendarPanel').find('.tab-pane.active').removeClass('active');
        $(document).find('#month1').show();
        //$(document).find('#contentmonth1').addClass('active');
        //$(document).find('#month1').addClass('active');
        $(document).find('#month2').show();
        $(document).find('#month3').show();
        $(document).find('#month4').show();
        $(document).find('#month5').hide();
        $(document).find('#month6').hide();
        $(document).find('#month7').hide();
        $(document).find('#month8').hide();
    });

    $(document).on('click','#calendarNext',function(){
        $(this).removeClass('active');
        //$(document).find('#calendarPanel').find('.tab-pane.active').hide();
        $(document).find('#calendarPanel').find('.tab-pane.active').removeClass('active');
        $(document).find('#month5').show();
        //$(document).find('#contentmonth5').addClass('active');
        //$(document).find('#month5').addClass('active');
        $(document).find('#month6').show();
        $(document).find('#month7').show();
        $(document).find('#month8').show();
        $(document).find('#month1').hide();
        $(document).find('#month2').hide();
        $(document).find('#month3').hide();
        $(document).find('#month4').hide();
        //if($('#month5.noclick')[0]){fillMonth($('#month5.noclick'));}
    });

/******End Calendar Functions*******/


/************Weather Functions********/

    $(document).on('click','#weatherTab.unclicked',function(){//create on click
        $(this).removeClass('unclicked');//do not make again 
        currentWeather($(this));
        setTimeout(function() {//wait for tab to appear before beginning
            var svg = dimple.newSvg("#chartContainer", 590, 800);//create 
            $.getJSON($SCRIPT_ROOT + '/weatherData/'+$(document).find('html').attr('id'),function(data) {//find the correct campground in flask
                var myChartTemp = new dimple.chart(svg, data['tempData']);//temperature plot
                myChartTemp.setBounds(60, 30, 505, 305);//set the location and size inside chartContainer
                var x = myChartTemp.addCategoryAxis("x", "MONTH");//create the x axis: month
                x.addOrderRule(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);//order x axis by month
                myChartTemp.addMeasureAxis("y", "Temperature (F)");//add y axis: temperature
                myChartTemp.addSeries(['min/max'], dimple.plot.line);//plot the min/max seperately as lines
                myChartTemp.addSeries(["min/max"], dimple.plot.bubble);//also plot circles
                var myLegend=myChartTemp.addLegend(60, 10, 500, 20,'right');//create the legend for the min/max temperature
                myChartTemp.draw();//now draw it
                var myChartprecip = new dimple.chart(svg, data['precipData']);//plot for precipitation
                myChartprecip.setBounds(60, 430, 505, 305);//create the bonds, below the temp plot
                var x2 = myChartprecip.addCategoryAxis("x", "MONTH");//create the x axis: months
                x2.addOrderRule(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);//order the months
                myChartprecip.addMeasureAxis("y", "Precipitation (in)");//create the y axis: precipitation
                s=myChartprecip.addSeries(null, dimple.plot.area);//fill the plot
                s.interpolation = "step";//do bar plot
                myChartprecip.draw();//draw the plot
            });//json function
        }, 300);//wait for tab to appear before beginning
    });//on clicking the weather tab
    /**********************************/

    function currentWeather(weatherTab){
              $.ajax({//call flask to get the locations on the map
                type: 'POST',// Provide correct Content-Type, so that Flask will know how to process it.
                contentType: 'application/json',// Encode data as JSON.
                data: JSON.stringify({//tell flask which page we are on
                    'pageID': $(document).find('html').attr('id'),
                }),// This is the type of data expected back from the server.
                dataType: 'json',
                url: '/_getWeather',//this is the url with the info
                success: function (ret) {//if we succeeded
                    for(day=0;day<ret['period'].length;day++){
                    var line='<tr><td><div class="row"><div class="col-xs-4"><image src="'+ret['icon'][day]+'"></div>'
                    line+='<div class="col-xs-5"><b>'+ret['period'][day]+':</b> '+ret['condition'][day]+'</div>'
                    line+='<div class="col-xs-3">'+ret['temperature'][day]+' F</div>'
                    line+='<div></td></tr>'
                    $('#currentWeather').append(line);
                }//for
            }//success
        });//ajax

    }//currentWeather


/************End Weather Functions********/



}
$(document).ready(main);
