/* global movies */

$(document).ready(init);

function init(){
    var controller = new Controller(movies["movies"]);
}

function Controller(data){
    //Data
    this.data = data;
    
    //Icons/buttons
    this.list_icon = "#list-icon";
    this.grid_icon = "#grid-icon";
    this.hd_icon= "#hd";
    this.search_button = "#search_button";
    
    //Templates
    this.grid_template = "#gridview-template";
    this.list_template = "#listview-template";
    
    //Destination
    this.movies_div = "#movies";
    
    //Other important tags/things to remember
    this.search_field = "#field";
    this.suggestion_box = "#suggestion_box";
    this.combo_box = "#combo-box";
    this.is_in_gridview = true;
    
    //Functions
    this.make_grid_function=function(){this.make_grid.call(this);};
    this.make_list_function=function(){this.make_list.call(this);};
    this.sort_movies_function=function(){this.sort_movies.call(this);};
    this.hide_hd_function=function(){this.hide_hd.call(this);};
    this.show_rating_function=function(){this.show_rating.call(this);};
    this.search_function=function(){this.search.call(this);};
    
    //Save a reference to controller
    var self = this;
    
    //Call this so we can see the gridview initially
    this.load_movies(this.grid_template);
    this.hide_hd_function.call(this);
    
    $(this.grid_icon).on("click",function(){

        self.make_grid_function.call(self);
        self.load_movies(self.grid_template);
        self.hide_hd_function.call(self);
        $(self.suggestion_box).hide();
        self.is_in_gridview = true;
    });
    $(this.list_icon).on("click",function(){

        self.make_list_function.call(self);
        self.load_movies(self.list_template);
        self.hide_hd_function.call(self);
        self.show_rating_function.call(self);

        $(self.suggestion_box).hide();
        self.is_in_gridview = false;
    });
    $(this.combo_box).on("change",function(){
        self.sort_movies_function.call(self);
        self.hide_hd_function.call(self);
        self.show_rating_function.call(self);
        $(self.suggestion_box).hide();

    });
    
    $(this.search_field).on('keyup',function(){
        self.search_function.call(self);
    });
    
    
}
Controller.prototype.make_grid = function(){
    $(this.grid_icon).attr("src","images/grid_pressed.jpg");
    $(this.list_icon).attr("src","images/list.jpg");
    $(this.movies_div).attr("class","gridview");
};
Controller.prototype.make_list = function(){
    $(this.list_icon).attr("src","images/list_pressed.jpg");
    $(this.grid_icon).attr("src","images/grid.jpg");
    $(this.movies_div).attr("class","listview");
};
Controller.prototype.sort_movies=function(){
    var by=$(this.combo_box).val().toLowerCase();
    this.data=this.data.sort(
            function(a,b){
                if(a[by]<b[by])
                    return -1;
                if(a[by]==b[by])
                    return 0;
                if(a[by]>b[by])
                    return 1;
    });
    
    if(this.is_in_gridview){
        this.load_movies(this.grid_template);
    }
    else{
        this.load_movies(this.list_template);
    }
    
};
Controller.prototype.hide_hd = function() {
    var all_hd_tags = $(".hd").map(function(){ return this;}).get();
    for(var i=0;i<this.data.length;i++){
        if(!this.data[i]["HD"]){
            $(all_hd_tags[i]).css({"visibility":"hidden"});
        }
    }
};
Controller.prototype.show_rating = function() {
    var all_rating_containers = $(".rating-container").map(function(){ return this; }).get();
    for(var i=0;i<this.data.length;i++){
        var current_rating = this.data[i]["rating"];
        for(var j=0;j<current_rating;j++){
            $(all_rating_containers[i].children[j]).attr("src","images/gold_star.png");
        }
    }
};
Controller.prototype.load_movies = function(template_id) {
    var template = $(template_id).html();
    var html_maker = new htmlMaker(template);
    var html = html_maker.getHTML(this.data);
    $(this.movies_div).html(html);
};
Controller.prototype.search = function(){
    //looped through the data and created a list of suggestions that could appear
    var search_suggestions = this.get_suggestions();
    //empty template for creating all the suggestions
    var html = "";
    //get the value in the text box after a keyup
    var value = $(this.search_field).val();
    //flag for whether or not suggestions will be shown
    var show = false;
    //save a reference to controller object
    var self = this;
    
    //Need to take the value entered and match it with anything in the search_suggestions container
    for(var i=0;i<search_suggestions.length;i++){
        //Found a matching suggestion
        var found = search_suggestions[i].toLowerCase().trim().search(value.toLowerCase().trim());
        if(found >= 0){
            //Create div tags with the suggestion matched
            html+="<div class=\"sub-suggestion\">" + search_suggestions[i] + "</div>";
            //Add the suggestion div to the suggestions box div
            $(this.suggestion_box).html(html);
            //Flag for suggestions
            show = true;
        }
    }
    
    if(show){

        $(".sub-suggestion").on("click",function(){
            var item=$(this).html();
            $(self.search_field).val(item);
            $(self.suggestion_box).hide();
        });

        
        $(this.suggestion_box).show();
    }
    else{
        $(this.suggestion_box).hide();
    }
    
    //add search handler here
    $(this.search_button).on("click",function(){
        self.load_movies(self.list_template);

        self.hide_hd();
        self.show_rating();
        $(self.suggestion_box).hide();

        //Hide the listview panels initially
        $(self.movies_div).children().hide();
        //Get the movie titles of the suggestions
        var all_suggestion_titles = $($(self.suggestion_box).children()).map(function(){ return this.innerText.substr(0,this.innerText.indexOf("(")) ;}).get();
        //If the movie title from suggestions matches with the title in the listview panels, display the panel
        for(var i=0; i < self.data.length; i++){
            for(var j=0;j<all_suggestion_titles.length;j++){
                if(self.data[i]["title"] == all_suggestion_titles[j]){
                    $(self.movies_div).children().eq(i).show();
                }
            }
        }
    });
};
Controller.prototype.get_suggestions = function(){
    var suggestions = [];
    for(var i=0;i<this.data.length;i++){
        suggestions.push(this.data[i]["title"]+"("+this.data[i]["year"]+"), "+this.data[i]["starring"]);
    }
    return suggestions;
};



