var OverPath =function(game,currentPos,destinationFinal, elem)
{
 
    this.x = currentPos.x;
    this.y = currentPos.y;
    this.destinationFinal=destinationFinal;
    this.element = elem || '';

    var transfert = JSON.stringify(game.walkables);
    this.walkables = JSON.parse(transfert);

    this.path = [];
    this.pathfinder = game.plugins.add(new Phaser.Plugin.PathFinderPlugin(game, this));
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
    for(var i = 0; i < this.walkables.length; i++){
        this.pathfinder.setTileCost(this.walkables[i], 100);
    }
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
    };
    switch(this.element){
        case 'feu' : 
        //ON FUSIONNE TOUT LES TABLEAU AVEC CHAQUES COUT BIEN PREFEDINI
            Array.prototype.push.apply(this.walkables, this.fireWalkables);
            Array.prototype.push.apply(this.walkables, this.natureWalkables);
            Array.prototype.push.apply(this.walkables, this.waterWalkables);
            this.tileCost(1000,1,1000);
            break;
        case 'eau' : 
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

    // this.sprite = game.add.sprite(currentPos.x*32, currentPos.y*32, "waypoint");

    
};
OverPath.prototype.constructor = OverPath;
OverPath.prototype.findPath = function(destinationFinal) {
    var that = this;
    this.pathfinder.setCallbackFunction(function(path) {
        that.path = path ; 
    });
    this.pathfinder.preparePathCalculation([this.x,this.y],[destinationFinal.x,destinationFinal.y]);
    this.pathfinder.calculatePath();

};
var Coins =function(game,x,y,text)
{
    this.x=x
    this.y=y
    this.sprite=game.spriteCoins.create(x,y,"coin");
    this.text=text;
    this.style ={ font: "20px impact", fill: "#DF0101", align: "center" };
    this.goldText=game.add.text(this.sprite.x+30,this.sprite.y , this.text, this.style);
    this.sprite.animations.add('shine');
    this.sprite.animations.play('shine', 20, true);
    
}
var Button = function(game,x,y,clef,callback,that){
    this.sprite = game.add.button(x,y,clef,callback,that);
}
var Text=function(game,x,y,text,filltext,sizeAndFont){
     this.t=text; 
     this.style = {font: sizeAndFont || "100px jankenFont" , fill: filltext , align: "center" };
     this.text=game.add.text(x,y,this.t,this.style);
}
var ShowWalkables=function(game,x,y){
    this.graphics=game.add.graphics(x,y);
    this.graphics.beginFill(0x000000, 0.3);
    this.graphics.drawRect(0,0,32,32)
}




