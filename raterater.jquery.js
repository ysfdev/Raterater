/*
 *  Raterater 1.0.1
 *  License: MIT - http://www.opensource.org/licenses/mit-license.php
 *  Author: Bain Mullins - http://bainweb.com
 */

;(function( $ ) {
    var data = {};
    var opts = {};
    var elems = null;
	$.fn.raterater = function(options) {

        /* Default options
         */
        $.fn.raterater.defaults = {
            submitFunction: 'submitRating', // this function will be called when a rating is chosen
            allowChange: false, // allow the user to change their mind after they have submitted a rating
        };

        opts = $.extend( {}, $.fn.raterater.defaults, options );

        elems = this;

        /* Initialize what we can while we wait for FontAwesome to load
         */
        init();

        /* We need to wait for font awesome to load before we proceed
         * Because we have to absolute position some of the stars,
         * It is important that they are rendered before we calculate their positions
         */
        setInterval( waitForFonts, 100 );

        return this;
    }

    /* Check is Font Awesome is loaded. 
     * If it is, proceed with initialization.
     */
    function waitForFonts() {

        if( $('.raterater-rating-layer').find('i.fa').css('font-family') === 'FontAwesome' ) {
            clearInterval(waitForFonts);
            initializePositions();
        }
    }

    function init() {
        
        elems.each( function() {
        
            var $this = $( this );
            var id = dataId( $this );

            /* Uh oh... We really need a data-id or bad things happen
             */
            if( !id ) {
                throw "Error: Each raterater element needs a unique data-id attribute.";
            }

            /* This is where we store our important data for each rating box
             */
            data[id] = {
                state: 'inactive', // inactive, hover, or rated
                width: 10, // width of the rating box
                star_width: 0, // width of an individual star
                space_width: 0, // width of the gap between stars
                num_stars: 5 // the number of stars in the box
            };

            /* Make our wrapper relative if it is static so we can position children absolutely
             */
            if( $this.css( 'position' ) === 'static' )
                $this.css( 'position', 'relative' )

            /* Clear out anything inside so we can append the relevent children
             */
            $this.html( '' );

            /* We have 4 div children here as different star layers
             * Layer 1 contains the dull filled stars as a background
             * Layer 2 shows the bright filled stars that represent the current user's rating
             * Layer 3 shows the bright filled stars that represent the item's rating
             * Layer 4 shows the outline stars and is just for looks
             */
            $.each( [ 'bg', 'hover', 'rating', 'outline' ], function() {
                $this.append(' <div class="raterater-layer raterater-' + this + '-layer"></div>' );
            });

            /* Fill the layers with stars
             */
            for( var i = 0; i < data[id].num_stars; i++ ) {
                $this.children( '.raterater-bg-layer' ).first()
                    .append( '<i class="fa fa-star"></i>&nbsp;' );
                $this.children( '.raterater-outline-layer' ).first()
                    .append( '<i class="fa fa-star-o"></i>&nbsp;' );
                $this.children( '.raterater-hover-layer' ).first()
                    .append( '<i class="fa fa-star"></i>' );
                $this.children( '.raterater-rating-layer' ).first()
                    .append( '<i class="fa fa-star"></i>' );
            }

            /* This is a forth layer that exists only to keep event.offsetX 
             * from being ruined by child elements
             */
            $this.append( '<div class="raterater-cover-layer"></div>' );

            /* Register mouse event callbacks
             */
            $this.find( '.raterater-cover-layer' ).hover( mouseEnter, mouseLeave );
            $this.find( '.raterater-cover-layer' ).mousemove( hiliteStarsHover );
            $this.find( '.raterater-cover-layer' ).click( rate );
        });
    }

    function initializePositions() {
        
        elems.each( function() {
           
            var $this = $( this );
            var id = dataId( $this );
        
            /* Get the width of spacing, stars, and wrapper for later calculations
             */
            data[id].star_width = $this.children( 'div' ).first().children( 'i' ).first().width();
            var p1 = $this.children( 'div' ).first().children( 'i' ).eq(0).position().left;
            var p2 = $this.children( 'div' ).first().children( 'i' ).eq(1).position().left;
            data[id].space_width = p2 - p1 - data[id].star_width;
            data[id].width = data[id].num_stars * data[id].star_width;
            data[id].width += data[id].num_stars * data[id].space_width;

            /* Set the width and height of the raterater wrapper and the cover layer
             */
            $this.css( 'width', data[id].width + 'px' )
                .css( 'height', $this.children( 'div' ).first().height() );
            $this.find( '.raterater-cover-layer' )
                .css( 'width', $this.width() )
                .css( 'height', $this.height() );

            /* The second and third layers are trickier
             * The stars must be absolutely positioned so that we can display partial stars
             */
            var $target = $this.children( '.raterater-bg-layer' ).first().children( 'i' ).eq( 0 );
            var p = $target.position();
            for( var i = 0; i < data[id].num_stars; i++ ) {

                /* shows the user's rating on hover 
                 */
                $this.children( '.raterater-hover-layer' ).first().children( 'i' ).eq( i )
                    .css( 'top', p.top + 'px' )
                    .css( 'left', i * (data[id].star_width + data[id].space_width) + 'px' );

                /* shows the established rating from the data-rating attribute 
                 */
                $this.children( '.raterater-rating-layer' ).first().children( 'i' ).eq( i )
                    .css( 'top', p.top + 'px' )
                    .css( 'left', i * (data[id].star_width + data[id].space_width) + 'px' );
            }

            /* show the item's current rating on the raterater-rating-layer
             */
            var rating = parseFloat( $this.attr( 'data-rating' ) );
            var whole = Math.floor( rating );
            var partial = rating - whole;
            hiliteStars (
                $this.find( '.raterater-rating-layer' ).first(), 
                whole, 
                partial
            );
        });
    }

    function rate(e) {
        var $this = $( e.target ).parent();
        var id = dataId( $this );
        var stars = data[id].whole_stars_hover + data[id].partial_star_hover;

        /* Round stars to 2 decimals
         */
        stars = Math.round( stars * 100 ) / 100;

        /* Set the state to 'rated' to disable functionality
         */
        data[id].state = 'rated';

        /* Add the 'rated' class to the hover layer for additional styling flexibility
         */
        $this.find( '.raterater-hover-layer' ).addClass( 'rated' );

        /* Call the user-defined callback function if it exists
         */
        if( typeof window[opts.submitFunction] === 'function' );
            window[opts.submitFunction]( id, stars );
    }

    /* Calculate the number of stars from the x position of the mouse relative to the cover layer
     * (This is only compicated because of the spacing between stars)
     */
    function calculateStars(x, id) {
        /* Whole star = floor( x / ( star_width + space_width ) ) 
         */
        var whole_stars = Math.floor( x / ( data[id].star_width + data[id].space_width ) );

        /* Partial star = max( 1, ( x - whole_stars * ( star_width + space_width ) ) / star_width )
         */
        var partial_star = x - whole_stars * ( data[id].star_width + data[id].space_width );
        if( partial_star > data[id].star_width )
            partial_star = data[id].star_width;
        partial_star /= data[id].star_width;

        /* Store our result in the data object
         */
        data[id].whole_stars_hover = whole_stars;
        data[id].partial_star_hover = partial_star;
    }

    /* Given a layer object and rating data, highlight the stars
     */
    function hiliteStars($layer, whole, partial) {
        var id = dataId( $layer.parent() );

        /* highlight the 'whole' stars
         */
        for( var i = 0; i < whole; i++ ) {
            $layer.find( 'i' ).eq( i )
                .css( 'width', data[id].star_width + 'px' );
        }

        /* highlight the partial star
         */
        $layer.find( 'i' ).eq( whole )
            .css( 'width', data[id].star_width * partial + 'px' );

        /* clear the extra stars
         */
        for( var i = whole+1; i < data[id].num_stars; i++) {
            $layer.find( 'i' ).eq( i )
                .css( 'width', '0px' );
        }
    }

    /* Highlight the hover layer stars
     * This is the callback for the mousemove event
     */
	function hiliteStarsHover(e) {
        var id = dataId( $( e.target ).parent() );
        
        /* Leave it alone, we aren't hovering
         */
        if( data[id].state !== 'hover' ) {
            return;
        }

        /* Calculate how many stars to show from the mouse position
         */
        var x = e.offsetX;
        data[id].stars = calculateStars( x, id );

        /* Find the layer element
         */
        var $layer = $( e.target ).parent().children( '.raterater-hover-layer' ).first();

        /* Call the more generic highlighting function
         */
        hiliteStars( $layer, data[id].whole_stars_hover, data[id].partial_star_hover );
	}

    /* Active this rating box
     * This is the callback for the mouseenter event 
     */
	function mouseEnter(e) {
        var id = dataId( $( e.target ).parent() );

        /* Leave it alone, we have already rated this item
         */
        if( data[id].state === 'rated' && !opts.allowChange ) {
            return;
        }

        /* set the state to 'hover'
         */
		data[id].state = 'hover';

        /* show the hover layer and hide the rating layer
         */
        $( e.target ).parent().children( '.raterater-rating-layer' ).first().css( 'display', 'none' );
        $( e.target ).parent().children( '.raterater-hover-layer' ).first().css( 'display','block' );
	}

    /* Deactivate this rating box
     * This is the callback for the mouseleave event 
     */
	function mouseLeave(e) {
        var id = dataId( $( e.target ).parent() );

        /* Leave it alone, we have already rated this item
         */
        if( data[id].state === 'rated' ) {
            return;
        }

        /* set the state to 'inactive'
         */
        data[id].state = 'inative';

        /* hide the hover layer and show the rating layer
         */
        $( e.target ).parent().children( '.raterater-hover-layer' ).first().css( 'display', 'none' );
        $( e.target ).parent().children( '.raterater-rating-layer' ).first().css( 'display','block' );
	}

    /* Shorthand function to get the data-id of an element
     */
    function dataId(e) {
        return $( e ).attr( 'data-id' );
    }

})( jQuery );