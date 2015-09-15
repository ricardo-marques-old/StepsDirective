(function(angular){

    'use strict'

    angular.module('app', [])
    .controller('myController',['$scope',function($scope){
        this.activeStep = 1;
        this.updateStep = function(newStep){
            this.activeStep = newStep;
        }
    }])
    .directive('mySteps',function($timeout,$interval){
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
                    //when the active-step attribute is updated this adds the class active to the step with index of updatedStep
                    updateStep = function(updatedStep){
                        console.log(collapsedMode);
                        $timeout(function(){
                            var $circles=$('.circle');
                            if(updatedStep >= 0 && updatedStep <= numberOfSteps){ //make sure it's a valid step number
                                // $steps.removeClass('active').eq(updatedStep-1).addClass('active');
                                $circles.removeClass('active').eq(updatedStep-1).addClass('active');
                                if(collapsedMode){
                                    console.log('collapse');
                                    collapseOtherSteps(updatedStep-1);
                                }   
                            }
                            else{
                                $steps.removeClass('active');
                            }
                        })   
                    },
                    createCircles = function(){
                        $mySteps.prepend('<div class="circles"></div>');
                        var $circles=$('.circles')[0];
                        $circles.innerHTML=template.repeat(numberOfSteps);
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
