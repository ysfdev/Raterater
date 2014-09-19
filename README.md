# Raterater 

## Description

jQuery 5 star rating plugin based on Font Awesome icons that allows arbitrary star fractions, variable star sizes, and CSS colors.

## Usage

Include the font-awesome css file, raterater.css, jquery, and raterater.jquery.js

```html
<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet"/>
<link href="raterater.css" rel="stylesheet"/>

<script src="https://code.jquery.com/jquery-1.4.1.min.js"></script>
<script src="raterater.jquery.js"></script>
```

Write a callbaack function for handling the rating event

```javascript
function rateAlert(id, rating)
{
    alert( 'Rating for ' + id + ' is ' + rating + ' stars!' );
}
```

Create any number of div elements with unique data-id attributes and optional data-rating attributes

```html
<div class="ratebox" data-id="1" data-rating="2.2"></div>
<div class="ratebox" data-id="2" data-rating="3.6"></div>
```

Initialize Raterater

```javascript
$( '.ratebox' ).raterater( { submitFunction: 'rateAlert' } );
```

See demo.html for an example.

## Options

Attribute|Default|Values|Description
:-------:|:-----:|:----:|:----------
submitFunction | 'submitRating' | String | A function name that will be called when the user selected a rating. The function should take 2 arguments: id and rating. The id is the data-id of the rating div and the rating is a float representation of the number of stars the user selected.
allowChange | false | Boolean | If set to true, allows the user to change his rating. the submitFunction callback will be called again, so be prepared to handle this in your code.
starWidth | 20 | Integer | Width of a star in pixels
spaceWidth | 5 | Integer | Width of a space between two stars in pixels
numStars | 5 | Integer | Total number of stars per rating box

## Styling

Change the colors of the stars

```css
/* Star placeholder color */
.raterater-bg-layer {
    color: rgba( 0, 0, 0, 0.25 );
}

/* Star color on hover */
.raterater-hover-layer {
    color: rgba( 255, 255, 0, 0.75 );
}

/* Star color after rating */
.raterater-hover-layer.rated {
    color: rgba( 255, 255, 0, 1 );
}

/* Initial star color */
.raterater-rating-layer {
    color: rgba( 255, 155, 0, 0.50 );
}

/* Color of the star outline */
.raterater-outline-layer {
    color: rgba( 0, 0, 0, 0.25 );
}
```

## Requirements

* jquery >=1.4.1
* font-awesome >= 4.2.0

## License

Released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Donations

Bitcoin: 1K38TyxCmSQRALLm6Gzfuz7V7AqQCMrXvy