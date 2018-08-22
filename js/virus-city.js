var spawningAgent = null,
		virusIndexes = [0,1,2,3,4,5,6,7,8],
		totalHealth = 10,
		gameRunning = true,
		enemiesKilled = 0,
		selectedColor = "red";
AFRAME.registerComponent("virus-city",{
	schema : {
		smallEnemyCount : {
			type : "int",
			default : 5
		},
		mediumEnemyCount : {
			type : "int",
			default : 3
		},
		bossCount : {
			type : "int",
			default : 1
		},
    width: {
        type: 'int',
        default: 20
    },
    length: {
        type: 'int',
        default: 20
    },
    spacing: {
        type: 'int',
        default: 15
    }
	},
	init : function(){
		document.getElementById("redSaber").addEventListener("click",function(){
			selectedColor = "red";
		})
		document.getElementById("yellowSaber").addEventListener("click",function(){
			selectedColor = "yellow";
		})
		document.getElementById("blueSaber").addEventListener("click",function(){
			selectedColor = "blue";
		})
		this.viruses = [];
		for(i = 0;i < this.data.smallEnemyCount; i++){
			var virus = this.generateSmallEnemy(i);
			this.viruses.push(virus);
			var virusPosition = {"x" : getRandomArbitrary(-4,4), "y" : 0, "z" : getRandomArbitrary(-6,-2)};
			virus.setAttribute("position",virusPosition);
			this.el.appendChild(virus);
		}

		for(i = 0;i < this.data.mediumEnemyCount; i++){
			var virus = this.generateMediumEnemy(i + this.data.smallEnemyCount);
			this.viruses.push(virus);
			var virusPosition = {"x" : getRandomArbitrary(-4,4), "y" : 0, "z" : getRandomArbitrary(-6,-2)};
			virus.setAttribute("position",virusPosition);
			this.el.appendChild(virus);
		}

		for(i = 0;i < this.data.bossCount; i++){
			var virus = this.generateBossEnemy(i + this.data.mediumEnemyCount + this.data.smallEnemyCount);
			this.viruses.push(virus);
			var virusPosition = {"x" : getRandomArbitrary(-4,4), "y" : 0, "z" : getRandomArbitrary(-6,-2)};
			virus.setAttribute("position",virusPosition);
			this.el.appendChild(virus);
		}
		var hurt = document.getElementById("hurt");
		var scene = this.el;
		this.viruses.forEach(function(virus){
			
			virus.addEventListener("click",function(){
				console.log(selectedColor);
				var energy = 0;
				var power = parseInt(this.attributes["data-power"].value);
				switch(selectedColor){
					case "blue":
						energy = 30;
						break;
					case "yellow":
						energy = 20;
						break;
					case "red":
						energy = 10;
						break;
				}
				power -= energy;
				console.log(power);

				var killedbar = document.getElementById("killedbar");
				this.setAttribute("opacity", power / 100);
				if(power <= 0){
					enemiesKilled++;
					scene.removeChild(this);	
					killedbar.setAttribute("value",enemiesKilled);
					var idx = parseInt(this.attributes["data-index"].value);
					if(enemiesKilled == 9){
						endGame(3);
					}
				}else{
					this.setAttribute("data-power",power);
				}
			})
		})
	},

	generateSmallEnemy : function(idx){
		var virus = document.createElement("a-entity");
		virus.setAttribute("obj-model","obj: #small-virus-obj; mtl: #small-virus-mtl");
		virus.setAttribute("class","smallenemy virus");
		virus.setAttribute("data-type", "small");
		virus.setAttribute("data-power", "10");
		virus.setAttribute("scale","0.04 0.04 0.04");
		virus.id = "small" + idx;
		virus.setAttribute("data-index",idx);
		return virus;
	},

	generateMediumEnemy : function(idx){
		var virus = document.createElement("a-entity");
		virus.setAttribute("obj-model","obj: #medium-virus-obj; mtl: #medium-virus-mtl");
		virus.setAttribute("class","mediumenemy virus");
		virus.setAttribute("data-type", "medium");
		virus.setAttribute("data-power", "60");
		virus.setAttribute("scale","0.06 0.06 0.06");
		virus.id = "medium" + idx;
		virus.setAttribute("data-index",idx);
		return virus;
	},

	generateBossEnemy : function(idx){
		var virus = document.createElement("a-entity");
		virus.setAttribute("collada-model","#boss-virus-obj");
		virus.setAttribute("class","bossenemy virus");
		virus.setAttribute("data-type", "boss");
		virus.setAttribute("data-power", "100");		
		virus.setAttribute("scale","1 1 1");
		virus.id = "boss" + idx;
		virus.setAttribute("data-index",idx);
		return virus;
	},

})
var getRandomArbitrary = function(min, max) {
  return Math.random() * (max - min) + min;
}

var getRandomInteger = function(min, max){
	min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var endGame = function(code){
	gameRunning = false;
	switch(code){
		case 0:
			msg = "You are dead."
			break;
		case 1:
			msg = "No energy left."
			break;
		case 3:
			msg = "All enemies killed."
			break;
	}
	var gameover = document.getElementById("gameover");
	gameover.setAttribute("visible",true);
	gameover.setAttribute("value", msg);
	clearInterval(spawningAgent);
	if(code == 3){
		window.localStorage.setItem("totalscore", totalEnergy);
		window.location = "ending.html";
	}
}

