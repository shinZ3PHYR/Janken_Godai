
window.addEventListener("load",init);

function init(){
    var game = new Phaser.Game(1024, 720, Phaser.CANVAS, 'gameContainer', 
                                { 
                                     
                                    
                                    
                           });
    game.state.add('run', run);
    game.state.add('menu', menu);
    game.state.add('stageSelection',menu.stageSelection);
    game.state.add('looseScreen',looseScreen);
    game.state.add('victoryScreen',victoryScreen);
    game.parameters = httpGetData('config/parameters.json');
    game.score={
        time:0,
        remainingMoney:0
    }
    game.state.start('menu');
    game.musicIsPlayed={
        gameOverSong:false,
        titleTheme:true,
        world1Loop:false,
    }
}
//######  #     # #     # 
//#     # #     # ##    # 
//#     # #     # # #   # 
//######  #     # #  #  # 
//#   #   #     # #   # # 
//#    #  #     # #    ## 
//#     #  #####  #     # 
var run = {
    preload:function(game){
        //SOUNDS
        game.load.audio('world1loop2','assets/sounds/world1Action.mp3');
        game.load.audio('world1loop','assets/sounds/world1.mp3');
        game.load.audio('cantPutTower','assets/sounds/cantPutTower.mp3');
        //JSON
        game.load.tilemap('w1s1', 'config/world1Level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('w1s2', 'config/world1Level3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('w2s1', 'config/world2Level1.json', null, Phaser.Tilemap.TILED_JSON); 
        game.load.tilemap('w2s2', 'config/world2Level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('w3s1', 'config/world3Level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('w3s2', 'config/world3Level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.atlas('kodama', 'assets/images/kodama_spritesheet.png', 'config/kodama.json');
        game.load.atlas('bulletWater', 'assets/images/bulletWater.png', 'config/bulletWater.json');
        game.load.atlas('bulletFire', 'assets/images/bulletFire.png', 'config/bulletFire.json');
        game.load.atlas('kodama_eau', 'assets/images/monsterWater.png', 'config/monsterWater.json');
        game.load.atlas('kodama_feu', 'assets/images/feu_spritesheet.png', 'config/feu_spritesheet.json');
        game.load.atlas('spiritOfWater', 'assets/images/spiritOfWater.png', 'config/spiritOfWater.json');
        game.load.atlas('spiritOfFire', 'assets/images/spiritOfFire.png', 'config/spiritOfFire.json');
        game.load.atlas('spiritOfNature', 'assets/images/spiritOfNature.png', 'config/spiritOfNature.json');
        game.load.atlas('panda', 'assets/images/panda.png', 'config/panda.json');
        game.load.atlas('spider', 'assets/images/spider.png', 'config/spider.json');
        game.load.atlas('slim', 'assets/images/slim.png', 'config/slim.json');
        game.load.atlas('blueExplosion', 'assets/images/splash.png', 'config/splash.json');
        game.load.atlas('redExplosion', 'assets/images/redExplosion.png', 'config/explosion.json');
        game.load.atlas('greenExplosion', 'assets/images/growNature.png', 'config/growNature.json');
        //IMAGES
        game.load.spritesheet('snowflakes', 'assets/images/snowflakes.png', 17, 17);
        game.load.spritesheet('snowflakes_large', 'assets/images/snowflakes_large.png', 64, 64);
        game.load.image('tiles', 'assets/images/newTile.png');
        game.load.image('blur', 'assets/images/blur.png');
        game.load.image('blurBlue', 'assets/images/blurBlue.png');
        game.load.image('tiles2', 'assets/images/newTile2.png');
        game.load.image('tiles3', 'assets/images/newTile3.png');
        game.load.image("bg3","assets/images/bg3.jpg");
        game.load.image('buttonSend',"assets/images/butonSend.png")
        game.load.spritesheet('coin', 'assets/images/coin.png',50,50,7);
        game.load.image('fireSymbol', 'assets/images/fireSymbol.png');
        game.load.image('natureSymbol','assets/images/natureSymbol.png');
        game.load.image('buttonStart','assets/images/buttonStart.png');
        game.load.image('nextWave','assets/images/nextWave.png')
        game.load.image('towerComposite','assets/images/towerComposite.png');
        game.load.image('towerWater','assets/images/towerWater.png');
        game.load.image('towerNature','assets/images/towerNature.png');
        game.load.image('towerFire','assets/images/towerFire.png');
        game.load.image('bullet','assets/images/bullet.png');
        game.load.image('waypoint','assets/images/bullet.png');
        game.load.image('waypoint_rouge','assets/images/waypoint_rouge.png');
        game.load.image('waypoint_bleu','assets/images/waypoint_bleu.png');
        game.load.image('waypoint_vert','assets/images/waypoint_vert.png'); 
        game.load.image('samurai','assets/images/samurai.png');
        game.load.image('hudBody','assets/images/assetsHud/Body.png');
        game.load.image('aquaBivel','assets/images/assetsHud/Aqua.png');
        game.load.image('fireBivel','assets/images/assetsHud/fire.png');
        game.load.image('natureBivel','assets/images/assetsHud/wood.png');
        game.load.image('towerCase','assets/images/assetsHud/towerCase.png');
        game.load.image('jauges','assets/images/assetsHud/jauges.png');
        game.load.image('showNextWave','assets/images/assetsHud/showNextWave.png');    
        console.log('RUN PRELOADED');
    },
    create:function(game){
//-------------------------------ELAPSED TIME------------------
    
        game.elapsedTime+=game.deltaTime;
//-------------------------------partie AUDIO----------------------------------------------------------
        soundStoper(menu.titleTheme,game.musicIsPlayed.titleTheme);
        soundStoper(looseScreen.gameOverSong,game.musicIsPlayed.gameOverSong);
        game.yooSound=game.add.audio('yoo')
        game.yooSound.play("",0,1)   
        game.world1loop2=game.add.audio('world1loop2');
        game.cantPutTower=game.add.audio('cantPutTower');
        game.musicIsPlayed.world1Loop=true; //la musique du monde un est joué on le precise dans musiqueIsPlayed
//----------------------------------------------------MERGED LAYERS-------------------------------------                
        
        game.mergedLayer = [];
        game.map = game.add.tilemap(game.mapToLoad);
        game.map.addTilesetImage(game.tileSetNameToLoad,  game.tileSetToLoad);
        for (var i = 0 ; i < game.map.layers[0].height ; i++){
            game.mergedLayer.push([]);
            for (var j = 0 ; j < game.map.layers[0].width ; j++){
                game.mergedLayer[i].push(0);
            }
        }
        for (var i = 0 ; i < game.map.layers.length ; i++){
            game.map.createLayer(game.map.layers[i].name);

            for (var y = 0 ; y  < game.map.layers[i].data.length ; y++){
                for (var x = 0 ; x < game.map.layers[i].data[y].length ; x++){
                    if (!!game.map.layers[i].data[y][x] && game.map.layers[i].data[y][x].index != -1){
                        game.mergedLayer[y][x] =  game.map.layers[i].data[y][x].index;
                    }
                }
            } 
        }   

//-------------------------CREATION DES TABLEAU DE LAYERS WALKABLES-----------------
       //WALKABLES
        game.walkables = [];
        game.showWalkables=[];//on push dans ce tableau les markers verts qui montre ou l'on peut poser une tourelle
        createArrayLayers(game,0,game.walkables,"walkables");
        game.waterWalkables = [];
        createArrayLayers(game,1,game.waterWalkables,"waterwalkables");
        game.fireWalkables = [];
        createArrayLayers(game,2,game.fireWalkables,"firewalkables");
        game.natureWalkables = [];
        createArrayLayers(game,3,game.natureWalkables,"earthwalkables");
        game.unwalkables = [];
        createArrayLayers(game,4,game.unwalkables,"unwalkables");

//----------------------------------------------------------------------------------
        game.frame = 0;
        game.layer = game.map.createLayer('unwalkables');
        game.layer.resizeWorld();
        game.enemiesGroup = game.add.group();
        game.waveArray = [];
        game.bulletsGroup = game.add.group();
        game.waypointsSprites = game.add.group();
        game.overPathWater;
        game.overPathNature;
        game.overPathFire;
        game.waypointEau=[];
        game.waypointNature=[];
        game.waypointFeu=[];
        game.coins=[];
        game.spriteCoins=game.add.group();
        game.marker = game.add.graphics();
        game.marker.lineStyle(2, 0x000000, 1);
        game.marker.drawRect(0, 0, 32, 32);
        //Prévisualisation des trajectoires de chaques elements naturels
        calculeGlobalPathFire(game,OverPath, 'feu',true);
        calculeGlobalPathNature(game,OverPath, 'nature',true);
        calculeGlobalPathWater(game,OverPath, 'eau',true);
        game.hud= new Hud(game);
//-------------------------------Ressources-------------------------------------------
        game.ressources={
            gold: game.parameters.ressources.goldforbegin,
            mana: game.parameters.ressources.manamax,
            cashInPocketHud: new Text(game,110,670,game.parameters.ressources.goldforbegin+"","#FFFFFF","25px japan"),
            managerGold:function(game,action,enemyIndex){
            if(action == "buyComposite"){
                this.gold-= game.parameters.ressources.compositeprice;
            }
            else if(action == "changeElement"){
                this.gold-= game.parameters.ressources.changeElementPrice;
            }
            else if(action == "upgradeTower"){
                this.gold-= game.parameters.ressources.upgradeTowerPrice;
            }
            else if(action == "sendComposite"){
                this.gold+= game.parameters.ressources.compositesend;
            }
            else if(action == "sendElement"){
                this.gold+= game.parameters.ressources.elementsend;
            }
            else if(action == "enemyKill"){
                this.gold+=game.waveArray[enemyIndex].goldWin;
            }    
                this.cashInPocketHud.text.destroy();
                this.cashInPocketHud.t=this.gold+"";
                this.cashInPocketHud.text=game.add.text(110,670,this.cashInPocketHud.t,this.cashInPocketHud.style);
            },
            animCoins:function(game){ 
                for(var i = 0;i< game.coins.length;i++){
                    game.coins[i].sprite.y--;
                    game.coins[i].goldText.y--;
                    if(game.coins[i].y-game.coins[i].sprite.y==30){
                        game.coins[i].goldText.destroy();
                        game.coins[i].sprite.kill();
                        game.coins.splice(i,1);
                        
                    }       
                }
            }  
        }
       
//-----------------------Manager de tourelles-------------------------------------------   
        managerTurret(game);
//-----------------------------MANAGER DE WAVE------------------------------------
        game.waveId=0;
        var enemyId=0;
        game.managerWave={
            frameToPop:50,
            prepareNextwave:true,
            world1:{
                waves: game.currentWaves,//toute les waves
                wavesNumber:game.currentWavesNumber ,//nombre de wave au total dans le monde
                wave:game.currentWaves[game.waveId],//wave actuellement parcouru
                enemiesNumber:game.currentWaves[game.waveId].length,//nombre total d'ennemi dans la wave
                enemy:game.currentWaves[game.waveId][enemyId], //id de l'ennemi a push
                
            },
            runWave:function runWave(game,enemiesNumber){
                //------------------------------Les ennemies arrivent--------------------------------                
                if(!(game.frame % this.frameToPop)&& enemyId < enemiesNumber){
                    if(game.managerWave.world1.enemy==1){
                        var enemy = new Enemy1(game,game.ennemiSpawn,game.ennemiDestinationFinal )
                        game.waveArray.push(enemy);   
                    }
                    else if(game.managerWave.world1.enemy==2){
                        game.waveArray.push(new Enemy2(game,game.ennemiSpawn, game.ennemiDestinationFinal));   
                    }
                    else if(game.managerWave.world1.enemy==3){
                        game.waveArray.push(new Enemy3(game,game.ennemiSpawn, game.ennemiDestinationFinal));   
                    }
                    enemyId++;
                    if(game.parameters.waves.world1[game.waveId]==game.currentWaves[game.waveId.length-1]&&game.waveArray.length == 0){
                    
                    }
                    else{
                        game.managerWave.world1.enemy = game.currentWaves[game.waveId][enemyId];
                        this.prepareNextwave=true;      
                    }
                }
                    
                //------------------------------------la vague est terminé--------------------------------------                
                if(enemyId==enemiesNumber && game.waveArray.length == 0){
                   this.nextWave(game);

                }
                //------------------------------------------------------------------------------------------------                
                for (var i=0; i< game.waveArray.length;i++){
                    game.waveArray[i].direction.check();
                    game.waveArray[i].displayLife(game);
                    if((game.waveArray[i].sprite.x == game.waveArray[i].destinationFinal.x*32 && 
                    game.waveArray[i].sprite.y == game.waveArray[i].destinationFinal.y*32)||(game.waveArray[i].id==3&&game.waveArray[i].path.length==0) ){
                        game.waveArray[i].sprite.kill();
                        game.waveArray.splice(i,1);
                        game.hud.nexusLife-=game.parameters.ressources.nexusdamage;
                        if(game.hud.nexusLife <= 0){
                            game.state.start('looseScreen')
                        }
                    }
                }
            },
            nextWave: function(game){
                if(game.waveId < game.currentWavesNumber){ 
                    if(this.prepareNextwave){
                        if(game.hud.stopParticlesAqua)
                            game.hud.aquaBivelF(game,"stop")
                        if(game.hud.stopParticlesFire)           //||game.hud.stopParticlesFire||game.hud.stopParticlesNature){
                            game.hud.fireBivelF(game,"stop")
                        if(game.hud.stopParticlesNature)     
                            game.hud.natureBivelF(game,"stop")
                        game.hud.bivelTween(game,"goOut");
                        game.add.tween(game.nextWaveButton).to({x:730}, 2000, Phaser.Easing.Cubic.Out,true);
                        game.world1loop2.stop();
                        game.waveId++;
                        game.managerWave.world1.wave=game.currentWaves[game.waveId]
                        enemyId = 0;
                        if(game.currentWaves[game.waveId]==game.currentWaves[game.waveId.length-1]&&game.waveArray.length == 0){
                            game.bg3= game.add.sprite(3000,0,"bg3");
                            game.add.tween(game.bg3).to({x:-200}, 1000, Phaser.Easing.Cubic.Out,true);
                            
                        }
                        else{
                            game.world1Loop.play();
                            game.managerWave.world1.enemy = game.currentWaves[game.waveId][enemyId];
                            game.managerWave.world1.enemiesNumber=game.currentWaves[game.waveId].length;
                            game.clickOnNextWave=true;
                           
                            game.chrono = game.time.events.resume();
                            game.chrono = game.time.events.add(50000, beginWave,this);
    

                            
                            game.go=false;
                            this.prepareNextwave=false;
                            calculeGlobalPathFire(game,OverPath,'feu',true); // on modifie chaque path
                            calculeGlobalPathNature(game,OverPath,'nature',true);
                            calculeGlobalPathWater(game,OverPath,'eau',true);
                            game.add.tween(game.hud.showNextWave).to({x:550}, 1000, Phaser.Easing.Cubic.Out,true); 
                            game.hud.checkNextWave(game,game.waveId,"onEnter");//vient regarder le nombre et le type d'ennemi de la prochaine vague
                        }
                    }
                 }
            },            
            update: function (game){
                if(game.go){
                    game.managerWave.runWave(game,game.managerWave.world1.enemiesNumber);
                }
                for(var i = 0 ; i<game.currentVariationFrameToPop.length;i++){
                    if(game.currentVariationFrameToPop[i][0]==game.waveId&&game.currentVariationFrameToPop[i][1]==enemyId){
                        this.frameToPop = game.currentVariationFrameToPop[i][2];
                    }     
               }
               if(game.bg3.x==-200){
                game.score.remainingMoney = game.ressources.gold;
                game.state.start("victoryScreen")
               }
              
            }
        }    
        

//-------------------------------Time EVENTS--------------------------------------
        game.go=false;//des que go passe a true la wave commence
        game.clickOnNextWave=true;//si jamais on click sur le bouton next wave;
        game.canShowWalkables=false;//bool qui permet de check si on peut montrer les walkables quand on drag une tourelle(pour voir ou on peut la poser)
        function beginWave(){
            
            game.hud.bivelTween(game,"goIn");
            game.add.tween(game.nextWaveButton).to({x:1500}, 100, Phaser.Easing.Cubic.Out,true);
            game.add.tween(game.hud.showNextWave).to({x:1300}, 1000, Phaser.Easing.Cubic.Out,true);   
            game.hud.checkNextWave(game,game.waveId,"onExit");
            game.go=true;//les monstres commencent a venir sur la map
            

            game.chrono=null;
            if(game.clickOnNextWave){
                holdOn(game);//animation avec les samurai et le texte : "hold on"
                game.world1Loop.stop();
                game.world1loop2.play("",0,1,true);
                for (var i=0; i< game.waypointEau.length;i++){
                    game.waypointEau[i].kill()
                    }
                for (var i=0; i< game.waypointFeu.length;i++){
                    game.waypointFeu[i].kill()
                }
                for (var i=0; i< game.waypointNature.length;i++){
                    game.waypointNature[i].kill()
                }
            }
        }   
        function clickOnNextWave(){
           game.chrono = game.time.events.resume();
           game.chrono=game.time.events.add(1000, beginWave, this);
        } 
        game.chrono = game.time.events.resume();
        game.chrono = game.time.events.add(50000, beginWave);
        
        

        game.screenChrono ={
            text:(game.chrono.delay|0) +"",
            style :{ font: "22px japan", fill: "#FFFFFF", align: "center" },
            chrono:game.add.text(500,850,this.text,this.style),
        }   

//--------------------------------------SCREEN LOADER-------------------------------
        game.nextWaveButton= game.add.button(1500,630,'nextWave',clickOnNextWave);
        game.bg3={//preparation de l'ecrand de victoire
            x:0
        } 
        game.add.tween(game.hud.showNextWave).to({x:550}, 1000, Phaser.Easing.Cubic.Out,true,2000);
        game.bg2 = game.add.sprite(0,0,'bg2');
        game.add.tween(game.bg2).to({x:-game.bg2.width}, 1000, Phaser.Easing.Cubic.Out,true,3000);
        var text = "Loading";
        var style = { font: "200px jankenFont", fill: "#000000", align: "center" };
        game.text = game.add.text(game.world.centerX-300,200 , text, style);
        game.add.tween(game.text).to({x:3000}, 2000, Phaser.Easing.Cubic.Out,true,2000);
        console.log("RUN CREATED");
  
//-----------------------------------------------------------------------------------------

    },    
    update:function(game){
        game.frame ++ ;
        game.ressources.animCoins(game);//animation des coins en hauteurs et splice de celles ci
            
        if(game.chrono!=null){                                                                              
            game.screenChrono.chrono.destroy();
            if(!game.go){
                game.screenChrono.text="remaining time : " + ((game.time.events.duration/100)|0+"");                                    //C'est ici que j'affiche le chronometre
                game.screenChrono.chrono = game.add.text(755,560,game.screenChrono.text,game.screenChrono.style);//    
            }                                                            //
        }
        else{
            if(game.go){
                game.screenChrono.chrono.destroy();
                if(game.currentWaves[game.waveId])
                game.screenChrono.text="wave : " +(game.waveId+1) +" / " +(game.currentWaves.length);
                game.screenChrono.chrono = game.add.text(755,560,game.screenChrono.text,game.screenChrono.style);
            }

        }    
        if(game.bg2.x==-game.bg2.width){  // le je commence a partir de ce moment
            game.hud.checkNextWave(game,0,"onEnter");//on check le nombre d'ennemi de la premiere vague
            game.add.tween(game.nextWaveButton).to({x:730}, 2000, Phaser.Easing.Cubic.Out,true);
            game.world1Loop=game.add.audio('world1loop');
            game.world1Loop.play("",0,1,true);
            game.bg2.kill();
            game.bg2.x=0;
        }
        game.managerWave.update(game);
        game.managerTurret.update(game,TowerComposite,game.marker.x,game.marker.y - 32,Bullet);
        game.physics.overlap(game.bulletsGroup, game.enemiesGroup, collisionHandler, null, this);
        game.marker.x = game.layer.getTileX(game.input.activePointer.worldX) * 32;
        game.marker.y = game.layer.getTileY(game.input.activePointer.worldY) * 32;
        for (var i =0; i <game.waveArray.length; i++) {
            game.waveArray[i].regainLife(game,i);
        };
        game.hud.update(game);      
    }
       
};
//#    # ###### #    # #    # 
//##  ## #      ##   # #    # 
//# ## # #####  # #  # #    # 
//#    # #      #  # # #    # 
//#    # #      #   ## #    # 
//#    # ###### #    #  ####  
var menu = {
    preload:function(game){
        game.load.audio('titleTheme', ["assets/sounds/titleTheme.mp3"]);
        game.load.audio('zen', ["assets/sounds/zen.mp3"]);
        game.load.image('bg1','assets/images//bg1.jpg');
        game.load.image('waterSymbol','assets/images/waterSymbol.png');
        game.load.image('fireSymbol', 'assets/images/fireSymbol.png');
        game.load.image('natureSymbol','assets/images/natureSymbol.png');
        game.load.image('buttonStart','assets/images/buttonStart.png');
        game.load.image('bg2','assets/images/bg2.jpg');
        game.load.audio('yoo','assets/sounds/yoo.mp3');
        console.log("MENU PRELOADED")
    },
    zenSound:"",
    titleTheme:"",
    create :function(game){
        soundStoper(looseScreen.gameOverSong,game.musicIsPlayed.gameOverSong);
        //ADD IMAGE
        this.titleTheme=game.add.audio('titleTheme');
        this.titleTheme.play("",0,1,true);
        game.musicIsPlayed.titleTheme=true,
        this.zenSound=game.add.audio('zen').play();
        game.bg1=game.add.sprite(0,0,'bg1')
        game.waterSymbol = game.add.sprite(game.world.centerX-50,-100,'waterSymbol');
        game.fireSymbol=game.add.sprite(game.world.centerX-200-50,-150,'fireSymbol');
        game.natureSymbol=game.add.sprite(game.world.centerX+200-50,-200,'natureSymbol');
        game.buttonStart=new Button(game,-200,400,'buttonStart',this.goModeNormal)
        var text = "JANKEN GODAI";
        var style = { font: "100px jankenFont", fill: "#000000", align: "center" };
        game.text = game.add.text(230,30 , text, style);
        game.add.tween(game.waterSymbol).to({y:150}, 2000, Phaser.Easing.Bounce.Out,true);
        game.add.tween(game.fireSymbol).to({y:150}, 2000, Phaser.Easing.Bounce.Out,true);
        game.add.tween(game.natureSymbol).to({y:150}, 2000, Phaser.Easing.Bounce.Out,true);
        game.add.tween(game.buttonStart.sprite).to({x:560}, 2000, Phaser.Easing.Cubic.Out,true);
        //DONE
        console.log("MENU CREATED");

    },
    update:function(game){ 

    },
    particlesNature:function(){
        this.game.currentStage= "w1s1";//world1Stage1
        checkForNextStage(this.game);//on look une premiere fois le stage actuelle (pour le moment toujours world1 stage 1 tant qu'il n'y a as de sauvegarde)
        this.game.state.start('run');
    },
    particlesWater:function(){
        this.game.currentStage= "w3s1";
        checkForNextStage(this.game);
        this.game.state.start('run');
    },
    particlesFire:function(game){
        this.game.currentStage= "w2s1";
        checkForNextStage(this.game);
        this.game.state.start('run');
    },
    goModeNormal:function(game){ 
        this.game.state.start('stageSelection')
    }, 
// #####                                                                   
//#     # #####   ##    ####  ######     ####  ###### #      ######  ####  
//#         #    #  #  #    # #         #      #      #      #      #    # 
// #####    #   #    # #      #####      ####  #####  #      #####  #      
//      #   #   ###### #  ### #              # #      #      #      #      
//#     #   #   #    # #    # #         #    # #      #      #      #    # 
// #####    #   #    #  ####  ######     ####  ###### ###### ######  ####            
    stageSelection:{
        create:function(game){
            this.zenSound=game.add.audio('zen').play();
            game.bg1 = game.add.sprite(0,0,'bg1');
            game.buttonStart=game.add.sprite(560,400,'buttonStart');
            game.bg2 = game.add.sprite(-1024,0,'bg2');
            game.waterSymbol = new Button(game,game.world.centerX-50,150,'waterSymbol',menu.particlesWater);
            game.fireSymbol=new Button(game,game.world.centerX-200-50,150,'fireSymbol',menu.particlesFire);
            game.natureSymbol=new Button(game,game.world.centerX+200-50,150,'natureSymbol',menu.particlesNature);
            game.add.tween(game.bg2).to({x:0,angle:360}, 2000, Phaser.Easing.Cubic.Out,true);
            game.add.tween(game.waterSymbol.sprite).to({x:0,angle:360}, 2000, Phaser.Easing.Cubic.Out,true)
            .to({y:500}, 1000, Phaser.Easing.Cubic.Out,true);
            game.add.tween(game.fireSymbol.sprite).to({x:0,angle:360}, 2000, Phaser.Easing.Cubic.Out,true)
            .to({y:325}, 1000, Phaser.Easing.Cubic.Out,true);
            game.add.tween(game.natureSymbol.sprite).to({x:0,angle:360}, 2000, Phaser.Easing.Cubic.Out,true);
            var text = "Stage Selection";
            var style = { font: "100px jankenFont", fill: "#000000", align: "center" };
            game.text = game.add.text(230,30 , text, style);
            var text1 = "World 1";
            var style1 = { font: "50px jankenFont", fill: "#00680E", align: "center" };
            game.text1 = game.add.text(-200,160 , text1, style1);
            var text2 = "World 2";
            var style2 = { font: "50px jankenFont", fill: "#ED0000", align: "center" };
            game.text2 = game.add.text(-200,360 , text2, style2);
            var text3 = "World 3";
            var style3 = { font: "50px jankenFont", fill: "#1000F2", align: "center" };
            game.text3 = game.add.text(-200,510 , text3, style3);
            game.add.tween(game.text1).to({x:140}, 2000, Phaser.Easing.Cubic.Out,true,2000);
            game.add.tween(game.text2).to({x:140}, 2000, Phaser.Easing.Cubic.Out,true,2000);
            game.add.tween(game.text3).to({x:140}, 2000, Phaser.Easing.Cubic.Out,true,2000);
        },
        update:function(game){

        },


    },
};
// #####                                                      
//#     #   ##   #    # ######     ####  #    # ###### #####  
//#        #  #  ##  ## #         #    # #    # #      #    # 
//#  #### #    # # ## # #####     #    # #    # #####  #    # 
//#     # ###### #    # #         #    # #    # #      #####  
//#     # #    # #    # #         #    #  #  #  #      #   #  
// #####  #    # #    # ######     ####    ##   ###### #    # 
looseScreen={
    gameOverSong:"",
    preload:function(game){
        game.load.image("gameOverImage","assets/images/gameOver.jpg");
        game.load.audio("gameOverSong","assets/sounds/gameOverSong.mp3");
        game.load.image('tryAgain','assets/images/buttonStart.png');
        game.load.image('returnToMenu','assets/images/buttonStart.png');
    },
    create:function(game){
        soundStoper(game.world1loop2,game.musicIsPlayed.world1Loop);
        this.gameOverSong=game.add.audio('gameOverSong');
        this.gameOverSong.play();
        game.musicIsPlayed.gameOverSong=true;
        game.bg1=game.add.sprite(0,0,"gameOverImage");
        game.tryAgain=game.add.button(560,400,'tryAgain',this.tryAgain);
        game.returnToMenu=game.add.button(560,450,'tryAgain',this.returnToMenu);
        var text = "Game Over";
        var style = { font: "100px jankenFont", fill: "#000000", align: "center" };
        game.text = game.add.text(-500,270 , text, style);
        game.add.tween(game.text).to({x:40}, 1000, Phaser.Easing.Cubic.Out,true,2000);
    },
    update:function(game){
    },
    tryAgain:function(game){
        this.game.state.start('run');
    },
    returnToMenu:function(game){
        this.game.state.start('menu');
    }
}  
victoryScreen={
    preload:function(game){
        game.load.audio("victorySong","assets/sounds/victory.mp3");
        game.load.image("bg3","assets/images/bg3.jpg");
        game.load.image("sakura","assets/images/sakura.png");
        game.load.atlas('kodama', 'assets/images/kodama_spritesheet.png', 'config/kodama.json');
        game.load.image('tryAgain','assets/images/buttonStart.png');
    },
    create:function(game){
        
        this.victoryTextArray="victory";
        this.victorySong=game.add.audio('victorySong');
        this.victorySong.play();
        this.bg3=game.add.sprite(-200,0,"bg3");
        for (var i = 0; i < this.victoryTextArray.length; i++) {
            this.victoryText=new Text(game,-100,100*i,this.victoryTextArray[i]+"","#000000");
            game.add.tween(this.victoryText.text).to({x:150}, 1000, Phaser.Easing.Elastic.Out,true,100*i);
        };
        this.kodama = game.add.sprite(1100, 250, "kodama");
        this.kodama.scale.x=1.2;
        this.kodama.scale.y=1.2;   
        this.kodama.animations.add('left', ['left1', 'left2', 'left3', 'left4', 'left5', 'left6', 'left7', 'left8', 'left9', 'left10']);
        this.kodama.animations.play('left',15, true);
        game.add.tween(this.kodama).to({x:-100}, 6000, Phaser.Easing.Cubic.None,true,1000);

        this.kodama2 = game.add.sprite(1100, 100, "kodama");
        this.kodama2.scale.x=1.2;
        this.kodama2.scale.y=1.2;   
        this.kodama2.animations.add('left', ['left1', 'left2', 'left3', 'left4', 'left5', 'left6', 'left7', 'left8', 'left9', 'left10']);
        this.kodama2.animations.play('left',15, true);
        game.add.tween(this.kodama2).to({x:-100}, 6000, Phaser.Easing.Cubic.None,true,1300);
        
        this.timeText=new Text(game,1200,100,"time : ","#000000","40px japan");
        game.add.tween(this.timeText.text).to({x:485}, 3500, Phaser.Easing.Cubic.None,true,1000);

        this.moneyText=new Text(game,1200,250,"Remaining money : ","#000000","40px japan");
        game.add.tween(this.moneyText.text).to({x:360}, 4000, Phaser.Easing.Cubic.None,true,800);
        
        this.sakura = game.add.emitter(game.world.centerX, 200, 200);
        this.sakura.makeParticles('sakura');
        this.sakura.emitY=-50;
        this.sakura.emitX=200;
        this.sakura.start(false, 5000, 200);
        this.sakura2 = game.add.emitter(game.world.centerX, 200, 200);
        this.sakura2.makeParticles('sakura');
        this.sakura2.emitY=-50;
        this.sakura2.emitX=600;
        this.sakura2.start(false, 5000, 200);
        this.tryAgain=game.add.button(1300,400,'tryAgain',this.changeStage);
        this.returnMenu=game.add.button(1300,480,'tryAgain',this.returnToMenu);  
        game.add.tween(this.returnMenu).to({x:560}, 3500, Phaser.Easing.Cubic.None,true,500);
        game.add.tween(this.tryAgain).to({x:560}, 3500, Phaser.Easing.Cubic.None,true,1000);
    },
    update:function(game){
        if(this.moneyText.text.x==360){
            this.moneyText2=new Text(game,900,250,game.score.remainingMoney+"","#FFFFFF","40px japan");
        }
    },
    changeStage:function(game){
        victoryScreen.victorySong.stop();
        console.log(this.game.currentStage[3]);
        checkForNextStage(this.game,"changeStage",this.game.currentStage);
        this.game.state.start('run');
    },
    returnToMenu:function(game){
        victoryScreen.victorySong.stop();
        this.game.state.start('menu');
    }
}  