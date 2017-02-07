// page init
jQuery(function () {
    initTimer();
});

function initTimer(){
//	jQuery('.timer1').circleTimer({
//		startTime: '00:00',
//		endTime: '03:50'
//	});
//	jQuery('.timer2').circleTimer({
//		startTime: '03:00',
//		endTime: '04:50'
//	});
//jQuery('.timer3').circleTimer({
//    startTime: '03:50',
//    endTime: '00:00'
//});
}

/*
 * circleTimer
 */
;(function($) {
	function CircleTimer(options) {
		this.options = {
			startTime: '00:00',
			endTime: '00:00'
		}
		$.extend(this.options, options);
		this.init();
	}
	CircleTimer.prototype = {
		init: function() {
			this.findElements();
			this.prepare();
			this.makeCallback('onInit', this);
		},
		findElements: function() {
			this.holder = $(this.options.holder);
			
			this.leftPartFirst = this.holder.find('.left-part.first');
			this.leftCircleWrapFirst = this.leftPartFirst.find('.left-wrap');
			this.leftCircleFameFirst = this.leftPartFirst.find('.left-frame');
			
			this.leftPartSecond = this.holder.find('.left-part.second');
			this.leftCircleWrapSecond = this.leftPartSecond.find('.left-wrap');
			this.leftCircleFameSecond = this.leftPartSecond.find('.left-frame');
			
			this.rightPartFirst = this.holder.find('.right-part.first');
			this.rightCircleWrapFirst = this.rightPartFirst.find('.right-wrap');
			this.rightCircleFameFirst = this.rightPartFirst.find('.right-frame');
			
			this.rightPartSecond = this.holder.find('.right-part.second');
			this.rightCircleWrapSecond = this.rightPartSecond.find('.right-wrap');
			this.rightCircleFameSecond = this.rightPartSecond.find('.right-frame');
			
			this.minutes = this.holder.find('.minutes');
			this.seconds = this.holder.find('.seconds');
		},
		prepare: function() {
			var startTimeSplit = this.options.startTime.split(':');
			this.startTime = parseInt(startTimeSplit[0] * 60 * 1000 + startTimeSplit[1] * 1000, 0);
			
			var endTimeSplit = this.options.endTime.split(':');
			this.endTime = parseInt(endTimeSplit[0] * 60 * 1000 + endTimeSplit[1] * 1000, 0);
			
			if (!this.startTime) {
				this.startTime = 0;
			}
			
			if (!this.endTime) {
				this.endTime = 0;
			}
			
			this.deltaTime = this.endTime - this.startTime;
			
			if (this.deltaTime !== 0) {
				if (this.deltaTime < 0) {
					this.deltaTime = - this.deltaTime;
					this.direction = -1;
				} else {
					this.direction = 1;
				}
				this.initTime = new Date().getTime();
				this.countTimer();
			}
		},
		countTimer: function() {
			var that = this;
			
			var curTime = new Date().getTime();
			var delta = curTime - that.initTime;
			
			var progress;
			
			if (delta === 0) {
				progress = 0;
			} else {
				progress = parseFloat((100 * delta / that.deltaTime).toFixed(2));
			}
			
			that.timer = setTimeout(function() {
				that.countTimer();
			}, 13);
			
			that.progressBar(progress);
			that.writeln(delta);
		},
		progressBar: function(progress) {
			if (progress < 25) {
				this.rightCircleWrapFirst.rotate({
					angle: 180 * progress / 25,
					center: ["34", "34"]
				});
				this.rightCircleFameFirst.rotate({
					angle: 180 - (180 * progress / 25),
					center: ["34", "34"]
				});
			} else {
				this.rightCircleWrapFirst.rotate({
					angle: 180,
					center: ["34", "34"]
				});
				this.rightCircleFameFirst.rotate({
					angle: 0,
					center: ["34", "34"]
				});
			}
			
			if (progress >= 25) {
				if (progress < 50) {
					this.leftCircleWrapFirst.rotate({
						angle: 180 * (progress - 25) / 25,
						center: ["50%", "50%"]
					});
					this.leftCircleFameFirst.rotate({
						angle: 180 - (180 * (progress - 25) / 25),
						center: ["50%", "50%"]
					});
				} else {
					this.leftCircleWrapFirst.rotate({
						angle: 180,
						center: ["50%", "50%"]
					});
					this.leftCircleFameFirst.rotate({
						angle: 0,
						center: ["50%", "50%"]
					});
				}
			}
			
			if (progress >= 50) {
				if (progress < 75) {
					this.rightCircleWrapSecond.rotate({
						angle: 180 * (progress - 50) / 25,
						center: ["34", "34"]
					});
				} else {
					this.rightCircleWrapSecond.rotate({
						angle: 180,
						center: ["34", "34"]
					});
				}
			}
			
			if (progress >= 75) {
				if (progress < 100) {
					this.leftCircleWrapSecond.rotate({
						angle: 180 * (progress - 75) / 25,
						center: ["34", "34"]
					});
				} else {
					this.leftCircleWrapSecond.rotate({
						angle: 180,
						center: ["34", "34"]
					});
				}
			}
		},
		writeln: function(delta) {
			var curTime = parseInt(delta / 1000, 10);
			
			if (this.direction > 0) {
				curTime = (this.startTime / 1000) + curTime;
			} else {
				curTime = (this.startTime / 1000) - curTime;
			}
			
			if (curTime < 0) {
				clearTimeout(this.timer);
				return;
			}
			var minutes = parseInt(curTime / 60, 10);
			var seconds = curTime - minutes * 60;
			
			if ((minutes + '').length < 2) {
				minutes = '0' + minutes;
			}
			
			if ((seconds + '').length < 2) {
				seconds = '0' + seconds;
			}
			
			this.minutes.text(minutes);
			this.seconds.text(seconds);
		},
		destroy: function() {
			this.destroyed = true;
			
		},
		makeCallback: function(name) {
			if(typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	}
	
	$.fn.circleTimer = function(options) {
		var args = Array.prototype.slice.apply(arguments);
		return this.each(function(){
			var instance = $.data(this, 'CircleTimer');
			var methodName = args[0];
			if (instance) {
				if (typeof methodName === 'string') {
					instance[methodName].apply(instance, args.slice(1));
				}
			} else if (typeof methodName !== 'string') {
				$(this).data('CircleTimer', new CircleTimer($.extend(options, {holder: this})));
			}
		});
	}
}(jQuery));

//timerLoad
;(function($){
	$.fn.timerLoad = function(options){
		var options = $.extend({
			delay: 1
		}, options);
		
		return this.each(function(){
			var box = jQuery(this),
				delay = options.delay,
				currDelay = delay*1000*60,
				seconds = box.find('.seconds'),
				minites = box.find('.minutes'),
				pauseClass = 'pause',
				activeClass = 'timer-active',
				timer,
				hour = 60,
				startSecondsCount = 0,
				startMinutesCount = 0,
				startHoursCount = 0,
				rightPart = box.find('.righ-wrap'),
				rightPartHolder = box.find('.right-frame'),
				leftPart = box.find('.left-wrap'),
				leftPartHolder = box.find('.left-frame'),
				angle = 0;
			
			// rotate loader handler
			rightPart.rotate({
				angle: 0,
				duration: currDelay/2,
				center: ["50%", "50%"], 
				animateTo:180,
				easing: function(x, t, b, c, d) { return b+(t/d)*c ; }
			});
			rightPartHolder.rotate({
				angle: 180,
				duration: currDelay/2,
				center: ["50%", "50%"], 
				animateTo:0,
				easing: function(x, t, b, c, d) { return b+(t/d)*c ; }
			});
			setTimeout(function(){
				leftPart.rotate({
					angle: 0,
					duration: currDelay/2,
					center: ["34", "34"], 
					animateTo:180,
					easing: function(x, t, b, c, d) { return b+(t/d)*c ; }
				});
				leftPartHolder.rotate({
					angle: 180,
					duration: currDelay/2,
					center: ["34", "34"], 
					animateTo:0,
					easing: function(x, t, b, c, d) { return b+(t/d)*c ; }
				});
			}, currDelay/2);
			
			// timer handler
			function nextStep(){
				if (startSecondsCount < hour) {
					startSecondsCount++
				} else {
					startSecondsCount = 0;
					if (startMinutesCount < hour){
						startMinutesCount++
					} 
				}
				currentFormat = function(currCount){
					if (currCount < 10) {
						currCount = '0'+ currCount
					} else {
						currCount
					}
					return currCount
				}
				seconds.text(currentFormat(startSecondsCount));
				minites.text(currentFormat(startMinutesCount));
				
				if (parseInt(currentFormat(startMinutesCount)) < delay) {
					startTimer();
				} 
			};
			startTimer();
			// start timer
			function startTimer(){
				timer = setTimeout(function(){
					nextStep();
				}, 1000);
			};
			// stop timer
			function stopTimer(){
				clearTimeout(timer);
				if (!box.hasClass(pauseClass)) {
					startTimer();
				}
			};
			// control handler
			function controllHandler(e){
				e.preventDefault();
				if (!box.hasClass(pauseClass)) {
					box.addClass(pauseClass)
					stopTimer();
				} else {
					box.removeClass(pauseClass)
					startTimer();
				}
			};
		})
	}
}(jQuery));

// VERSION: 2.3 LAST UPDATE: 11.07.2013
/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/ 
 */

(function($){var supportedCSS,supportedCSSOrigin,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");for(var a=0;a<toCheck.length;a++){if(styles[toCheck[a]]!==undefined){supportedCSS=toCheck[a]}}if(supportedCSS){supportedCSSOrigin=supportedCSS.replace(/[tT]ransform/,"TransformOrigin");if(supportedCSSOrigin[0]=="T"){supportedCSSOrigin[0]="t"}}eval('IE = "v"=="\v"');jQuery.fn.extend({rotate:function(parameters){if(this.length===0||typeof parameters=="undefined"){return}if(typeof parameters=="number"){parameters={angle:parameters}}var returned=[];for(var i=0,i0=this.length;i<i0;i++){var element=this.get(i);if(!element.Wilq32||!element.Wilq32.PhotoEffect){var paramClone=$.extend(true,{},parameters);var newRotObject=new Wilq32.PhotoEffect(element,paramClone)._rootObj;returned.push($(newRotObject))}else{element.Wilq32.PhotoEffect._handleRotation(parameters)}}return returned},getRotateAngle:function(){var ret=[];for(var i=0,i0=this.length;i<i0;i++){var element=this.get(i);if(element.Wilq32&&element.Wilq32.PhotoEffect){ret[i]=element.Wilq32.PhotoEffect._angle}}return ret},stopRotate:function(){for(var i=0,i0=this.length;i<i0;i++){var element=this.get(i);if(element.Wilq32&&element.Wilq32.PhotoEffect){clearTimeout(element.Wilq32.PhotoEffect._timer)}}}});Wilq32=window.Wilq32||{};Wilq32.PhotoEffect=(function(){if(supportedCSS){return function(img,parameters){img.Wilq32={PhotoEffect:this};this._img=this._rootObj=this._eventObj=img;this._handleRotation(parameters)}}else{return function(img,parameters){this._img=img;this._onLoadDelegate=[parameters];this._rootObj=document.createElement("span");this._rootObj.style.display="inline-block";this._rootObj.Wilq32={PhotoEffect:this};img.parentNode.insertBefore(this._rootObj,img);if(img.complete){this._Loader()}else{var self=this;jQuery(this._img).bind("load",function(){self._Loader()})}}}})();Wilq32.PhotoEffect.prototype={_setupParameters:function(parameters){this._parameters=this._parameters||{};if(typeof this._angle!=="number"){this._angle=0}if(typeof parameters.angle==="number"){this._angle=parameters.angle}this._parameters.animateTo=(typeof parameters.animateTo==="number")?(parameters.animateTo):(this._angle);this._parameters.step=parameters.step||this._parameters.step||null;this._parameters.easing=parameters.easing||this._parameters.easing||this._defaultEasing;this._parameters.duration=parameters.duration||this._parameters.duration||1000;this._parameters.callback=parameters.callback||this._parameters.callback||this._emptyFunction;this._parameters.center=parameters.center||this._parameters.center||["50%","50%"];if(typeof this._parameters.center[0]=="string"){this._rotationCenterX=(parseInt(this._parameters.center[0],10)/100)*this._imgWidth*this._aspectW}else{this._rotationCenterX=this._parameters.center[0]}if(typeof this._parameters.center[1]=="string"){this._rotationCenterY=(parseInt(this._parameters.center[1],10)/100)*this._imgHeight*this._aspectH}else{this._rotationCenterY=this._parameters.center[1]}if(parameters.bind&&parameters.bind!=this._parameters.bind){this._BindEvents(parameters.bind)}},_emptyFunction:function(){},_defaultEasing:function(x,t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b},_handleRotation:function(parameters,dontcheck){if(!supportedCSS&&!this._img.complete&&!dontcheck){this._onLoadDelegate.push(parameters);return}this._setupParameters(parameters);if(this._angle==this._parameters.animateTo){this._rotate(this._angle)}else{this._animateStart()}},_BindEvents:function(events){if(events&&this._eventObj){if(this._parameters.bind){var oldEvents=this._parameters.bind;for(var a in oldEvents){if(oldEvents.hasOwnProperty(a)){jQuery(this._eventObj).unbind(a,oldEvents[a])}}}this._parameters.bind=events;for(var a in events){if(events.hasOwnProperty(a)){jQuery(this._eventObj).bind(a,events[a])}}}},_Loader:(function(){if(IE){return function(){var width=this._img.width;var height=this._img.height;this._imgWidth=width;this._imgHeight=height;this._img.parentNode.removeChild(this._img);this._vimage=this.createVMLNode("image");this._vimage.src=this._img.src;this._vimage.style.height=height+"px";this._vimage.style.width=width+"px";this._vimage.style.position="absolute";this._vimage.style.top="0px";this._vimage.style.left="0px";this._aspectW=this._aspectH=1;this._container=this.createVMLNode("group");this._container.style.width=width;this._container.style.height=height;this._container.style.position="absolute";this._container.style.top="0px";this._container.style.left="0px";this._container.setAttribute("coordsize",width-1+","+(height-1));this._container.appendChild(this._vimage);this._rootObj.appendChild(this._container);this._rootObj.style.position="relative";this._rootObj.style.width=width+"px";this._rootObj.style.height=height+"px";this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._eventObj=this._rootObj;var parameters;while(parameters=this._onLoadDelegate.shift()){this._handleRotation(parameters,true)}}}else{return function(){this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._imgWidth=this._img.naturalWidth;this._imgHeight=this._img.naturalHeight;var _widthMax=Math.sqrt((this._imgHeight)*(this._imgHeight)+(this._imgWidth)*(this._imgWidth));this._width=_widthMax*3;this._height=_widthMax*3;this._aspectW=this._img.offsetWidth/this._img.naturalWidth;this._aspectH=this._img.offsetHeight/this._img.naturalHeight;this._img.parentNode.removeChild(this._img);this._canvas=document.createElement("canvas");this._canvas.setAttribute("width",this._width);this._canvas.style.position="relative";this._canvas.style.left=-this._img.height*this._aspectW+"px";this._canvas.style.top=-this._img.width*this._aspectH+"px";this._canvas.Wilq32=this._rootObj.Wilq32;this._rootObj.appendChild(this._canvas);this._rootObj.style.width=this._img.width*this._aspectW+"px";this._rootObj.style.height=this._img.height*this._aspectH+"px";this._eventObj=this._canvas;this._cnv=this._canvas.getContext("2d");var parameters;while(parameters=this._onLoadDelegate.shift()){this._handleRotation(parameters,true)}}}})(),_animateStart:function(){if(this._timer){clearTimeout(this._timer)}this._animateStartTime=+new Date;this._animateStartAngle=this._angle;this._animate()},_animate:function(){var actualTime=+new Date;var checkEnd=actualTime-this._animateStartTime>this._parameters.duration;if(checkEnd&&!this._parameters.animatedGif){clearTimeout(this._timer)}else{if(this._canvas||this._vimage||this._img){var angle=this._parameters.easing(0,actualTime-this._animateStartTime,this._animateStartAngle,this._parameters.animateTo-this._animateStartAngle,this._parameters.duration);this._rotate((~~(angle*10))/10)}if(this._parameters.step){this._parameters.step(this._angle)}var self=this;this._timer=setTimeout(function(){self._animate.call(self)},10)}if(this._parameters.callback&&checkEnd){this._angle=this._parameters.animateTo;this._rotate(this._angle);this._parameters.callback.call(this._rootObj)}},_rotate:(function(){var rad=Math.PI/180;if(IE){return function(angle){this._angle=angle;this._container.style.rotation=(angle%360)+"deg";this._vimage.style.top=-(this._rotationCenterY-this._imgHeight/2)+"px";this._vimage.style.left=-(this._rotationCenterX-this._imgWidth/2)+"px";this._container.style.top=this._rotationCenterY-this._imgHeight/2+"px";this._container.style.left=this._rotationCenterX-this._imgWidth/2+"px"}}else{if(supportedCSS){return function(angle){this._angle=angle;this._img.style[supportedCSS]="rotate("+(angle%360)+"deg)";this._img.style[supportedCSSOrigin]=this._parameters.center.join(" ")}}else{return function(angle){this._angle=angle;angle=(angle%360)*rad;this._canvas.width=this._width;this._canvas.height=this._height;this._cnv.translate(this._imgWidth*this._aspectW,this._imgHeight*this._aspectH);this._cnv.translate(this._rotationCenterX,this._rotationCenterY);this._cnv.rotate(angle);this._cnv.translate(-this._rotationCenterX,-this._rotationCenterY);this._cnv.scale(this._aspectW,this._aspectH);this._cnv.drawImage(this._img,0,0)}}}})()};if(IE){Wilq32.PhotoEffect.prototype.createVMLNode=(function(){document.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!document.namespaces.rvml&&document.namespaces.add("rvml","urn:schemas-microsoft-com:vml");return function(tagName){return document.createElement("<rvml:"+tagName+' class="rvml">')}}catch(e){return function(tagName){return document.createElement("<"+tagName+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}})()}})(jQuery);
