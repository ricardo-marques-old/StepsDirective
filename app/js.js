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

            //CONFIG -------------------------------
            var minimumPaddingBetweenSteps = 0,    // ensures that labels will be at least X pixels apart
                circleDiameter = 30,                // 
                circleBorderRadius = "50%",         // Leave at 50 for circle, 0 for square; feel free to also use px, just keep it in a string
                barHeight = 5,                      // Make sure to not set it to be bigger than the circle diameter, I recommend at max circleDiameter/2
                barFillColor = "orange",            // Keep it in a string ex: "rgba(255,255,255,.3) , #333, etc."
                barFillPadding = 0,                 // Padding between bar and its fill
                sequential;                         // if this is true, the steps before the current step will remain active (circles filled)
            //END CONFIG ---------------------------


            var $mySteps = elem,
                $parent = $mySteps.parent()[0],
                $steps = $('step'),
                $circles, //just initializing, gets defined in createCircles()
                $circle,  //^same
                $bar,     //defined in render()
                $barFill,
                parentWidth,
                width,
                widthOfChildren = 0,
                numberOfSteps = $steps.length,
                template = '<div class="circle"></div>',
                currentStep = attrs.activeStep,
                collapsedMode = false;

                if(attrs.bar!==undefined){
                    var bar=true;
                    $mySteps.prepend('<div class="bar"></div>');
                    $bar=$('.bar');
                    console.log($bar);
                    $bar[0].innerHTML='<div class="bar-fill"></div>';
                    $barFill=$('.bar-fill');
                } 
                else{
                    var bar=false;
                } 

                attrs.sequential!==undefined ? sequential = true : sequential = false;
                //when the active-step attribute is updated this adds the class active to the step with index of updatedStep
            var updateStep = function(updatedStep){
                    $timeout(function(){
                        var $circles=$('.circle');
                        if(updatedStep >= 0 && updatedStep <= numberOfSteps){ //make sure it's a valid step number
                            $steps.removeClass('active').eq(updatedStep-1).addClass('active');
                            if(sequential){
                                $circle.each(function(index){
                                    if(index<=updatedStep-1){
                                        $(this)[0].className="circle active";
                                    }
                                    else{
                                        $(this)[0].className="circle";
                                    }
                                })
                            }
                            else{
                                $circle.eq(updatedStep-1).addClass('active').siblings().removeClass('active');
                            }
                            if(collapsedMode){
                                collapseOtherSteps(updatedStep-1);
                            }   
                        }
                        else{
                            $steps.removeClass('active');
                        }
                        if(bar){
                            $barFill[0].style.right = ((100/(numberOfSteps-1))*(numberOfSteps-updatedStep))+"%";            
                        }
                    })   
                },
                createCircles = function(){
                    $mySteps.prepend('<div class="circles"></div>');
                    $circles=$('.circles')[0];
                    $circles.innerHTML=template.repeat(numberOfSteps);
                    $circle=$('.circle');
                    $circle.each(function(){
                        $(this)[0].style.height = $(this)[0].style.width = circleDiameter+"px";
                        $(this)[0].style.borderRadius = circleBorderRadius;

                    })
                    updateStep(currentStep);
                }(),
                // collapses every step except the nth one
                collapseOtherSteps = function(nth){
                    $steps.each(function(index){
                        if(index !== nth){
                            $(this).addClass('collapsed');
                        }
                        else( $(this).removeClass('collapsed') )
                    })
                },
                //gets the widdest step (used in render to check if we need to collapse)
                getWiddestStep = function(){
                    var widdest=0;
                    $steps.each(function(){
                        if($(this)[0].offsetWidth>= widdest){
                            widdest=$(this)[0].offsetWidth;
                        }
                    });
                    return widdest;
                },
                //positions the step labels relatively to the circles, ensuring perfect alignment
                setStepsPosition = function(){
                    $steps.each(function(index){
                        $(this)[0].style.position = "absolute";
                        if(index !== 0 && index!==numberOfSteps-1){
                            $(this)[0].style.left = ($circle[index].offsetLeft+(circleDiameter/2))+"px";
                            $(this)[0].style.transform = "translate(-50%,0)";
                        }
                        else if(index===numberOfSteps-1){
                            $(this)[0].style.right = "0px";
                        }
                    })
                },
                // if the widdest step is widder than the width of the container/(numberofsteps-1) then it goes into collapsed mode
                // else it makes every step the width of the widdest (this ensures that there is correct spacing between circles)
                // this needs to be called when the window is resized 
                render = function(){
                    $timeout(function(){
                        parentWidth=$parent.offsetWidth;
                        width=getWiddestStep();
                        console.log(width);
                        //Next if makes sure that there's enough room to equally space the circles and labels
                        //also adds the minimum padding
                        console.log(parentWidth);
                        if( ((width*numberOfSteps)+((minimumPaddingBetweenSteps*(numberOfSteps-1)))) <= parentWidth) {
                            //UNCOLLAPSED VIEW  
                            //every step except for the first and last gets a left coordinate equal to it's circle+(half of circle) and translatde to left -50%
                            collapsedMode=false;
                            console.log('Full size');
                            setStepsPosition(collapsedMode);
                        }
                        else {
                            //COLLAPSED VIEW
                            collapsedMode=true;
                            console.log('Collapsed');
                            collapseOtherSteps(currentStep-1);
                            setStepsPosition(collapsedMode);
                        }
                        //renders the bar and its fill
                        if(bar){
                            $bar[0].style.right = $bar[0].style.left = $bar[0].style.top = circleDiameter/2+"px";
                            $bar[0].style.height = barHeight+"px";
                            $bar[0].style.position = "absolute";
                            $bar[0].style.transform = "translate(0,-50%)";

                            $barFill[0].style.bottom = $barFill[0].style.left = $barFill[0].style.top = barFillPadding + "px";
                            $barFill[0].style.position = "absolute";
                            $barFill[0].style.background = barFillColor;
                        }

                    });
                };
            
                render();
                window.onresize=function(){
                    console.log('resizing');
                    render();
                };
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
    
    //repeat polyfill
    if (!String.prototype.repeat) {
      String.prototype.repeat = function(count) {
        'use strict';
        if (this == null) {
          throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
          count = 0;
        }
        if (count < 0) {
          throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
          throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
          return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
          throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (;;) {
          if ((count & 1) == 1) {
            rpt += str;
          }
          count >>>= 1;
          if (count == 0) {
            break;
          }
          str += str;
        }
        return rpt;
      }
    }

})(angular);
