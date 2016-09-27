var Tower=function(game, destinationFinal, currentPos) {
        
     
}
Tower.prototype.constructor = Tower;


function TowerComposite(game, x, y) {
        //Goal = {x:,y:};
    Tower.call(this)    
    this.refGame = game;
    this.x = x;
    this.y = y;    
    this.element="composite";
    this.rateOfFire = 30;
    this.frameSinceShoot = 0;
    this.damage = 12;
    this.range = 96; //96 de base
    this.sprite = this.refGame.add.sprite(this.x, this.y, "towerComposite");
    this.bulletsArray= [] ; //tableau de bullets propre a la tourrelle
    this.visualRange = this.refGame.add.graphics(this.x+this.sprite.width*0.5, this.y+this.sprite.height*0.75);
    this.visualRange.lineStyle(2, 0xFFFFFF, 0.5);
    this.visualRange.beginFill(0xFFFFFF, 0.1);
    this.visualRange.drawCircle(0, 0, this.range);
    
}
TowerComposite.prototype = Object.create(Tower.prototype);
TowerComposite.prototype.constructor = TowerComposite;

function TowerWater(game, x, y) {
        //Goal = {x:,y:};
    Tower.call(this)    
    this.refGame = game;
    this.x = x;
    this.y = y;    
    this.element="water";
    this.level = 0;
    this.rateOfFire = 30;
    this.frameSinceShoot = 0;
    this.damage = 12;
    this.range = 96; //96 de base
    this.sprite = this.refGame.add.sprite(this.x, this.y, "towerWater");
    this.bulletsArray= [] ; //tableau de bullets propre a la tourrelle
    this.visualRange = this.refGame.add.graphics(this.x+this.sprite.width*0.5, this.y+this.sprite.height*0.75);
    this.visualRange.lineStyle(2, 0xFFFFFF, 0.5);
    this.visualRange.beginFill(0xFFFFFF, 0.1);
    this.visualRange.drawCircle(0, 0, this.range);
    
}
TowerWater.prototype = Object.create(Tower.prototype);
TowerWater.prototype.constructor = TowerWater;

function TowerNature(game, x, y) {
        //Goal = {x:,y:};
    Tower.call(this)    
    this.refGame = game;
    this.x = x;
    this.y = y;   
    this.element="nature";
    this.level = 0;
    this.rateOfFire = 30;
    this.frameSinceShoot = 0;
    this.damage = 12;
    this.range = 96; //96 de base
    this.sprite = this.refGame.add.sprite(this.x, this.y, "towerNature");
    this.bulletsArray= [] ; //tableau de bullets propre a la tourrelle
    this.visualRange = this.refGame.add.graphics(this.x+this.sprite.width*0.5, this.y+this.sprite.height*0.75);
    this.visualRange.lineStyle(2, 0xFFFFFF, 0.5);
    this.visualRange.beginFill(0xFFFFFF, 0.1);
    this.visualRange.drawCircle(0, 0, this.range);
}
TowerNature.prototype = Object.create(Tower.prototype);
TowerNature.prototype.constructor = TowerNature;

function TowerFire(game, x, y) {
        //Goal = {x:,y:};
    Tower.call(this)    
    this.refGame = game;
    this.x = x;
    this.y = y;   
    this.element="fire";
    this.level = 0;
    this.rateOfFire = 30;
    this.frameSinceShoot = 0;
    this.damage = 12;
    this.range = 96; //96 de base
    this.sprite = this.refGame.add.sprite(this.x, this.y, "towerFire");
    this.bulletsArray= [] ; //tableau de bullets propre a la tourrelle
    this.visualRange = this.refGame.add.graphics(this.x+this.sprite.width*0.5, this.y+this.sprite.height*0.75);
    this.visualRange.lineStyle(2, 0xFFFFFF, 0.5);
    this.visualRange.beginFill(0xFFFFFF, 0.1);
    this.visualRange.drawCircle(0, 0, this.range);
}
TowerFire.prototype = Object.create(Tower.prototype);
TowerFire.prototype.constructor = TowerFire;

Tower.prototype.manageShoot = function(game,ObjectBullet){
    this.frameSinceShoot++;
    if(this.frameSinceShoot >= this.rateOfFire){
        var target = this.searchForTarget();
        if(target){
            this.shoot(game,target,ObjectBullet);
            this.frameSinceShoot = 0;
        }
    }
    var tower = this;
    for(var i = 0; i < this.bulletsArray.length; i++){
        this.bulletsArray[i].move(game,tower,i);
    }     
}

Tower.prototype.shoot = function (game,target,ObjectBullet){

    // switch(this.element)
    this.bulletsArray.push(new ObjectBullet(this.refGame, this.sprite.x+this.sprite.width*0.25,this.sprite.y+this.sprite.height*0.15,target, this.element));   
}

// Tower.prototype.shoot = function(target){
//             var vecteurX = (this.sprite.x+this.sprite.width*0.5) - (target.sprite.x+target.sprite.width*0.5);
//             var vecteurY = (this.sprite.y+this.sprite.height*0.5) - (target.sprite.y+target.sprite.height*0.5);
//             var longueur = Math.sqrt(vecteurX * vecteurX + vecteurY * vecteurY);
//             vecteurX /= longueur;
//             vecteurY /= longueur;
//     this.refGame.MANAGERSHOOT.create(this.sprite.x+this.sprite.width*0.5,this.sprite.y+this.sprite.height*0.5,this.type,{x:(vecteurX),y:(vecteurY)},target,this.refGame);
// }
Tower.prototype.searchForTarget = function(){
    var closestEnemy = null;
    var distanceEnemy;
    var shootPosition = {
        x:this.sprite.x+this.sprite.width*0.5,
        y:this.sprite.y+this.sprite.height*0.75
    }; 
    for(var i = 0; i < this.refGame.waveArray.length; i++){
        if(this.refGame.waveArray[i].hp > 0){
            var dist = this.calculateDistance(shootPosition.x,shootPosition.y,this.refGame.waveArray[i].sprite.x+this.refGame.waveArray[i].sprite.width*0.5,this.refGame.waveArray[i].sprite.y+this.refGame.waveArray[i].sprite.height*0.5);
            if(closestEnemy == null && dist <= this.range){
                closestEnemy = this.refGame.waveArray[i];
                distanceEnemy = dist;
            }
            else if((dist < distanceEnemy) && dist <= this.range){
                closestEnemy = this.refGame.waveArray[i];
                distanceEnemy = dist;
            }
        }
    }
    return closestEnemy;
}

Tower.prototype.calculateDistance =  function(x1,y1,x2,y2) {
  var ac = y2 - y1;
  var bc = x2 - x1;
  return Math.sqrt(Math.pow(ac,2) + Math.pow(bc,2));
}
