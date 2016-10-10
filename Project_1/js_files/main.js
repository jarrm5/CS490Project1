/* global movies */

$(document).ready(init);

function init(){
    var data = movies["movies"];
    
    //Loads the gridview
    dynamic_load(data,"#gridview-template","#gridview");
    
    $("#search_button").on('click',search);
    $("#field").on('keyup',search);
    
    //Loads the listview
    
}
function dynamic_load(data, template_id, destination){
    //Get the html template from the html file
    var template = $(template_id).html();
    //Create the html maker
    var html_maker = new htmlMaker(template);
    //Populate the template with JSON data
    var html = html_maker.getHTML(data);
    //Load the template and data to a destination tag
    $(destination).html(html);
}
function search(){
    var data = movies["movies"];
    var keys = ["title","year","starring"];
    var html = "";
    var value = $("#field").val();
    var show = false;
    
    for(var i=0;i<data.length;++i){
        for(var j=0;j<keys.length;++j){
            var start = data[i][keys[j]].toString().toLowerCase().search(value.toLowerCase().trim());
            if (start != -1) { //if there is a search match
            html += "<div class='sub_suggestions' data-item='" + data[i][keys[j]] + "' >";
            html += data[i][keys[j]].substring(0,start)+"<b>"+data[i][keys[j]].substring(start,start+value.length)+"</b>"+data[i][keys[j]].substring(start+value.length,data[i][keys[j]].length);
            html += "</div>";
            show=true; //show suggestions
            }
        }
    }
    if(show){
        $("#suggestions_box").html(html);
        //get the children of suggestions_box with .sub_suggestions class
        $("#suggestions_box").children(".sub_suggestions").on('click',function(){
            var item=$(this).attr('data-item'); //get the data
            $("#field").val(item); //show it in the field
            $("#suggestions_box").hide(); //hide the suggestion box
        });
        
        $("#suggestions_box").show();
    }
    else{
       $("#suggestions_box").hide();
    }
}


