var _t = Date.now();
var c = document.getElementById("canvas");
c.height = window.innerHeight;
c.width = window.innerWidth;		
var ctx = c.getContext('2d');

window.addEventListener("resize", function(e) {
    c.height = window.innerHeight;
    c.width = window.innerWidth;
});

dotsArray = [];

var mX;
var mY;
function draw() {
	var t = Date.now();
	window.addEventListener("mousemove", function(e) {
		mY = e.clientY
		mX = e.clientX
	})

	var deltaT = (t - _t)/1000;
	//Background
	ctx.rect(0, 0, c.width, c.height);
	ctx.fillStyle = 'rgb(13, 12, 13)';
	ctx.fill();
	for (i = 0; i < dotsArray.length; i++) 	{
		dotsArray[i].update(deltaT, mX, mY);
	}
	
	for (i = 0; i < sphereArray.length; i++) 	{
		sphereArray[i].update(deltaT, mX, mY);
	}
	_t = t;
	window.requestAnimationFrame(draw);
}
function Glow() {
	this.x = 0;
	this.y = 0;
	this.draw = function() {
  ctx.shadowBlur = 20;
  ctx.shadowColor = "rgba(255,255,255,1)";
	ctx.fillStyle =  "white";
	ctx.arc(this.x,this.y, 2 /*radius*/,0,2*Math.PI);
	ctx.fill();
	ctx.shadowBlur=0;
	}
	this.update = function(deltaT, mX, mY) {
		this.x=mX;
		this.y=mY;
		this.draw();
	}
}

function Dots(x, y, radius, twinkle, xV, yV)  {
	this.x = x;
	this.y = y;
	this.xV = xV;
	this.yV = yV;
	
	this.twinkler = .01;
	this.twinkle = twinkle;
	this.radius = radius;
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = "rgba(255,255,255,"+this.twinkle+")";
		ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
		ctx.fill();
	}
	this.update = function(deltaT, mX, mY) {
		//Edge Reset
		var detectionR = 205;
		if (this.y>(c.height+detectionR+this.radius+5)) {
			this.y = 0-this.radius-detectionR;
		}
		
		else if (this.y<(-this.radius-detectionR-5)) {
			this.y = c.height-this.radius-detectionR;
		}
		
		if (this.x>(c.width+this.radius+detectionR+5)) {
			this.x = 0-detectionR;
		}
		
		else if (this.x<(-this.radius-detectionR-5)) {
			this.x = c.width+this.radius+detectionR;
		}
		
		if (yV < 10 && yV > -10) {
			yV+=Math.random()*15;
		}
		if (xV < 20 && xV > -10) {
			xV+=Math.random()*15;
		}
		
		//Left
	
		if (this.twinkle > twinkle) {this.twinkler = (Math.random()*-.005)}
		if (this.twinkle < 0) {this.twinkler = (Math.random()*.005)}
		this.twinkle += this.twinkler;

		var d = distance(this.x,this.y,mX,mY);
		if ((this.x >= mX-detectionR && this.x <= mX+detectionR)&&(this.y >= mY-detectionR && this.y <= mY+detectionR)) {

			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(mX,mY)
      ctx.lineWidth = this.radius;
      ctx.strokeStyle = "rgba(255,255,255,"+((detectionR-d)/detectionR)/2+")";
      ctx.stroke();

		}
		this.x += this.xV*deltaT;
		this.y += this.yV*deltaT;
		this.draw();
	}
}

function init() {
	dotsArray = [];
	sphereArray = [];
	for (i = 0; i < 60; i ++) {
		var x = Math.random()*c.width;
		var xV = Math.random()*90-45;
		var yV = Math.random()*90-45;
		var radius = Math.random()*1.8;
		var y = Math.random()*(c.height+radius*2)-radius;
		var twinkle = Math.random()*.6;
		dotsArray.push(new Dots(x,y,radius, twinkle, xV, yV))
	}
	for (i = 0; i<1; i++) {
	sphereArray.push(new Glow());
	}
}

function distance(x1,y1,x2,y2) {
  var distX = Math.pow(x2 - x1, 2),
      distY = Math.pow(y2 - y1, 2),
      distance = Math.sqrt(distX + distY);
  return distance;
}

Utilities = {
	mobile: function () {
		var check = false;
		if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			check = true;
		} else {
			check = false;
		}
		return check;
	},
	
	trimSpace: function (x) {
		var emptySpace = / /g;
		var trimAfter = x.replace(emptySpace, "");
		return (trimAfter);
	},

	NumberValidate: function (incomingString, defaultValue) {
		if (this.trimSpace(incomingString).length === 0 || incomingString.search(/[^0-9]/g) != -1) {
			return false;
		} else {
			return true;
		}
	},
	
	NameValidate: function (incomingString, defaultValue) {
		if (incomingString.search(/[^a-z A-Z а-я А-ЯёЁ!#%^/.:;0-9-\n/?{}&*(,)+=_~`|\[\]]/g) != -1) {
			return false;
		} else {

			return true;
		}
	},

	TextValidate: function (incomingString, defaultValue) {
		if (this.trimSpace(incomingString).length === 0 || incomingString.search(/[^а-яА-ЯёЁ]/g) != -1) {
			return false;
		} else {

			return true;
		}
	},
	
	textValidateArea: function (incomingString, defaultValue) {
		if (this.trimSpace(incomingString).length === 0 || incomingString.search(/[^а-я А-ЯёЁ!#%^/.:;0-9-\n/?{}&*(,)+=_~`|\[\]]/g) != -1) {
			return false;
		} else {
			return true;
		}
	},

	textValidateAreaEng: function (incomingString, defaultValue) {
		if (this.trimSpace(incomingString).length === 0 || incomingString.search(/[^a-z A-Z!#%^/.:;0-9-\n/?{}&*(,)+=_~`|\[\]]/g) != -1) {
			return false;
		} else {
			return true;
		}
	}
}

var productSlider = {
	slider: $('.app-product-slider'),
	sliderNav: $('.app-tabnav'),
	sliderFilter: $('.js-dropdown-handler'),
	init: function(){
		productSlider.slider.on('beforeChange', function(event, slick, slide, nextSlide){
			productSlider.sliderNav.find('.active').removeClass('active').end().children().eq(nextSlide).addClass('active');
			productSlider.sliderFilter.empty().text(productSlider.sliderNav.find('.active').children().attr('data-text'));
			$('.js-dropdown').removeClass('is-active');
		}).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: false,
			focusOnSelect: false,
			fade: true,
			arrows: true,
			dots: false,
			speed: 500,
			responsive: [
				{
					breakpoint: 767,
					settings: {
						arrows: true,
						dots: false
					}
				},
				{
					breakpoint: 575,
					settings: {
						arrows: false,
						dots: true
					}
				}
			]
		});

		$(document).on('click', '.app-tabnav__item', function (){
			productSlider.slider.slick('slickGoTo', $(this).index(), true );
			$('.js-dropdown').removeClass('is-active');
		});

		$(document).on('click', '.js-dropdown-toggle', function () {
			$(this).parents('.js-dropdown').toggleClass('is-active');
		});
	}
};

var historySlider = {
	slider: $('.app-history-slider'),
	init: function(){
		$('.app-history-card__media').each(function () {
			var $this = $(this);
			var poster = $this.data('poster');
			var src = $this.data('src');
			// var vhtml = '<video class="app-history-card__video" loop="loop" muted poster="' + poster + '">';
			var vhtml = '<video class="app-history-card__video" muted poster="' + poster + '">';
			vhtml += '<source src="' + src + '.mp4" type="video/mp4">';
			vhtml += '<source src="' + src + '.webm" type="video/webm">';
			vhtml +='</video>';
			
			$this.prepend(vhtml);
		});

		historySlider.slider.on('init', function (event, slick) {
			var video = slick.$slides.eq(0).find('video').get(0);
			video.play();
			video.onended = function (e) {
				historySlider.slider.slick('slickGoTo', 1, true );
			}
		}).on('beforeChange', function (event, slick, slide, nextSlide) {
			slick.$slides.removeClass('animate').eq(nextSlide).addClass('animate');
			var video = slick.$slides.eq(slide).find('video').get(0);
			video.pause();
			video.currentTime = 0.0;
			// productSlider.sliderNav.find('.active').removeClass('active').end().children().eq(nextSlide).addClass('active');
		}).on('afterChange', function (event, slick, currentSlide) {
			// slick.$slides.eq(currentSlide).addClass('animated');
			var video = slick.$slides.eq(currentSlide).find('video').get(0);
			video.play();

			video.onended = function (e) {
				historySlider.slider.slick('slickGoTo', currentSlide+1, true );
			}
		}).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			focusOnSelect: false,
			fade: true,
			arrows: true,
			dots: false,
			speed: 500,
			// autoplay: true,
			// autoplaySpeed: 5000,
			responsive: [
				{
					breakpoint: 767,
					settings: {
						arrows: false,
						dots: true
					}
				}
			]
		});
	}
};

var timelineSlider = {
	popupHtml: function(elem){
		var tpl = '<div class="app-timeline-modal">'+
					'<div class="app-timeline-modal__wrap">'+
						'<h6 class="app-timeline-modal__title">' + elem['title'] + '</h6>'+
						'<div class="app-timeline-modal__content">'+
							'<p class="app-timeline-modal__text">' + elem['text'] + '</p>'+
							'<p class="app-timeline-modal__target">Подробнее: <a href="' + elem['link'] + '" target="_blank">' + elem['link'] + '</a></p>'+
						'</div>'+
					'</div>';
		return tpl;
	},
	slider: $('.app-timeline-slider'),
	sliderSettings: function(){
		return {
			slidesToShow: 6,
			slidesToScroll: 6,
			infinite: false,
			focusOnSelect: false,
			variableWidth: true,
			arrows: true,
			dots: false,
			speed: 500,
			responsive: [
				{
					breakpoint: 1199,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4,
						variableWidth: true,
						dots: false
					}
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
						// centerMode: true,
						variableWidth: true,
						arrows: false,
						dots: true
					}
				},
				{
					breakpoint: 575,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						// centerMode: true,
						variableWidth: false,
						arrows: false,
						dots: false
					}
				}
			]
		}
	},
	popupClose: function(){
		$(document).on('click', function (e) {
			if (!$(e.target).closest('.app-timeline-slider__item.is-active').length) {
				$('.app-timeline').find('.app-timeline-slider__item.is-active').removeClass('is-active');
				$('.app-timeline').find('.app-timeline-modal').hide().remove();
			}
		});
	},
	init: function(){
		var item = {};
		var data = [];
		var map = Array.prototype.map;
		var curItem;
		var curElem;

		timelineSlider.slider.on('beforeChange', function (event, slick, slide, nextSlide) {
			slick.$slides.find('is-active').removeClass('is-active');
			$('.app-timeline').find('.app-timeline-modal').hide().remove();
		}).on('breakpoint', function (event, slick) {
			setTimeout(function () {
				timelineSlider.slider.slick('slickGoTo', 7, true );
			}, 500);
		}).slick(timelineSlider.sliderSettings());

		timelineSlider.slider.slick('slickGoTo', 7, true );

		$(document).on('click', '.js-timeline-preview', function () {
			var self = $(this);
			var modalWidth;
			var modalHeight;
			var posLeft = 0;
	
			// console.log('left= ', $(this).offset().left);
			// console.log('t-width= ', self.width());
			curItem = $(this).closest('.app-timeline-slider__item');
			curElem = $(this).closest('.app-timeline-card');
			if(!curItem.hasClass('is-active')) {
				$('.app-timeline').find('.app-timeline-slider__item.is-active').removeClass('is-active');
				$('.app-timeline').find('.app-timeline-modal').hide().remove();
				if (curElem.data('link') == '#') return false;
				data['title'] = curElem.data('title');
				data['text'] = curElem.data('text');
				data['link'] = curElem.data('link');

				item = timelineSlider.popupHtml(data);
				$('.app-timeline').prepend(item);
				modalWidth = $('.app-timeline-modal').width() / 2;
				modalHeight = $('.app-timeline-modal').outerHeight();
				// console.log('modal-width= ', $('.app-timeline-modal').width());
				if (Math.round(self.offset().left + (self.width() / 2) - modalWidth) > 0) {
					if (Math.round(self.offset().left + (self.width() / 2) + modalWidth) > $(window).width()) {
						posLeft = $(window).width() - (modalWidth * 2) - 10;
						$('.app-timeline-modal').addClass('right');
					} else {
						posLeft = Math.round(self.offset().left + (self.width() / 2) - modalWidth);
					}
				} else {
					posLeft = 10;
					$('.app-timeline-modal').addClass('left');
				}

				$('.app-timeline-modal').addClass('visible').css({
					"left": posLeft + 'px',
					"top": Math.round(self.position().top + (self.height() / 2) - modalHeight) + 'px'
				});
				curItem.addClass('is-active');
			}
		});

		$(document).on('mouseover', '.js-timeline-preview', function () {
			$(this).parent().next().addClass('is-shown');
		});

		$(document).on('mouseleave', '.js-timeline-preview', function () {
			$(this).parent().next().removeClass('is-shown');
		});

		$('body').on('click', timelineSlider.popupClose);

		$(window).on('resize', function () {
			$('.app-timeline').find('.is-active').removeClass('is-active').end().find('is-shown').removeClass('is-shown');
			$('.app-timeline').find('.app-timeline-modal').hide().remove();
		});
	}
};

var productBgAnimate = {
	init: function () {
		$(window).on("scroll", function() {
			var posTop = 0;
			var posLeft = ($(window).scrollTop() / $('.app-product').outerHeight()) * 20;
			// console.log('pos= ', pos);
			posTop = ($(window).width() > 767) ? "-25%" : "0";
			if ($(window).scrollTop() >= $('.app-product').offset().top - 400 && $(window).scrollTop() < $('.app-product').offset().top + $('.app-product').outerHeight()) {
				$('.app-product__bg-img').css({'transform' : 'translate(' + posLeft + '%, ' + posTop + ')'});
			}
		});
	}
}

var scrollToElem = {
	toScroll: function(elem){
		$('html, body').animate({ scrollTop: parseInt($(elem).offset().top) }, 1000);
	},
	
	init: function(){
		$(document).on('click', '.js-scrollTo', function (e) {
			var $this = $(e.currentTarget);
			var scrollHandler = $this.data('scroll');
			scrollToElem.toScroll(scrollHandler);
		});
	}
}

var modalVideo = {
	player: null,
	done: false,

	onYouTubeIframeAPIReady: function(jElement, id){
		var player = 'player-0';
		jElement.find('.yt-video').attr('id', player);
		modalVideo.player = new YT.Player(player, {
		  height: '100%',
		  width: '100%',
		  videoId: id,
		  playerVars: { 'autoplay': 1, 'controls': 1,'autohide':1, 'wmode':'opaque'},
		  events: {
			'onStateChange': function(e) {
			  if (e.data == 0) {
				modalVideo.onYouTubeDestroy.call(null, modalVideo.player);
			  }
			},
			'onReady': modalVideo.onPlayerReady,
			'onPlayerStateChange': modalVideo.onPlayerStateChange
		  }
		});
	},

	onPlayerReady: function (event) {
		event.target.setVolume(10);
		//event.target.playVideo();
	},

	onPlayerStateChange: function (event) {
		if (event.data == YT.PlayerState.PLAYING && !modalVideo.done) {
			setTimeout(modalVideo.stopVideo.call(null, modalVideo.player), 6000);
			modalVideo.done = true;
		}
	},

	stopVideo: function (player) {
		player.stopVideo();
	},

	onYouTubeDestroy: function (player) {
		player.stopVideo();
		player.destroy();
		player = null;
	},

	openModal: function (elem, id) {
		var self = this;
		var ytId = $(elem).data('video');
		$('.app').addClass('app-modal-open');
		$(id).collapse('show').before('<div class="app-modal__backdrop fade"></div>').add($('.app-modal__backdrop').addClass('in').css('height', '110%'));

		$(document).on('click.bs.collapse', '.app-modal .yt-close', function() {
			modalVideo.hideModal(id);
		});

		modalVideo.onYouTubeIframeAPIReady.call(null, $(id), ytId);
	},

	hideModal: function (elem) {
		if($('.collapse.in').is(':visible')){
			$(elem).collapse('hide');
			$('.app-modal__backdrop').fadeOut(function () {
				this.remove();
			});
			$('.app').removeClass('app-modal-open');

			modalVideo.onYouTubeDestroy.call(null, modalVideo.player);
		}
	},

	init: function () {
		var self = this;
		$(document).on('click', '.js-modal-video', function (e) {
			var $this = $(e.currentTarget);
			self.openModal($this, $this.data('modal'));
		});
	}
}

$(function () {
	init();
	draw();
	timelineSlider.init();
	productSlider.init();
	historySlider.init();
	productBgAnimate.init();
	scrollToElem.init();
	modalVideo.init();

	var timeOut = false;
	setInterval(addAnimateTo, 6000);

	function addAnimateTo () {
		clearTimeout(timeOut);
		$('.app-btn-animate').removeClass('animate-back').addClass('animate-to');
		timeOut = setTimeout(function () {
			$('.app-btn-animate').removeClass('animate-to').addClass('animate-back');
		}, 4000);
	}
});