var myGame = new Kiwi.Game(
	"",
	"TextPopUpTutorial",
	null,
	{
		plugins: [ "BitmapText" ],
		// renderer: Kiwi.RENDERER_CANVAS
	}
);

myGame.states.addState( loadingState );
myGame.states.addState( myState );

myGame.states.switchState( "loadingState" );
