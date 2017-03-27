(function(global, speech) {
    'use strict';

    var Alice = function() {};

    Alice.prototype.init = function() {
        this.bestName = "Google UK English Female";
        this.voice = null;
        speech.onvoiceschanged = this.onVoicesChanged.bind(this);
        return this;
    };

    Alice.prototype.onVoicesChanged = function() {

        speech.getVoices().forEach(function(voice, index) {
            //console.log(index, voice.name, voice.default ? '(default)' :'', voice);
            if (this.bestName === voice.name) {
                this.voice = voice;
                return false;
            }
        }.bind(this));
    };

    Alice.prototype.say = function(text) {
        var utter = new SpeechSynthesisUtterance();
        utter.voice = this.voice;
        utter.text = text;
        speech.speak(utter);
    };

    Alice.prototype.sayQuote = function() {
        var i = _.random(0, global.quotes.length);
        this.say(global.quotes[i]);
    };

    // Singleton
    global.Alice = new Alice().init();
})(window, speechSynthesis);