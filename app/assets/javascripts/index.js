$(function(){
  
  // if things don't work, go to console and do localStorage.clear() to clear previous codepen localstorage
  
  var feels = {
    'mood'  : 0,
    'energy': 0,
    'pain'  : 0,
    'fog'   : 0
  };
  
  //var color = {};
  
  $('section').each(function(){
    var section = $(this).attr('class');
    /*var i;
    color[section] = {};
    $(this).children('a').each(function(index){
      i = index + 1;
      color[section][i] = $(this).css('background-color');
    });*/
    
    $('p.info').append('<span class="' + section + '">' + section + ' <span class="color" style="background-color:#555;"></span> </span>');
    
  });
  
  //console.log(JSON.stringify(color));
  
    var color =  {'pain':{'1':'rgb(86, 28, 67)','2':'rgb(96, 32, 66)','3':'rgb(106, 35, 66)','4':'rgb(115, 39, 65)','5':'rgb(125, 43, 64)','6':'rgb(135, 46, 64)','7':'rgb(145, 50, 63)','8':'rgb(154, 54, 62)','9':'rgb(164, 57, 62)','10':'rgb(174, 61, 61)'},'mood':{'1':'rgb(198, 89, 127)','2':'rgb(177, 106, 138)','3':'rgb(157, 122, 149)','4':'rgb(136, 140, 161)','5':'rgb(116, 157, 172)','6':'rgb(95, 173, 183)'},'energy':{'1':'rgb(232, 181, 78)','2':'rgb(209, 182, 80)','3':'rgb(186, 183, 82)','4':'rgb(163, 184, 84)','5':'rgb(140, 186, 87)','6':'rgb(117, 187, 89)','7':'rgb(94, 188, 91)','8':'rgb(71, 189, 93)'},'fog':{'1':'rgb(164, 193, 203)','2':'rgb(171, 196, 204)','3':'rgb(179, 199, 204)','4':'rgb(186, 201, 204)','5':'rgb(194, 204, 204)','6':'rgb(201, 207, 204)','7':'rgb(209, 209, 204)','8':'rgb(216, 212, 204)'}};
  
    var emoji = {
        1:'http://s.goose.im/emoji/emoji_u1f622.png',
        2:'http://s.goose.im/emoji/emoji_u1f614.png',
        3:'http://s.goose.im/emoji/emoji_u1f61b.png',
        4:'http://s.goose.im/emoji/emoji_u1f610.png',
        5:'http://s.goose.im/emoji/emoji_u1f603.png',
        6:'http://s.goose.im/emoji/emoji_u1f60a.png'
    };
  
    // visjs
    var chart_data = [];
  
    $('span.entry').each(function(){

         var span = $(this).text();
         
         var local = $.parseJSON(span);

         //console.log(span);

         var time = local['time'];
         var date = new Date(time);
         var pain = local['feels']['pain'];  
         var mood = local['feels']['mood'];  
         var energy = local['feels']['energy'];  
         var fog = local['feels']['fog'];

         var process = '<span class="date">' +
                       date.getHours() + ':' + date.getMinutes() + '&nbsp;&nbsp;&nbsp;&nbsp;' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() +
                       '</span>pain ' + pain + ' <span class="color" style="background-color:' + color['pain'][pain] + '"></span>' +
                       'mood ' + mood + '<img src="' + emoji[mood] + '"> <span class="color" style="background-color:' + color['mood'][mood] + '"></span>' +
                       'energy ' + energy + ' <span class="color" style="background-color:' + color['energy'][energy] + '"></span>' +
                       'fog ' + fog + ' <span class="color" style="background-color:' + color['fog'][fog] + '"></span>' +
                       '<span class="notes">' + local['notes'] + '</span>';

         $(this).html(process);

        // visjs
        Array.prototype.push.apply(chart_data, [{x:time,    y:energy,    group:'energy'}]);
        Array.prototype.push.apply(chart_data, [{x:time,    y:fog,       group:'fog'}]);
        Array.prototype.push.apply(chart_data, [{x:time,    y:mood,      group:'mood'}]);
        Array.prototype.push.apply(chart_data, [{x:time,    y:pain,      group:'pain'}]);

        //console.log(chart_data);

    }); 
    
    //visjs
    
    var container = document.getElementById('chart');
    
    if (container) {
    
        var chart_groups = new vis.DataSet();
        chart_groups.add({id:'energy',content:'Energy',className:'energy'});
        chart_groups.add({id:'fog',content:'Fog',className:'fog'});
        chart_groups.add({id:'mood',content:'Mood',className:'mood'});
        chart_groups.add({id:'pain',content:'Pain',className:'pain'});

        var today = new Date();

        var options = {
            dataAxis: {
                customRange: {
                    left: {
                        min:1, max:10
                    }
                },
                //showMinorLabels: false
            },
            showCurrentTime: false,
            width: '100%',
            height:'400px',
            drawPoints: {
                style: 'circle',
                size: '10'
            },
            timeAxis: {
                scale: 'day'
            },
            zoomMax: 31536000000,
            zoomMin: 86400000,
            catmullRom: {
                enabled: false
            }//,
            //start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
        };

        var graph2d = new vis.Graph2d(container, chart_data, chart_groups, options);

        $('circle.point').qtip({
            content: {
                text: function(event,api){
                    var value = Math.floor(10-($(this).attr('cy')/39));
                    var label = $(this).attr('class').split(' ')[0];
                    return label + ': ' + value;
                }
            },
            position: {
                my: 'bottom center',
                at: 'top center'
            },
            style: {
                classes: 'qtip-tipsy'
            }
        });
    
    }
  // end visjs
  
  
  
  $('section a').click(function(){
    var section = $(this).parent('section').attr('class');
    if ($(this).hasClass('clicked')) {
      $(this).removeClass('clicked');
      feels[section] = 0;
      $('p.info').children('.' + section).children('.color').css('background-color','#555');
    } else {
      $(this).addClass('clicked');
      $(this).siblings('a').removeClass('clicked');
      feels[section] = $(this).text();
      $('p.info').children('.' + section).children('.color').css('background-color',color[section][$(this).text()]);
    }
  });
  
   
  $('a.submit').click(function(){
    if (feels['pain'] == 0 || feels['mood'] == 0 || feels['energy'] == 0 || feels['fog'] == 0) {
      $('.alert').show();
      event.preventDefault();
    } else {
      var timestamp = Date.now();
      var note = $('input.note').val();
      var data = {
        'feels':feels,
        'notes':note,
        'time': timestamp
      };
     
      $('input#entry_content').val(JSON.stringify(data));
      
      $('form#new_entry').submit();
      
      event.preventDefault();
    }
  });
  
  $('.alert a.button').click(function(){
    $('.alert').hide();
    event.preventDefault();
  });
  
  
});