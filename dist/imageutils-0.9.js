/*!
 * ImageUtils
 * 
 * @version 0.9
 * @license MIT License
 * @author mach3
 * @require jQuery 1.7+
 */
(function($, undefined){

	var ImageUtils = ({
		type : "ImageUtils",
		browser : {
			msie : false,
			version : null
		},
		regex : {
			extension : /\.(png|jpg|jpeg|gif)$/i
		},
		/**
		 * initialize ImageUtils
		 */
		init : function(){
			var m = navigator.userAgent.match(/MSIE\s([\d\.]+?);/i);
			this.browser.msie = m !== null;
			if( this.browser.msie ){
				this.browser.version = parseInt(m[1], 10);
			}
			return this;
		},
		_replace : function(str, vars){
			return str.replace(
				/\{\{(\w+?)\}\}/g, 
				function(a,b){ return vars[b] || ""; }
			);
		},
		_hasSize : function(ele){
			var $ele = $(ele);
			return Boolean($ele.width() && $ele.height());
		},
		_getType : function(ele){
			var type = null;
			switch(true){
				case /AlphaImageLoader/i.test($(ele).css("filter")) : type = "ail"; break;
				case ele.tagName.toLowerCase() === "img" : type = "img"; break;
				default : type = "block"; break;
			}
			return type;
		},
		_getImage : function(ele){
			var o, r;
			o = $(ele);
			r = null;
			switch(this._getType(ele)){
				case "ail" : r = o.css("filter").match(/src=([^,\)]+)/)[1]; break;
				case "img" : r = o.prop("src"); break;
				default : r = o.css("background-image").match(/url\("?(.+?)"?\)/)[1]; break;
			}
			return r;
		},
		_getHoverImage : function(ele, postfix){
			return this._getImage(ele).replace(this.regex.extension, function(a){
				return postfix + a;
			});
		},
		/**
		 * Set AlphaImageLoader to element
		 * @param jQueryObject $eles
		 * @param Object config
		 * @return jQueryObject
		 * 
		 * @example
		 *   ImageUtils.alphaImage($(ele), {
		 *     method : "image", // "image" || "crop" || "scale", sizingMethod for AlphaImageLoader
		 *     blankImage : "./blank.gif", // The path to the transparent GIF image
		 *   });
		 */
		alphaImage : function($eles, config){
			var my = {};
			if(! this.browser.msie){ return ; }
			my.self = this;
			my.opt = $.extend({
				method : "image",
				blankImage : "./blank.gif"
			}, config);
			my.ail = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod={{method}}, src={{path}});";
			my.setFilter = function(){
				var o, my, path;
				o = $(this);
				my = o.data("alpha-image");
				if(this.tagName.toLowerCase() === "img"){
					path = o.prop("src");
					o.css({
						"width" : o.width(),
						"height" : o.height()
					});
					o.prop("src", my.opt.blankImage);
				} else {
					path = o.css("background-image").match(/url\("?(.+?)"?\)/)[1];
					o.css("background-image", "none");
					o.append($("<span>").css({
						"position" : "absolute",
						"display" : "block",
						"background-color" : "#fff",
						"width" : o.width(),
						"height" : o.height(),
						"opacity" : 0
					}));
				}
				o.css({
					"filter" : my.self._replace(my.ail, {
						method : my.opt.method,
						path : path
					})
				});
			};
			$eles.each(function(){
				var o = $(this);
				o.data("alpha-image", my);
				if(my.self._hasSize(this)){
					my.setFilter.call(this);
				} else {
					$(this).on("load", my.setFilter);
				}
			});
			return $eles;
		},
		/**
		 * Swap image on hover
		 * @param jQueryObject $eles
		 * @param Object config
		 * @return jQueryObject
		 * 
		 * @example
		 *   ImageUtils.swapImage($(ele), {
		 *     hoverPostfix : "-hover", // Postfix for hover image
		 *     ignoreClass : "active", // if the element has this class, swap is ignored.
		 *   });
		 */
		swapImage : function($eles, config){
			var my = {};
			my.self = this;
			my.opt = $.extend({
				hoverPostfix : "-hover",
				ignoreClass : "active"
			}, config);
			my.swap = function(e){
				var o, my, enter, src, utils;
				o = $(this);
				my = o.data("swap-image");
				if(o.hasClass(my.opt.ignoreClass)){ return; }
				enter = e.type.toLowerCase() === "mouseenter";
				src = enter ? o.data("hover-image") : o.data("default-image");
				switch( my.self._getType(this) ){
					case "ail" :
						o.css("filter", o.css("filter").replace(
							/src=([^,\)\s]+)/, 
							function(){ return "src=" + src; }
						));
						break;
					case "img" : o.attr("src", src); break;
					default : o.css("background-image", "url(" + src + ")"); break;
				}
			};
			$eles.each(function(){
				var o = $(this);
				o.data("default-image", my.self._getImage(this));
				o.data("hover-image", my.self._getHoverImage(this, my.opt.hoverPostfix));
				o.data("swap-image", my);
				$("<img>").on("load", function(){
					o.hover(my.swap, my.swap);
				}).attr("src", o.data("hover-image"));
			});
			return $eles;
		},
		/**
		 * Add blend effect to element on hover
		 * @param jQueryObject $eles
		 * @param Object config
		 * @return jQueryObject
		 * 
		 * @example
		 *   ImageUtils.blendImage($(ele), {
		 *     hoverPostfix : "-hover",
		 *     ignoreClass : "active",
		 *     durationEnter : 100,
		 *     durationLeave : 500
		 *   });
		 */
		blendImage : function($eles, config){
			var my = {};
			my.self = this;
			my.opt = $.extend({
				hoverPostfix : "-hover",
				ignoreClass : "active",
				durationEnter : 100,
				durationLeave : 500
			}, config);
			my.init = function(){
				var o, my, src, hover;
				o = $(this);
				my = o.data("blend-image");
				src = my.self._getHoverImage(this, my.opt.hoverPostfix);
				hover = $("<span>")
					.css({
						"position" : "absolute",
						"display" : "block",
						"width" : o.width(),
						"height" : o.height(),
						"background-image" : "url(" + src + ")"
					});
				if(my.self.browser.msie){
					my.self.alphaImage(hover);
					hover.css("background-image", "none");
				}
				hover.css("opacity", 0);
				if(this.tagName.toLowerCase() === "img"){
					hover.insertBefore(o);
				} else {
					o.append(hover);
				}
				hover.data("blend-image", my);
				hover.hover(my.blend, my.blend);
			};
			my.blend = function(e){
				var my, enter, opacity, duration;
				my = $(this).data("blend-image");
				enter = e.type === "mouseenter";
				opacity = enter ? 1 : 0;
				duration = my.opt["duration" + (enter ? "Enter" : "Leave")];
				$(this).stop().fadeTo(duration, opacity);
			};
			$eles.each(function(){
				$(this).data("blend-image", my);
				if(my.self._hasSize(this)){
					my.init.call(this);
				} else {
					$(this).on("load", my.init);
				}
			});
			return $eles;
		}
	}).init();

	$.fn.extend({
		/**
		 * Set AlphaImageLoader to elements
		 * This call ImageUtils.alphaImage()
		 * @param Object config
		 */
		alphaImage : function(config){
			ImageUtils.alphaImage(this, config);
			return this;
		},
		/**
		 * Swap image on hover
		 * This call ImageUtils.swapImage()
		 * @param Object config
		 */
		swapImage : function(config){
			ImageUtils.swapImage(this, config);
			return this;
		},
		/**
		 * Add blend effect to element on hover
		 * This call ImageUtils.blendImage()
		 * @param Object config
		 */
		blendImage : function(config){
			ImageUtils.blendImage(this, config);
			return this;
		}
	});

}(jQuery));
