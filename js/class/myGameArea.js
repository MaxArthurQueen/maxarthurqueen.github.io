var tableauNotifs = new Array;
var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function(){
		//this.canvas.style.cursor = "none";
		this.canvas.width = window.innerWidth-20;
		this.canvas.height = window.innerHeight-30;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 35);
		this.mouseX = 0;
		this.mouseY = 0;
		this.crystalCompteur = new CrystalCompteur();
		this.vie = new VieCompteur();
		
		window.addEventListener("mousemove", function (e){
			this.mouseX = e.pageX;
			this.mouseY = e.pageY;
		})
		window.addEventListener("mousedown", function (e){
			Joueur.action = true;
		})
		window.addEventListener("mouseup", function (e){
			Joueur.action = false;
		})
		window.addEventListener("keydown", function (e){
			var code = e.keyCode;
			switch(code){
				case 77:
					if (Map.activated == false){
						Map.activated = true;
					}else{
						Map.activated = false;
					}
			}
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = true;
		})
		window.addEventListener("keyup", function (e){
			myGameArea.keys[e.keyCode] = false;
		})
	},
	stop : function(){
		clearInterval(this.interval);
	},
	clear : function(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	update : function(){
		this.canvas.width = window.innerWidth-20;
		this.canvas.height = window.innerHeight-30;
		this.mouseX = Joueur.posX - (this.canvas.width/2) + window.mouseX;
		this.mouseY = Joueur.posY - (this.canvas.height/2) + window.mouseY;
		ctx = this.context;
		ctx.save();
		ctx.drawImage(this.crystalCompteur.image, this.canvas.width-this.crystalCompteur.width,10, this.crystalCompteur.width, this.crystalCompteur.height);
		this.vie.update();
	}
}
function CrystalCompteur(){
	this.image = new Image();
	this.image.src = "img/crystal.png";
	this.width = 30;
	this.height = 30;
}

function VieCompteur(){
	this.width = 400;
	
	this.update = function(){
		
		if(Joueur.structure < 0){
			Joueur.structure = 0;
		}
		//Calcul barre de vie restante
		var barreVie = Joueur.structure * 400 / Joueur.structureRef;
		//Vie totale
		var ctx = myGameArea.context;
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.strokeStyle ="#552222";
		ctx.globalAlpha = 1;
		ctx.moveTo(myGameArea.canvas.width/2-this.width/2,myGameArea.canvas.height-15);
		ctx.lineTo(myGameArea.canvas.width/2+this.width/2,myGameArea.canvas.height-15);
		ctx.stroke();
		// Vie effective
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.strokeStyle ="#FF4b4b";
		ctx.globalAlpha = 1;
		ctx.moveTo(myGameArea.canvas.width/2-this.width/2, myGameArea.canvas.height-15);
		ctx.lineTo(myGameArea.canvas.width/2-this.width/2+barreVie, myGameArea.canvas.height-15);
		ctx.stroke();
		ctx.fillStyle = "#ffffff";
		ctx.font = "9px Arial";
		ctx.fillText(Joueur.structure, myGameArea.canvas.width/2-this.width/2+barreVie+5, myGameArea.canvas.height-12);
		ctx.restore();
	}
}

var tableauPts = new Array;
var Map = {
	start : function(largeurScan){
		this.scanRadar = largeurScan;
		this.activated = false;
	},
	update : function(){
		for(i=0; i<tableauElements.length; i++){
			
			if (tableauElements[i].onMap == true){
				if(tableauElements[i].inWorld == false){
					tableauElements[i].inWorld = true;
					tableauPts.push(tableauElements[i]);
				}
			}
		}
		if (this.activated == true){
			var fenetreWidth = myGameArea.canvas.width;
			var fenetreHeight = myGameArea.canvas.height;
			if (fenetreWidth >= fenetreHeight){
				this.afficher(fenetreWidth, fenetreHeight);
			}else{
				this.afficher(fenetreHeight, fenetreWidth);
			}
		}else{
			var ctx = myGameArea.context;
			ctx.globalAlpha = 1;
		}
	},
	afficher : function(cotePlusGrand, cotePlusPetit){
		var ctx = myGameArea.context;
		
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = "green";
		ctx.fillRect((cotePlusGrand-cotePlusPetit)/2, 0, cotePlusPetit, cotePlusPetit);	
		ctx.restore();
		
		ctx.beginPath();
		var espaceLignes = cotePlusPetit/20;
		for ( i = 0; i < 20; i++){
			ctx.moveTo((cotePlusGrand-cotePlusPetit)/2, espaceLignes*i);
			ctx.lineTo(((cotePlusGrand-cotePlusPetit)/2)+cotePlusPetit, espaceLignes*i);
		}
		
		for ( i = 0; i < 21; i++){
			ctx.moveTo((cotePlusGrand-cotePlusPetit)/2 + espaceLignes*i, 0);
			ctx.lineTo((cotePlusGrand-cotePlusPetit)/2 + espaceLignes*i, cotePlusPetit);
		}
		ctx.strokeStyle = '#227722';
		ctx.stroke();
		
		ctx.fillStyle = "#ffffff";
		//CONVERTI TOUS LES ELEMENTS MAJEURS EN VISIBLE SUR LA MINIMAP
		//alert(tableauPts.length);
		for(i=0; i<tableauPts.length; i++){
			var elementPosX = tableauPts[i].posX-Joueur.posX;
			var elementPosY = tableauPts[i].posY-Joueur.posY;
			var prodCroixX = elementPosX * 100 / (this.scanRadar/2);
			var prodCroixY = elementPosY * 100 / (this.scanRadar/2);
			var positionMiniMapX = prodCroixX / cotePlusPetit * 100;
			var positionMiniMapY = prodCroixY / cotePlusPetit * 100;
			
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(((cotePlusGrand-cotePlusPetit)/2)+(cotePlusPetit/2)+(positionMiniMapX)-2, (cotePlusPetit/2)+(positionMiniMapY)-2, 4, 4);
		}
		// Indicateur blanc du JOUEUR
		ctx.fillRect(((cotePlusGrand-cotePlusPetit)/2)+(cotePlusPetit/2)-2, (cotePlusPetit/2)-2, 4, 4);
	}
}

var tableauTirs = new Array;
var GestionTirs = {
	// Tir des stations et vaisseaux ennemis
	generation : function(){//Compare en permanence tous les vaisseaux et stations du tableau afin qu'ils se tirent dessus si ?? portee
		for(i = 0; i < tableauElements.length; i++){
			var elementViseur = tableauElements[j];
			
			for(j = 0; j < tableauElements.length; j++){
				var elementVise = tableauElements[j];
				
				if (elementViseur.faction != elementVise.faction){ // Si le vaisseau detecte la presence ennemi
					var diffX = Math.abs(elementViseur.posX - elementVise.posX);
					var diffY = Math.abs(elementViseur.posY - elementVise.posY);
					if(diffX < elementViseur.distanceTir+10 && diffY < elementViseur.distanceTir+10){ // Si la portee est bonne, generer le tir.
						var tir = new Tir("normal", elementViseur.posX, elementViseur.posY, elementVise.posX, elementVise.posY);
						tableauTirs.push(tir);
					}
				}
			}
		}
	}
}

function Tir(type, launchedX, launchedY, destinationX, destinationY){
	this.posX = launchedX;
	this.posY = launchedY;
	this.visible = Math.random()*1; // definira l'opacite de l'explosion
	switch (type){
		case "normal":
			this.dmg = 10;
			this.vitesse = 10;
			break;
	}
	
}