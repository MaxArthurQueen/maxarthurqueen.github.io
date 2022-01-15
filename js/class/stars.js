var tableauEtoiles = new Array;

var FondEtoile = {
	start : function(nbEtoiles){
		var etoiles = nbEtoiles;
		for(i = 0; i<etoiles; i++){
			var etoile = new Etoile(Math.random()*myGameArea.canvas.width, Math.random()*myGameArea.canvas.height);
			tableauEtoiles.push(etoile);
		}//
	},
	update : function(){
		var nbEtoiles = tableauEtoiles.length;
		for(i = 0; i<nbEtoiles; i++){
			var etoile = tableauEtoiles[i];
			etoile.update();
		}
	}
}

function Etoile(posX, posY){
	this.x = posX;
	this.y = posY;
	var position = 3;
	var tabCouleurs = ["white","lightblue","orange", "lightgreen"];
	var tailleAleatoire = 1 + Math.floor(Math.random() * 2);
	this.position = Math.round(Math.random() * position);
	this.width = Math.floor(tailleAleatoire);
	this.height = Math.floor(tailleAleatoire);
	this.couleur = tabCouleurs[Math.floor(Math.random() * tabCouleurs.length)];
	this.update = function(){
		
		if(this.x < 0){this.x = myGameArea.canvas.width;}
		if(this.x > myGameArea.canvas.width){this.x = 0;}
		if(this.y < 0){this.y = myGameArea.canvas.height;}
		if(this.y > myGameArea.canvas.height){this.y = 0;}
		
		switch(this.position){
			case 0:
				this.x += Joueur.vitesseX/3;
				this.y += Joueur.vitesseY/3;
				break;
				
			case 1:
				this.x += (Joueur.vitesseX/5);
				this.y += (Joueur.vitesseY/5);
				break;
				
			case 2:
				this.x += (Joueur.vitesseX/10);
				this.y += (Joueur.vitesseY/10);
				break;
				
			case 3:
				this.x += (Joueur.vitesseX*4);
				this.y += (Joueur.vitesseY*4);
				break;
				
		}
		ctx = myGameArea.context;
		if(this.position == 3){
			ctx.beginPath();
			ctx.moveTo(this.x+Joueur.vitesseX, this.y+Joueur.vitesseY);
			ctx.lineTo(this.x+(-Joueur.vitesseX*10),this.y+(-Joueur.vitesseY*10));
			ctx.strokeStyle = '#222222';
			ctx.stroke();
		}else{
			ctx.fillStyle = this.couleur;
			ctx.fillRect(this.x, this.y, this.width, this.height)
		}
	}
}