class Sprite {
    constructor(config) { // Config é tipo um objeto
        this.spriteSheet = new Image();
        this.spriteSheet.src = config.spriteSheet;
        this.spriteSheet.onload = () => {
            this.isLoaded = true;
        }
        
        this.isHorse = config.isHorse || false;
        console.log(this.spriteSheet.src, this.isHorse);
        if (this.isHorse) {
            this.animations = { // É o mesmo para quase todas as sprites, menos o Efeito e o Cavalo
                "idle-right" : [ [0,3] ],
                "idle-up"    : [ [0,1] ],
                "idle-down"  : [ [0,2] ],
                "idle-left"  : [ [0,0] ],
                "walk-right" : [ [0,3],[1,3],[2,3],[3,3],[4,3],[5,3][5,3] ],
                "walk-up"    : [ [0,1],[1,1],[2,1],[3,1],[4,1],[5,1][5,1] ],
                "walk-down"  : [ [0,2],[1,2],[2,2],[3,2],[4,2],[5,2][5,2] ],
                "walk-left"  : [ [0,0],[1,0],[2,0],[3,0],[4,0],[5,0][5,0] ]
            }
        } else {
            this.animations = { // É o mesmo para quase todas as sprites, menos o Efeito e o Cavalo
                "idle-right" : [ [1,3] ],
                "idle-up"    : [ [1,1] ],
                "idle-down"  : [ [1,2] ],
                "idle-left"  : [ [1,0] ],
                "walk-right" : [ [0,3],[1,3],[2,3],[3,3], ],
                "walk-up"    : [ [0,1],[1,1],[2,1],[3,1], ],
                "walk-down"  : [ [0,2],[1,2],[2,2],[3,2], ],
                "walk-left"  : [ [0,0],[1,0],[2,0],[3,0], ]
            }
        }
        
        // É se a peça vai para cima ou para baixo, sendo usado para saber se deve mostrar a parte da frente ou as costas da peça
        this.directionMoviment = config.directionMoviment; 
        if (this.directionMoviment == "up") {
            this.startAnimationFrame = "idle-up";
        } else if (this.directionMoviment == "down") {
            this.startAnimationFrame = "idle-down";
        }
    }

}


// var pingo = new Sprite({
//     spriteSheet: "./public/assets/spriteSheets/blue/kingBlue.png",
//     directionMoviment: "up"
// });