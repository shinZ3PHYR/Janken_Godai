

var Enemy=function(game, destinationFinal, currentPos)
{   
    this.refGame=game;
    this.rePosSpriteY=0
    this.rePosSpriteY = 0;
    this.walkablesIsFull = false;
        //DEFINITION DES ANIMATIONS
    game.add.tween(this.sprite);
        //CLONE DES ARRAY WALKABLE
        //WALKABLES
    this.walkables = [];
    for(var i=0; i < game.walkables.length;i++){ //on clone le tableau game.walkables pour garde l'initial en reference
        this.walkables[i] = game.walkables[i];
    }   
        //WATERWALKABLE
    this.waterWalkables = [];
    for(var i=0; i < game.waterWalkables.length;i++){
        this.waterWalkables[i] = game.waterWalkables[i];
    }
        //FIREWALKABLE
    this.fireWalkables = [];
   for(var i=0; i < game.fireWalkables.length;i++){
     this.fireWalkables[i] = game.fireWalkables[i];
   }
        //NATUREWALKABLE
    this.natureWalkables = [];
    for(var i=0; i < game.natureWalkables.length;i++){
        this.natureWalkables[i] = game.natureWalkables[i];
    }
     this.destinationFinal=destinationFinal;

    
     this.path = [];
     this.pathfinder = game.plugins.add(new Phaser.Plugin.PathFinderPlugin(game, this));
     for(var i = 0; i < this.walkables.length; i++){
        this.pathfinder.setTileCost(this.walkables[i], 100);
    }
         //FUNCTION QUI DEFINI LA VALEUR DES TILES
    this.tileCost=function tileCost(waterTileCost,fireTileCost,natureTileCost){
        for(var i = 0; i < this.walkables.length; i++){
            for(var w = 0; w < this.waterWalkables.length; w++){
                if(this.walkables[i]==this.waterWalkables[w]){
                     this.pathfinder.setTileCost(this.walkables[i], waterTileCost);     
                }  
            }
            for(var f = 0; f < this.fireWalkables; f++){
                if(this.walkables[i]==this.fireWalkables[f]){
                    this.pathfinder.setTileCost(this.walkables[i], fireTileCost); 
                }  
            }
            for(var n =0; n < this.natureWalkables; n++){
                if(this.walkables[i]==this.natureWalkables[n]){
                     this.pathfinder.setTileCost(this.walkables[i], natureTileCost);   
                }  
            }
        }
    }
        //DEFINITION DES PATHS AVEC TILECOST ET FUSION DES ARRAY
        switch(this.element){
            case 'fire' : 
            //ON FUSIONNE TOUT LES TABLEAU AVEC CHAQUES COUT BIEN PREFEDINI
                Array.prototype.push.apply(this.walkables, this.fireWalkables);
                Array.prototype.push.apply(this.walkables, this.natureWalkables);
                Array.prototype.push.apply(this.walkables, this.waterWalkables);
                this.tileCost(1000,1,1000);
                break;
            case 'water' : 
                Array.prototype.push.apply(this.walkables, this.waterWalkables);
                Array.prototype.push.apply(this.walkables, this.fireWalkables);
                Array.prototype.push.apply(this.walkables, this.natureWalkables);
                this.tileCost(1,1000,1000);
                break;
            case 'nature' : 
                Array.prototype.push.apply(this.walkables, this.fireWalkables);
                Array.prototype.push.apply(this.walkables, this.waterWalkables);
                Array.prototype.push.apply(this.walkables, this.natureWalkables);
                this.tileCost(1000,1000,1);
                 break;   
        }
        
        this.pathfinder.setGrid(game.mergedLayer, this.walkables);
        this.findPath(destinationFinal);
        //DEPLACEMENT DES ENNEMIS EN PIXEL
        var that = this;
        this.direction = {
            me: that ,
            nextPos:null,
            slowEnemy:1,
            check:function(){

                //ASSIGNATION CASE
                if(this.nextPos!=null){              
                    //GO LEFT
                    if(this.me.sprite.x > this.nextPos.x){

                        
                        if(this.me.isOver(game, 2, 'fireWalkables', game.fireWalkables)&&this.me.element == "fire"){
                            if(!!this.nextPos){
                                if(this.me.onOverBonus){
                                    this.me.hp += (60*this.me.hp/100);
                                    this.me.onOverBonus = false;
                                    
                                }
                            }
                        }
                        if(this.me.isOver(game, 3, 'natureWalkables', game.natureWalkables)&&this.me.element == "nature"){
                            if(!!this.nextPos){
                                if(this.me.onOverBonus){
                                    this.me.regain += 0.02;
                                    this.me.onOverBonus = false;
                                    
                                }
                            }
                        }
                        if(this.me.isOver(game, 1, 'waterwalkables', game.waterWalkables)&&this.me.element == "water"){
                            if(!!this.nextPos){
                                this.me.sprite.x-=this.me.speed*2/this.slowEnemy;
                            }
                        }else{

                            this.me.sprite.x-=this.me.speed/this.slowEnemy;
                        }
                        this.me.sprite.animations.play('left', this.me.JSON.enemies.animations.framerate.normalside, true);
                    }
                    //GO RIGHT
                    else if(this.me.sprite.x < this.nextPos.x){
                        this.me.sprite.x+=this.me.speed/this.slowEnemy;
                        this.me.sprite.animations.play('right', this.me.JSON.enemies.animations.framerate.normalside, true);
                    }
                    //GO UP
                    if(this.me.sprite.y + this.me.rePosSpriteY > this.nextPos.y){
                        
                        this.me.sprite.y-=this.me.speed/this.slowEnemy;
                        this.me.sprite.animations.play('up', this.me.JSON.enemies.animations.framerate.normal, true);
                    }
                    //GO DOWN
                    else if(this.me.sprite.y + this.me.rePosSpriteY < this.nextPos.y){
                        
                        this.me.sprite.y+=this.me.speed/this.slowEnemy;
                        this.me.sprite.animations.play('down', this.me.JSON.enemies.animations.framerate.normal, true);
                    }
                    //CASE ATTEINTE
                    else if(this.me.sprite.y%32==0&&this.me.sprite.x%32==0){
                        this.nextPos=null;
                        this.slowEnemy=this.me.refGame.hud.slowEnemy;
                    }
                }
                    
                //CASE ASSIGNER
                else{
                    if(this.me.path.length == 0){
                        return true;
                    }
                    this.nextPos = this.me.path.shift();
                    this.nextPos.x*=32;
                    this.nextPos.y *= 32;

                    
                }
            }
        };
}
Enemy.prototype.constructor = Enemy;

//---------------------------ENEMY1-----------------------------------    
var Enemy1 = function Enemy1(game,currentPos,destinationFinal){
    this.JSON = game.parameters;
    this.goldWin=this.JSON.ressources.enemy1goldwin;
     this.speed = 1;
    this.element="";
    switch((Math.random()*3)|0){
        case 0:
            this.element="fire";
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "kodama_feu");
           
            this.sprite.animations.add('right', ['right1', 'right2', 'right3', 'right4', 'right4','right3', 'right2']);
            this.sprite.animations.add('down', ['down1', 'down2', 'down3', 'down4', 'down4', 'down3', 'down2']);
            this.sprite.animations.add('up', ['up1', 'up2', 'up3', 'up4', 'up4', 'up3', 'up2']);
            this.sprite.animations.add('left', ['left1', 'left2', 'left3', 'left4', 'left4', 'left3', 'left2']);
            
            break;
        case 1:
            this.element="nature";
            this.regain = 0.00;
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "kodama");
            this.sprite.animations.add('right', ['right1', 'right2', 'right3', 'right4', 'right5', 'right6', 'right7', 'right8', 'right9', 'right10']);
            this.sprite.animations.add('down', ['down1', 'down2', 'down3', 'down4', 'down5', 'down6', 'down7']);
            this.sprite.animations.add('up', ['up1', 'up2', 'up3', 'up4', 'up5', 'up6', 'up7']);
            this.sprite.animations.add('left', ['left1', 'left2', 'left3', 'left4', 'left5', 'left6', 'left7', 'left8', 'left9', 'left10']);
         break;
        case 2:
            this.element="water";
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "kodama_eau");
            this.sprite.animations.add('right', ['down1', 'down2', 'down3', 'down4', 'down3']);
            this.sprite.animations.add('down', ['down1', 'down2', 'down3', 'down4', 'down3']);//, 'down5', 'down6', 'down7'
            this.sprite.animations.add('up', ['up1', 'up2', 'up3', 'up4', 'up3']);//, 'up5', 'up6', 'up7'
            this.sprite.animations.add('left', ['down1', 'down2', 'down3', 'down4', 'down3']);
            break;
        default : break;
            };
	Enemy.call(this,game,destinationFinal,currentPos);
    this.hp = 32;
    this.id= 1;   
    this.onOverBonus = true;
    }
    Enemy1.prototype = Object.create(Enemy.prototype);
    Enemy1.prototype.constructor = Enemy1;
//---------------------------ENEMY2-----------------------------------
var Enemy2 = function Enemy2(game,currentPos,destinationFinal){
    this.JSON = game.parameters;
    this.goldWin=this.JSON.ressources.enemy2goldwin;
    this.id= 2;   
    this.element="";
    switch((Math.random()*3)|0){
        case 0:
            this.hp = 100;
            this.speed = 1;
            this.element="fire";
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "spider");
            this.sprite.animations.add('right', ['r1', 'r2', 'r3', 'r4', 'r5']);
            this.sprite.animations.add('down', ['d1', 'd2', 'd3', 'd4', 'd5']);
            this.sprite.animations.add('up', ['u1', 'u2', 'u3', 'u4', 'u5']);
            this.sprite.animations.add('left', ['l1', 'l2', 'l3', 'l4', 'l5']);
        break;
        case 1:
            this.rePosSpriteY = 32;
            this.hp = 50;
            this.hpMax=50;
            this.regain=0.02;
            this.speed =1 ;
            this.element="nature";
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "panda");
            this.sprite.animations.add('right', ['r1', 'r2', 'r3']);
            this.sprite.animations.add('down', ['d1', 'd2', 'd3']);
            this.sprite.animations.add('up', ['u1', 'u2', 'u3']);
            this.sprite.animations.add('left', ['l1', 'l2', 'l3']);
        break;
        case 2:
            this.hp = 20;
            this.speed =2;
            this.element="water";
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "slim");
            this.sprite.animations.add('right', ['r1', 'r2', 'r3', 'r4', 'r5']);
            this.sprite.animations.add('down', ['l1', 'l2', 'l3', 'l4', 'l5']);
            this.sprite.animations.add('up', ['l1', 'l2', 'l3', 'l4', 'l5']);
            this.sprite.animations.add('left', ['l1', 'l2', 'l3', 'l4', 'l5']);
        break;
        default : break;
    };
    Enemy.call(this,game,destinationFinal,currentPos);       
}
    Enemy2.prototype = Object.create(Enemy.prototype);
    Enemy2.prototype.constructor = Enemy2;
//---------------------------ENEMY3-----------------------------------
var Enemy3 = function Enemy3(game,currentPos,destinationFinal){
    this.JSON = game.parameters;
    this.goldWin=this.JSON.ressources.enemy3goldwin;
    this.id= 3;   
    this.element="";
    this.onOverBonus = true;
    switch((Math.random()*3)|0){
        case 0:
        this.hp = 150;
             this.speed = 1;
            this.element="fire";
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "spiritOfFire");
            this.sprite.animations.add('right', ['right1', 'right2', 'right3', 'right2']);
            this.sprite.animations.add('down', ['down1', 'down2', 'down3', 'down2']);
            this.sprite.animations.add('up', ['up1', 'up2', 'up3', 'up2']);
            this.sprite.animations.add('left', ['left1', 'left2', 'left3', 'left2']);
            
            break;
        case 1:
            this.rePosSpriteY = 32;
            this.hp = 60;
            this.hpMax=50;
            this.speed =1 ;
            this.regain=0.06;
            this.element="nature";
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "spiritOfNature");
            this.sprite.animations.add('right', ['right1', 'right2', 'right3', 'right2']);
            this.sprite.animations.add('down', ['down1', 'down2', 'down3', 'down2']);
            this.sprite.animations.add('up', ['up1', 'up2', 'up3', 'up2']);
            this.sprite.animations.add('left', ['left1', 'left2', 'left3', 'left2']);
         break;
        case 2:
            this.hp = 50;
            this.speed =2 ;
            this.element="water";
            this.sprite = game.enemiesGroup.create(currentPos.x*32, currentPos.y*32, "spiritOfWater");
            this.sprite.animations.add('right', ['right1', 'right2', 'right3', 'right2']);
            this.sprite.animations.add('down', ['down1', 'down2', 'down3', 'down2']);
            this.sprite.animations.add('up', ['up1', 'up2', 'up3', 'up2']);
            this.sprite.animations.add('left', ['left1', 'left2', 'left3', 'left2']);
            break;
        default : break;
    };
    Enemy.call(this,game,destinationFinal,currentPos);
    if(this.element=="nature"){
            this.rePosSpriteY=32;
    }
}
    Enemy3.prototype = Object.create(Enemy.prototype);
    Enemy3.prototype.constructor = Enemy3;

//DEFINITION DES COUT DE TILE POUR CHAQUE LAYER DE THIS
    Enemy.prototype.tileCost=function tileCost(thisArrayWalkable,tileCost){
    for(var i = thisArrayWalkable.length + 1; i > 0; i--){
            this.pathfinder.setTileCost(thisArrayWalkable[i], tileCost);
       };
   };
   Enemy.prototype.redefinedPath=function redefinedPath(game,destinationFinal,i){	
   		if(this.direction.nextPos){
   			this.pathfinder.preparePathCalculation([this.direction.nextPos.x/32,this.direction.nextPos.y/32],[destinationFinal.x,destinationFinal.y]);
   			this.pathfinder.calculatePath()	
   		}
	 
   };

    Enemy.prototype.findPath = function(destinationFinal) {
        var that = this;
        this.pathfinder.setCallbackFunction(function(path) {
            that.path = path || []; 
        });
       
        this.pathfinder.preparePathCalculation([this.sprite.x/32,this.sprite.y/32],[destinationFinal.x,destinationFinal.y]);
        this.pathfinder.calculatePath();
        

    };
    Enemy.prototype.displayLife = function(game) {
        if(this.hp>0){
            if(this.lifeBar != null){
                if(this.hp > 32){
                    this.lifeBar.x = this.sprite.x-this.hp*.5;
                    this.lifeBar.y = this.sprite.y;
                    this.currentLife.x = this.sprite.x-this.hp*.5;
                    this.currentLife.y=this.sprite.y;     
                }
                else{
                    this.lifeBar.x = this.sprite.x;
                    this.lifeBar.y = this.sprite.y;
                    this.currentLife.x = this.sprite.x;
                    this.currentLife.y=this.sprite.y;
                }
                this.currentLife.clear();
                
                this.currentLife.beginFill(0xFF0000, 1);
                this.currentLife.drawRect(0, -3, this.hp, 2);
                
            }else{
            this.lifeBar = game.add.graphics(this.sprite.x, this.sprite.y);
            this.currentLife = game.add.graphics(this.sprite.x, this.sprite.y);
            
            this.lifeBar.lineStyle(2, 0x000000, 1);
            this.lifeBar.beginFill(0xFFFFFF, 1);
            this.lifeBar.drawRect(0, -3, this.hp, 3);

            this.currentLife.beginFill(0xFF0000, 1);
            this.currentLife.drawRect(0, -3, this.hp, 2);
            }
        }else{
            this.lifeBar.clear();
            this.currentLife.clear();
        }


    }
    Enemy.prototype.isOver = function(game, idLayer, stringWalkables, arrayWalkables) {
       for (var i = 0 ; i < game.map.layers.length ; i++)
        {
            if(game.map.layers[idLayer]!=-1)
            {   
                for (var y = 0 ; y  < game.map.layers[idLayer].data.length ; y++)
                {
                    for (var x = 0 ; x < game.map.layers[idLayer].data[y].length ; x++)
                    {       
                        if(!!game.map.layers[idLayer].data[y][x])//&&arrayWalkables.indexOf(game.map.layers[idLayer].data[y][x].index)== -1
                        {  
                            if(Math.floor(this.sprite.x/32) == game.map.layers[idLayer].data[y][x].x && Math.floor(this.sprite.y/32) == game.map.layers[idLayer].data[y][x].y){
                                return true;
                            }
                        }
                    }
                } 
            }
        }

    }
Enemy.prototype.regainLife = function(game, i){
    if(game.waveArray[i].element == "nature" &&game.waveArray[i].hp < game.waveArray[i].hpMax){
        game.waveArray[i].hp += game.waveArray[i].regain ;
    }     
}
        