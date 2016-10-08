/* global movies */

$(document).ready(init);

function init(){
    var data = movies["movies"];
    
    //Loads the gridview
    dynamic_load(data,"#gridview-template","#gridview");
    
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


