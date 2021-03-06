function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function afficher(object, rotation, alpha) {
	object.x = object.posX - Joueur.posX;
	object.y = object.posY - Joueur.posY;
	ctx = myGameArea.context;
	ctx.save();
	ctx.translate(object.x+(myGameArea.canvas.width/2), object.y+(myGameArea.canvas.height/2));
	if (rotation == "rotationON"){
		object.rotation();
	}
	
	ctx.rotate(object.angleRotation);
	
	if (alpha == "alphaON"){
		ctx.globalAlpha = object.alpha;
	}
	ctx.drawImage(object.image, -object.width/2, -object.height/2, object.width, object.height);
	ctx.restore();
}

function Notification(texte, duree, anime){
	this.anime = anime;
	this.exist = true;
	this.texte = texte;
	this.duree = duree;

	if (this.anime == true){
		this.width = 50;
	}else{
		this.width = 20;
	}

	this.update = function(){
		this.duree--;
		if (this.duree <=0){
			this.exist = false;
		}
		if(this.width >20){
			this.width-=this.width/5;
		}
		ctx.font = this.width+"px Arial";
		ctx.fillText(this.texte, 0, -50);	
	}
	
	tableauNotifs.push(notif);
}

function effetSurvol(elementUnit){
	ctx.beginPath();
	ctx.strokeStyle="#FFFFFF";
	//trait haut gauche vers le bas
	ctx.moveTo(elementUnit.x+window.innerWidth/2-elementUnit.width/2-15, elementUnit.y+window.innerHeight/2-elementUnit.height/2-15);
	ctx.lineTo(elementUnit.x+window.innerWidth/2-elementUnit.width/2-15, elementUnit.y+elementUnit.height/5+window.innerHeight/2-elementUnit.height/2-15); 
	
	//trait haut gauche vers la droite
	ctx.moveTo(elementUnit.x+window.innerWidth/2-elementUnit.width/2-15, elementUnit.y+window.innerHeight/2-elementUnit.height/2-15);
	ctx.lineTo(elementUnit.x+window.innerWidth/2-elementUnit.width/2+elementUnit.width/5-15, elementUnit.y+window.innerHeight/2-elementUnit.height/2-15);
	
	//trait bas droite vers la gauche
	ctx.moveTo(elementUnit.x+window.innerWidth/2+elementUnit.width/2-8, elementUnit.y+window.innerHeight/2+elementUnit.height/2-12);
	ctx.lineTo(elementUnit.x+window.innerWidth/2-elementUnit.width/5+elementUnit.width/2-8, elementUnit.y+window.innerHeight/2+elementUnit.height/2-12);
	
	//trait bas droite vers le haut
	ctx.moveTo(elementUnit.x+window.innerWidth/2+elementUnit.width/2-8, elementUnit.y+window.innerHeight/2+elementUnit.height/2-12);
	ctx.lineTo(elementUnit.x+window.innerWidth/2+elementUnit.width/2-8, elementUnit.y+window.innerHeight/2-elementUnit.height/5+elementUnit.height/2-12);
	
	ctx.stroke();
}

function chercher(chercheur, elementCherche){
	
	if(elementCherche == "asteroide" || elementCherche.name == "asteroide"){
		let tableauAstrd = new Array;
		if(tableauAsteroides.length > 0){
			
			for (var i=0; i < tableauAsteroides.length; i++){
				let astrd = tableauAsteroides[i];
				if(astrd.exist == true){
					let diffX = Math.abs(chercheur.posX - astrd.posX);
					let diffY = Math.abs(chercheur.posY - astrd.posY);
					
					// Si l'asteroide est a portee du radar du chercheur
					if (diffX <= chercheur.porteeScan && diffY <= chercheur.porteeScan){
						tableauAstrd.push(astrd);
					}
					let nbRdm = Math.round(Math.random()*tableauAstrd.length);
					chercheur.cible = tableauAstrd[nbRdm];
				}
			}
		}else{
			let stationsArr = new Array();
			for(i=0;i<tableauElements.length;i++){
				if(tableauElements[i].name == "Station"){
					stationsArr.push(tableauElements[i]);
				}
			}
			chercheur.cible = Closest(chercheur, stationsArr);
			chercheur.docking = true;
		}
		
	}else if(elementCherche == "Joueur"){
		chercheur.cible = Joueur;
	}
}

function Laser(mineur, asteroide, mode){
	var showRandom = getRandomInt(1000);
	var showRandomFin = showRandom + (mineur.bonusMinage*100)
	var numFin = Math.floor(Math.random()*20) + 1; // grandeur de la zone graphique de la dispertion rayon minier
	numFin *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	var numDepart = Math.floor(Math.random()*5) + 1;
	numDepart *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	var amplitudeDepart = Math.floor(Math.random() * numDepart) + 1 
	var amplitudeFinX = Math.floor(Math.random() * numFin) + 1 
	var amplitudeFinY = Math.floor(Math.random() * numFin) + 1 
	if (showRandom > 800 - (mineur.bonusMinage*80)){
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = Math.random()*5;
		ctx.strokeStyle="#BBBBFF";
		ctx.globalAlpha=Math.random()*1;
		if(mineur==Joueur){
			ctx.moveTo(mineur.x+amplitudeDepart,mineur.y+amplitudeDepart);
		}else{
			ctx.moveTo(mineur.x+myGameArea.canvas.width/2+amplitudeDepart,mineur.y+myGameArea.canvas.height/2+amplitudeDepart);
		}
		ctx.lineTo(asteroide.x+myGameArea.canvas.width/2+amplitudeFinX,asteroide.y+myGameArea.canvas.height/2+amplitudeFinY);
		ctx.stroke();
		ctx.restore();
		//ctx.strokeStyle="#AAAAFF";
	}
}

//  Le second parametre est soit un array dont il return l'element le plus proche, soit directement un element, (vaisseau, station...)
function Closest(chercheur, elementsArray){
	let param2 = Array.isArray(elementsArray);
	if(param2 == true){
		let cCoord = chercheur.posX + chercheur.posY;
		let distanceArr = new Array();
		if(elementsArray.length > 1){
			for(let i=0; i < elementsArray.length;i++){
				let element = elementsArray[i];
				let distance = Math.abs((element.posX+element.posY)-cCoord)
				distanceArr.push(distance);
			}
			distanceArr.sort(function(a, b){return a - b});
			return distanceArr[0];
		}else{
			return elementsArray[0];
		}
	}else{
		chercheur.cible = elementsArray;
	}
}

function tirer(tireur, cible, dgt){
	var numFin = Math.floor(Math.random()*20) + 1; // grandeur de la zone graphique de la dispertion rayon minier
	numFin *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	var numDepart = Math.floor(Math.random()*5) + 1;
	numDepart *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	var amplitudeDepart = Math.floor(Math.random() * numDepart) + 1 
	var amplitudeFinX = Math.floor(Math.random() * numFin) + 1 
	var amplitudeFinY = Math.floor(Math.random() * numFin) + 1
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = Math.random()*5;
	ctx.strokeStyle="#FF6767";
	ctx.globalAlpha=Math.random()*1;
	ctx.moveTo(tireur.x+myGameArea.canvas.width/2+amplitudeDepart,tireur.y+myGameArea.canvas.height/2+amplitudeDepart);
	if (cible == Joueur){
		ctx.lineTo(cible.x+amplitudeFinX,cible.y+amplitudeFinY);
	}else{
		ctx.lineTo(cible.x+myGameArea.canvas.width/2+amplitudeFinX,cible.y+myGameArea.canvas.height/2+amplitudeFinY);
	}
	ctx.stroke();
	ctx.restore();
	
	ctx.beginPath();
	ctx.strokeStyle="#FF9A9A";
	ctx.moveTo(tireur.x+myGameArea.canvas.width/2+amplitudeDepart,tireur.y+myGameArea.canvas.height/2+amplitudeDepart);
	if (cible == Joueur){
		ctx.lineTo(cible.x+amplitudeFinX,cible.y+amplitudeFinY);
	}else{
		ctx.lineTo(cible.x+amplitudeFinX,cible.y+amplitudeFinY);
	}
	ctx.stroke();
	
	var dgtInfliges = Math.round(dgt/2 + (Math.random()*dgt/2));
	cible.structure-= dgtInfliges;
}