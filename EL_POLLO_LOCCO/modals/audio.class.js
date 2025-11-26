class Audios {
    sounds = {
        // Game
        backgroundMusic: new Audio('./audios/background.mp3'),
        winSound: new Audio('./audios/win.mp3'),
        gameOverSound: new Audio('./audios/gamOover.mp3'),

        // Chicken
        chickenHurtSound: new Audio('./audios/angry-chicken-imitation.mp3'),
        bossChickenStartSound: new Audio('./audios/bossChickenStart.mp3'),
        bossChickenHurtSound: new Audio('./audios/hurtChickenBoss.mp3'),
        bossChickenAttackSound: new Audio(''),
        chickenDeadSound: new Audio('./audios/chickenDead.mp3'),

        // Items
        coinSound: new Audio('./audios/collectCoints.mp3'),
        takeBottleSound: new Audio('./audios/pickBottle.mp3'),
        
        brockenBottleSound: new Audio('./audios/brokenBottle.mp3'),
        // Character
        jumpSound: new Audio('./audios/jump.mp3'),
        longIdleSound: new Audio('./audios/longIdle.mp3'),
        characterHurtSound: new Audio('./audios/cartoonScream.mp3'),
        characterDeadSound: new Audio('./audios/ohYes.mp3'),

    };


    isMuted = false;

    constructor(){

    }

}