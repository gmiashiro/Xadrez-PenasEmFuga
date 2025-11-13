class EfeitosSonoros {
    constructor() {
        this.movementSound = new Howl({
            src: "./assets/audio/soundEffects/movement.ogg",
            loop: false,
            volume: 0.8,
        });

        this.captureSound = new Howl({
            src: "./assets/audio/soundEffects/capture.ogg",
            loop: false,
            volume: 0.8,
        });
    }

    playMovementSound() {
        this.movementSound.play();
    }

    playCaptureSound() {
        this.captureSound.play();
    }
}