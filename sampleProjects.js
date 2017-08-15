$(document).ready(function(){
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/0', function(data){
    $('#Project0_title').append(data.title);
    $('#Project0_type').append(data.type);
    $('#Project0_detail_title').append(data.title);
    $('#Project0_detail_header').append(data.header);
    $('#Project0_detail_description').append(data.description);
    $('#Project0_detail_quote').append(data.quote);
    $('#Project0_detail_notes').append(data.notes);
    $('#Project0_detail_date').append(data.date);
    $('#Project0_detail_client').append(data.client);
    $('#Project0_detail_category').append(data.category);
  })
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/1', function(data){
    $('#Project1_title').html(data.title);
    $('#Project1_title').append("<br> Tool");
    $('#Project1_type').append(data.type);
    $('#Project1_detail_title').append(data.title);
    $('#Project1_detail_header').append(data.header);
    $('#Project1_detail_description').append(data.description);
    $('#Project1_detail_quote').append(data.quote);
    $('#Project1_detail_notes').append(data.notes);
    $('#Project1_detail_date').append(data.date);
    $('#Project1_detail_client').append(data.client);
    $('#Project1_detail_category').append(data.category);
  })
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/2', function(data){
    $('#Project2_title').append(data.title);
    $('#Project2_type').append(data.type);
    $('#Project2_detail_title').append(data.title);
    $('#Project2_detail_header').append(data.header);
    $('#Project2_detail_description').append(data.description);
    $('#Project2_detail_quote').append(data.quote);
    $('#Project2_detail_notes').append(data.notes);
    $('#Project2_detail_date').append(data.date);
    $('#Project2_detail_client').append(data.client);
    $('#Project2_detail_category').append(data.category);
  })
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/3', function(data){
    $('#Project3_title').append(data.title);
    $('#Project3_type').append(data.type);
    $('#Project3_detail_title').append(data.title);
    $('#Project3_detail_header').append(data.header);
    $('#Project3_detail_description').append(data.description);
    $('#Project3_detail_quote').append(data.quote);
    $('#Project3_detail_notes').append(data.notes);
  })
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/4', function(data){
    $('#Project4_title').append(data.title);
    $('#Project4_type').append(data.type);
    $('#Project4_detail_title').append(data.title);
    $('#Project4_detail_header').append(data.header);
    $('#Project4_detail_description').append(data.description);
  })
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/5', function(data){
    $('#Project5_title').append(data.title);
    $('#Project5_type').append(data.type);
    $('#Project5_detail_title').append(data.title);
    $('#Project5_detail_header').append(data.header);
    $('#Project5_detail_description').append(data.description);
    $('#Project5_detail_pathname').append(data.relevant_paths[0].name);
  })
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/6', function(data){
    $('#Project6_title').append(data.title);
    $('#Project6_type').append(data.type);
    $('#Project6_detail_title').append(data.title);
    $('#Project6_detail_header').append(data.header);
    $('#Project6_detail_description').append(data.description);
  })
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/7', function(data){
    $('#Project7_title').append(data.title);
    $('#Project7_type').append(data.type);
    $('#Project7_detail_title').append(data.title);
    $('#Project7_detail_header').append(data.header);
    $('#Project7_detail_description').append(data.description);
  })
  $.get('https://u1bf8qnwhc.execute-api.us-east-1.amazonaws.com/dev/projects/8', function(data){
    $('#Project8_title').append(data.title);
    $('#Project8_type').append(data.type);
    $('#Project8_detail_title').append(data.title);
    $('#Project8_detail_header').append(data.header);
    $('#Project8_detail_description').append(data.description);
  })
})
