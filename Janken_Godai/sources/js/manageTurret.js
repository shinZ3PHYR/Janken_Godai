function managerTurret(game){
	  
        game.managerTurret = { // gestion des tourelles
            towers:[],
            canPutTower:true,
            canCalculate:false,
            canOpenCustomMenu:true,
    
            update: function(game,ObjectTower,x,y,ObjectBullet){
                for(var i = 0; i < this.towers.length;i++){ 
                    if((this.towers[i].x== game.marker.x &&(this.towers[i].y)+32 == game.marker.y)){
                        this.canPutTower=false;    
                    }       
                }
                if (game.input.mousePointer.isUp&&game.hud.canCreate&&this.canPutTower&&game.ressources.gold>=10&&game.marker.y/32!=0&&game.marker.y/32!=1&&game.marker.y/32!=2){
                   this.retireTile(game, game.marker.x, game.marker.y);
                   if(this.canPutTower&&game.ressources.gold>=10){
                        this.towers.push(new ObjectTower(game,game.layer.getTileX(x*32), game.layer.getTileY(y*32),"composite"));
                        game.ressources.managerGold(game,"buyComposite");
                    }
                   this.canPutTower = false;
                }
                for(var i = 0 ;i<this.towers.length;i++){
                    this.towers[i].manageShoot(game,ObjectBullet);
                }
                this.customMenu(game);    
            },
           retireTile: function(game, markerX, markerY){
                game.mergedLayer[markerY/32][markerX/32]=game.unwalkables[0];//on change la tile en tile unwalkable
                if(game.go){
                    calculeGlobalPathFire(game,OverPath,'feu',false); // on modifie chaque path
                    calculeGlobalPathNature(game,OverPath,'nature',false);
                    calculeGlobalPathWater(game,OverPath,'eau',false);
                }
                else{
                    calculeGlobalPathFire(game,OverPath,'feu',true); // on modifie chaque path
                    calculeGlobalPathNature(game,OverPath,'nature',true);
                    calculeGlobalPathWater(game,OverPath,'eau',true);
                }    
                if(game.overPathFire.path==null){ // si un path n'est pas calculé car les walkables ne permettent plus d'arrivé a destination
                    game.mergedLayer[markerY/32][markerX/32]=game.walkables[0] // alors on (re)rend la tile walkable
                    this.canPutTower=false;//et on empeche de poser une tourelle
                    game.cantPutTower.play();//feedback sonore d'interdiction
                }
                else{
                     for(var i= 0; i  <  game.waveArray.length;i++){
                        game.waveArray[i].pathfinder.setTileCost(0, 0); 
                        game.waveArray[i].redefinedPath(game, game.ennemiDestinationFinal,i);//sinon on garde la valeur de tile unwalkable et on calcule le path ennemi
                    }    
                }    
            },
            customMenu:function(game){
                        if(game.input.mousePointer.isUp&&!game.hud.elementMenuIsOpen&&!game.hud.buttonSendIsOpen){
                            this.canOpenCustomMenu=true;
                        }
                for(var i = 0; i < this.towers.length;i++){
                    if((((this.towers[i].x== game.marker.x && (this.towers[i].y)+32 == game.marker.y)||(this.towers[i].x== game.marker.x && (this.towers[i].y)+32 == game.marker.y+32))&&game.input.mousePointer.isDown)&&i!=game.hud.towerIndex&&game.hud.elementMenuIsOpen){
                      
                            game.hud.destroyMenu();
                        
                    }
                    else if((((this.towers[i].x== game.marker.x && (this.towers[i].y)+32 == game.marker.y)||(this.towers[i].x== game.marker.x && (this.towers[i].y)+32 == game.marker.y+32))&&game.input.mousePointer.isDown)&&i!=game.hud.towerIndex&&game.hud.buttonSendIsOpen){
                            
                            game.hud.destroySend();
                            
                    }
                    else if(((this.towers[i].x== game.marker.x && (this.towers[i].y)+32 == game.marker.y)||(this.towers[i].x== game.marker.x && (this.towers[i].y)+32 == game.marker.y+32))&&game.input.mousePointer.isDown){
                        if(game.input.mousePointer.isDown && this.canOpenCustomMenu && !game.hud.hudTower.input.isDragged){
                            this.openCustomMenu(game,i)    
                        }
                    }  
                    if(game.hud.deleteOldTurret){ //ceci supprime les cercle autours des tourelles quand on remplace les tourelle(pour ne pas qu'ils s'accumulent)  
                        game.hud.destroyMenu();
                        game.hud.destroySend();
                        game.hud.deleteOldTurret=false;//fermeture de la condition on a bien detruit tout ce qu'il fallait
                    }
                }
                       
            },
            openCustomMenu:function(game,i){ //cette function fais apparaitre une fenetre pour personnaliser la tourelle selectioné, on traitera les donné dans la fonction customMenu, cette fonction la ne sert qu'a faire a pparaitre le menu
                if(this.towers[i].element == "composite"){
                    game.hud.chooseAnElementMenu(game,this.towers[i].x-42,this.towers[i].y+64,i)//creer la fenetre du menu pour choisir son element  
                    game.hud.buttonSendGo(game,this.towers[i].x-42,this.towers[i].y+64,i)
                    this.canOpenCustomMenu=false;
                    
                }
                else{

                    game.hud.chooseAStatMenu(game,this.towers[i].x-42,this.towers[i].y+64,i)
                     game.hud.buttonSendGo(game,this.towers[i].x-42,this.towers[i].y+64,i);
                     this.canOpenCustomMenu=false;
                }
            }
           
        };
}