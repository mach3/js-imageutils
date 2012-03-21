ImageUtils
==========

Simple Utilities for image.  
Some effect on hover and transparent PNG images.

## Features

- Enable IE brothers to show transparent PNG, using AlphaImageLoader
- Swap image on hover
- Blend images on hover

## USAGE

### alphaImage()

This set elements AlphaImageLoader filter  
for "src" of image or "background-image" of element.

	$(".my-class").alphaImage();

or with config options...

	$(".my-class").alphaImage({
		method : "image",
		blankImage : "./blank.gif"
	});

#### Options

- *method* (String) : sizingMethod of AlphaImageLoader.  
    "crop" || "scale" || "image"  
    Default : "image"
- *blankImage"* (String) : The path to transparetn gif image.
    Required when the element is "img".  
    Default : "./blank.gif"


### swapImage()

This add elements simple rollover feature.  
Swap the image on mouse enter, and get it back when mouse leave.

	$(".my-class").swapImage();

#### Options

- *hoverPostfix* (String) : Postfix for hover image.  
    If the image file name is "foo.png" and postfix is "-hover",  
    this will be swapped with "foo-hover.png"  
    Default : "-hover"
- *ignoreClass* (String) : Class name to be ignored hover effect.  
    If the element has this class, will not be swapped.  
    Default : ".active"

### blendImage()

This add elements blend effect on rollover.  

	$(".my-class").blendImage();

#### Options

- *hoverPostfix* (String) : Same as swapImage()
- *ignoreClass* (String) : Same as swapImage()
- *durationEnter* (Integer) : Duration for blend effect when enter
    Default : 100
- *durationLeave* (Integer) : Duration for blend effect when leave
    Default : 500


## Versions

- 0.9 : First release


## Todo

- Add example