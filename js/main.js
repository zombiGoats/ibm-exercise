(function($) {

    /*** Foundation ***/
    /*jslint browser: true*/
    /*global $, jQuery*/
    $(document).foundation();

    var pageNum = '2';

    function getPhotos(pageNum) {

        var apikey = 'a5e95177da353f58113fd60296e1d250',
            userID = '24662369@N07',
            flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=' + apikey + '&user_id=' + userID + '&per_page=20&page=' + pageNum + '&format=json&nojsoncallback=1';

        // Pull photos from Flickr
        $.getJSON(flickrAPI, function() {

        }).done(function(data) {

            //Grab photo objects  
            var photo = data.photos.photo;

            //Loop each photo and set masonry block
            $.each(photo, function(i, item) {

                //Set URLs
                var image = 'https://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg',
                    origImage = 'https://www.flickr.com/photos/gsfc/' + item.id + '/',
                    title = item.title,
                    photoInfo = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=' + apikey + '&photo_id=' + item.id + '&format=json&nojsoncallback=1';

                //Create image block and title
                $.getJSON(photoInfo, function(metadata) {

                }).done(function(metadata) {

                    var posted = metadata.photo.dates.posted;
                    //sortDate = Date.parse(date);

                    $("<a>").attr({
                        "style": "background-image: url(" + image + ")",
                        "class": "grid-item",
                        "href": origImage,
                        "target": "_blank",
                        "data-title": title,
                        "data-posted": posted
                    }).appendTo(".grid")
                        .append("<p class='grid-item--desc'>" + title + "</p>");

                    //Apply larger block classes to index items that are multiple of 8
                    $('.grid-item:nth-child(8n+0)').addClass("grid-item--width2");
                    $('.grid-item:nth-child(13n+0)').addClass("grid-item--height2 grid-item--width2");
                });
            });

            // Sort by oldest
            $(".sort-title").on('click', function() {
                var $gridWrap = $(".grid");
                $gridWrap.find('.grid-item').sort(function(a, b) {
                    return +a.dataset.posted - +b.dataset.posted;
                }).appendTo($gridWrap);

            });

            // Sort by newest
            $(".unsort-title").on('click', function() {
                var $gridWrap = $(".grid");
                $gridWrap.find('.grid-item').sort(function(a, b) {
                    return +b.dataset.posted - +a.dataset.posted;
                }).appendTo($gridWrap);
            });

        });
    }
    getPhotos();

    //Load more button
    $('.load-more-btn').on('click', function() {
        getPhotos(pageNum++);
    });

    //Sticky sorting
    function sticky_relocate() {
        var window_top = $(window).scrollTop();
        var div_top = $('#sticky-anchor').offset().top;
        if (window_top > div_top) {
            $('#sorting').addClass('stick');
            $('#sticky-anchor').height($('#sorting').outerHeight());
        } else {
            $('#sorting').removeClass('stick');
            $('#sticky-anchor').height(0);
        }
    }

    $(function() {
        $(window).scroll(sticky_relocate);
        sticky_relocate();
    });

})(jQuery);