/**
 * Represents a status bar for displaying health, coins, bottles, or endboss health.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {

    /** @type {string[]} Coin status bar images (0-100%) */
    IMAGES_COIN = [
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    /** @type {string[]} Bottle status bar images (0-100%) */
    IMAGES_BOTTLE = [
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ];

    /** @type {string[]} Health status bar images (0-100%) */
    IMAGES = [
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        './img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    /** @type {string[]} Endboss health status bar images (0-100%) */
    IMAGES_ENDBOSS_HEALTH = [
        './img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        './img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        './img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        './img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        './img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        './img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    /** @type {number} Current percentage value (0-100) */
    percentage = 100;

    /**
     * Creates a StatusBar instance of the specified type at given position.
     * @param {string} type - Type of status bar ('health', 'coin', 'bottle', 'endbossHealth').
     * @param {number} x - Horizontal position of the status bar.
     * @param {number} y - Vertical position of the status bar.
     */
    constructor(type, x, y) {
        super();
        if (type === 'health') this.images = this.IMAGES;
        else if (type === 'coin') this.images = this.IMAGES_COIN;
        else if (type === 'bottle') this.images = this.IMAGES_BOTTLE;
        else if (type === 'endbossHealth') this.images = this.IMAGES_ENDBOSS_HEALTH;
        this.loadImages(this.images);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the status bar to display the given percentage.
     * @param {number} percentage - The percentage value to display (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images[this.resolvImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index based on current percentage.
     * @returns {number} Index of the image to display (0-5).
     */
    resolvImageIndex() {
        if (this.percentage <= 0) return 0;
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}