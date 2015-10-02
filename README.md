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
### Raterater as callback

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

### Raterater as input field


Create any number of input elements

```html
<input name="service" class="ratebox" value="3">
<input name="delivery" class="ratebox">
```

Initialize Raterater

```javascript
$( '.ratebox' ).raterater( { mode: 'input' } );
```

See demo.html for an example.

## Options

Attribute|Default|Values|Description
:-------:|:-----:|:----:|:----------
submitFunction | 'submitRating' | String | A function name that will be called when the user selected a rating. The function should take 2 arguments: id and rating. The id is the data-id of the rating div and the rating is a float representation of the number of stars the user selected.
allowChange | false | Boolean | If set to true, allows the user to change his rating. the submitFunction callback will be called again, so be prepared to handle this in your code.
isStatic | false | Boolean | If set to true, the rating will initialized without any interaction (only for display).
starWidth | 20 | Integer | Width of a star in pixels
spaceWidth | 5 | Integer | Width of a space between two stars in pixels
numStars | 5 | Integer | Total number of stars per rating box
mode | 'callback' | String | Initialzation mode ('callback' or 'input'). Use 'input' to use raterater as form field, or use 'callback' to handle the rating with a custom javascript callback only.
step | false | Float | Specify step increments for ratings. Float number between 0 and 1, for example if you want to allow only half stars, use 0.5, or whole stars use 1.

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
