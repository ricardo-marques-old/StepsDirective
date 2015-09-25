(function(angular){

    'use strict'

    angular.module('steps', [])
    .directive('steps',['$timeout',function($timeout){
        return{
            restrict: 'E',
            link: function(scope,elem,attrs){

            //CONFIG -------------------------------

            var minimumPaddingBetweenSteps = 0,     // ensures that labels will be at least X pixels apart
                circleDiameter = 20,                // 
                circleBorderRadius= "50%",          // Leave at 50 for circle, 0 for square; feel free to also use px, just keep it in a string
                barHeight = 3,                      // Make sure to not set it to be bigger than the circle diameter, I recommend at max circleDiameter/2
                barFillColor = "skyblue",           // Keep it in a string ex: "rgba(255,255,255,.3) , #333, etc."
                barFillPadding = 0,                 // Padding between bar and its fill
                stepsPadding = 20;                  // Padding between circle and labels

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
                widdest,
                numberOfSteps = $steps.length,
                template = '<div class="steps-circle"></div>',
                currentStep = attrs.activeStep,
                collapsedMode = true,
                sequential,
                clickable,
                noCollapse;


                //check attributes
                if(attrs.bar!==undefined){
                    var bar=true;
                    $mySteps.prepend('<div class="steps-bar"></div>');
                    $bar=$('.steps-bar');
                    $bar[0].innerHTML='<div class="steps-bar-fill"></div>';
                    $barFill=$('.steps-bar-fill');
                } 
                else{
                    var bar=false;
                } 

                attrs.sequential!==undefined ? sequential = true : sequential = false;

                attrs.clickable!==undefined ? clickable = true : clickable = false;

                attrs.noCollapse!==undefined ? noCollapse = true : noCollapse = false;
                //end attribute check



                //when the active-step attribute is updated this adds the class active to the step with index of updatedStep
            var updateStep = function(updatedStep){
                    $timeout(function(){
                        if(updatedStep >= 0 && updatedStep <= numberOfSteps){ //make sure it's a valid step number
                            $steps.removeClass('active').eq(updatedStep-1).addClass('active');
                            if(sequential){
                                $circle.each(function(index){
                                    if(index<=updatedStep-1){
                                        $(this)[0].className="steps-circle active";
                                    }
                                    else{
                                        $(this)[0].className="steps-circle";
                                    }
                                })
                            }
                            else{
                                $circle.eq(updatedStep-1).addClass('active').siblings().removeClass('active');
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
                    $mySteps.prepend('<div class="steps-circles"></div>');
                    $circles=$('.steps-circles')[0];
                    $circles.innerHTML=template.repeat(numberOfSteps);
                    $circle=$('.steps-circle');
                    $circle.each(function(){
                        $(this)[0].style.height = $(this)[0].style.width = circleDiameter+"px";
                        $(this)[0].style.borderRadius = circleBorderRadius;
                    })
                    updateStep(currentStep);
                }(),
                // collapses the steps
                collapseSteps = function(){
                    $steps.each(function(){
                        $(this).addClass('collapsed');
                    })
                },
                uncollapseSteps = function(){
                    $steps.each(function(){
                        $(this).removeClass('collapsed');
                    })
                },
                //gets the widdest step (used in render to check if we need to collapse)
                getWiddestStep = function(){
                    widdest=0;
                    $steps.each(function(){
                        if($(this)[0].offsetWidth>= widdest){
                            widdest=$(this)[0].offsetWidth;
                        }
                    });
                    return widdest;
                },
                //positions the step labels relatively to the circles, ensuring perfect alignment
                setStepsPosition = function(collapsedMode){
                    if(collapsedMode===false){
                        $steps.each(function(index){
                            if(index !== 0 && index!==numberOfSteps-1){
                                $(this)[0].style.left = ($circle[index].offsetLeft + circleDiameter/2) + "px";
                                $(this)[0].style.top = stepsPadding + "px";
                                $(this)[0].style.transform = "translate(-50%,0)";
                                $(this)[0].style.webkitTransform = "translate(-50%,0)";
                            }
                            else if(index===numberOfSteps-1){
                                $(this)[0].style.left = "100%";
                                $(this)[0].style.top = stepsPadding + "px";
                                $(this)[0].style.transform = "translate(-100%,0)";
                                $(this)[0].style.webkitTransform = "translate(-100%,0)";
                            }
                            else if(index ===0){
                                $(this)[0].style.top = stepsPadding + "px";
                            }
                        })
                    }
                    else{
                        $steps.each(function(index){
                            //if the step can't fit if it's centered with its circle then it will be aligned to whatever side the circle is closest to
                            if((($(this)[0].offsetWidth/2) > (parentWidth-($circle[index].offsetLeft+(circleDiameter/2)))) && (index!==0 && index!==numberOfSteps-1 && index>((numberOfSteps/2)-1))){
                                $(this)[0].style.left=100 + "%";
                                $(this)[0].style.top = stepsPadding + "px";
                                $(this)[0].style.transform = "translate(-100%,0)";
                                $(this)[0].style.webkitTransform = "translate(-100%,0)";
                            }
                            else if( $(this)[0].offsetWidth/2 > ($circle[index].offsetLeft+(circleDiameter/2))   && (index!==0 || index!==numberOfSteps-1)){
                                $(this)[0].style.left=0 + "px";
                                $(this)[0].style.top = stepsPadding + "px";
                                $(this)[0].style.transform = "translate(0,0)";
                                $(this)[0].style.webkitTransform = "translate(0,0)";
                            }
                            else{
                                if(index !== 0 && index!==numberOfSteps-1){
                                    $(this)[0].style.left = ($circle[index].offsetLeft + circleDiameter/2) + "px";
                                    $(this)[0].style.top = stepsPadding + "px";
                                    $(this)[0].style.transform = "translate(-50%,0)";
                                    $(this)[0].style.webkitTransform = "translate(-50%,0)";
                                }
                                else if(index===numberOfSteps-1){
                                    $(this)[0].style.left = "100%";
                                    $(this)[0].style.top = stepsPadding + "px";
                                    $(this)[0].style.transform = "translate(-100%,0)";
                                    $(this)[0].style.webkitTransform = "translate(-100%,0)";
                                }
                                else if(index ===0){
                                    $(this)[0].style.top = stepsPadding + "px";
                                }
                            }
                        })
                    }
                },
                // if the widdest step is widder than the width of the container/(numberofsteps-1) then it goes into collapsed mode
                // else it makes every step the width of the widdest (this ensures that there is correct spacing between circles)
                // this needs to be called when the window is resized 
                render = function(){
                    $timeout(function(){
                        parentWidth=$parent.offsetWidth;
                        width=getWiddestStep();
                        //Next it makes sure that there's enough room to equally space the circles and labels
                        //also adds the minimum padding
                        if((((width*numberOfSteps)+(((minimumPaddingBetweenSteps + circleDiameter*1.8)*(numberOfSteps-1)))) <= parentWidth) || noCollapse) {
                            //UNCOLLAPSED VIEW  
                            //every step except for the first and last gets a left coordinate equal to it's circle+(half of circle) and translatde to left -50%
                            setStepsPosition(!collapsedMode);
                            uncollapseSteps();
                        }
                        else {
                            //COLLAPSED VIEW
                            setStepsPosition(collapsedMode);
                            collapseSteps();
                        }
                        //renders the bar and its fill
                        if(bar){
                            $bar[0].style.right = $bar[0].style.left = $bar[0].style.top = circleDiameter/2+"px";
                            $bar[0].style.height = barHeight+"px";
                            $bar[0].style.position = "absolute";
                            $bar[0].style.transform = "translate(0,-50%)";
                            $bar[0].style.webkitTransform = "translate(0,-50%)";

                            $barFill[0].style.bottom = $barFill[0].style.left = $barFill[0].style.top = barFillPadding + "px";
                            $barFill[0].style.position = "absolute";
                            $barFill[0].style.background = barFillColor;
                        }

                    });
                };
            
                $steps.each(function(){
                    $(this)[0].style.position = "absolute";
                });
                render();
                window.onresize=function(){
                    render();
                };
                //watches the active-step attribute on the my-steps element and applies the active class to a new step
                attrs.$observe('activeStep',function(updatedStep){
                    updateStep(updatedStep);
                });

                //if the clickable attribute is present
                if(clickable){
                    $circle.each(function(index){
                        $(this)[0].style.cursor="pointer";
                        $(this)[0].addEventListener("click",function(){
                            updateStep(index+1);
                        });
                    });
                    $steps.each(function(index){
                        $(this)[0].style.cursor="pointer";
                        $(this)[0].addEventListener("click",function(){
                            updateStep(index+1);
                        });
                    });
                }
            }
        }
    }]);
    
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
