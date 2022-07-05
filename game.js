const BALL_ORIGIN = new Vector(25,25)
const STICK_ORIGIN = new Vector(970, 11)
const SHOOT_ORIGIN = new Vector(955, 11)
const DELTA = 1/100
/////////////loadingAssest///////////////////////
let sprites = {}
let assestStillLoading = 0 
function loadSprites(filename){
    assestStillLoading ++;

    let spriteImg = new Image()
    spriteImg.src ="/assest/sprite/" + filename;

    spriteImg.addEventListener("load", ()=>{

        assestStillLoading --;

    })
            return spriteImg;
}
function loadAssets(callBack){
    sprites.background = loadSprites("background.png")
    sprites.stick = loadSprites("stick.png")
    sprites.ball = loadSprites("ball.png")

    assestLoadingLoop(callBack)
}
function assestLoadingLoop(callBack){

    if(assestStillLoading){
        requestAnimationFrame(assestLoadingLoop.bind(this, callBack))
    }else{
        callBack()
    }
}
/////////////////////////////////////////////////

///////////////////////vector/////////////////////

function Vector (x=0 , y=0){
this.x = x;
this.y = y;

}

Vector.prototype.copy = function(){

    return new Vector(this.x ,this.y);
}
Vector.prototype.addTo = function (vector){
    this.x += vector.x;
    this.y += vector.y;

}
Vector.prototype.mult = function(value){
return new Vector(this.x * value , this.y *value)

}
Vector.prototype.length = function(){
return Math.sqrt(Math.pow(this.x,2) +Math.pow(this.y,2))

}
let v1 = new Vector(1,2)
let v2 =new Vector(2,3)
//////////////////////////////////////////////////





///////////////////////mouse handeler///////////////

function ButtonState(){

    this.down = false;
    this.pressed = false;
}
function MouseHadeler (){

    this.left = new ButtonState();
    this.mid = new ButtonState();
    this.right = new ButtonState();


    this.position = new Vector();


    document.addEventListener("mousemove" , handleMouseMove)
    document.addEventListener("mousedown" , handleMouseDown)
    document.addEventListener("mouseup" , handleMouseUp)
}


MouseHadeler.prototype.reset = function (){
this.pressed.left = false;
this.pressed.mid = false;
this.pressed.right = false;


}

function handleMouseMove(e){
    Mouse.position.x = e.pageX;
    Mouse.position.y = e.pageY;
}

function handleMouseDown(e){

    handleMouseMove(e);
    if(e.which == 1){
        Mouse.left.down = true;
        Mouse.left.pressed = true;
    }else if (e.which == 2){
        Mouse.mid.down = true;
        Mouse.mid.pressed = true;
        
    }else if (e.which == 3){
        Mouse.right.down = true;
        Mouse.right.pressed = true;

    }


}

function handleMouseUp(e){
    handleMouseMove(e);
    if(e.which == 1){
        Mouse.left.down = false;
       
    }else if (e.which == 2){
        Mouse.mid.down = false;
    
        
    }else if (e.which == 3){
        Mouse.right.down = false;
        

    }

}
let Mouse = new MouseHadeler()
///////////////////////////////////////////////////





///////////////////////canvas/////////////////////
function Canvas2D (){
this._canvas = document.getElementById("screen")
this.ctx = this._canvas.getContext("2d")
}
Canvas2D.prototype.clear = function(){

    this.ctx.clearRect(0, 0, this._canvas.clientWidth, this._canvas.height)
}
Canvas2D.prototype.drawImage = function(image, position = { x: 0 , y:0},origin = { x: 0 , y:0},rotation = 0){

    this.ctx.save();
    this.ctx.translate(position.x,position.y);
    this.ctx.rotate(rotation);
    this.ctx.drawImage(image,-origin.x, -origin.y);
    this.ctx.restore();

}
let Canvas = new Canvas2D();
///////////////////////////////////////////////


/////////////////////white ball///////////////
function Ball(position){
this.position = position;
this.velocity = new Vector();
this.moving = false;
}
Ball.prototype.update = function (delta){
this.position.addTo(this.velocity.mult(delta))
this.velocity = this.velocity.mult(0.98)
if(this.velocity.length()<5){
    this.velocity = new Vector()
    this.moving = false;
}
}

Ball.prototype.draw = function (){
Canvas.drawImage(sprites.ball, this.position , BALL_ORIGIN)

}
Ball.prototype.shoot = function (power, rotation){
    this.velocity = new Vector(power *Math.cos(rotation) , power* Math.sin(rotation))
    this.moving = true;
}

/////////////////////////////////////////////

////////////////////stick///////////////
function Stick(position, onShoot){
    this.position = position;
    this.rotation = 0;
    this.origin = STICK_ORIGIN.copy();
    this.power = 0;
    this.onShoot = onShoot;
    this.shot = false;
}

Stick.prototype.draw = function(){
    Canvas.drawImage(sprites.stick, this.position, this.origin, this.rotation)
}

Stick.prototype.update = function(){
    this.updateRotation();
    if(Mouse.left.down){
        this.increasePower();
    }else if(this.power > 0){
        this.shoot();
        
    }
}

Stick.prototype.shoot = function(){
    this.onShoot (this.power, this.rotation)
    this.power = 0;
    this.origin = SHOOT_ORIGIN.copy();
    this.shot = true;
}


Stick.prototype.updateRotation = function(){
    let opposite = Mouse.position.y - this.position.y;
    let adjacent = Mouse.position.x - this.position.x;

    this.rotation = Math.atan2(opposite, adjacent)
}

Stick.prototype.increasePower = function(){
    this.power += 100;
    this.origin.x += 5;
}
Stick.prototype.onShoot = function(){
}
Stick.prototype.rePosition = function(position){
    this.position = position.copy()
    this.origin = STICK_ORIGIN
}
/////////////////////////////////////////////



/////////////////////game world///////////////
function GameWorld(){
this.whiteBall = new Ball(new Vector(413,413))
this.stick = new Stick(new Vector(413,413), this.whiteBall.shoot.bind(this.whiteBall))
}

GameWorld.prototype.update = function(){
this.stick.update()
this.whiteBall.update(DELTA)
if(!this.whiteBall.moving && this.stick.shot){
this.stick.rePosition(this.whiteBall.position)
}

}

GameWorld.prototype.draw = function(){
    Canvas.drawImage(sprites.background)
    this.whiteBall.draw()
    this.stick.draw()
}

let gameworld = new GameWorld()

////////////////////////////////////////////////


///////////////////////animate////////////////

function  animate(){

Canvas.clear()
gameworld.update()
gameworld.draw()


    requestAnimationFrame(animate);
}
loadAssets(animate)



//////////////////////////////////////////////////


