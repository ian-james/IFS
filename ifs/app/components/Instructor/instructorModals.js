$(document).ready(function(){
    //  for classes modal
    $("#psycoptionsC").hide();
    $("#othoptionsC").hide();
    $("#ctype").change(function() {  
        var value = $("#ctype").val();
        if(value == "computer science")
        {
            $("#csoptionsC").show();
            $("#psycoptionsC").hide();
            $("#othoptionsC").hide();
        }
        else if(value == "psychology"){
            $("#csoptionsC").hide();
            $("#psycoptionsC").show();
            $("#othoptionsC").hide();
        }
        else{
            $("#csoptionsC").hide();
            $("#psycoptionsC").hide();
            $("#othoptionsC").show();
        }
    });

    function displayAssignmentOptions(){
        var value = $("#cnameA").val();
        value = JSON.parse(value);
        var discipline = value['cdiscipline'];
        if(discipline == "computer science")
        {
            $("#csoptionsA").show();
            $("#psycoptionsA").hide();
            $("#othoptionsA").hide();
        }
        else if(discipline == "psychology"){
            $("#csoptionsA").hide();
            $("#psycoptionsA").show();
            $("#othoptionsA").hide();
        }
        else{
            $("#csoptionsA").hide();
            $("#psycoptionsA").hide();
            $("#othoptionsA").show();
        }
    }

    displayAssignmentOptions();
    // for assignment modal
    $("#cnameA").change(function() {
        displayAssignmentOptions();
    });

});