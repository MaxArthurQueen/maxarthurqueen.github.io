var tableauEffets = new Array;
var tableauWayPoints = new Array;
var tableauElements = new Array;
var tableauAsteroides = new Array;
var tableauAchievments = new Array;
var WorldElements = {
	start : function(){
		var stationJoueur = new Station(322, 387, 0.0025, "Lucioles");
		tableauElements.push(stationJoueur);
		var categoryAsteroide = getRandomInt(3);
		var asteroideTest = new Asteroide(600, 600, categoryAsteroide, 2);
		tableauAsteroides.push(asteroideTest);
		var categoryAsteroide = getRandomInt(3); 
		var asteroideTest2 = new Asteroide(200, 200, categoryAsteroide, 2);
		tableauAsteroides.push(asteroideTest2);
		var vaisseauEtranger = new Vaisseau("scout", 700, 600, "Trader", "minage");
		tableauElements.push(vaisseauEtranger);
		//var champAsteroides = new ChampAsteroides(1000, 1000, 7, 50);
		//champAsteroides.generate();
	},
	update : function(){
		var ctx = myGameArea.context;
		for(let i=0; i<tableauAsteroides.length; i++){
			let asteroide = tableauAsteroides[i];
			if(asteroide.exist == false){
				tableauAsteroides.splice(i, 1);
			}else{
				asteroide.update();
			}
		}
		for(j=0; j<tableauElements.length; j++){
			var elementUnit = tableauElements[j];
			if(elementUnit.exist == false){
				tableauElements.splice(j, 1);
			}else{
				elementUnit.update();
			}
		}
		for(k=0; k<tableauEffets.length; k++){
			var effet = tableauEffets[k];
			if (effet.exist == false){
				tableauEffets.splice(k, 1);
			}else{
				effet.update();
			}
		}
		for(l=0; l<tableauWayPoints.length; l++){
			var wayPoint = tableauWayPoints[l];
			if (wayPoint.exist == false){
				tableauWayPoints.splice(l, 1);
			}else{
				wayPoint.update();
			}
		}
		
		// ########
		//TEST line
		// ########
		ctx.fillText(tableauElements.length, 5, 35);
		
		
		// SURVOL SOURIS
		var tableauGeneral = new Array;
		var valeurDepart = 50000;
		var cible = new Object;
		for (a=0; a<tableauAsteroides.length; a++){
			tableauGeneral.push(tableauAsteroides[a]);
		}
		for (b=0; b<tableauElements.length; b++){
			tableauGeneral.push(tableauElements[b]);
		}
		// Realise un tableau general de tous les elements physique dans la map
		for(c=0; c<tableauGeneral.length; c++){
			var elementUnit = tableauGeneral[c];
			if (elementUnit.name == "scout"){
				//ctx.fillText(elementUnit.posY, 5, 150);
			}
			
			
			// si souris a proximite (### SURVOL ###)
			if (myGameArea.mouseX >= (elementUnit.posX - elementUnit.width/2)+10 && myGameArea.mouseY >= (elementUnit.posY - elementUnit.height/2)+10 && myGameArea.mouseX <= (elementUnit.posX + elementUnit.width/2)+6 && myGameArea.mouseY <= (elementUnit.posY + elementUnit.height/2)+6){
				
				// DESCRIPTION ELEMENT & EFFET SURVOL DE LA SOURIS
				effetSurvol(elementUnit); 
				
				
				// SI ELEMENT = Vaisseau
				if (elementUnit.name != "asteroide"){
					ctx.fillStyle = "#9999Ff";
					ctx.fillText(elementUnit.name, myGameArea.canvas.width/2 +elementUnit.x+elementUnit.width/2+7, myGameArea.canvas.height/2+elementUnit.y-elementUnit.height/2 +25);
					ctx.font = "16px Arial";
					ctx.fillStyle = "#ffffff";
					ctx.fillText(elementUnit.faction, myGameArea.canvas.width/2 +elementUnit.x+elementUnit.width/2, myGameArea.canvas.height/2+elementUnit.y-elementUnit.height/2+15);
				}else{
					ctx.fillText(elementUnit.name, window.mouseX+15, window.mouseY+3);
				}
				
				
				// SI ELEMENT = ASTEROIDE / ALORS / RECOLTE CRYSTAUX
				if (elementUnit.name == "asteroide" && Joueur.mode == "miner" && Joueur.action == true){
					elementUnit.wayPoint = true;
					//Calcul du bonus de distance
					var distanceXetY = new Array(Math.abs(Joueur.posX - elementUnit.posX),Math.abs(Joueur.posY - elementUnit.posY));
					var distance = Math.max(distanceXetY[0],distanceXetY[1])
					var bonus = 0;
					if (distance < Joueur.porteeMinage && elementUnit.destruct==false){
						Laser(Joueur, elementUnit, "miner");
						bonus = (100-(100/Joueur.porteeMinage*distance))*Joueur.ratioPorteeMinageOptimale;
						if (bonus > 100){
							bonus = 100;
						}
						ctx.fillText(Math.floor(bonus)+"%", window.mouseX+60, window.mouseY+5);
						ctx.fillText("life: "+elementUnit.life, window.mouseX+60, window.mouseY+15);
						
						// Calcul Pourcentage barre restante avant recolte crystal
						var totalVieParCrystal = elementUnit.vieParCrytal;
						var barreVieLongueur = 50;
						var longueurRestante = barreVieLongueur * elementUnit.vieProchainCrystal / totalVieParCrystal;
						ctx.beginPath();
						ctx.strokeStyle="#AA7744";
						ctx.lineWidth = 5;
						ctx.moveTo(window.mouseX+15, window.mouseY+10);
						ctx.lineTo(window.mouseX+15+longueurRestante, window.mouseY+10);
						ctx.fillText(elementUnit.vieProchainCrystal, window.mouseX+15+longueurRestante, window.mouseY+15);
						ctx.stroke();
						ctx.lineWidth = 1;
						
						// Chance du joueur dans la recolte
						var jetDeDes = Math.random()*elementUnit.difficulte;
						
						//Application bonus minage
						var minageSkillBonus = Joueur.minageSkill * bonus / 100 + Joueur.minageSkill;
						if (Joueur.bonusMinage > 0){
							minageSkillBonus += Joueur.bonusMinage * Joueur.minageSkill;
						}
						
						//Recolte d'un crystal
						if ( minageSkillBonus >= jetDeDes && distance < Joueur.porteeMinage){
							//pose des effets de minage
							var posEffMinX = (elementUnit.posX-elementUnit.width/2)+getRandomInt(elementUnit.width);
							var posEffMinY = (elementUnit.posX-elementUnit.height/2)+getRandomInt(elementUnit.height);
							var effetMinage = new Effet(0, posEffMinX, posEffMinY);
							
							// diminue la barre de vie asteroide
							elementUnit.vieProchainCrystal--;
							
							
							if ( elementUnit.vieProchainCrystal <=0){
								elementUnit.life--;
								if(elementUnit.life<=0){
									elementUnit.destruct = true;
								}else{
									elementUnit.vieProchainCrystal = elementUnit.vieParCrytal;
								}
								Joueur.crystals++;
								
							}
						}
					}
					
				}else{
					if(elementUnit.name == "asteroide"){
						elementUnit.vieProchainCrystal = elementUnit.vieParCrytal;
						elementUnit.wayPoint = false;
						Joueur.wayPointsConsecutifs = 0;
					}
				}
				
				
			}else{
				if(elementUnit.name == "asteroide"){
					elementUnit.vieProchainCrystal = elementUnit.vieParCrytal;
					elementUnit.wayPoint = false;
					Joueur.wayPointsConsecutifs = 0;
				}
			}
		}
		
	}
}

function ChampAsteroides(posX, posY, nb, rayon){
	this.posX = posX;
	this.posY = posY;
	this.number = nb;
	this.grandeur = rayon;
	this.generate = function(){
		for(i = 0; i<this.number; i++){
			var asteroide = new Asteroide((this.posX+getRandomInt(this.grandeur)), (this.posY+getRandomInt(this.grandeur)), getRandomInt(3));
			asteroide.defineIMG();
			tableauAsteroides.push(asteroide);
		}
	}
}

function Asteroide(posX, posY, category, vie){
	this.exist = true;
	this.life = vie;
	this.alpha = 1;
	this.name = "asteroide";
	this.difficulte = 10;
	this.vieParCrytal = 10;
	this.vieProchainCrystal = 10;
	this.surprise = 3;
	this.surpriseDureeMax = new Array(1,5);
	this.wayPoint = false;
	this.chanceBonus = 1; // ici CHANCEBONUS signifi la chance qu'a l'asteroide de donner un waypoint
	this.bonusCompare = 100;// donnee en pourcentage ici en pourcentage
	this.posX = posX;
	this.posY = posY;
	this.image = new Image();
	this.image.src = "img/Asteroid"+category+".png";
	this.angleRotation = 0;
	this.vitesseRotation = 0.005;
	this.tailleCategory = (category+2)*10;
	this.tailleAfinee = 0;
	this.width = this.tailleCategory + getRandomInt(this.tailleAfinee);
	this.height = this.tailleCategory + getRandomInt(this.tailleAfinee);
	this.destruct = false;
	this.update = function(){
		
		//Bonus temporaire ##########################################
		var comparaison = getRandomInt(this.bonusCompare);
		if (this.wayPoint == true && this.chanceBonus+Joueur.bonusMinage >= comparaison && tableauWayPoints.length <= 9){ // bonus minage du joueur influent sur le nombre de waypoints autour de l'asteroide
			this.wayPoint = true;
			var wpPosX = this.posX- (Joueur.porteeMinage/1.5) + getRandomInt(Joueur.porteeMinage);
			var wpPosY = this.posY- (Joueur.porteeMinage/1.5) + getRandomInt(Joueur.porteeMinage);
			var duree = 500;
			var longueDuree = 3000+getRandomInt(1000);
			var jetAleatoire = getRandomInt(100);
			if ( jetAleatoire >50){ // une fois sur 5 pope un bonus (waypoint) qui stuffskill carrement longtemps
				var wayPoint = new WayPoint(0, wpPosX, wpPosY, longueDuree, this);
			}else{
				var wayPoint = new WayPoint(0, wpPosX, wpPosY, duree, this);
			}
			tableauWayPoints.push(wayPoint);
		}
		
		// Affichage#################################################
		afficher(this, "rotationON", "alphaON");
		
		//Destruction si life = 0
		if(this.destruct == true){
			this.alpha-=0.1;
			if(this.alpha <= 0.1){
				for(let i=0;i<tableauElements.length;i++){
					if(tableauElements[i].cible == this){
						tableauElements[i].cible = null;
					}
				}
				this.exist = false;
			}
		}
		
	}
	this.rotation = function(){
		if(this.angleRotation <= 360){
			this.angleRotation += this.vitesseRotation;
		}else{
			this.angleRotation = 0;
		}
	}
}


function Station(posX, posY, varRotation, varFaction){
	this.exist = true;
	this.name = "Station";
	this.faction = varFaction;
	this.inWorld = false;
	this.onMap = true;
	this.degats = 10;
	this.rayonVisee = 200;
	this.distanceTir = 200;
	this.vitesseRotation = varRotation;
	this.angleRotation = 0;
	this.posX = posX;
	this.posY = posY;
	this.x = 0;
	this.y = 0;
	this.image = new Image();
	this.image.src = "img/stationJoueur.png";
	this.width = 211;
	this.height = 189;
	this.structure = 10000;
	this.tableau = new Array;
	this.bay = new Array();
	//this.zoneEmTir = new Array([this.posX-rayonVisee, this.posY-rayonVisee, this.posX+rayonVisee, this.posY+rayonVisee]);
	this.rotation = function(){
		if(this.angleRotation <= 360){
			this.angleRotation += this.vitesseRotation;
		}else{
			this.angleRotation = 0;
		}
	}
	this.update = function(){
		afficher(this, "rotationON", "alphaOFF");
	}
}

function Vaisseau(type, posX, posY, varFaction, behavior) {
	this.exist = true;
	this.alpha = 1;
	this.faction = varFaction;
	this.name = type;
	this.behavior = behavior; // Attaque, patrouille, minage
	this.inWorld = false;
	this.onMap = true;
	this.posX = posX;
	this.posY = posY;
	this.image = new Image();
	this.trajectoire = new Array(0, 0);
	this.cible = null;
	this.porteeScan = 4000;
	this.porteeTir = 250;
	this.porteeDocking = 20;
	this.angleRotation = 0;
	this.vitesseX = 0;
	this.vitesseY = 0;
	this.docking = false;
	this.docked = false;
	if (type == "scout"){
		this.cadenceTir = 10;
		this.dgt = 50;
		this.caleCapacity = 10;
		this.cale = 0;
		this.mineSpeed = 100; // tous les 500 rafraichissements CTX, incremente +1 la cale du vaisseau
		this.mined = 0;
		this.width = 30;
		this.height= 38;
		this.structure = 100;
		this.acceleration = 0.10;
		this.bonusMinage = 0.2;
		this.vitesseMax = 0;
		this.vitesseMaxM = 3;
		this.image.src = "img/scout.png";
		
	}
	
	this.update = function(){
		
		//Si le PNJ est docked
		if(this.docked == true){
			this.desaparition();
		}
		
		
		// Si le PNJ a un objectif :
		if (this.cible != null){
			
			//se tourner vers la cible
			let angleFinal = Math.atan2(this.cible.posY-this.posY, this.cible.posX-this.posX);
			this.angleRotation = angleFinal;

			//Si la cible du vaisseau est une Station spatiale
			if(this.cible.name == "Station"){
				if(this.docking == true){
					// Si le vaisseau est a portee de docking
					if(Math.abs(this.cible.posX-this.posX) <= this.porteeDocking || Math.abs(this.cible.posY-this.posY) <= this.porteeDocking){
						this.docked = true;
						this.docking = false;
						this.cible.bay.push(this);
						this.cible.bay.length;
					}
				}
			}
			//determiner un point de trajectoire a partir de la cible :
			if (this.trajectoire[0]== 0 && this.trajectoire[1] == 0){
				this.trajectoire[0] = this.cible.posX - this.porteeTir + getRandomInt(this.porteeTir*2);
				this.trajectoire[1] = this.cible.posY - this.porteeTir + getRandomInt(this.porteeTir*2);
			}
			
			// se deplacer vers la cible
			// definir par ou doit aller le vaisseau
			let separationX = this.posX - this.trajectoire[0];
			let separationY = this.posY - this.trajectoire[1];
			
			let separationXabs = Math.abs(separationX);
			let separationYabs = Math.abs(separationY);
			
			if (separationXabs < this.porteeTir/5 && separationYabs < this.porteeTir/5){
				//ralenti quand pres de la cible
				if (this.vitesseMax > 0.1){
					this.vitesseMax -= this.acceleration;
				}else{
					this.trajectoire[0] = 0;
					this.trajectoire[1] = 0;
				}
			}else{
				//pousse les gazs
				if (this.vitesseMax < this.vitesseMaxM){
					this.vitesseMax += this.acceleration;
				}
			}
			
			//Mode ATTAQUE
			let separationCibleX = Math.abs(this.posX - this.cible.posX);
			let separationCibleY = Math.abs(this.posY - this.cible.posY);
			if (separationCibleX < this.porteeTir && separationCibleY <this.porteeTir && this.behavior == "attaque"){
				if(Math.round(Math.random()*this.cadenceTir) == 1){
					//tirer(this, this.cible, this.dgt);
				}else{
					this.tirBullet++;
				}
			}
			
			//MODE MINEUR
			// Gestion minage & Cale
			
			if (separationXabs < this.porteeTir && separationYabs <= this.porteeTir && this.behavior == "minage" && this.cible.name == "asteroide"){
				Laser(this, this.cible, "miner");
				this.mined++;
				if(this.mined >= this.mineSpeed){
					this.mined = 0;
					this.cale++
					if(this.cale >= this.caleCapacity){
						let stationsToScan = new Array();
						for(let i = 0; i < tableauElements.length ; i++){
							let element = tableauElements[i];
							if(element.name == "Station")
								stationsToScan.push(element);
						}
						this.cible = Closest(this, stationsToScan); // rentrer a la station
						this.docking = true;
					}
				}
				ctx.fillText("cale:"+this.cale+"mined:"+this.mined, this.x+myGameArea.canvas.width/2 - this.width/2,this.y+myGameArea.canvas.height/2+this.height+5);
			}
			
			var plusGrand = Math.max(separationXabs, separationYabs);
			var pourcent = 0;
			
			
			if (plusGrand == separationXabs){
				pourcent = (separationYabs*100)/separationXabs;
				if (separationX > 0){
					this.vitesseX = -(this.vitesseMax);
				}else{
					this.vitesseX = this.vitesseMax;
				}
				var pourcentDeY = pourcent * this.vitesseMax / 100;
				if (separationY > 0){
					this.vitesseY = -(pourcentDeY);
				}else{
					this.vitesseY = pourcentDeY;
				}
			}else{
				pourcent = separationXabs *100 / separationYabs;
				if (separationY > 0){
					this.vitesseY = -(this.vitesseMax);
				}else{
					this.vitesseY = this.vitesseMax;
				}
				var pourcentDeX = pourcent * this.vitesseMax / 100;
				if (separationX > 0){
					this.vitesseX = -(pourcentDeX);
				}else{
					this.vitesseX = pourcentDeX;
				}
			}
		
			// actualisation position
			this.posX += this.vitesseX;
			this.posY += this.vitesseY;
			//scanner 
			//for (i = 0; i < tableauElements.length
		}else{
			// definir l'objectif si le vaisseau a un comportement de mineur
			if(this.behavior == "minage"){
				// chercher un asteroide
				chercher(this, "asteroide");
			// Definir une cible a attaquer si le comportement est agressif
			}else if(this.behavior == "attaque"){
				// Chercher un ennemi
				chercher(this, "Joueur");
			}
		}
		//Affiche le vaisseau
		afficher(this, "rotationOFF", "alphaON");
	}
	this.desaparition = function(){
		this.alpha-=Math.random()*1/(getRandomInt(10)+5);
		if (this.alpha <= 0.1){
			this.exist = false;
		}
	}
	
}

function WayPoint(type, posX, posY, duree, referant){
	this.referance = referant;
	this.exist = true;
	this.validated = false;
	this.type = type;
	this.alpha = 1;
	this.duree = duree;
	this.posX = posX;
	this.posY = posY;
	this.width = 50;
	this.height = 50;
	this.vitesseRotation = 0.5;
	this.angleRotation = 0;
	this.attributionDiverse = 0;
	this.image = new Image();
	switch(this.type){
		case 0:
		this.image.src = "img/WayPointPosOpt2.png";
		break;
	}
	this.rotation = function(){
		if(this.angleRotation <= 360){
			this.angleRotation += this.vitesseRotation;
		}else{
			this.angleRotation = 0;
		}
	}
	this.update = function(){
		afficher(this, "rotationON", "alphaON");
		
		//Si le waypoint concerne un asteroide
		if (type == 0){
			for(let i=0;i<tableauAsteroides;i++){
				let astrd = tableauAsteroides[i];
				if(astrd == this.referance){
					this.exist = false;
				}
			}
			
			var critique = false;
			if (this.attributionDiverse == 0){
				//bonus normal ou... CRITIQUE!
				var jetAleatoire = Math.random()*100;
				if (jetAleatoire > 90){
					this.attributionDiverse = 0.5+Math.random()*2;
					critique = true;
				}else{
					this.attributionDiverse = Math.random()*0.3;
				}
			}
			// Check si le joueur passe sur le waypoint
			var comparerPosX = Math.abs(Joueur.posX - (this.posX));
			var comparerPosY = Math.abs(Joueur.posY - (this.posY));
			if(comparerPosX <= this.width/2 && comparerPosY <= this.height/2 && this.validated == false){
				this.validated = true;
				Joueur.bonusMinage += this.attributionDiverse;
				Joueur.wayPointsConsecutifs++;
				var txtNotifBonus = Math.round(this.attributionDiverse*100);
				var txtNotifBonusCritique = "-#!CRITIQUE!#-";
				if (critique == true){
					this.duree = 250;
					var notif = new Notification("+"+txtNotifBonusCritique+"%", 50, true);
				}else{
					var notif = new Notification("+"+txtNotifBonus+"%", 50, true);
				}
				if (Joueur.wayPointsConsecutifs == 1){
					//var achievmentWPC = new Achievment(0, "Achieved", "FFFFFF", "333333");
					//tableauAchievments.push(achievmentWPC);
				}
			}else if (this.validated == true && this.alpha >= 0){
				this.alpha -= 0.1;
				if (this.alpha < 0){this.alpha = 0;}
				this.width *= 1.05;
				this.height *= 1.05;
			}
		}
		this.duree--;
		if (this.duree <= 0){
			Joueur.bonusMinage -= this.attributionDiverse;
			this.exist = false;
		}
	}
}


function Effet(type, posX, posY, alpha){
	this.exist = true;
	this.type = type;
	this.posX = posX;
	this.posY = posY;
	if(alpha = "alphaON"){
		this.alpha = Math.random()*1;
	}else{
		this.alpha = 1;
	}
	this.image = new Image();
	switch(this.type){
		case 0: // ASTEROIDES
		this.image.src = "img/effetMinage"+getRandomInt(2)+".png";
		var taille = getRandomInt(40)+5
		this.width = taille;
		this.height = taille;
		break;
		
		case 1: // DEGATS
		this.image.src = "img/effetExplosion"+getRandomInt(2)+".png";
		var taille = getRandomInt(40)+10
		this.width = taille;
		this.height = taille;
		break;
		
		case 2: // DESTRUCTION
		this.image.src = "img/effetExplosion"+getRandomInt(2)+".png";
		var taille = getRandomInt(10)+100
		this.width = taille;
		this.height = taille;
		break;
	}
	
	tableauEffets.push(this);
	this.update = function(){
		afficher(this, "rotationOFF", "alphaON");
		this.diminution();
	}
	this.diminution = function(){
		this.alpha-=Math.random()*1/(getRandomInt(10)+5);
		if (this.alpha <= 0.1){
			this.exist = false;
		}
	}
}