var customSelect = {
	select: null,
	selectVal: null,
	selectText: null,
	selectTarget: null,

	selectItemClick: function(e){
		var $parent = e.data.jElem;
		var $this = $(e.currentTarget);
		var $target = $this.closest('.js-select').find('.js-select-target');
		var $thisParent = $this.closest($parent);

		customSelect.selectText = $thisParent.find('.js-select-target span');
		customSelect.selectVal = $thisParent.find('.js-select-target input');

		if(!$this.hasClass('js-tab-nav')){
			$this.closest('.js-select-list').find('.active').removeClass('active');
			$this.addClass('active');
		}
		customSelect.selectText.empty().html($this.attr('data-value'));
		customSelect.selectVal.val($this.attr('data-value'));
		$thisParent.removeClass('is-active');
		$target.removeClass('is-active');
	},

	selectTargetClick: function(e){
		var $this = $(e.currentTarget);
		if($this.attr('href')) e.preventDefault();
		$this.toggleClass('is-active');
		$this.closest(".js-select").toggleClass('is-active');
	},

	selectClose: function(){
		$(document).on('click', function(e){
			if (!$(e.target).closest(customSelect.select).length && !$(e.target).closest('.js-error').prev().hasClass('js-select')) {
				customSelect.select.removeClass('is-active');
				customSelect.selectTarget.removeClass('is-active');
			}
		});
	},

	init: function(){
		if($('.js-select').length) {
			customSelect.selectTarget = $('.js-select-target');
			customSelect.select = customSelect.selectTarget.closest('.js-select');
			customSelect.selectItem = customSelect.select.find('.js-select-list').children();
			customSelect.selectItem.on('click', {jElem: customSelect.select}, customSelect.selectItemClick);
			customSelect.selectTarget.on('click', customSelect.selectTargetClick);
			$('body').on('click', customSelect.selectClose);
		}
	}
};

var contactUs = {
	containerHeight: null,
	openBlock: function (e) {
		var self = this;
		var $parent = e.data.jElem;
		if (!$parent.hasClass('is-opened')) {
			$parent.addClass('is-opened');
			setTimeout(function () {
				$parent.find('.js-contact-us-content').slideDown(function(){
					if ($parent.outerHeight() + $parent.offset().top > $(window).height()) {
						if ($(window).height() - ($parent.outerHeight() + 50) < 0) {
							$(this).css({
								'overflow-y': 'scroll',
								'height': ($parent.outerHeight() - 100 + ($(window).height() - ($parent.outerHeight() + 50))) + 'px'
							})
						}
						// $parent.css({'top': '3%'});
					}
				});
			}, 300);
		}
	},

	shownBlock: function (e) {
		var $parent = e.data.jElem;
		if (!$parent.hasClass('open')) {
			$parent.addClass('open');
		}
	},

	hiddenBlock: function (e) {
		var $parent = e.data.jElem;
		if ($parent.hasClass('open')) {
			$parent.removeClass('open');
		}
	},

	closeBlock: function (e) {
		var $parent = e.data.jElem;
		if ($parent.hasClass('is-opened')) {
			$parent.find('.js-contact-us-content').slideUp(function(){
				var $this = $(this);
				$parent.removeClass('open is-opened');
				setTimeout(function () {
					$this.removeAttr('style');
					// $parent.removeAttr('style');
				}, 300);
			});
		}
	},

	hiddenError: function (e) {
		var $this = $(e.currentTarget);
		var parentEl = $this.parents('.app-contact-us__group');
		if (parentEl.hasClass('is-error')) {
			parentEl.removeClass('is-error').find('input, textarea').focus();
			
			if (parentEl.children('.js-select').length) {
				$(".js-select-target").trigger('click');
			}
		}
	},

	validateForm: function (e) {
		var html = '<div class="app-contact-us__text">Ваш запрос отправлен</div><div class="app-btn app-btn_blue js-contact-us-close">Закрыть</div>';
		var $parent = e.data.jElem;

		$parent.find('.app-contact-us__content-inner').empty().html(html);
	},
	
	init: function () {
		var self = this;
		var targetElOpen = $('.js-contact-us-open');
		var targetElClose = $('.js-contact-us-close');
		var parentEl = $('.js-contact-us');
		
		$(document).on('mouseover', '.js-contact-us-show', {jElem: parentEl}, self.shownBlock);
		$(document).on('mouseleave', '.js-contact-us-show', {jElem: parentEl}, self.hiddenBlock);
		$(document).on('click', '.js-contact-us-open', {jElem: parentEl}, self.openBlock);
		$(document).on('click', '.js-contact-us-close', {jElem: parentEl}, self.closeBlock);
		$(document).on('click', '.js-error-hidden', self.hiddenError);
		$(document).on('click', '.js-contact-us-send', {jElem: parentEl}, self.validateForm);
	}
}

$(function () {
	customSelect.init();
	contactUs.init();
});