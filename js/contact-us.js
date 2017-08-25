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
		if ($this.parents('.app-contact-us__group').hasClass('is-error')) {
			$this.parents('.app-contact-us__group').removeClass('is-error');
		}
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
					// if ($parent.outerHeight() + $parent.offset().top > $(window).height()) {
						if ($(window).height() - ($parent.outerHeight() + 50) < 0) {
							$(this).css({
								'overflow-y': 'scroll',
								'height': ($parent.outerHeight() - 100 + ($(window).height() - ($parent.outerHeight() + 50))) + 'px'
							})
						}
					// }
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
		var $Form = null;
		var params = {};
		var $this = $(e.currentTarget);
		var data = '';
		var isError = false;
		var tmp, tmpName;

		if (e.data.jForm) {
			$Form = e.data.jForm;
		}

		$Form.find('.js-requere').each(function(){
			tmp = $(this);
			tmpName = tmp.attr('name');

			if(tmpName){
				params[tmpName] = tmp.val();
			}

			if(tmpName == 'contactusQuestion'){

				if (tmp.val() == 0) {
					tmp.parents('.app-contact-us__group').addClass('is-error');
					isError = true;
					return false;
				}
				tmp.parents('.app-contact-us__group').removeClass('is-error');
				isError = false;
			}

			if(tmpName == 'contactusMessage'){
				if(Utilities.trimSpace(tmp.val()) == ''){
					if (tmp.val() == '	') {
						tmp.val() = '';
					}
					tmp.parent().find('.js-error-text').empty().text('Обязательное поле для заполнения');
					tmp.parent().addClass('is-error');
					isError = true;
					return false;
				}
				
				if (tmp.val().length < 2) {
					tmp.parent().find('.js-error-text').empty().text('Некорректно заполнено поле');
					tmp.parent().addClass('is-error');
					isError = true;
					return false;
				}

				if (!Utilities.textValidateArea(tmp.val())) {
					tmp.parent().find('.js-error-text').empty().text('Сообщение содержит недопустимые символы');
					tmp.parent().addClass('is-error');
					isError = true;
					return false;
				}

				tmp.parent().removeClass('is-error');
				isError = false;
			}

			if(tmpName == 'contactusEmail'){
				var regexp = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

				if(Utilities.trimSpace(tmp.val()) == ''){
					tmp.parent().find('.js-error-text').empty().text('Обязательное поле для заполнения');
					tmp.parent().addClass('is-error');
					isError = true;
					return false;
				}

				if (!Utilities.trimSpace(tmp.val()) == '' && regexp.test(tmp.val()) !== true) {
					tmp.parent().find('.js-error-text').empty().text('Некорректный email адрес');
					tmp.parent().addClass('is-error');
					isError = true;
					return false;
				}
				tmp.parent().removeClass('is-error');
				isError = false;
			}
		});

		if (isError) {
			$Form.find('.is-error').each(function(){
				if($(this).hasClass('is-error')){
					$(this).focus();
					return false;
				}
			});
		} else {
			var data = { message: params.contactusMessage, email: params.contactusEmail };
			// TODO: for ajax request
			// $.post($Form.attr('action'), data, function(json){
			// 	 if (json.success){}
			// }, "json");

			var html = '<div class="app-contact-us__text">Ваш запрос отправлен</div><div class="app-btn app-btn_blue js-contact-us-close">Закрыть</div>';
			var $parent = e.data.jElem;
			$parent.find('.app-contact-us__content-inner').empty().html(html);
		}
	},
	
	posShowContainer: function (e) {
		var $this = $(e.currentTarget);
		var $parent = e.data.jElem;
		
		if (Utilities.mobile() && (Math.floor($(window).height() / 3) <= -1*($parent.offset().top - $this.offset().top))) {
			$parent.css({'top': -1 * Math.floor($(window).height() / 3) + 'px'});
		}
	},

	posHideContainer: function (e) {
		var $parent = e.data.jElem;
		$parent.removeAttr('style');
	},
	
	init: function () {
		var self = this;
		var targetElOpen = $('.js-contact-us-open');
		var targetElClose = $('.js-contact-us-close');
		var parentEl = $('.js-contact-us');

		$('.contact-field-text.js-requere, .contact-field-email.js-requere').on('focus', function(e) {
			var $this = $(e.currentTarget);
			var parentEl = $this.parents('.app-contact-us__group');
			if (parentEl.hasClass('is-error')) {
				parentEl.removeClass('is-error');
			};
		});
		
		$(document).on('mouseover', '.js-contact-us-show', {jElem: parentEl}, self.shownBlock);
		$(document).on('mouseleave', '.js-contact-us-show', {jElem: parentEl}, self.hiddenBlock);
		$(document).on('click', '.js-contact-us-open', {jElem: parentEl}, self.openBlock);
		$(document).on('click', '.js-contact-us-close', {jElem: parentEl}, self.closeBlock);
		$(document).on('click', '.js-error-hidden', self.hiddenError);
		$(document).on('click', '.js-contactus-submit', {jElem: parentEl, jForm: $('#contactus')}, self.validateForm);

		$(document).on('focus', '.app-contact-us__control', {jElem: parentEl}, self.posShowContainer);
		$(document).on('blur', '.app-contact-us__control', {jElem: parentEl}, self.posHideContainer);
	}
}

$(function () {
	customSelect.init();
	contactUs.init();
});