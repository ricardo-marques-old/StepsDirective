Angular directive to create a responsive steps section

## Warnings

* The labels are positioned absolutely, so make sure they're not overflowing onto the div below.	Adding some padding to the bottom of the container fixes it. (I didn't add it because it depends on the size of font you're using).
* Make sure you set position relative or absolute on steps or the bar will behave weird.
* Make sure the largest step fits within the container when it's the smallest size, the text does not wrap correctly currently.

## Usage

### Including the directive in your angular module

1. Make sure to include [jquery](https://jquery.com/) and [angular](https://angularjs.org/) in your website (jquery must be called first).
2. Include steps.css in your header file.
3. Include steps.js in your html file, after angular. 
	<script src="steps.js"></script>
4. Use this markup
```html
<steps active-step="1" sequential bar clickable ng-app="steps">
	<div>
		<step><span>1. Think</span></step>
		<step><span>2. Code</span></step>
		<step><span>3. Fix</span></step>
	</div>
</steps>
```
5. Style to taste. If you want to add padding to the sides, simply wrap the steps element within a container and add padding to it. Before changing the CSS make sure what you're trying to change isn't withing the CONFIG comment within the steps.js file.
6. You're done, go grab a cup of coffee and rejoyce in the millions of dollars you will make from your snazzy website (results not guaranteed).

### Optional attributes

* "sequential" being defined means that the circles behind the active one also remain active. 
* "bar" being defined means that you'll get a bar connecting the circles
* "clickable" enables the user to change steps by clicking on the label or circle. May be useful.
* "no-collapse" disables collapsing of labels, use at own risk.
