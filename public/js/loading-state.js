var loadingState = new Kiwi.State( "loadingState" );

loadingState.preload = function() {
	this.addSpriteSheet('NinjaGaiden', './arcadeFonts/8x8/Ninja Gaiden (Tecmo).png', 8, 8, true, 0, 0, 0, 0, 0);
};

loadingState.create = function() {
	this.game.states.switchState( "myState" );
};
