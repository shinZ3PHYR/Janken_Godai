function loadJSONFiles(files){
    var jsonFiles = { };
    for (fileName in files){
        jsonFiles[fileName] = { 
            fileName : files[fileName] , 
            file: httpGetData(files[fileName]) 
        };
    }
    return jsonFiles;
}

// utility function for loading assets from server
function httpGet(theUrl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

// utility function for loading json data from server
function httpGetData(theUrl) {
    var responseText = httpGet(theUrl);
    return JSON.parse(responseText);
}

function createArrayLayers(game,idLayer,arrayWalkables,stringWalkables){
    //WATERWALKABES
    
    for (var i = 0 ; i < game.map.layers.length ; i++)
    {
        if(game.map.layers[idLayer].name.indexOf(stringWalkables)!=-1)
        {
            for (var y = 0 ; y  < game.map.layers[idLayer].data.length ; y++)
            {
                for (var x = 0 ; x < game.map.layers[idLayer].data[y].length ; x++)
                {
                    if(!!game.map.layers[idLayer].data[y][x]&&arrayWalkables.indexOf(game.map.layers[idLayer].data[y][x].index)==-1)
                    {
                        arrayWalkables.push(game.map.layers[idLayer].data[y][x].index);
                    }
                }
            } 
        }
    }
    // console.log(arrayWalkables +"arrayWalkables DONE")
}
//c'est ici que je push Enemy1

function calculeGlobalPathWater(game,object, elem,displayTrajectory)
{   
    game.overPathWater = new OverPath(game, game.ennemiSpawn, game.ennemiDestinationFinal, elem);
    if(game.overPathWater.path==null){
            return
    }  
    if(displayTrajectory){
        for (var i=0; i< game.waypointEau.length;i++){
            game.waypointEau[i].kill()
        }
        for(var i = 0; i< game.overPathWater.path.length; i++){
            game.waypointEau.push(game.waypointsSprites.create((game.overPathWater.path[i].x*32)+8, (game.overPathWater.path[i].y*32)+8, "waypoint_bleu"));
        }       
    }

}
function calculeGlobalPathFire(game,object, elem,displayTrajectory)
{  
        game.overPathFire = new OverPath(game, game.ennemiSpawn, game.ennemiDestinationFinal, elem);
        if(game.overPathFire.path==null){
            return
        }  
        if(displayTrajectory){
            for (var i=0; i< game.waypointFeu.length;i++){
                game.waypointFeu[i].kill()
            }
            for(var i = 0; i< game.overPathFire.path.length; i++){
                game.waypointFeu.push(game.waypointsSprites.create((game.overPathFire.path[i].x*32)+8, (game.overPathFire.path[i].y*32)+8, "waypoint_rouge"));
            }
        }
        
    
   
}
function calculeGlobalPathNature(game,object, elem,displayTrajectory)
{   
    game.overPathNature = new OverPath(game,game.ennemiSpawn, game.ennemiDestinationFinal, elem);
    if(game.overPathNature.path==null){
            return
    } 
    if(displayTrajectory){
        for (var i=0; i< game.waypointNature.length;i++){
            game.waypointNature[i].kill()
        }
        for(var i = 0; i< game.overPathNature.path.length; i++){
            game.waypointNature.push(game.waypointsSprites.create((game.overPathNature.path[i].x*32)+8, (game.overPathNature.path[i].y*32)+8, "waypoint_vert"));
        }   
    } 
}
function collisionHandler(bullet, enemy) {

    
    for(var i = 0; i<this.game.managerTurret.towers.length; i++){

        for(var j = 0; j<this.game.managerTurret.towers[i].bulletsArray.length; j++){

            if(this.game.managerTurret.towers[i].bulletsArray[j].sprite === bullet)
                
                var daTower = this.game.managerTurret.towers[i];
        }
    }
    for(var i = 0; i<this.game.waveArray.length; i++){

        if(this.game.waveArray[i].sprite === enemy){

            var daEnemy = this.game.waveArray[i];

            if(this.game.waveArray[i].hp > 0){  
                var dmg = damageRatio(daEnemy, daTower, 120, 80)
                this.game.waveArray[i].hp -= dmg;
                if(this.game.waveArray[i].hp <= 0){
                    this.game.coins.push(new Coins(this.game,this.game.waveArray[i].sprite.x,this.game.waveArray[i].sprite.y,this.game.waveArray[i].goldWin+""));  
                    this.game.waveArray[i].lifeBar.clear();
                    this.game.waveArray[i].currentLife.clear();
                    enemy.kill();
                    this.game.ressources.managerGold(this.game,"enemyKill",i);
                    this.game.waveArray.splice(i, 1);
                    
                    i--;
                }
            }
        }
    }
    // if(this.frame % 20 == 0)
        bullet.kill();
}    
function damageRatio(enemy, tower, strength, weakness){

    var dmg;
    if(enemy.element == "fire"){
        switch(tower.element){
            case "nature" : dmg = Math.floor(tower.damage * weakness / 100); break;
            case "water" : dmg = Math.floor(tower.damage * strength / 100); break;
            case "composite" : dmg = Math.floor(tower.damage * 50 / 100); break;
            default : dmg = tower.damage; break;
        }
    }
    else if(enemy.element == "water"){
        switch(tower.element){
            case "fire" : dmg = Math.floor(tower.damage * weakness / 100); break;
            case "nature" : dmg = Math.floor(tower.damage * strength / 100); break;
            case "composite" : dmg = Math.floor(tower.damage * 50 / 100); break;
            default : dmg = tower.damage; break;
        }
    }
    else if(enemy.element == "nature"){
        switch(tower.element){
            case "water" : dmg = Math.floor(tower.damage * weakness /100); break;
            case "fire" : dmg = Math.floor(tower.damage * strength / 100); break;
            case "composite" : dmg = Math.floor(tower.damage * 50 / 100); break;
            default : dmg = tower.damage; break;
        }
    }
    return dmg;
}                   
function soundStoper(music,musicIsPlaying){//cette fonction sert a arrété les bonne musiques au bon moments
    if(musicIsPlaying){ // si la musique en question est jouée
        music.stop(); // on l'arrete
        musicIsPlaying=false;//et on precise qu'elle n'est plus jouée   
    }
}
function drawOnTop(bullet){
    bullet.bringToTop();
}
function holdOn(game){
    var samuraiBitmap1=game.add.sprite(1324,300,"samurai");
    var samuraiBitmap2=game.add.sprite(-300,300,"samurai");
    samuraiBitmap2.scale.x=-1;
    game.add.tween(samuraiBitmap1).to({x:0}, 1000, Phaser.Easing.Cubic.Out,true)
    .to({x:1324}, 1000, Phaser.Easing.Cubic.Out,true,500);
    game.add.tween(samuraiBitmap2).to({x:1024}, 1000, Phaser.Easing.Cubic.Out,true)
    .to({x:-300}, 1000, Phaser.Easing.Cubic.Out,true,500);
    var text = "Hold ON";
    var style = { font: "200px jankenFont", fill: "#000000", align: "center" };
    var t = game.add.text(game.world.centerX-300,300 , text, style);
    game.add.tween(t).to({y:-300}, 1000, Phaser.Easing.Cubic.Out,true,1000);
}
function placeShowWalkables(game){
    for(var y = 0; y<game.mergedLayer.length;y++){
        for(var x = 0 ; x<game.mergedLayer[y].length;x++){
            for(var i=0;i<game.unwalkables.length;i++){
                if(game.mergedLayer[y][x]== game.unwalkables[i] && y!=22&& y!=21&& y!=20&& y!=19&&y!=18){
                    game.showWalkables.push(new ShowWalkables(game,x*32,y*32))
                }   
            }   
        }
    }                       
}
function checkForNextStage(game,action,previousStage){
    if(action=="changeStage"){
        if(previousStage=="w1s1"){
            game.currentStage="w1s2";
        }
        else if(previousStage=="w1s2"){
            game.currentStage="w2s1";
        }
        else if(previousStage=="w2s1"){
            game.currentStage="w2s2";
        }
        else if(previousStage=="w2s2"){
            game.currentStage="w3s1";
        }
        else if(previousStage=="w3s1"){
            game.currentStage="w3s2";
        }
        else if(previousStage=="w3s2"){
            game.currentStage="w1s1";
        }
    }
    if(game.currentStage[1] == 1){//look la deuxieme occurence de current stage "WaSb"(a etant l'id du word et b l'id du stage du world)
        if(game.currentStage[3] == 1){
            game.currentWaves=game.parameters.waves.world1;//toute les waves
            game.currentWavesNumber=game.parameters.waves.world1.length;//nombre de wave au total dans le monde
            game.currentVariationFrameToPop = game.parameters.variationframetopop.world1
            game.ennemiSpawn={x: 31, y:11};
            game.ennemiDestinationFinal={x:0,y:11};
            game.mapToLoad='w1s1';
            game.tileSetToLoad='tiles';
            game.tileSetNameToLoad='newTile'
        }
        else if(game.currentStage[3] == 2){
            game.currentWaves=game.parameters.waves.world2;//toute les waves
            game.currentWavesNumber=game.parameters.waves.world2.length;//nombre de wave au total dans le monde
            game.currentVariationFrameToPop = game.parameters.variationframetopop.world2
            game.ennemiSpawn={x: 25, y:2};
            game.ennemiDestinationFinal={x:0,y:13};
            game.mapToLoad='w1s2';
            game.tileSetToLoad='tiles';
            game.tileSetNameToLoad='newTile'
        }
    }
    else if(game.currentStage[1] == 2){
        if(game.currentStage[3] == 1){
            game.currentWaves=game.parameters.waves.world3;//toute les waves
            game.currentWavesNumber=game.parameters.waves.world3.length;//nombre de wave au total dans le monde
            game.currentVariationFrameToPop = game.parameters.variationframetopop.world3
            game.ennemiSpawn={x: 25, y:2};
            game.ennemiDestinationFinal={x:0,y:8};
            game.mapToLoad='w2s1';
            game.tileSetToLoad='tiles2';
            game.tileSetNameToLoad='newTile2'
        }
        else if(game.currentStage[3] == 2){
            game.currentWaves=game.parameters.waves.world4;//toute les waves
            game.currentWavesNumber=game.parameters.waves.world4.length;//nombre de wave au total dans le monde
            game.currentVariationFrameToPop = game.parameters.variationframetopop.world4
            game.ennemiSpawn={x: 15, y:2};
            game.ennemiDestinationFinal={x:0,y:11};
            game.mapToLoad='w2s2';
            game.tileSetToLoad='tiles2';
            game.tileSetNameToLoad='newTile2'
        }
    }
    else if(game.currentStage[1] == 3){
        if(game.currentStage[3] == 1){
            game.currentWaves=game.parameters.waves.world5;//toute les waves
            game.currentWavesNumber=game.parameters.waves.world5.length;//nombre de wave au total dans le monde
            game.currentVariationFrameToPop = game.parameters.variationframetopop.world5
            game.ennemiSpawn={x: 3, y:2};
            game.ennemiDestinationFinal={x:0,y:8};
            game.mapToLoad='w3s1';
            game.tileSetToLoad='tiles3';
            game.tileSetNameToLoad='newTile3'
        }
        else if(game.currentStage[3] == 2){
            game.currentWaves=game.parameters.waves.world6;//toute les waves
            game.currentWavesNumber=game.parameters.waves.world6.length;//nombre de wave au total dans le monde
            game.currentVariationFrameToPop = game.parameters.variationframetopop.world6
            game.ennemiSpawn={x: 29, y:2};
            game.ennemiDestinationFinal={x:0,y:8};
            game.mapToLoad='w3s2';
            game.tileSetToLoad='tiles3';
            game.tileSetNameToLoad='newTile3'
        }
    }
}

