/**
 * Created by Drew on 1/29/2017.
 */


//All public variables
var ctx;
var canvas;
var WIDTH;
var HEIGHT;
var GAMEINTERVAL;
var GAMESTARTED = false;
var GAMEOVERCOUNTER = 0;
var GAMESCORE = 0;
var ROUNDNUMBER = 0;

var zombieList = [];
var interval = 100;
var zombieSpawnInterval = 3000;
var wDown = false;
var aDown = false;
var sDown = false;
var dDown = false;
var spaceDown = false;
var upDown = false;
var leftDown = false;
var downDown = false;
var rightDown = false;
var broImg;
var footballImg;
var hammockImg;
var tree1Img;
var tree2Img;
var tree3Img;
var zombieImg;

var spriteSheetHeight = 256;
var spriteSheetWidth = 384;
var spriteX = 0;
var spriteY = 0;
var charWidth = 32;
var charHeight = 32;
var broX;
var prevBroX;
var broY;
var prevBroY;

var fbIntervalUp = 0;
var fbIntervalLeft = 0;
var fbIntervalRight = 0;
var fbIntervalDown = 0;
var fbSpriteSheetHeight = 32;
var fbSpriteSheetWidth = 144;
var fbHeight = 16;
var fbWidth = 16;
var fbSpeed = 35;

//Initializes the beginning requirements of game.
function init() {
    canvas = document.getElementById('canvas');
    ctx = document.getElementById('canvas').getContext('2d');
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    WIDTH = ctx.canvas.width;
    HEIGHT = ctx.canvas.height;
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000000";
    ctx.font = "45px Arial Black, Gadget, sans-serif";
    ctx.fillText("ROBROTRON!", WIDTH/2, HEIGHT/2 - 200);
    ctx.font = "25px Tahoma, Geneva, sans-serif";
    ctx.strokeText("BRO!", WIDTH/2, HEIGHT/2 - 150);
    ctx.strokeText("SOME CHICKS ARE TRYING TO SIT IN YOUR HAMMOCK.", WIDTH/2, HEIGHT/2 - 100);
    ctx.strokeText("THAT IS NOT COOL.", WIDTH/2, HEIGHT/2 - 50);
    ctx.strokeText("ONLY THREE CAN SIT IN IT AT ONE TIME!!!", WIDTH/2, HEIGHT/2);
    ctx.strokeText("WASD TO MOVE.", WIDTH/2, HEIGHT/2 + 50);
    ctx.strokeText("ARROW KEYS TO PUMP GUNZ.", WIDTH/2, HEIGHT/2 + 100)
    ctx.font = "10px Tahoma, Geneva, sans-serif"
    ctx.strokeText("(click to slay some chicks)", WIDTH/2, HEIGHT/2 + 200);

    canvas.addEventListener('mousedown', onClick, true);
}

//Registers user interaction
function onClick() {
    if (!GAMESTARTED) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ROUNDNUMBER = 0;
        GAMESCORE = 0;
        document.getElementById("score").innerHTML = "Chicks Scored: " + GAMESCORE;
        document.getElementById("gameOverScore").innerHTML = "Chicks On Hammock: " + GAMEOVERCOUNTER;
        canvas.background = "url('sand.png')";
        topZombies = [];
        leftZombies = [];
        bottomZombies = [];
        rightZombies = [];
        GAMEOVERCOUNTER = 0;
        GAMESTARTED = true;
        zombieList = [];
        initGame();
    }
}

//Creates the game and runs it.
function initGame() {
    broX = WIDTH/2 - 32;
    broY = (HEIGHT / 2) - 64;
    spriteY = 0;
    spriteX = 32;

    broImg = new Image();
    broImg.src = 'bruh.png'

    footballImg = new Image();
    footballImg.src = 'football.png';

    hammockImg = new Image();
    hammockImg.src = 'hammock.png';

    tree1Img = new Image();
    tree1Img.src = 'tree1.png';

    tree2Img = new Image();
    tree2Img.src = 'tree2.png';

    tree3Img = new Image();
    tree3Img.src = 'tree3.png';

    zombieImg = new Image();
    zombieImg.src = 'chick.png';

    GAMEINTERVAL = setInterval(drawGame, interval);

}

//Executes the animations of each component
function drawGame() {
    var setDelay = 0;

    if(zombieList.length == 0 && GAMEOVERCOUNTER < 3) {
        clearTimeout(setDelay);
        zombieList = [];
        topZombies = [];
        bottomZombies = [];
        leftZombies = [];
        rightZombies = [];
        ROUNDNUMBER++;
        for (var i = 0; i < ROUNDNUMBER * 3; i++) {
            zombieList.push(new createZombies())
        }
        zombieList.forEach(function(a) {
            setTimeout (function() {
                drawZombies(a);

            }, 3000)

        })
    } else if (GAMEOVERCOUNTER == 3) {
        clearInterval(GAMEINTERVAL);
        zombieList.forEach(function(a) {
            a.isDead = true;
        });

        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.font = "55px Tahoma, Geneva, sans-serif";
        ctx.textAlign = "center"
        ctx.strokeStyle = "#FFFFFF";
        ctx.strokeText("MY HAAAAMMMOOOOCKKKKK", WIDTH/2 , HEIGHT/2 - 150);
        GAMESTARTED = false;
        //ctx.fillRect(0, 0, WIDTH, HEIGHT);

    }

    if (wDown == true) {
        prevBroX = broX;
        prevBroY = broY;
        broY += -16;
        spriteY = 96;
        spriteX += charWidth;
    }
    else if (aDown == true) {
        prevBroX = broX;
        prevBroY = broY;
        broX += -16;
        spriteY = 32;
        spriteX += charWidth;
    }
    else if (sDown == true) {
        prevBroX = broX;
        prevBroY = broY;
        broY += 16;
        spriteY = 0;
        spriteX += charWidth;
    }
    else if (dDown == true) {
        prevBroX = broX;
        prevBroY = broY;
        broX += 16;
        spriteY = 64;
        spriteX += charWidth;

    }
    if (spaceDown == true) {
    }

    drawBro(broX, broY);
    drawHammock();
    drawTrees();

}

function drawBro(x, y) {
    ctx.clearRect(prevBroX, prevBroY, 64, 64);
    ctx.drawImage(broImg,
        spriteX,spriteY,            // sprite upper left position
        charWidth,charHeight, // size of a sprite 72 x 96
        x,y,  // canvas position
        2*charWidth,2*charHeight      // sprite size shrinkage
    );

    if (spriteX >= spriteSheetWidth - 32) {
        spriteX = 0;
    }
}


//CREATES THE ZOMBIES RANDOMLY
var possibleSides = ['top', 'left','bottom', 'right'];
var possibleImg = [0, 96, 192, 288];
var topZombies = [];
var leftZombies = [];
var bottomZombies = [];
var rightZombies = [];
//zombieX, zombieY, zombieVx, zombieVy, zombieImgX, zombieImgY
function createZombies() {

    var rngSide = Math.floor(Math.random() * 4);
    var theSide = possibleSides[rngSide];


    if (theSide == 'top') {
        var rngLocation = Math.floor(Math.random() * (WIDTH - 100)) + 100;
        var rngImage = Math.floor(Math.random() * 4);
        this.zombieX = rngLocation;
        this.zombieY = 0;
        this.zombieVx = 0;
        this.zombieVy = 0;
        this.zombieImgX = possibleImg[rngImage];
        this.zombieImgY = 128;
        this.isDead = false;
    }
    if (theSide == 'left') {
        var rngLocation = Math.floor(Math.random() * (HEIGHT - 100)) + 100;
        var rngImage = Math.floor(Math.random() * 4);
        this.zombieX = 0;
        this.zombieY = rngLocation;
        this.zombieVx = 0;
        this.zombieVy = 0;
        this.zombieImgX = possibleImg[rngImage];
        this.zombieImgY = 192;
        this.isDead = false;
        //leftZombies.push(this);
    }
    if (theSide == 'bottom') {
        var rngLocation = Math.floor(Math.random() * (WIDTH - 100)) + 100;
        var rngImage = Math.floor(Math.random() * 4);
        this.zombieX = rngLocation;
        this.zombieY = HEIGHT;
        this.zombieVx = 0;
        this.zombieVy = 0;
        this.zombieImgX = possibleImg[rngImage];
        this.zombieImgY = 224;
        this.isDead = false;
        //bottomZombies.push(this);
    }
    if (theSide == 'right') {
        var rngLocation = Math.floor(Math.random() * (HEIGHT - 100)) + 100;
        var rngImage = Math.floor(Math.random() * 4);
        this.zombieX = WIDTH;
        this.zombieY = rngLocation;
        this.zombieVx = 0;
        this.zombieVy = 0;
        this.zombieImgX = possibleImg[rngImage];
        this.zombieImgY = 160;
        this.isDead = false;
    }
}

//DRAWS THE RANDOMLY CREATED ZOMBIES
function drawZombies(a) {
    var zombieWidth = 32;
    var zombieHeight = 32;
    var originalImageX = a.zombieImgX;
    var maxImageX = a.zombieImgX + 96;
    var zombiePrevX;
    var zombiePrevY;
    if (!a.isDead) {
        var zombieAnimation = setInterval(function() {
            ctx.clearRect(zombiePrevX, zombiePrevY, zombieWidth*2, zombieHeight*2);
            var zombieDestinationX = WIDTH/2 - a.zombieX;
            var zombieDestinationY = HEIGHT/2 - a.zombieY;
            var distance = Math.sqrt(zombieDestinationX * zombieDestinationX + zombieDestinationY * zombieDestinationY)
            a.zombieVx = (zombieDestinationX / distance) * 4;
            a.zombieVy = (zombieDestinationY / distance) * 4;
            ctx.drawImage(zombieImg, a.zombieImgX, a.zombieImgY, zombieWidth, zombieHeight, a.zombieX, a.zombieY, 2*zombieWidth, 2*zombieHeight);
            drawHammock();
            drawTrees();
            a.zombieImgX += 32;
            zombiePrevX = a.zombieX;
            zombiePrevY = a.zombieY;
            a.zombieX += a.zombieVx;
            a.zombieY += a.zombieVy;
            if(a.zombieImgX >= maxImageX) {
                a.zombieImgX = originalImageX;
            }

            if(a.zombieX < WIDTH/2 + 48 && a.zombieX > WIDTH/2 - 48 && a.zombieY < HEIGHT/2 + 48 && a.zombieY > HEIGHT/2 - 48) {
                GAMEOVERCOUNTER++;
                document.getElementById("gameOverScore").innerHTML = "Chicks On Hammock: " + GAMEOVERCOUNTER;
                ctx.clearRect(a.zombieX - 3, a.zombieY - 3, zombieWidth*2+8, zombieHeight*2+8);
                zombieList.splice(zombieList.indexOf(a), 1);
                clearInterval(zombieAnimation);
            }

            if(a.isDead) {
                ctx.clearRect(a.zombieX - 3, a.zombieY - 3, zombieWidth*2+8, zombieHeight*2+8);
                GAMESCORE++;
                document.getElementById("score").innerHTML = "Chicks Scored: " + GAMESCORE;
                clearInterval(zombieAnimation);
            }
        }, 100)
    }
}

//SHOOTS IN 4 DIRECTIONS
function shoot() {
    //up
    if (spriteY == 96) {
        var prevBallX;
        var prevBallY;
        var fbSpriteX = 0;
        var fbSpriteY = 0;
        var fbX;
        var fbY;
        fbX = broX + charWidth/2;
        fbY = broY - charHeight * 2;
        fbSpriteY = 0;
        if (!fbIntervalUp) {
            fbIntervalUp = setInterval(function() {
                if (fbY > -32) {
                    ctx.clearRect(prevBallX, prevBallY, fbWidth*2, fbHeight*2);
                    ctx.drawImage(footballImg,
                        fbSpriteX,fbSpriteY,            // sprite upper left position
                        fbWidth,fbHeight, // size of a sprite 72 x 96
                        fbX,fbY,  // canvas position
                        2*fbWidth,2*fbHeight      // sprite size shrinkage
                    );
                    zombieList.forEach(function(a) {
                        if (fbX < a.zombieX + 48 && fbX > a.zombieX - 48 && fbY < a.zombieY + 48 && fbY > a.zombieY - 48) {
                            a.isDead = true;
                            zombieList.splice(zombieList.indexOf(a), 1);
                        }
                    });
                    drawHammock();
                    drawTrees();
                    prevBallX = fbX;
                    prevBallY = fbY;
                    fbSpriteX += fbWidth;
                    fbY -= 20;
                    if (fbSpriteX >= fbSpriteSheetWidth) {
                        fbSpriteX = 0;
                    }
                    if (fbY <= -32) {
                        ctx.clearRect(prevBallX, prevBallY, fbWidth*2, fbHeight*2);
                        drawHammock();
                        drawTrees();
                        clearInterval(fbIntervalUp);
                        fbIntervalUp = 0;
                    }
                }
            }, fbSpeed)
        }
    }

    //left
    else if (spriteY == 32) {
        var prevBallX;
        var prevBallY;
        var fbSpriteX = 0;
        var fbSpriteY = 0;
        var fbX;
        var fbY;
        fbX = broX - charWidth - 30;
        fbY = broY + charHeight/2;
        fbSpriteY = 15;
        if (!fbIntervalLeft) {
            fbIntervalLeft = setInterval(function() {
                if (fbX > -32) {
                    ctx.clearRect(prevBallX, prevBallY, fbWidth*2, fbHeight*2);
                    ctx.drawImage(footballImg,
                        fbSpriteX,fbSpriteY,            // sprite upper left position
                        fbWidth,fbHeight, // size of a sprite 72 x 96
                        fbX,fbY,  // canvas position
                        2*fbWidth,2*fbHeight      // sprite size shrinkage
                    );
                    zombieList.forEach(function(a) {
                        if (fbX < a.zombieX + 48 && fbX > a.zombieX - 48 && fbY < a.zombieY + 48 && fbY > a.zombieY - 48) {
                            a.isDead = true;
                            zombieList.splice(zombieList.indexOf(a), 1);

                        }
                    });
                    drawHammock();
                    drawTrees();
                    prevBallX = fbX;
                    prevBallY = fbY;
                    fbSpriteX += fbWidth;
                    fbX -= 20;
                    if (fbSpriteX >= fbSpriteSheetWidth) {
                        fbSpriteX = 0;
                    }
                    if (fbX <= -32) {
                        ctx.clearRect(prevBallX, prevBallY, fbWidth*2, fbHeight*2)
                        drawHammock();
                        drawTrees();
                        clearInterval(fbIntervalLeft);
                        fbIntervalLeft = 0;
                    }
                }
            }, fbSpeed)
        }
    }

    //down
    else if (spriteY == 0) {
        var prevBallX;
        var prevBallY;
        var fbSpriteX = 0;
        var fbSpriteY = 0;
        var fbX;
        var fbY;
        fbX = broX + charWidth / 2;
        fbY = broY + charHeight * 2 + 20;
        fbSpriteY = 0;
        if (!fbIntervalDown) {
            fbIntervalDown = setInterval(function() {
                if (fbY < HEIGHT + 32) {
                    ctx.clearRect(prevBallX, prevBallY, fbWidth*2, fbHeight*2);
                    ctx.drawImage(footballImg,
                        fbSpriteX,fbSpriteY,            // sprite upper left position
                        fbWidth,fbHeight, // size of a sprite 72 x 96
                        fbX,fbY,  // canvas position
                        2*fbWidth,2*fbHeight      // sprite size shrinkage
                    );
                    zombieList.forEach(function(a) {
                        if (fbX < a.zombieX + 48 && fbX > a.zombieX - 48 && fbY < a.zombieY + 48 && fbY > a.zombieY - 48) {
                            a.isDead = true;
                            zombieList.splice(zombieList.indexOf(a), 1);
                        }
                    });
                    drawHammock();
                    drawTrees();
                    prevBallX = fbX;
                    prevBallY = fbY;
                    fbSpriteX += fbWidth;
                    fbY += 20;
                    if (fbSpriteX >= fbSpriteSheetWidth) {
                        fbSpriteX = 0;
                    }
                    if (fbY > HEIGHT) {
                        ctx.clearRect(prevBallX, prevBallY, fbWidth*2, fbHeight*2);
                        drawHammock();
                        drawTrees();
                        clearInterval(fbIntervalDown);
                        fbIntervalDown = 0;
                    }
                }
            }, fbSpeed)
        }
    }

    //right
    else if (spriteY == 64) {
        var prevBallX;
        var prevBallY;
        var fbSpriteX = 0;
        var fbSpriteY = 0;
        var fbX;
        var fbY;
        fbX = broX + charWidth * 2 + 20;
        fbY = broY + charHeight / 2;
        fbSpriteY = 16;
        if (!fbIntervalRight) {
            fbIntervalRight = setInterval(function() {
                if (fbY < WIDTH + 32) {
                    ctx.clearRect(prevBallX, prevBallY, fbWidth*2, fbHeight*2);
                    ctx.drawImage(footballImg,
                        fbSpriteX,fbSpriteY,            // sprite upper left position
                        fbWidth,fbHeight, // size of a sprite 72 x 96
                        fbX,fbY,  // canvas position
                        2*fbWidth,2*fbHeight      // sprite size shrinkage
                    );
                    zombieList.forEach(function(a) {
                        if (fbX < a.zombieX + 48 && fbX > a.zombieX - 48 && fbY < a.zombieY + 48 && fbY > a.zombieY - 48) {
                            a.isDead = true;
                            zombieList.splice(zombieList.indexOf(a), 1);
                        }
                    });
                    drawHammock();
                    drawTrees();
                    prevBallX = fbX;
                    prevBallY = fbY;
                    fbSpriteX += fbWidth;
                    fbX += 20;
                    if (fbSpriteX >= fbSpriteSheetWidth) {
                        fbSpriteX = 0;
                    }
                    if (fbX > WIDTH) {
                        ctx.clearRect(prevBallX, prevBallY, fbWidth*2, fbHeight*2);
                        drawHammock();
                        drawTrees();
                        clearInterval(fbIntervalRight);
                        fbIntervalRight = 0;
                    }
                }
            }, fbSpeed)
        }
    }
}


//THIS IS THE CODE THAT DRAWS THE MAP
function drawHammock() {
    ctx.drawImage(hammockImg, WIDTH/2 - hammockImg.width/2, HEIGHT/2 - hammockImg.height/2);
}
function drawTrees() {
    //right side
    ctx.drawImage(tree1Img, 0, 0, tree1Img.width, tree1Img.height, WIDTH - 100, 30, tree1Img.width/2, tree1Img.height/2);
    ctx.drawImage(tree1Img, 0, 0, tree1Img.width, tree1Img.height, WIDTH - 50, 100, tree1Img.width/2, tree1Img.height/2);
    ctx.drawImage(tree1Img, 0, 0, tree1Img.width, tree1Img.height, WIDTH - 100, 150, tree1Img.width/2, tree1Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, WIDTH - 100, 230, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree1Img, 0, 0, tree1Img.width, tree1Img.height, WIDTH - 100, 300, tree1Img.width/2, tree1Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, WIDTH - 100, 430, tree2Img.width + 30, tree2Img.height + 30);

    //bottom side
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, 0, HEIGHT-50, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, 100, HEIGHT-50, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 150, HEIGHT-50, tree2Img.width - 50, tree2Img.height - 50);
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, 230, HEIGHT-50, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, 300, HEIGHT-50, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 420, HEIGHT-50, tree2Img.width - 50, tree2Img.height - 50);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 560, HEIGHT-50, tree2Img.width - 50, tree2Img.height - 50);
    ctx.drawImage(tree1Img, 0, 0, tree1Img.width, tree1Img.height, 670, HEIGHT-50, tree1Img.width/2, tree1Img.height/2);
    ctx.drawImage(tree1Img, 0, 0, tree1Img.width, tree1Img.height, 800, HEIGHT-50, tree1Img.width/2, tree1Img.height/2);

    //right side
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, -100, -100, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, -60, 40, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, -60, 90, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, -100, 150, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, -100, 230, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, -60, 260, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, -100, 400, tree2Img.width + 30, tree2Img.height + 30);

    //top side
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 50, -180, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree1Img, 0, 0, tree1Img.width, tree1Img.height, 150, -180, tree1Img.width/2, tree1Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 230, -190, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 350, -180, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, 430, -180, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 500, -200, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree1Img, 0, 0, tree1Img.width, tree1Img.height, 550, -190, tree1Img.width/2, tree1Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 620, -200, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree3Img, 0, 0, tree3Img.width, tree3Img.height, 690, -180, tree3Img.width/2, tree3Img.height/2);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 780, -200, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 800, -200, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 830, -180, tree2Img.width + 30, tree2Img.height + 30);
    ctx.drawImage(tree2Img, 0, 0, tree2Img.width, tree2Img.height, 900, -180, tree2Img.width + 30, tree2Img.height + 30);
}

//MOVEMENTS
function onKeyDown(evt) {
    if (evt.keyCode == 87) {
        wDown = true;
    }
    else if (evt.keyCode == 65) {
        aDown = true;
    }
    else if (evt.keyCode == 83) {
        sDown = true;
    }
    else if(evt.keyCode == 68) {
        dDown = true;
    }
    else if(evt.keyCode == 38) {
        if (!upDown) {
            if (fbIntervalUp == 0) {
                spriteY = 96;
                shoot();
                upDown = true;
            }
        }
    }
    else if(evt.keyCode == 37) {
        if (!leftDown) {
            if (fbIntervalLeft == 0) {
                spriteY = 32;
                shoot();
                leftDown = true;
            }
        }
    }
    else if(evt.keyCode == 40) {
        if (!downDown) {
            if (fbIntervalDown == 0) {
                spriteY = 0;
                shoot();
                downDown = true;
            }
        }
    }
    else if(evt.keyCode == 39) {
        if (!rightDown) {
            if (fbIntervalRight == 0) {
                spriteY = 64;
                shoot();
                rightDown = true;
            }
        }
    }

}

function onKeyUp(evt) {
    if (evt.keyCode == 87) {
        wDown = false;
        spriteX = 128;
    }
    else if (evt.keyCode == 65) {
        aDown = false;
        spriteX = 128;
    }
    else if (evt.keyCode == 83) {
        sDown = false;
        spriteX = 128;
    }
    else if(evt.keyCode == 68) {
        dDown = false;
        spriteX = 128;
    }
    else if(evt.keyCode == 32) {
        spaceDown = false;
    }
    else if(evt.keyCode == 38) {
        upDown = false;
    }
    else if(evt.keyCode == 37) {
        leftDown = false;
    }
    else if(evt.keyCode == 40) {
        downDown = false;
    }
    else if(evt.keyCode == 39) {
        rightDown = false;
    }
}