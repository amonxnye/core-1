(function () {
	var SetPassword = {
		init : function() {
			$('#set-password #submit').click(this.onClickSetPassword);
		},

		onClickSetPassword : function(event){
			var passwordObj = $('#password');
			var retypePasswordObj = $('#retypepassword');
			passwordObj.parent().removeClass('shake');
			event.preventDefault();
			if (passwordObj.val() === retypePasswordObj.val()) {
				$.post(
					passwordObj.parents('form').attr('action'),
					{password: passwordObj.val()}
				).done(function (result) {
					OC.User.SetPassword._resetDone(result);
				}).fail(function (result) {
					OC.User.SetPassword._onSetPasswordFail(result);
				});
			} else {
				//Password mismatch happened
				passwordObj.val('');
				retypePasswordObj.val('');
				passwordObj.parent().addClass('shake');
				$('#message').addClass('warning')
					.text('Passwords do not match')
					.show();
				passwordObj.focus();
			}
		},

		_onSetPasswordFail: function(result) {
			var response = JSON.parse(result.responseText);
			var errorObject = $('#error-message');

			var errorMessage;
			errorMessage = response.message;

			if (!errorMessage) {
				errorMessage = t('core', 'Failed to set password. Please contact your administrator.');
			}

			errorObject.text(errorMessage);
			errorObject.show();
			$('#submit').prop('disabled', true);
		},

		_resetDone : function(result){
			if (result && result.status === 'success') {
				var rootPath = OC.getRootPath();
				if (rootPath === '') {
					/**
					 * If owncloud is not run inside subfolder, the getRootPath
					 * will return empty string
					 */
					rootPath = "/";
				}
				OC.redirect(rootPath);
			}
		}
	};

	if (!OC.User) {
		OC.User = {};
	}
	OC.User.SetPassword = SetPassword;
})();

$(document).ready(function () {
	OC.User.SetPassword.init();
	$('#password').keypress(function () {
		/*
		 The warning message should be shown only during password mismatch.
		 Else it should not.
		 */
		if (($('#password').val().length >= 0) && ($('#retypepassword').val().length === 0)) {
			$('#message').removeClass('warning').text('');
		}
	});
});
