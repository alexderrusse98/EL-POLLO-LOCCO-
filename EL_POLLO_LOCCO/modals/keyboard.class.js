/**
 * Represents the keyboard input state for game controls.
 * Tracks which keys are currently pressed.
 */
class Keyboard {
    /** @type {boolean} Left arrow key or 'A' key pressed state */
    LEFT = false;
    
    /** @type {boolean} Right arrow key or 'D' key pressed state */
    RIGHT = false;
    
    /** @type {boolean} Up arrow key or 'W' key pressed state */
    UP = false;
    
    /** @type {boolean} Down arrow key or 'S' key pressed state */
    DOWN = false;
    
    /** @type {boolean} Space bar key pressed state */
    SPACE = false;
    
    /** @type {boolean} 'D' key pressed state for throwing action */
    D = false;
}