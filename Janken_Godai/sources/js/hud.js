var Hud=function(game){
    this.refGame = game;
    this.hudBody=game.add.sprite(0,0,"hudBody");
    this.showNextWave=game.add.sprite(1300,520,"showNextWave")
    this.hudTowerCase=game.add.sprite(412,590,"towerCase" );
    this.hudTowerX=this.hudTowerCase.x+(this.hudTowerCase.width/2-15);
    this.hudTowerY=this.hudTowerCase.y+(this.hudTowerCase.height/2-32);    
    this.hudTower=game.add.sprite(this.hudTowerX,this.hudTowerY,"towerComposite");
    this.hudTower.inputEnabled = true;
    this.hudTower.input.enableDrag(false,false);
    this.canCreate=false;
    this.textColor= "#FFFFFF";
    this.hudJauges=game.add.sprite(50,590,"jauges")
    this.DragAndDropText=new Text(game,this.hudTowerX-50,this.hudTowerY-64," Drag and drop",this.textColor,"15px japan")
    this.notEnoughtCash =new Text(game,this.hudTowerX-50,this.hudTowerY-64,"    GET CASH!",this.textColor,"15px japan");
    this.notEnoughtCash.text.visible=false;
    this.DragAndDropText.text.visible=true;
    this.chooseAnElement;
    this.explosion= null; // animation quand on change d'element
    this.deleteOldTurret=false;
    this.elementMenuIsOpen=false;
    this.buttonSendIsOpen=false;
    this.nexusLife=game.parameters.ressources.lifemax;
    this.mana=game.parameters.ressources.manamax;
    this.lifeBar=game.add.graphics(65, 608);
    this.lifeBar.beginFill(0xFF0000, 1);
    this.lifeBar.drawRect(0,0,this.nexusLife*1.87,19);
    this.lifeText =new Text(game,this.lifeBar.x+80,this.lifeBar.y-3,'Life',this.textColor,"20px japan");

    this.manaBar=game.add.graphics(65, 638);
    this.manaBar.beginFill(0x0007D1, 1);
    this.manaBar.drawRect(0,0,this.mana*1.87,19);
    this.lifeText =new Text(game,this.manaBar.x+75,this.manaBar.y-3,'Mana',this.textColor,"20px japan")
    this.showNextWaveText={//objet contenent les propriété necessaire a la fonction game.hud.showNextWave
      numberOfEnemy1:0,
      numberOfEnemy2:0,
      numberOfEnemy3:0,
    }
    this.aquaBivelButton=new Button(game,1500,600,"aquaBivel",this.aquaBivelF,this);
    this.fireBivelButton=new Button(game,1500,600,"fireBivel",this.fireBivelF,this);
    this.natureBivelButton=new Button(game,1500,600,"natureBivel",this.natureBivelF,this);
    //----------------------PARTICULES DES POUVOIRS-----------------
    this.createAquaParticles=function(){
        //-------------------neige------------------
      //premier plan
      this.aquaParticlesBack = game.add.emitter(game.world.centerX, -32, 600);
      this.aquaParticlesBack.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
      this.aquaParticlesBack.maxParticleScale = 0.6;
      this.aquaParticlesBack.minParticleScale = 0.2;
      this.aquaParticlesBack.setYSpeed(20, 100);
      this.aquaParticlesBack.gravity = 0;
      this.aquaParticlesBack.width = game.world.width * 1.5;
      this.aquaParticlesBack.minRotation = 0;
      this.aquaParticlesBack.maxRotation = 40;
      //deuxieme plan
      this.aquaParticlesMid = game.add.emitter(game.world.centerX, -32, 250);
      this.aquaParticlesMid.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
      this.aquaParticlesMid.maxParticleScale = 1.2;
      this.aquaParticlesMid.minParticleScale = 0.8;
      this.aquaParticlesMid.setYSpeed(50, 150);
      this.aquaParticlesMid.gravity = 0;
      this.aquaParticlesMid.width = game.world.width * 1.5;
      this.aquaParticlesMid.minRotation = 0;
      this.aquaParticlesMid.maxRotation = 40;
      //premier plan
      this.aquaParticlesFront = game.add.emitter(game.world.centerX, -32, 50);
      this.aquaParticlesFront.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
      this.aquaParticlesFront.maxParticleScale = 1;
      this.aquaParticlesFront.minParticleScale = 0.5;
      this.aquaParticlesFront.setYSpeed(100, 200);
      this.aquaParticlesFront.gravity = 0;
      this.aquaParticlesFront.width = game.world.width * 1.5;
      this.aquaParticlesFront.minRotation = 0;
      this.aquaParticlesFront.maxRotation = 40;
      this.speedParticlesX=0;
      this.stopParticlesAqua=false;
      this.changeWindDirection();
    }
    this.createAquaParticles();
    this.fireParticles = game.add.emitter(game.world.centerX, game.marker.x, game.marker.y);
    this.fireParticles.makeParticles('bulletFire');
    this.fireParticles.maxParticleScale = 1.1;
    this.fireParticles.minParticleScale = 0.2;
    this.fireParticles.setYSpeed(-100, -400);
    this.stopParticlesFire=false;

    this.natureParticles = game.add.emitter(game.world.centerX,100, 100);
    this.natureParticles.makeParticles('blur');
    this.natureParticles.emitY=600;
    this.natureParticles.emitX=100;
    this.natureParticles.maxParticleScale = 0.8;
    this.natureParticles.minParticleScale = 0.2;
    this.natureParticles.setYSpeed(-30, 30);
    this.natureParticles.gravity = 0;
    this.stopParticlesNature=false;

    this.manaParticles = game.add.emitter(game.world.centerX,100, 100);
    this.manaParticles.makeParticles('blurBlue');
    this.manaParticles.emitY=game.marker.y;
    this.manaParticles.emitX=game.marker.x;
    this.manaParticles.maxParticleScale = 0.8;
    this.manaParticles.minParticleScale = 0.2;
    

    this.manaParticles.gravity = 0;
    this.stopParticlesMana=true;
    

    //------------propriétés necessaires au regain de mana-------------

    this.delayForManaUp=0;// on augmente le mana si la position du curseur n'a pas bougé pendant un certain temps
    this.regainMana=false;
    this.oldPosMarkerX=0;
    this.oldPosMarkerY=0;
}
Hud.prototype.constructor = Hud;
Hud.prototype.update = function(game){
    this.lifeBar.clear();
    this.lifeBar.drawRect(0,0,this.nexusLife*1.87,19);
    this.manaBar.clear();
    this.manaBar.drawRect(0,0,this.mana*1.87,19);
    if(this.hudTower.input.isDragged){
        this.canCreate=true;
        game.managerTurret.canPutTower=true;
        if(game.marker.x>1024-32||game.marker.x<0||game.marker.y>720-32||game.marker.y<0){//cette bride evite de faire planter le jeu si le marker ce retrouve a une endroit sans layer
          this.hudTower.x=this.hudTowerX;
          this.hudTower.y=this.hudTowerY;
          game.marker.x=1024+32//ceci est un cache misere
          game.marker.y=0
          this.canCreate=false;
          game.managerTurret.canPutTower=false; 
        }
          for(var j = 0 ; j < game.unwalkables.length ;j++ ){ 
            if(game.unwalkables[j]==game.mergedLayer[(game.marker.y/32)|0][(game.marker.x/32)|0]){ //si le marker sur trouve sur une unwalkables on ne peut pas placer de tourelles
              this.canCreate=false;
              game.managerTurret.canPutTower=false; 
            } 
            
          } 
        if(game.canShowWalkables){
          placeShowWalkables(game);
          game.canShowWalkables=false;  
        }
    }
    else{
      for(var i=0;i<game.showWalkables.length;i++){    
          game.showWalkables[i].graphics.destroy();
          game.showWalkables.splice(i,1);
          i--
      }
        game.showWalkables=[];
        game.canShowWalkables=true;  
        this.canCreate=false;
        this.hudTower.x=this.hudTowerX;
        this.hudTower.y=this.hudTowerY;
    }
    if(game.ressources.gold<10){
        this.hudTower.input.draggable =false;
        this.notEnoughtCash.text.visible=true;
        this.DragAndDropText.text.visible=false;
         
    }
    else{
        this.hudTower.input.draggable =true;
        this.notEnoughtCash.text.visible=false;
        this.DragAndDropText.text.visible=true;
    }
    this.regainManaF(game);
    this.updateBivelF(game);
    
}
Hud.prototype.chooseAnElementMenu=function(game,newX,newY,i){
    this.newX=newX;
    this.newY=newY;
    this.towerIndex= i;
    this.chooseAnElement = game.add.sprite(this.hudTowerCase.x,this.hudTowerCase.y,"towerCase");
    game.add.tween(this.chooseAnElement).to({x:newX,y:newY}, 1000, Phaser.Easing.Cubic.Out,true);

    this.text= new Text(game,this.chooseAnElement.x,this.chooseAnElement.y,"   choose an \n element","#000000","15px japan");
    game.add.tween(this.text.text).to({x:newX,y:newY}, 1000, Phaser.Easing.Cubic.Out,true);
    
     this.FireButton=new Button(game,this.hudTowerCase.x+this.chooseAnElement.width/2-23,this.hudTowerCase.y+32,"fireSymbol",this.pushFireTurret,this);
    game.add.tween(this.FireButton.sprite).to({x:newX+this.chooseAnElement.width/2-23,y:newY+32}, 1000, Phaser.Easing.Cubic.Out,true);
    this.FireButton.sprite.scale.setTo(0.3,0.3);
    
    this.waterButton=new Button(game,this.hudTowerCase.x+5,this.hudTowerCase.y+65,"waterSymbol",this.pushWaterTurret,this);
    game.add.tween(this.waterButton.sprite).to({x:newX+5,y:newY+65}, 1000, Phaser.Easing.Cubic.Out,true);
    this.waterButton.sprite.scale.setTo(0.3,0.3);
    
    this.natureButton=new Button(game,this.hudTowerCase.x+70,this.hudTowerCase.y+65,"natureSymbol",this.pushNatureTurret,this);
    game.add.tween(this.natureButton.sprite).to({x:newX+70,y:newY+65}, 1000, Phaser.Easing.Cubic.Out,true);
    this.natureButton.sprite.scale.setTo(0.3,0.3);
    this.elementMenuIsOpen=true; // le menu est crée

}

Hud.prototype.chooseAStatMenu=function(game,newX,newY,i){
    this.newX=newX;
    this.newY=newY;
    this.towerIndex= i;
    this.chooseAStat = game.add.sprite(this.hudTowerCase.x,this.hudTowerCase.y,"towerCase");
    this.chooseAStat.scale.x = 2;

    game.add.tween(this.chooseAStat).to({x:newX,y:newY}, 1000, Phaser.Easing.Cubic.Out,true);

    this.text= new Text(game,this.chooseAStat.x,this.chooseAStat.y +10,"caracteristics","#000000","15px japan");
    game.add.tween(this.text.text).to({x:newX + 10,y:newY+10}, 1000, Phaser.Easing.Cubic.Out,true);


    this.text2= new Text(game,this.chooseAStat.x + 10,this.chooseAStat.y-30,"rate of fire : "+game.managerTurret.towers[i].rateOfFire,"#000000","15px japan");
    game.add.tween(this.text2.text).to({x:newX + 10,y:newY+30}, 1000, Phaser.Easing.Cubic.Out,true);

    this.upgradeRateOfFireButton=new Button(game,this.chooseAStat.x + 10,this.chooseAStat.y,"fireSymbol",this.upgradeRateOfFireTurret, this);
    game.add.tween(this.upgradeRateOfFireButton.sprite).to({x:newX + this.chooseAStat.width*.75,y:newY+25}, 1000, Phaser.Easing.Cubic.Out,true);
    this.upgradeRateOfFireButton.sprite.scale.setTo(0.2,0.2);
    

    this.text3= new Text(game,this.chooseAStat.x + 10,this.chooseAStat.y+50,"range : "+game.managerTurret.towers[i].range,"#000000","15px japan");
    game.add.tween(this.text3.text).to({x:newX + 10,y:newY+50}, 1000, Phaser.Easing.Cubic.Out,true);

    this.upgradeRangeButton=new Button(game,this.chooseAStat.x + 10,this.chooseAStat.y,"waterSymbol",this.upgradeRangeTurret, this);
    game.add.tween(this.upgradeRangeButton.sprite).to({x:newX + this.chooseAStat.width*.75,y:newY+45}, 1000, Phaser.Easing.Cubic.Out,true);
    this.upgradeRangeButton.sprite.scale.setTo(0.2,0.2);


    this.text4= new Text(game,this.chooseAStat.x,this.chooseAStat.y+70,"damage : "+game.managerTurret.towers[i].damage,"#000000","15px japan");
    game.add.tween(this.text4.text).to({x:newX + 10,y:newY+70}, 1000, Phaser.Easing.Cubic.Out,true);

    this.upgradeDamageButton=new Button(game,this.chooseAStat.x + 10,this.chooseAStat.y,"natureSymbol",this.upgradeDamageTurret, this);
    game.add.tween(this.upgradeDamageButton.sprite).to({x:newX + this.chooseAStat.width*.75,y:newY+65}, 1000, Phaser.Easing.Cubic.Out,true);
    this.upgradeDamageButton.sprite.scale.setTo(0.2,0.2);
    
    this.elementMenuIsOpen=true; // le menu est crée
    this.canDestroyChooseAState = true;

}


Hud.prototype.destroyMenu=function(){
  
    this.chooseAnElement.kill();
    if(this.chooseAStat != undefined &&this.canDestroyChooseAState){//le dernier des boolean de l'enfer,evite un bug majeur quand on revends une composite apres avoir revendu un elementaire(phaser.min.js)
      this.chooseAStat.kill();
      this.text2.text.destroy();
      this.text3.text.destroy();
      this.text4.text.destroy();
      this.upgradeRateOfFireButton.sprite.kill();
      this.upgradeRangeButton.sprite.kill();
      this.upgradeDamageButton.sprite.kill();
    }
    this.text.text.destroy();
    this.FireButton.sprite.kill();
    this.waterButton.sprite.kill();
    this.natureButton.sprite.kill();
    this.elementMenuIsOpen=false; // le menu est suprimé
    this.canDestroyChooseAState = false;
}
Hud.prototype.destroySend=function(){
    this.buttonSend.sprite.kill();
    this.buttonSend.text.text.destroy();
    this.buttonSendIsOpen=false;
}    

Hud.prototype.pushWaterTurret=function(game){
   if(this.refGame.ressources.gold>= this.refGame.parameters.ressources.changeElementPrice){
        for(var i = 0;i<this.refGame.managerTurret.towers[this.towerIndex].bulletsArray.length;i++ ){
            this.refGame.managerTurret.towers[this.towerIndex].bulletsArray[i].sprite.kill();
       }
       this.refGame.ressources.managerGold(this.refGame,"changeElement");
       this.refGame.managerTurret.towers[this.towerIndex].bullets =[];
       this.refGame.managerTurret.towers[this.towerIndex].sprite.kill();
       this.refGame.managerTurret.towers[this.towerIndex].visualRange.clear();
       this.refGame.managerTurret.towers[this.towerIndex]=new TowerWater(this.refGame,this.refGame.managerTurret.towers[this.towerIndex].sprite.x,this.refGame.managerTurret.towers[this.towerIndex].sprite.y);
       this.explosion=this.refGame.add.sprite(this.newX,this.newY-85,'blueExplosion');
       this.explosion.scale.x = 3;
       this.explosion.scale.y = 3;
       this.explosion.animations.add('splash', ['splash1', 'splash2', 'splash3', 'splash4', 'splash5', 'splash6', 'splash7', 'splash8', 'splash9', 'splash10','splash11','splash12','splash13']);
       this.explosion.animations._anims.splash.killOnComplete=true;
       this.explosion.animations.play('splash',15,false);
       this.deleteOldTurret=true;
   } 
   else{
        this.refGame.cantPutTower.play();
    }
}

Hud.prototype.pushFireTurret=function(game){
    if(this.refGame.ressources.gold>= this.refGame.parameters.ressources.changeElementPrice){
        for(var i = 0;i<this.refGame.managerTurret.towers[this.towerIndex].bulletsArray.length;i++ ){
            this.refGame.managerTurret.towers[this.towerIndex].bulletsArray[i].sprite.kill();
       }
       this.refGame.ressources.managerGold(this.refGame,"changeElement");
       this.refGame.managerTurret.towers[this.towerIndex].bullets =[]; 
       this.refGame.managerTurret.towers[this.towerIndex].sprite.kill();
       this.refGame.managerTurret.towers[this.towerIndex].visualRange.clear();
       this.refGame.managerTurret.towers[this.towerIndex]=new TowerFire(this.refGame,this.refGame.managerTurret.towers[this.towerIndex].sprite.x,this.refGame.managerTurret.towers[this.towerIndex].sprite.y);
       this.explosion=this.refGame.add.sprite(this.newX+20,this.newY-64,'redExplosion');
       this.explosion.animations.add('boom', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10','11']);
       this.explosion.animations._anims.boom.killOnComplete=true;
       this.explosion.animations.play('boom',15,false);
       this.deleteOldTurret=true;   
    }
    else{
        this.refGame.cantPutTower.play();
    }
}

Hud.prototype.pushNatureTurret=function(game){
    if(this.refGame.ressources.gold>= this.refGame.parameters.ressources.changeElementPrice){
       for(var i = 0;i<this.refGame.managerTurret.towers[this.towerIndex].bulletsArray.length;i++ ){
            this.refGame.managerTurret.towers[this.towerIndex].bulletsArray[i].sprite.kill();
       }
       this.refGame.ressources.managerGold(this.refGame,"changeElement");
       this.refGame.managerTurret.towers[this.towerIndex].bullets =[];
       this.refGame.managerTurret.towers[this.towerIndex].sprite.kill();
       this.refGame.managerTurret.towers[this.towerIndex].visualRange.clear();
       this.refGame.managerTurret.towers[this.towerIndex]=new TowerNature(this.refGame,this.refGame.managerTurret.towers[this.towerIndex].sprite.x,this.refGame.managerTurret.towers[this.towerIndex].sprite.y);
       this.explosion=this.refGame.add.sprite(this.newX+34,this.newY-85,'greenExplosion');
       this.explosion.scale.x = 1.2;
       this.explosion.scale.y = 1.2;
       this.explosion.animations.add('grow', ['grow1', 'grow2', 'grow3', 'grow4', 'grow5', 'grow6', 'grow7', 'grow8', 'grow9', 'grow10','grow11','grow12','grow12','grow11','grow10','grow9','grow8','grow7','grow6','grow5','grow4','grow3','grow2','grow1']);
       this.explosion.animations._anims.grow.killOnComplete=true;
       this.explosion.animations.play('grow',30,false);
       this.deleteOldTurret=true;      
    }
    else{
        this.refGame.cantPutTower.play();
    }
}

Hud.prototype.upgradeRateOfFireTurret=function(game){
  if(this.refGame.ressources.gold >= this.refGame.parameters.ressources.upgradeTowerPrice){
    
    this.refGame.managerTurret.towers[this.towerIndex].rateOfFire-=2;
    this.refGame.ressources.managerGold(this.refGame,"upgradeTower");
    console.log(this.refGame.managerTurret.towers[this.towerIndex].rateOfFire)
    this.deleteOldTurret=true;
    this.canDestroyChooseAState = true;
    
  
  }
}
Hud.prototype.upgradeRangeTurret=function(game){
  if(this.refGame.ressources.gold >= this.refGame.parameters.ressources.upgradeTowerPrice){
    
    this.refGame.managerTurret.towers[this.towerIndex].range+=5;
    this.refGame.managerTurret.towers[this.towerIndex].visualRange.graphicsData[0].points[2]=this.refGame.managerTurret.towers[this.towerIndex].range;
    this.refGame.managerTurret.towers[this.towerIndex].visualRange.graphicsData[0].points[3]=this.refGame.managerTurret.towers[this.towerIndex].range;
    
    this.refGame.ressources.managerGold(this.refGame,"upgradeTower");
    console.log(this.refGame.managerTurret.towers[this.towerIndex].range)
    this.deleteOldTurret=true;
    this.canDestroyChooseAState = true;
  
  }
}
Hud.prototype.upgradeDamageTurret=function(game){
  if(this.refGame.ressources.gold >= this.refGame.parameters.ressources.upgradeTowerPrice){
    
    this.refGame.managerTurret.towers[this.towerIndex].damage+=1;
    this.refGame.ressources.managerGold(this.refGame,"upgradeTower");
    console.log(this.refGame.managerTurret.towers[this.towerIndex].damage)
    this.deleteOldTurret=true;
    this.canDestroyChooseAState = true;
    
  
  }
}

Hud.prototype.buttonSendGo=function(game,newX,newY,i){
    this.towerIndex= i;
    this.buttonSend = new Button(game,this.hudTowerCase.x+5,this.hudTowerCase.y+65,"buttonSend",this.send,this)
    game.add.tween(this.buttonSend.sprite).to({x:newX-5,y:newY-115}, 1000, Phaser.Easing.Cubic.Out,true);
    this.buttonSend.text=new Text(game,this.buttonSend.sprite.x+15,this.buttonSend.sprite.y+10,"send","#000000","15px japan");
    game.add.tween(this.buttonSend.text.text).to({x:newX+35,y:newY-90}, 1000, Phaser.Easing.Cubic.Out,true);
    this.buttonSendIsOpen=true;
}
Hud.prototype.send=function(game){//je me suis trompé avec mon super anglais...tous ce qui est nommé send devrait etre nommé sell...
    for(var i = 0;i<this.refGame.managerTurret.towers[this.towerIndex].bulletsArray.length;i++ ){
            this.refGame.managerTurret.towers[this.towerIndex].bulletsArray[i].sprite.kill();
    }
    this.refGame.managerTurret.towers[this.towerIndex].bullets =[];
    if(this.refGame.managerTurret.towers[this.towerIndex].element == "composite"){
        this.refGame.ressources.managerGold(this.refGame,"sendComposite");
        this.refGame.coins.push(new Coins(this.refGame,this.refGame.managerTurret.towers[this.towerIndex].sprite.x,this.refGame.managerTurret.towers[this.towerIndex].sprite.y,this.refGame.parameters.ressources.compositesend+""))

    }
    else{
        this.refGame.ressources.managerGold(this.refGame,"sendElement");
        this.refGame.coins.push(new Coins(this.refGame,this.refGame.managerTurret.towers[this.towerIndex].sprite.x,this.refGame.managerTurret.towers[this.towerIndex].sprite.y,this.refGame.parameters.ressources.elementsend+""))
    }
    // todo : replacé les tiles des tourelles vendu par de stiles walkables
    
    for (var j= 0; j <this.refGame.walkables[i];j ++){
      this.refGame.mergedLayer[(this.refGame.managerTurret.towers[this.towerIndex].sprite.y/32)+1][this.refGame.managerTurret.towers[this.towerIndex].sprite.x/32]=this.refGame.walkables[0];          
    }
    if(this.refGame.go){
      calculeGlobalPathFire(this.refGame,OverPath,'feu',false); // on modifie chaque path
      calculeGlobalPathNature(this.refGame,OverPath,'nature',false);
      calculeGlobalPathWater(this.refGame,OverPath,'eau',false);
    }
    else{
      calculeGlobalPathFire(this.refGame,OverPath,'feu',true); // on modifie chaque path
      calculeGlobalPathNature(this.refGame,OverPath,'nature',true);
      calculeGlobalPathWater(this.refGame,OverPath,'eau',true);
    }
    for(var i= 0; i  <  this.refGame.waveArray.length;i++){
      this.refGame.waveArray[i].pathfinder.setTileCost(0, 0); 
      this.refGame.waveArray[i].redefinedPath(this.refGame,this.refGame.ennemiDestinationFinal,i);
    }  
    this.refGame.managerTurret.towers[this.towerIndex].visualRange.clear();
    this.refGame.managerTurret.towers[this.towerIndex].sprite.kill();
    if(this.refGame.managerTurret.towers[this.towerIndex].element!="composite"){
      this.canDestroyChooseAState=true;
    }
    else{
      this.canDestroyChooseAState=false;
    } 
    this.refGame.managerTurret.towers.splice(this.towerIndex,1)
    if(this.elementMenuIsOpen){
      this.destroyMenu();
    }
    if(this.buttonSendIsOpen){
    this.destroySend();
    }
    this.deleteOldTurret=false
}
Hud.prototype.checkNextWave=function(game,waveId,exitOrEnter){// cette fonction prends en troisieme parametre un chaine de charactere qui definira si il faut lancé le compteur d'ennemi ou le reset 
  if(game.parameters.waves.world1[waveId]!=game.parameters.waves.world1[waveId.length-1]&&game.waveArray.length == 0){
    if(exitOrEnter=="onEnter"){
      for (var i = 0; i < game.parameters.waves.world1[waveId].length; i++) {
        if(game.parameters.waves.world1[waveId][i]==1){
          this.showNextWaveText.numberOfEnemy1++;
        }
        else if(game.parameters.waves.world1[waveId][i]==2){
          this.showNextWaveText.numberOfEnemy2++;
        }
        else if(game.parameters.waves.world1[waveId][i]==3){
          this.showNextWaveText.numberOfEnemy3++;
        }   
      };
      this.textOfEnemy1=new Text(game,1300,590,this.showNextWaveText.numberOfEnemy1+"","#FFFFFF","20px japan");
      this.textOfEnemy2=new Text(game,1300,620,this.showNextWaveText.numberOfEnemy2+"","#FFFFFF","20px japan");
      this.textOfEnemy3=new Text(game,1300,670,this.showNextWaveText.numberOfEnemy3+"","#FFFFFF","20px japan");
      game.add.tween(this.textOfEnemy1.text).to({x:675}, 1000, Phaser.Easing.Cubic.Out,true);
      game.add.tween(this.textOfEnemy2.text).to({x:675}, 1000, Phaser.Easing.Cubic.Out,true);
      game.add.tween(this.textOfEnemy3.text).to({x:675}, 1000, Phaser.Easing.Cubic.Out,true);
    }
    else if(exitOrEnter=="onExit"){
      this.showNextWaveText.numberOfEnemy1=0;
      this.showNextWaveText.numberOfEnemy2=0;
      this.showNextWaveText.numberOfEnemy3=0;
      game.add.tween(this.textOfEnemy1.text).to({x:1300}, 1000, Phaser.Easing.Cubic.Out,true);
      game.add.tween(this.textOfEnemy2.text).to({x:1300}, 1000, Phaser.Easing.Cubic.Out,true);
      game.add.tween(this.textOfEnemy3.text).to({x:1300}, 1000, Phaser.Easing.Cubic.Out,true);
    }
  } 
}
Hud.prototype.changeWindDirection=function(){
  var multi = Math.floor((this.speedParticlesX + 200) / 4),
  frag = (Math.floor(Math.random() * 100) - multi);
  this.speedParticlesX = this.speedParticlesX + frag;
  if (this.speedParticlesX > 200) this.speedParticlesX = 150;
  if (this.speedParticlesX < -200) this.speedParticlesX = -150;
  this.setXSpeed(this.aquaParticlesBack, this.speedParticlesX);
  this.setXSpeed(this.aquaParticlesMid, this.speedParticlesX);
  this.setXSpeed(this.aquaParticlesFront, this.speedParticlesX);
}
Hud.prototype.setXSpeed=function(emitter,speed){
    emitter.setXSpeed(speed - 20, speed);
    emitter.forEachAlive(this.setParticleXSpeed, this, speed);
}
Hud.prototype.setParticleXSpeed=function(particle, speed) {
    particle.body.velocity.x = speed - Math.floor(Math.random() * 30);
}

Hud.prototype.bivelTween=function(game,exitOrEnter){
  if(exitOrEnter=="goIn"){
    game.add.tween(this.aquaBivelButton.sprite).to({x:600}, 1000, Phaser.Easing.Cubic.Out,true);
    game.add.tween(this.fireBivelButton.sprite).to({x:740}, 1000, Phaser.Easing.Cubic.Out,true);
    game.add.tween(this.natureBivelButton.sprite).to({x:880}, 1000, Phaser.Easing.Cubic.Out,true);
  }
  else if(exitOrEnter=="goOut"){
    game.add.tween(this.aquaBivelButton.sprite).to({x:1500}, 1000, Phaser.Easing.Cubic.Out,true);
    game.add.tween(this.fireBivelButton.sprite).to({x:1500}, 1000, Phaser.Easing.Cubic.Out,true);
    game.add.tween(this.natureBivelButton.sprite).to({x:1500}, 1000, Phaser.Easing.Cubic.Out,true);
  }

}
Hud.prototype.aquaBivelF=function(game,exitOrEnter){
  if(!this.stopParticlesAqua&&this.mana>0){
    this.aquaParticlesBack.start(false, 14000, 20); //on lance les particules de neiges
    this.aquaParticlesMid.start(false, 12000, 40);
    this.aquaParticlesFront.start(false, 6000, 1000); 
    this.stopParticlesAqua = true;
  }
  else if(this.stopParticlesAqua||exitOrEnter=="stop"){
    this.aquaParticlesBack.destroy(); //je detruis les particles existantes et je recrée un emiteur pour pouvoir les relancer(c'est le seu moyen que j'ai trouvé pour detruire des particules existantes)
    this.aquaParticlesMid.destroy();
    this.aquaParticlesFront.destroy();
    this.createAquaParticles();
    this.stopParticlesAqua = false;
  }
}
Hud.prototype.fireBivelF=function(game,exitOrEnter){
  if(!this.stopParticlesFire&&this.mana>0){
    this.fireParticles.start(false, 200, 1);
    this.stopParticlesFire = true;
  }
  else if(this.stopParticlesFire||exitOrEnter=="stop"){
    this.fireParticles.start(true,1,1);
    this.stopParticlesFire = false;
  }
}
Hud.prototype.natureBivelF=function(game,exitOrEnter){
    if(!this.stopParticlesNature&&this.mana>0 &&this.nexusLife <=this.refGame.parameters.ressources.lifemax ){
    this.natureParticles.start(false, 2000, 200);
    this.stopParticlesNature = true;
  }
  else if(this.stopParticlesNature||exitOrEnter=="stop"){
    this.natureParticles.start(true,1,1);
    this.stopParticlesNature = false;
  };
}
Hud.prototype.updateBivelF=function(game){
  this.fireParticles.emitX=game.marker.x+16;
  this.fireParticles.emitY=game.marker.y+16;
  this.manaParticles.emitX=game.marker.x+16;
  this.manaParticles.emitY=game.marker.y+16;
  this.manaParticles.setYSpeed(650-game.marker.y,650-game.marker.y);
  this.manaParticles.setXSpeed(70-game.marker.x,90-game.marker.x);
  if(this.stopParticlesNature&&this.mana>0&&this.nexusLife <=game.parameters.ressources.lifemax){
    this.mana-=0.05;
    this.nexusLife+=0.05; // avec le pouvoir de la nature on regagen de la vie
    this.delayForManaUp=0;
  }
  if(this.stopParticlesAqua&&this.mana>0){
    this.mana-=0.2;
    this.slowEnemy=2;//la glace ralenti les ennemis
    this.delayForManaUp=0;  
  }
  else{
    this.slowEnemy=1;
  }
  if(this.stopParticlesFire&& this.mana>0){
    this.mana-=0.1;
    game.physics.overlap(this.fireParticles, game.enemiesGroup, this.collisionFireParticles, null, this);
    this.delayForManaUp=0; 
  }
  if(this.mana<0){
     this.mana=0;
     game.hud.aquaBivelF(game,"stop");
     game.hud.fireBivelF(game,"stop");
     game.hud.natureBivelF(game,"stop");
  }
}
Hud.prototype.collisionFireParticles=function(particles,enemy,game){
  for(var i = 0; i<this.refGame.waveArray.length; i++){
    if(this.refGame.waveArray[i].sprite === enemy){
      this.refGame.waveArray[i].hp-=0.03;
    }
     if(this.refGame.waveArray[i].hp <= 0){
        this.refGame.coins.push(new Coins(this.refGame,this.refGame.waveArray[i].sprite.x,this.refGame.waveArray[i].sprite.y,this.refGame.waveArray[i].goldWin+""));  
        this.refGame.waveArray[i].lifeBar.clear();
        this.refGame.waveArray[i].currentLife.clear();
        enemy.kill();
        this.refGame.ressources.managerGold(this.refGame,"enemyKill",i);
        this.refGame.waveArray.splice(i, 1);            
        i--;
    }
  }
} 
Hud.prototype.regainManaF=function(game){
  if(this.delayForManaUp==0){
    this.oldPosMarkerY=game.marker.y;
    this.oldPosMarkerX=game.marker.x
  }
  this.delayForManaUp++;
  if(this.delayForManaUp>50){
    if(game.marker.x==this.oldPosMarkerX&&this.oldPosMarkerY==game.marker.y&&this.mana < game.parameters.ressources.manamax){
      this.mana+=0.05;
      if(this.stopParticlesMana)
      this.stopParticlesMana=false;
    }
    else{
      this.stopParticlesMana=true;
      this.delayForManaUp=0;
    }
  }
  if(this.stopParticlesMana){
    this.manaParticles.start(false, 5000, 200);
    this.stopParticlesMana=true;
  }
  else{
    
  }
}