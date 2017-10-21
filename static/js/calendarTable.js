/******Calendar Functions********/


    $(document).on('click','.month.noclick',function() {
        fillMonth($(this));});

    /********************/

    $(document).on('click','#calendarTab',function() {
    console.log('here')
        fillMonth($('.month.noclick.active'));});

    /********************/

    function fillMonth(monthElement){console.log($('.month.noclick.active').text())
              $.ajax({//call flask to get the locations on the map
                type: 'POST',// Provide correct Content-Type, so that Flask will know how to process it.
                contentType: 'application/json',// Encode data as JSON.
                data: JSON.stringify({//tell flask which page we are on
                    'month': $('.month.noclick.active').text().split(" ")[0],
                    'year':$('.month.noclick.active').text().split(" ")[1],
                    'primaryID':$(document).find('html').attr('id')
                }),// This is the type of data expected back from the server.
                dataType: 'json',
                url: '/_getCalendarMonth',//this is the url with the info
                beforeSend:function(){$('#content'+monthElement.attr('id')).prepend('<div class="loading"><img class="img-responsive center-block" src="'+$SCRIPT_ROOT+'/loading" alt="Loading..." wi
                success: function (ret) {//if we succeeded
                    $('.loading').remove();
                    for(week=0;week<6;week++){//go through each 
                        for(day=0;day<7;day++){
                        //console.log(monthElement)
                        cell=$('#content'+monthElement.attr('id')).find('#'+week+'-'+day)
                        if(ret['avaliArray'][week][day]>0){
                        cell.addClass('success availableDate dateChose availableMouseover');
                        cell.find('div').attr("data-toggle","popover");
                        cell.find('div').attr("data-trigger","hover"); 
                        cell.find('div').attr("data-content",ret['avaliArray'][week][day]+" Available");
                        cell.find('div').text(ret['monthArray'][week][day]);
                        }
                        else if(ret['monthArray'][week][day]!=''){
                        cell.addClass("active");
                        cell.find('div').text(ret['monthArray'][week][day]);
                        }
                    }}
                $('#content'+monthElement.attr('id')).find('div').css('visibility','visible').hide().fadeIn('fast');
                monthElement.removeClass('noclick');
                }
        });

    }

    /**********************************/

    $(document).on('click','#calendarPrev',function(){
        $(this).removeClass('active');
        $(document).find('#calendar').find('.tab-pane.active').removeClass('active');
        $(document).find('#month1').show();
        $(document).find('#contentmonth1').addClass('active');
        $(document).find('#month1').addClass('active');
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
        $(document).find('#calendar').find('.tab-pane.active').removeClass('active');
        $(document).find('#month5').show();
        $(document).find('#contentmonth5').addClass('active');
        $(document).find('#month5').addClass('active');
        $(document).find('#month6').show();
        $(document).find('#month7').show();
        $(document).find('#month8').show();
        $(document).find('#month1').hide();
        $(document).find('#month2').hide();
        $(document).find('#month3').hide();
        $(document).find('#month4').hide();
        if($('#month5.noclick')[0]){fillMonth($('#month5.noclick'));}
    });

/******End Calendar Functions*******/
