(function(angular){

	'use strict'

	angular.module('app', [])
	.controller('myController',['$scope',function($scope){
		this.activeStep = 1;
		this.updateStep = function(newStep){
			this.activeStep = newStep;
		}
	}])
	.directive('mySteps',function($timeout){
		return{
			restrict: 'E',
			link: function(scope,elem,attrs){
				var $mySteps = elem,
					$parent = $mySteps.parent()[0],
					$steps = $('step'),
					parentWidth = $parent.offsetWidth,
					widthOfChildren = 0,
					numberOfSteps = $steps.length,
					template = $('#circles')[0].innerHTML,
					currentStep = attrs.activeStep,
					collapsedMode = false,
					createCircles = function(){
						$mySteps.prepend('<div class="circles"></div>');
						var $circles=$('.circles');
						console.log($circles[0]);
						$circles[0].innerHTML=template.repeat(numberOfSteps);
					}(),
					//when the active-step attribute is updated this adds the class active to the step with index of updatedStep
					updateStep = function(updatedStep){
						if(updatedStep >= 0 && updatedStep <= numberOfSteps){ //make sure it's a valid step number
							$steps.removeClass('active').eq(updatedStep-1).addClass('active');
						}
						else{
							$steps.removeClass('active');
						}
					},
					// collapses every step except the nth one
					collapseOtherSteps = function(nth){
						$steps.each(function(index){
							if(index !== nth){
								$(this).addClass('collapsed');
							}
							else( $(this).removeClass('collapsed') )
						})
					},
					//gets the widdest step so we can set the height and width of all the steps to be equal
					getWiddestStep = function(){
						var widdest=0;
						$steps.each(function(){
							if($(this)[0].scrollWidth >= widdest){
								widdest=$(this)[0].scrollWidth;
							}
						});
						return widdest;
					},
					// if the widdest step is widder than the width of the container/(numberofsteps-1) then it goes into collapsed mode
					// else it makes every step the width of the widdest (this ensures that there is correct spacing between circles)
					// this needs to be called when the window is resized 
					setStepsWidth = function(){
						var width=getWiddestStep();
						if( width <= (parentWidth / (numberOfSteps-1)) ){
							$steps.each(function(index){
								$(this).css('width',width);
							})	
						}
						else {
							collapsedMode=true;
							collapseOtherSteps(currentStep-1);
						}
					}();
				
				//watches the active-step attribute on the my-steps element and applies the active class to a new step
				attrs.$observe('activeStep',function(updatedStep){
					updateStep(updatedStep);
					if(collapsedMode){
						collapseOtherSteps(updatedStep-1)
					};
				});


				$('step').each(function(){
					widthOfChildren += $(this).outerWidth();
				});
			}
		}
	});

})(angular);
