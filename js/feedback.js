var feedback = {
	$Form: null,
	params: {},
	validation: function (e) {
		var $this = $(e.currentTarget);
		var data = '';
		var isError = false;
		var tmp, tmpName;

		if (e.data.jForm) {
			feedback.$Form = e.data.jForm;
		}

		feedback.$Form.find('.js-requere').each(function(){
			tmp = $(this);
			tmpName = tmp.attr('name');

			if(tmpName){
				feedback.params[tmpName] = tmp.val();
			}

			if(tmpName == 'feedbackName'){
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
					tmp.parent().find('.js-error-text').empty().text('Поля "Ваше имя" должно содержать не менее 2 символов');
					tmp.parent().addClass('is-error');
					isError = true;
					return false;
				}

				if (!Utilities.NameValidate(tmp.val())) {
					tmp.parent().find('.js-error-text').empty().text('Ваше имя содержит недопустимые символы');
					tmp.parent().addClass('is-error');
					isError = true;
					return false;
				}

				tmp.parent().removeClass('is-error');
				isError = false;
			}

			if(tmpName == 'feedbackEmail'){
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
			feedback.$Form.find('.is-error').each(function(){
				if($(this).hasClass('is-error')){
					$('html, body').animate({ scrollTop: parseInt($(this).find('.js-requere').offset().top) }, 'slow');
					return false;
				}
			});
		} else {
			var data = { name: feedback.params.feedbackName, email: feedback.params.feedbackEmail };
			var parentEl = feedback.$Form.closest('.app-feedback');
			// TODO: for ajax request
			// $.post(feedback.$Form.attr('action'), data, function(json){
			// 	 if (json.success){}
			// }, "json");

			parentEl.find('.app-feedback__title').addClass('text-center').empty().html('Благодарим вас!<br />Вы&nbsp;подписались на&nbsp;новости проекта');
			parentEl.find('.app-feedback__form').remove();
			$('html, body').animate({ scrollTop: parseInt(parentEl.offset().top) }, 'slow');
		}
	},

	hiddenError: function (e) {
		var $this = $(e.currentTarget);
		var parentEl = $this.parents('.app-feedback__group');
		if (parentEl.hasClass('is-error')) {
			parentEl.removeClass('is-error').find('input, textarea').focus();
		}
	},

	init: function () {
		var self = this;

		$('.field-name.js-requere').on('blur', function(e) {
			if(!Utilities.trimSpace(this.value) == ''){
				if (this.value.length < 2) {
					if (this.value == '	') {
						this.value = '';
					}
					$(this).parent().find('.js-error-text').empty().text('Поля "Ваше имя" должно содержать не менее 2 символов');
					$(this).parent().addClass('is-error');
					return false;
				}
				if (!Utilities.NameValidate(this.value)) {
					$(this).parent().find('.js-error-text').empty().text('Ваше имя содержит недопустимые символы');
					$(this).parent().addClass('is-error');
					return false;
				}
			}
			$(this).parent().removeClass('is-error');
		});

		$('.field-email.js-requere').on('blur', function(e) {
			var regexp = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
			if (!Utilities.trimSpace(this.value) == '' && regexp.test(this.value) !== true) {
				$(this).parent().addClass('is-error');
			} else {
				$(this).parent().removeClass('is-error');
			}
		});
		
		$(document).on('click', '.js-feedback-submit', { jForm: $('#feedback')}, self.validation);
		$(document).on('click', '.js-error-hidden', self.hiddenError);
	}
}


$(function () {
	feedback.init();
});