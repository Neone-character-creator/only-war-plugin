/*
 Service for the character currently being created.

 character returns the current character.
 refresh() replaces the current character with a new one.

 The character object has the following
 */
define(["./../types/character/Character"], function (OnlyWarCharacter) {
    return function () {
//If there isn't already a character, create a new one.
        var _character = _character || new OnlyWarCharacter.OnlyWarCharacter();

        var service = {
            get character() {
                return _character
            },
            set character(value) {
                _character = value
            },
            refresh: function () {
                this.character = new character();
            }
        };
        return service;
    }
});
