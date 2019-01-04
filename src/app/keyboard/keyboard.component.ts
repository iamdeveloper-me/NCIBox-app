import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css'],

})
export class KeyboardComponent implements OnInit {
    @Input() onGetFocused: Function;
    @Input() onNewValue: Function;

    constructor() { }

    ngOnInit() {
    }

    onClick(event) {
        var target = event.target || event.srcElement || event.currentTarget;
        var shift = false;
        var capslock = false;
        var focused = <FormControl>this.onGetFocused();

        var $this = $(target);
        var character = target.textContent;

        // Shift keys
        if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();

            shift = (shift) ? false : true;
            capslock = false;
            return false;
        }

        // Caps lock
        if ($this.hasClass('capslock')) {
            $('.letter').toggleClass('uppercase');
            capslock = true;
            return false;
        }

        // Delete
        if ($this.hasClass('delete')) {
            var oldValue = focused.value;
            this.onNewValue(oldValue.substr(0, oldValue.length - 1));
            return;
        }

        // Special characters
        if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
        if ($this.hasClass('space')) character = ' ';
        if ($this.hasClass('tab')) character = "\t";
        if ($this.hasClass('return')) {
            this.onNewValue('return');
            return;
        }

        // Uppercase letter
        if ($this.hasClass('uppercase')) character = character.toUpperCase();

        // Remove shift once a key is clicked.
        if (shift) {
            $('.symbol span').toggle();
            if (capslock === false) $('.letter').toggleClass('uppercase');

            shift = false;
        }

        // Add the character
        var newValue = character;
        if (focused.value) { newValue = focused.value + character; };
        this.onNewValue(newValue);

    }

}
