function Station(posX, posY){
	alert("update OK");
	this.image = new Image();
	this.image.src = "img/stationJoueur.png";
	this.width = 100;
	this.height = 100;
	this.posX = posX;
	this.posY = posY;
	
	this.update(){
		
		this.x += Joueur.vitesseX;
		this.y += Joueur.vitesseY;
		this.posX += Joueur.vitesseX;
		this.posY += Joueur.vitesseY;
		
		
		//ctx = myGameArea.context;
		//ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height);
	}
}