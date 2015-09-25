Angular directive to create a responsive steps section
![screenshot](https://github.com/RicardoAlmeidaMarques/StepsDirective/blob/master/screen.png?raw=true "screenie")
## Warnings

* The labels are positioned absolutely, so make sure they're not overflowing onto the div below. Adding some padding to the bottom of the container fixes it. (I didn't add it because it depends on the size of font you're using).
* Make sure you set position relative or absolute on steps or the bar will behave weird.
* Make sure the largest step fits within the container when it's the smallest size, the text does not wrap correctly currently.
* This directive uses flexbox, so it [will only work on IE10 and above](http://caniuse.com/#search=flexbox).

## Usage

### Including the directive in your angular module

1. Make sure to include [jquery](https://jquery.com/) and [angular](https://angularjs.org/) in your website (jquery must be called first).
2. Include steps.css in your header file.
3. Include steps.js in your html file, after angular. `<script src="steps.js"></script>`
4. Use this markup. If you run into any problems, just wrap steps with a container div and add position:relative or absolute to that div.
	
	```html
		// sequential bar and clickable are optional attributes, see below for more info. 
		<steps active-step="1" sequential bar clickable ng-app="steps">
			<div>
				<step><span>1. Think</span></step>
				<step><span>2. Code</span></step>
				<step><span>3. Fix</span></step>
			</div>
		</steps>
	```
5. Style to taste. But please, <b>before you add styles in css, make sure what you want to change isn't in the config section of the js file!</b>

	```javascript
		//CONFIG -------------------------------

            var minimumPaddingBetweenSteps = 0,     // ensures that labels will be at least X pixels apart
                circleDiameter = 20,                // 
                circleBorderRadius= "50%",          // Leave at 50 for circle, 0 for square; feel free to also use px, just keep it in a string
                barHeight = 3,                      // Make sure to not set it to be bigger than the circle 
                									   diameter, I recommend a max of circleDiameter/2
                barFillColor = "skyblue",           // Keep it in a string ex: "rgba(255,255,255,.3) , #333, etc."
                barFillPadding = 0,                 // Padding between bar and its fill
                stepsPadding = 20;                  // Padding between circle and labels

        //END CONFIG ---------------------------

	````
If you want to add padding to the sides, simply wrap the steps element within a container and add padding to it. Before changing the CSS make sure what you're trying to change isn't withing the CONFIG comment within the steps.js file.
6. You're done, go grab a cup of coffee and rejoyce in the millions of dollars you will make from your snazzy website (results not guaranteed).

### Optional attributes

* "sequential" being defined means that the circles behind the active one also remain active. 
* "bar" being defined means that you'll get a bar connecting the circles
* "clickable" enables the user to change steps by clicking on the label or circle. May be useful.
* "no-collapse" disables collapsing of labels, use at own risk.