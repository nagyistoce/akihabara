/**
 * Keyboard and other input handling
 * @namespace AkihabaraInput
 */
var AkihabaraInput = {
	_keyboard: [],
	_keyboardpicker: 0,

	/**
	* Internal keymap to emulate old arcade buttons.
	* <br> z key for A button
	* <br> x key for B button
	* <br> c key for C button
	* <br> p key for pause
	* <br> m key for mute
	**/
	_keymap: {
		up: 38,
		down: 40,
		right: 39,
		left: 37,
		a: 90,
		b: 88,
		c: 67,
		pause: 80,
		mute: 77
	},

	/**
	* Verify a keydown event
	*
	* This function work with the _keyboard attribute and set 1 to the
	* keycode on it.
	*
	* @param {Object} e Object to test the keydown
	**/
	_keydown: function (e) {
		if (e.preventDefault) { e.preventDefault(); }
		var key = (e.fake || window.event ? e.keyCode : e.which);
		if (!AkihabaraInput._keyboard[key]) { AkihabaraInput._keyboard[key] = 1; }
	},

	/**
	* Verify a keyup event
	*
	* This function work with the _keyboard attribute and set -1 to the
	* keycode on it.
	*
	* The mute and pause keys are mapped here and call the correct function
	* for each of these actions.
	*
	* @param {Object} e Object to test the keyup
	**/
	_keyup: function (e) {
		if (e.preventDefault) { e.preventDefault(); }
		var key = (e.fake || window.event ? e.keyCode : e.which);
		AkihabaraInput._keyboard[key] = -1;
		//Check for global action keys
		if (e.keyCode === AkihabaraInput._keymap.pause) { AkihabaraGamebox.pauseGame(); }
		if (e.keyCode === AkihabaraInput._keymap.mute) {
			if (!AkihabaraAudio._totalAudioMute) {
				AkihabaraAudio.totalAudioMute();
				AkihabaraAudio._totalAudioMute = true;
			} else {
				AkihabaraAudio.totalAudioUnmute();
				AkihabaraAudio._totalAudioMute = false;
			}
		}
	},

	/**
	* Resets all keys setting all of the to 1 on the onkeyup function
	**/
	_resetkeys: function () {
		for (var key in AkihabaraInput._keymap) {
			AkihabaraInput._keyup({fake: 1, keyCode: AkihabaraInput._keymap[key]});
		}
	},

	_showkeyboardpicker: function () {
		AkihabaraInput._keyboardpicker.value = "Click/Tap here to enable the keyboard";
		AkihabaraInput._keyboardpicker.style.left = (AkihabaraGamebox._screenposition.x + 5) + "px";
		AkihabaraInput._keyboardpicker.style.top = (AkihabaraGamebox._screenposition.y + 5) + "px";
		AkihabaraInput._keyboardpicker.style.width = (AkihabaraGamebox._screenposition.w - 10) + "px";
		AkihabaraInput._keyboardpicker.style.height = "30px";
		AkihabaraInput._keyboardpicker.style.border = "1px dashed white";
		AkihabaraInput._keyboardpicker.readOnly = null;
	},

	_hidekeyboardpicker: function () {
		AkihabaraInput._keyboardpicker.style.zIndex = 100;
		AkihabaraInput._keyboardpicker.readOnly = "yes";
		AkihabaraInput._keyboardpicker.style.position = "absolute";
		AkihabaraInput._keyboardpicker.style.textAlign = "center";
		AkihabaraInput._keyboardpicker.style.backgroundColor = "#000000";
		AkihabaraInput._keyboardpicker.style.color = "#fefefe";
		AkihabaraInput._keyboardpicker.style.cursor = "pointer";
		AkihabaraInput._keyboardpicker.value = "";
		AkihabaraInput._keyboardpicker.style.left = "0px";
		AkihabaraInput._keyboardpicker.style.top = "0px";
		AkihabaraInput._keyboardpicker.style.height = "0px";
		AkihabaraInput._keyboardpicker.style.width = "0px";
		AkihabaraInput._keyboardpicker.style.border = "0px";
		AkihabaraInput._keyboardpicker.style.padding = "0px";
		AkihabaraInput._keyboardpicker.style.margin = "0px";
	},

	/**
	* Returns true if a given key in this._keymap is pressed. Only returns true on the transition from unpressed to pressed.
	* @param {String} id A key in the keymap. By default, one of: "up" "down" "left" "right" "a" "b" "c"
	* @returns {Boolean} True if the given key is transitioning from unpressed to pressed in this frame.
	*/
	keyIsHit: function (id) { return this._keyboard[this._keymap[id]] === 1; },

	/**
	* Returns true if a given key in this._keymap is being held down. Returns true as long as the key is held down.
	* @param {String} id A key in the keymap. By default, one of: "up" "down" "left" "right" "a" "b" "c"
	* @returns {Boolean} True if the given key is held down.
	*/
	keyIsPressed: function (id) { return this._keyboard[this._keymap[id]] > 0; },

	/**
	* Returns true if a given key in this._keymap has been held down for at least one frame. Will not return true if a key
	* is quickly tapped, only once it has been held down for a frame.
	* @param {String} id A key in the keymap. By default, one of: "up" "down" "left" "right" "a" "b" "c"
	* @returns {Boolean} True if the given key has been held down for at least one frame.
	*/
	keyIsHold: function (id) { return this._keyboard[this._keymap[id]] > 1; },

	/**
	* Returns true if a given key in this._keymap is released. Only returns true on the transition from pressed to unpressed.
	* @param {String} id A key in the keymap. By default, one of: "up" "down" "left" "right" "a" "b" "c"
	* @returns {Boolean} True if the given key is transitioning from pressed to unpressed in this frame.
	*/
	keyIsReleased: function (id) { return this._keyboard[this._keymap[id]] === -1; },

	addKeyListernerTo: function (th) {
		th.addEventListener(window, 'keydown', AkihabaraInput._keydown);
		th.addEventListener(window, 'keyup', AkihabaraInput._keyup);
	},

	// Keyboard support on devices that needs focus (like iPad) - actually is not working for a bug on WebKit's "focus" command.
	focusDrivenKeyboardSuport: function (th) {
		AkihabaraInput._keyboardpicker = document.createElement("input");
		AkihabaraInput._keyboardpicker.onclick = function (evt) { AkihabaraInput._hidekeyboardpicker(); evt.preventDefault(); evt.stopPropagation(); };
		AkihabaraInput._hidekeyboardpicker(AkihabaraInput._keyboardpicker);
		th._box.appendChild(AkihabaraInput._keyboardpicker);
	},

	/**
	* Add touch events to an object
	* @param {Object} th The object to add touch events
	*/
	addTouchEventsTo: function (th) {
		th.ontouchstart = function (evt) {
			AkihabaraGamebox._screenposition = AkihabaraGamebox._domgetabsposition(AkihabaraGamebox._screen);
			if (evt.touches[0].pageY - AkihabaraGamebox._screenposition.y < 30) {
				AkihabaraInput._showkeyboardpicker();
			} else {
				AkihabaraInput._hidekeyboardpicker();
				evt.preventDefault();
				evt.stopPropagation();
			}
		};

		th.onmousedown = function (evt) {
			AkihabaraGamebox._screenposition = AkihabaraGamebox._domgetabsposition(AkihabaraGamebox._screen);
			if (evt.pageY - AkihabaraGamebox._screenposition.y < 30) {
				AkihabaraInput._showkeyboardpicker();
			} else {
				AkihabaraInput._hidekeyboardpicker();
				evt.preventDefault();
				evt.stopPropagation();
			}
		};

		th.ontouchend = function (evt) { evt.preventDefault(); evt.stopPropagation(); };
		th.ontouchmove = function (evt) { evt.preventDefault(); evt.stopPropagation(); };
	}
};
