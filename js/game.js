function startGame(){
	myGameArea.start();
	FondEtoile.start(150);
	Joueur.start();
	WorldElements.start();
	Map.start(2000);
}

function updateGameArea(){
	myGameArea.clear();
	myGameArea.update();
	FondEtoile.update();
	WorldElements.update();
	Joueur.update();
	Map.update();
}



var Joueur = {
	exist : true,
	action : false,
	mode : "miner",
	posX : 450,
	posY : 650,
	structure : 1000,
	structureRef : 1000,
	vitesseX : 0,
	vitesseY : 0,
	gazX : true,
	gazY : true,
	acceleration : 0.15,
	vitesseMax : 4,
	//MINAGE
	porteeMinage : 400,
	ratioPorteeMinageOptimale : 1.2,
	crystals : 0,
	minageSkill : 1,
	bonusMinage : 0,
	wayPointsConsecutifs : 0,
	nivel : "img/joueur.png",
	start : function(){
		this.image = new Image();
		this.image.src = this.nivel;
		this.width = 30;
		this.height = 38;
		this.x = (myGameArea.canvas.width/2);
		this.y = (myGameArea.canvas.height/2);
		
	},
	update : function(){
		this.x = myGameArea.canvas.width/2;
		this.y = myGameArea.canvas.height/2;
		var angleFinal = Math.atan2(window.mouseY-this.y, window.mouseX-this.x);
		ctx = myGameArea.context;
		ctx.font = "10px Arial";
		ctx.fillText(Math.round(tableauElements[0].x)+"x :"+Math.round(Joueur.posY)+"y", 5, 10);
		ctx.font = "30px Arial";
		ctx.styleFill = 'blue';
		ctx.textAlign = "end";
		// Affichage ressources
		ctx.fillText(Joueur.crystals,myGameArea.canvas.width-35, 35);
		ctx.save();
		
		ctx.translate(this.x, this.y);
		
		// Destruction du vaisseau si la structure tombe a 0
		if (this.structure <= 0){
			this.vitesseX = 0;
			this.vitesseY = 0;
			this.exist == false;
		}else{
			this.exist == true;
		}
		
		// CANON
		if (this.mode == "canon"){
			
			if (this.action == true){
				
				
			}
		}
		
		
		// BONUS MINIER
		ctx.font = "10px Arial";
		ctx.textAlign = "center";
		if ( Joueur.bonusMinage > 0){
			ctx.fillText("+"+Math.round(Joueur.bonusMinage*100)+"%", 0, this.height/2+15);
		}
		/*
		if(this.mode == "miner"){
			
			//le joueur n'a jamais de malus
			if (this.bonusMinage < 0){
				this.bonusMinage = 0;
			}
			
			*//*
			if ( this.action == true){
			// (graphismes du rayon)
			var showRandom = getRandomInt(1000);
			var showRandomFin = showRandom + (Joueur.bonusMinage*100)
			var numFin = Math.floor(Math.random()*20) + 1; // grandeur de la zone graphique de la dispertion rayon minier
			numFin *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
			var numDepart = Math.floor(Math.random()*5) + 1;
			numDepart *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
			var amplitudeDepart = Math.floor(Math.random() * numDepart) + 1 
			var amplitudeFinX = Math.floor(Math.random() * numFin) + 1 
			var amplitudeFinY = Math.floor(Math.random() * numFin) + 1 
				if (showRandom > 800 - (Joueur.bonusMinage*80)){
					
					ctx.save();
					ctx.beginPath();
					ctx.lineWidth = Math.random()*5;
					ctx.strokeStyle="#BBBBFF";
					ctx.globalAlpha=Math.random()*1;
					ctx.moveTo(this.x-myGameArea.canvas.width/2+amplitudeDepart,this.y-myGameArea.canvas.height/2+amplitudeDepart);
					ctx.lineTo(window.mouseX-myGameArea.canvas.width/2+amplitudeFinX,window.mouseY-myGameArea.canvas.height/2+amplitudeFinY);
					ctx.stroke();
					ctx.restore();
					
					ctx.beginPath();
					ctx.strokeStyle="#AAAAFF";
					ctx.moveTo(this.x-myGameArea.canvas.width/2+amplitudeDepart,this.y-myGameArea.canvas.height/2+amplitudeDepart);
					ctx.lineTo(window.mouseX-myGameArea.canvas.width/2+amplitudeFinX,window.mouseY-myGameArea.canvas.height/2+amplitudeFinY);
					ctx.stroke();
				}
			}
			//(donnees et graphismes collecte)
			
		}
		*/
		// AFFICHAGE Notifs INTERFACE
		for(var tabN=0; tabN<tableauNotifs.length; tabN++){
			var notif = tableauNotifs[tabN];
			if (notif.exist == false){
				tableauNotifs.splice(tabN, 1);
			}else{
				notif.update();
			}
		}
		
		
		
		ctx.rotate(angleFinal);
		ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
		ctx.restore();
		
		
		if (myGameArea.keys && myGameArea.keys[39]) { // vers la droite
			if (this.vitesseX > (0-this.vitesseMax)){
				//this.gazX = false;
				this.vitesseX -= this.acceleration;	// quand On accelere
			}
		}else if(!myGameArea.keys[37]){
			this.gazX = true;
		}
		
		if (myGameArea.keys && myGameArea.keys[37]) { // vers la gauche
			if (this.vitesseX < this.vitesseMax){
				//this.gazX = false;
				this.vitesseX += this.acceleration; 
			}
		}else if(!myGameArea.keys[39]){
			this.gazX = true;
		}
		
		if (myGameArea.keys && myGameArea.keys[40]) { // vers le bas
			if (this.vitesseY > -this.vitesseMax){
				//this.gazY = false;
				this.vitesseY -= this.acceleration;
			}
		}else if(!myGameArea.keys[38]){
			this.gazY = true;
		}
		
		if (myGameArea.keys && myGameArea.keys[38]) { // vers le haut
			if (this.vitesseY < this.vitesseMax){
				//this.gazY = false;
				this.vitesseY += this.acceleration; 
			}
		}else if(!myGameArea.keys[40]){
			this.gazY = true;
		}
		
		this.posY += -this.vitesseY;
		this.posX += -this.vitesseX;
		
		
		// GRAPHISME DES DEGATS & DESTRUCTION(Petits effets de feu sur le vaisseau augmentant proportionnalement avec les degats)
		if (this.structure <= this.structureRef/2){
			var calcul = Math.round(this.structure * 100 /(this.structureRef/2));
			var nbAl = (Math.random()*100);
			//ctx.fillText(calcul,50, 200);
			if(nbAl>calcul && this.exist == true){
				var nbAl2 = Math.random()*5;
				if(nbAl2 <=1){
						
					var posEffX = (this.posX-this.width/2)+getRandomInt(this.width);
					var posEffY = (this.posY-this.height/2)+getRandomInt(this.height);
					var effetDestruction = new Effet(1, posEffX, posEffY);
					
				}
			}
			
			if (this.structure <= 0 && this.exist == true){
				var posEffX = (this.posX-this.width/2);
				var posEffY = (this.posY-this.height/2);
				var effetDestruction = new Effet(2, posEffX, posEffY);
				this.width = 0;
				this.height = 0;
				this.exist = false;
			}
		}
		
	}
}