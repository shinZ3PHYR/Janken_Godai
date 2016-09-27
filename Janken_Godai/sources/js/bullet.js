function Bullet(game, x,y,target, element){
    this.refGame = game;
    this.element = element;
    this.x= x;
    this.y= y;

    this.target = target;
    switch(this.element){

        case "water":
        this.sprite = game.bulletsGroup.create(x, y, "bulletWater");
        this.sprite.animations.add('anim', ['bullet1', 'bullet2', 'bullet3', 'bullet2', 'bullet1']);
        game.add.tween(this.sprite);
        this.sprite.animations.play('anim', 15, true);
        break;
        case "fire":
        this.sprite = game.bulletsGroup.create(x, y, "bulletFire");
        this.sprite.animations.add('anim', ['bullet1', 'bullet2', 'bullet3', 'bullet4', 'bullet3', 'bullet2', 'bullet1']);
        game.add.tween(this.sprite);
        this.sprite.animations.play('anim', 15, true);
        break;  
        case "nature":
        this.sprite = game.bulletsGroup.create(x, y, "bullet");
        break;    

        default : this.sprite = game.bulletsGroup.create(x, y, "bullet");
        break;  
    }

    //     this.rayon = parseInt(config.hitboxs[0].rayon);
    // this.offsetX = parseInt(config.hitboxs[0].offsetX);
    // this.offsetY= parseInt(config.hitboxs[0].offsetY);
    this.speed = 6;
    this.directionX = 0;
    this.directionY = 0;

    
    
    // switch(this.element){
    //     case "fire" : this.effectFire(); break;
    //     case "nature" : this.effectNature(); break;
    //     case "water" : this.effectWater(); break;
    // }
    this.calculeDirection();


}
//definition de l'heritage de spacecraft
//Bullet.prototype = Object.create(Sprite.prototype);
Bullet.prototype.constructor = Bullet;
Bullet.prototype.calculeDirection = function(){
       
    var diffX;
    var diffY;
    diffX = Math.abs(this.x) - Math.abs(this.target.sprite.x+this.target.sprite.width*0.5);
    diffY = Math.abs(this.y) - Math.abs(this.target.sprite.y+this.target.sprite.height*0.5);

    var total = Math.abs(diffX) + Math.abs(diffY);
    this.directionX = diffX/ total ;
    this.directionY = diffY/ total ;
}
Bullet.prototype.move = function(game,tower,i){
    var oriX=tower.sprite.x+tower.sprite.width*0.5;
    var oriY=tower.sprite.y+tower.sprite.height*0.75;
    this.lifeTime++;
    this.sprite.x -= this.directionX * this.speed;
    this.sprite.y -= this.directionY * this.speed;
    var dist = this.calculateDistance(this.sprite.x+this.sprite.width*0.5,this.sprite.y+this.sprite.height*0.5,oriX,oriY);

       if(dist > tower.range){
            tower.bulletsArray.splice(i,1);
            this.sprite.kill();
        }   
        

}
Bullet.prototype.calculateDistance =  function(x1,y1,x2,y2){
  var ac = y2 - y1;
  var bc = x2 - x1;
  return Math.sqrt(Math.pow(ac,2) + Math.pow(bc,2));
}