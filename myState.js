var myState = new Kiwi.State('myState');

myState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'], 0, 0);
	this.addChild(this.background);

	this.header = new Kiwi.GameObjects.StaticImage(this, this.textures['header'], 0, 0);
	this.addChild(this.header);

	this.textbg1 = new Kiwi.GameObjects.StaticImage(this, this.textures['textbg1'], 29,174);
	this.addChild(this.textbg1);
	this.textbg1.alpha = 0;

	this.textbg2 = new Kiwi.GameObjects.StaticImage(this, this.textures['textbg2'], 245, 148);
	this.addChild(this.textbg2);
	this.textbg2.alpha = 0;

	this.textbg3 = new Kiwi.GameObjects.StaticImage(this, this.textures['textbg3'], 480, 150);
	this.addChild(this.textbg3);
	this.textbg3.alpha = 0;

	this.sign1 = new Kiwi.GameObjects.StaticImage(this, this.textures['sign'], 90,372);
	this.addChild(this.sign1);

	this.sign2 = new Kiwi.GameObjects.StaticImage(this, this.textures['sign'], 350,372);
	this.addChild(this.sign2);

	this.sign3 = new Kiwi.GameObjects.StaticImage(this, this.textures['sign'], 600,372);
	this.addChild(this.sign3);

/*	this.text1 = new Kiwi.Plugins.GameObjects.BitmapText(this, this.textures['textAtlas'], 
		"Hey look! This is         a text box.", 66,198);
	this.addChild(this.text1);
	this.text1.maxWidth = 210;
	this.text1.scaleX = 0.8;
	this.text1.scaleY = 1.5;
	this.text1.alpha = 0;

	this.text2 = new Kiwi.Plugins.GameObjects.BitmapText(this, this.textures['textAtlas'], 
		"There is more text in this           section so we have made it           smaller and increased the            width of the object.", 290,180);
	this.addChild(this.text2);
	this.text2.maxWidth = 300;
	this.text2.scaleX = 0.8;
	this.text2.scaleY = 1.5;
	this.text2.alpha = 0;

	this.text3 = new Kiwi.Plugins.GameObjects.BitmapText(this, this.textures['otherfont'], 
		" You can change    the font and   color of the text   by using a    different texture", 512,192);
	this.addChild(this.text3);
	this.text3.maxWidth = 360;
	this.text3.scaleX = 0.6;
	this.text3.scaleY = 0.6;
	this.text3.alpha = 0;*/

	this.topText = new Kiwi.Plugins.GameObjects.BitmapText(this, this.textures['textAtlas'],
		"Walking in front of a sign will display a new block of text!", 43, 33);
	this.topText.maxWidth = 2000;
	this.topText.scaleX = 1.1;
	this.topText.scaleY = 1.5;
	this.addChild(this.topText);

	this.character = new Kiwi.GameObjects.Sprite(this, this.textures['ninja'], 20, 303);
	this.character.animation.add('idle', [0], 0.1, false);
	this.character.animation.add('move', [1,2,3,4,5,6], 0.1,true);
	this.character.animation.play('idle');
	this.addChild(this.character);
	this.character.box.hitbox = new Kiwi.Geom.Rectangle(48,37,27,75);

	this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);


}

myState.update = function(){
	Kiwi.State.prototype.update.call(this);


	if(this.leftKey.isDown){
		this.character.scaleX = -1;
		this.character.x-=3;
		if(this.character.animation.currentAnimation.name!='move')
			this.character.animation.switchTo('move', true);
	}
	else if(this.rightKey.isDown){
		this.character.scaleX = 1;
		this.character.x+=3;
		if(this.character.animation.currentAnimation.name!='move')
			this.character.animation.switchTo('move', true);
	}
	else
		this.character.animation.switchTo('idle');


	if(this.character.box.hitbox.intersects(this.sign1.box.hitbox) && this.text1.alpha == 0){
		var tw = this.game.tweens.create(this.text1);
		tw.to({alpha:1}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
		var tw = this.game.tweens.create(this.textbg1);
		tw.to({alpha:1}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
	}
	else if(!this.character.box.hitbox.intersects(this.sign1.box.hitbox) && this.text1.alpha == 1){
		var tw = this.game.tweens.create(this.text1);
		tw.to({alpha:0}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
		var tw = this.game.tweens.create(this.textbg1);
		tw.to({alpha:0}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
	}

	if(this.character.box.hitbox.intersects(this.sign2.box.hitbox) && this.text2.alpha == 0){
		var tw = this.game.tweens.create(this.text2);
		tw.to({alpha:1}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
		var tw = this.game.tweens.create(this.textbg2);
		tw.to({alpha:1}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
	}
	else if(!this.character.box.hitbox.intersects(this.sign2.box.hitbox) && this.text2.alpha == 1){
		var tw = this.game.tweens.create(this.text2);
		tw.to({alpha:0}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
		var tw = this.game.tweens.create(this.textbg2);
		tw.to({alpha:0}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
	}

	if(this.character.box.hitbox.intersects(this.sign3.box.hitbox) && this.text3.alpha == 0){
		var tw = this.game.tweens.create(this.text3);
		tw.to({alpha:1}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
		var tw = this.game.tweens.create(this.textbg3);
		tw.to({alpha:1}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
	}
	else if(!this.character.box.hitbox.intersects(this.sign3.box.hitbox) && this.text3.alpha == 1){
		var tw = this.game.tweens.create(this.text3);
		tw.to({alpha:0}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
		var tw = this.game.tweens.create(this.textbg3);
		tw.to({alpha:0}, 500, Kiwi.Animations.Tweens.Easing.Linear.None, true);
	}
	

}