/**
*
* @module myState
*
*/

var myState = new Kiwi.State( "myState" );
var currentStyle = 1;
var totalStyles;

myState.loadFont = function (f, offsetY=0){

	/**
	Function to load fonts whenever the selection in the dropdown menu changes.

	@method render
	@param f {string} Name of the font
	@param offsetY=0 {number} The offset of the whole spritesheet on the Y-axis. 
		Indicates which row/style of the spritesheet is to be used. 
		Defaults to 0 and increments/decrements of 8.
	**/


	this.addSpriteSheet(f, './arcadeFonts/8x8/' + f + '.png', 8, 8, true, 0, 0, 0, 0, 0);


	this.game.loader.start();


	var myNewFontLoaded = function(){

	/**
	Internal function to execute once the loader has finished.
	Save all the parameters in temporary variables, remove the Child and
		readd a new Bitmap-object with the different offset but same parameters.

	@method myNewFontLoaded
	**/

	var atlas = new Kiwi.Textures.SpriteSheet(f, this.game.fileStore.getFile(f).data, 8, 8, 0, 0, 0, 0, offsetY);
	this.textureLibrary.add(atlas);
	atlas.dirty = true;

	var tempScaleX = this.currentText.scaleX;
	var tempScaleY = this.currentText.scaleY;
	var tempX = this.currentText.x;
	var tempY = this.currentText.y;
	var tempAlign = this.currentText.align;
	var tempAnchorpointX = this.currentText.anchorPointX;
	var tempmaxWidth = this.currentText.maxWidth;
	var tempWidth = this.currentText.width;
	var tempHeight = this.currentText.height;

	this.removeChild(this.currentText, true);
	this.currentText = new Kiwi.Plugins.GameObjects.BitmapText(this, this.textures[f],
		this.currentText.text, tempX, tempY);

		this.currentText.align = tempAlign;
		this.currentText.width = tempWidth;
		this.currentText.maxWidth = tempmaxWidth;
		this.currentText.anchorPointX = tempAnchorpointX;
		this.currentText.height = tempHeight;
		this.currentText.box = new Kiwi.Components.Box(this.currentText);
		this.currentText.scaleX = tempScaleX;
		this.currentText.scaleY = tempScaleY;

		this.addChild(this.currentText);
		totalStyles = atlas._rows;
		$('#totalStyles').text(totalStyles);
	}
	this.game.loader.onQueueComplete.addOnce(myNewFontLoaded, this);
};

myState.zoomIn = function() {
	/**
	Scales the bitmap object on both X and Y-axis +0.1.

	@method zoomIn
	**/
	this.currentText.scaleX += 0.1;
	this.currentText.scaleY += 0.1;
};

myState.zoomOut = function() {
	/**
	Scales the bitmap object on both X and Y-axis +0.1.

	@method zoomOut
	**/
	this.currentText.scaleX -= 0.1;
	this.currentText.scaleY -= 0.1;
};

myState.nextFont = function() {
	/**
	Changes to the next font.

	@method nextFont
	**/
	$('option:selected', 'select').removeAttr('selected').prev('option').attr('selected', 'selected');
	this.loadFont($("#font option:selected").text());
	$('#fontTitle').text($("#font option:selected").text());
	currentStyle = 1;
	$('#currentStyle').text(currentStyle);
};

myState.prevFont = function() {
	/**
	Changes to the previous font.

	@method prevFont
	**/
	$('option:selected', 'select').removeAttr('selected').next('option').attr('selected', 'selected');
	this.loadFont($("#font option:selected").text());
	$('#fontTitle').text($("#font option:selected").text());
	currentStyle = 1;
	$('#currentStyle').text(currentStyle);
};

myState.nextStyle = function() {
	/**
	Changes to the next style.

	@method nextStyle
	**/
	var height = this.currentText.atlas.rows * 8;

	//Is the Y-axis offset smaller than the spritesheet height?
	if(this.currentText.atlas.sheetOffsetY < height-8) {
		var fontstyle = this.currentText.atlas.sheetOffsetY + 8;
		this.loadFont($("#font option:selected").text(), fontstyle);
		currentStyle++;
		$('#currentStyle').text(currentStyle);
	}
};

myState.prevStyle = function() {
	/**
	Changes to the previous style.

	@method prevStyle
	**/

	//Is the Y-axis offset bigger than 0?
	if(this.currentText.atlas.sheetOffsetY > 0) {
		var fontstyle = this.currentText.atlas.sheetOffsetY - 8;
		this.loadFont($("#font option:selected").text(), fontstyle);
		currentStyle--;
		$('#currentStyle').text(currentStyle);
	}
};


myState.create = function() {
	/**
	Creates all objects and add them. Assigns keyboard and mouse inputs.

	@method create
	**/

	Kiwi.State.prototype.create.call( this );
	this.game.stage.color = "262224";
	//Add all the assets

	
	this.currentText = new Kiwi.Plugins.GameObjects.BitmapText(
		this, this.textures[ "NinjaGaiden" ],
		"Start Typing",
		this.game.stage.width/2, this.game.stage.height/2);
	this.currentText.align = 2;
	this.currentText.width = this.currentText.text.length * this.currentText.atlas.cellWidth;
	this.currentText.maxWidth = this.game.stage.width / 1.5;
	this.currentText.scaleX = 1.9;
	this.currentText.scaleY = 2.5;
	this.currentText.height = this.currentText.atlas.cellHeight;
	this.currentText.box = new Kiwi.Components.Box(this.currentText);
	this.currentText.anchorPointX = this.currentText.maxWidth * 0.5;
	this.currentStyle = 1;
	this.totalStyles = this.currentText.atlas.rows;


	
	//Add mouse and keyboard input
	this.mouse = this.game.input.mouse;

	this.qKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.Q );
	this.wKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.W );
	this.eKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.E );
	this.rKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.R );
	this.tKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.T );
	this.zKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.Z );
	this.uKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.U );
	this.iKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.I );
	this.oKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.O );
	this.pKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.P );
	this.aKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.A );
	this.sKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.S );
	this.dKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.D );
	this.fKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.F );
	this.gKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.G );
	this.hKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.H );
	this.jKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.J );
	this.kKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.K );
	this.lKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.L );
	this.yKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.Y );
	this.xKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.X );
	this.cKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.C );
	this.vKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.V );
	this.bKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.B );
	this.nKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.N );
	this.mKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.M );

	this.oneKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.ONE );
	this.twoKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.TWO );
	this.threeKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.THREE );
	this.fourKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.FOUR );
	this.fiveKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.FIVE );
	this.sixKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.SIX );
	this.sevenKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.SEVEN );
	this.eightKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.EIGHT );
	this.nineKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.NINE );
	this.zeroKey = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.ZERO );

	this.spaceBar = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.SPACEBAR, true);
	this.backSpace = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.BACKSPACE, true);
	this.enter = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.ENTER, true);
	this.up = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.UP, true);
	this.down = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.DOWN, true);
	this.left = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.LEFT, true);
	this.right = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.RIGHT, true);
	this.delete = this.game.input.keyboard.addKey( Kiwi.Input.Keycodes.DELETE, true)

	this.game.input.keyboard.justPressedRate = 20;

	//Add all the children

	this.addChild( this.currentText );

};

myState.checkKeyboard = function() {

	/**
	Function called in the update loop checking for Keyboard input.
	Renders the mapped character onto the screen.
	Enter/Linebreak is not supported yet.

	@method checkKeyboard
	**/

	if(this.qKey.justPressed()) {
		this.currentText.text += 'q';
	} else if (this.wKey.justPressed()) {
		this.currentText.text += 'w';
	} else if (this.eKey.justPressed()) {
		this.currentText.text += 'e';
	} else if (this.rKey.justPressed()) {
		this.currentText.text += 'r';
	} else if (this.tKey.justPressed()) {
		this.currentText.text += 't';
	} else if (this.zKey.justPressed()) {
		this.currentText.text += 'z';
	} else if (this.uKey.justPressed()) {
		this.currentText.text += 'u';
	} else if (this.iKey.justPressed()) {
		this.currentText.text += 'i';
	} else if (this.oKey.justPressed()) {
		this.currentText.text += 'o';
	} else if (this.pKey.justPressed()) {
		this.currentText.text += 'p';
	} else if (this.aKey.justPressed()) {
		this.currentText.text += 'a';
	} else if (this.sKey.justPressed()) {
		this.currentText.text += 's';
	} else if (this.dKey.justPressed()) {
		this.currentText.text += 'd';
	} else if (this.fKey.justPressed()) {
		this.currentText.text += 'f';
	} else if (this.gKey.justPressed()) {
		this.currentText.text += 'g';
	} else if (this.hKey.justPressed()) {
		this.currentText.text += 'h';
	} else if (this.jKey.justPressed()) {
		this.currentText.text += 'j';
	} else if (this.kKey.justPressed()) {
		this.currentText.text += 'k';
	} else if (this.lKey.justPressed()) {
		this.currentText.text += 'l';
	} else if (this.yKey.justPressed()) {
		this.currentText.text += 'y';
	} else if (this.xKey.justPressed()) {
		this.currentText.text += 'x';
	} else if (this.cKey.justPressed()) {
		this.currentText.text += 'c';
	} else if (this.vKey.justPressed()) {
		this.currentText.text += 'v';
	} else if (this.bKey.justPressed()) {
		this.currentText.text += 'b';
	} else if (this.nKey.justPressed()) {
		this.currentText.text += 'n';
	} else if (this.mKey.justPressed()) {
		this.currentText.text += 'm';
	} else if (this.oneKey.justPressed()) {
		this.currentText.text += '1';
	} else if (this.twoKey.justPressed()) {
		this.currentText.text += '2';
	} else if (this.threeKey.justPressed()) {
		this.currentText.text += '3';
	} else if (this.fourKey.justPressed()) {
		this.currentText.text += '4';
	} else if (this.fiveKey.justPressed()) {
		this.currentText.text += '5';
	} else if (this.sixKey.justPressed()) {
		this.currentText.text += '6';
	} else if (this.sevenKey.justPressed()) {
		this.currentText.text += '7';
	} else if (this.eightKey.justPressed()) {
		this.currentText.text += '8';
	} else if (this.nineKey.justPressed()) {
		this.currentText.text += '9';
	} else if (this.zeroKey.justPressed()) {
		this.currentText.text += '0';
	} else if (this.spaceBar.justPressed()) {
		this.currentText.text += ' ';
	} else if (this.backSpace.justPressed()) {
		this.currentText.text = this.currentText.text.slice(0, -1);
	} else if (this.enter.justPressed()) {
		//this.currentText.text += '\n';
	} else if (this.up.justPressed()) {
		this.nextStyle();
	} else if (this.down.justPressed()) {
		this.prevStyle();
	} else if (this.left.justPressed()) {
		this.prevFont();
	} else if (this.right.justPressed()) {
		this.nextFont();
	}
};


myState.createTextbox = function(x1, y1, x2, y2) {
	/**
	Creates a textbox upon click and drag or even just click.

	@method createTextbox
	@param x1 {number} X-coordinate of the initial click.
	@param y1 {number} Y-coordinate of the initial click.
	@param x2 {number} X-coordinate of the mouse-release.
	@param y2 {number} Y-coordinate of the mouse-release.
	**/

	var endWidth, endHeight, textPositionX, textPositionY;
	var defaultWidth = 300;
	var defaultHeight = 50;

	//Remove existing rectangle if it exists
	if(this.rectangle) {
		this.removeChild(this.rectangle);
	}
	
	//Set width/height to default height/width when mouse was only clicked.
	if(x2 === x1) {
		endWidth = defaultWidth;
	} else {
		endWidth = x2-x1;
	}
	if(y2 === y1) {
		endHeight = defaultHeight;
	} else {
		endHeight = y2-y1;
	}

	this.rectangle = new Kiwi.Plugins.Primitives.Rectangle({
		state: this,
		strokeColor: [ 0, 0.59, 0.99 ],
		centerOnTransform: false,
		width: endWidth,
		height: endHeight,
		drawFill: false,
		enableInput: true,
		x: x1,
		y: y1
	});

	//Set the coordinates of the text depending on the position of start/end coordinates.
	if(x1 > x2) {
		textPositionX = x2;
	} else {
		textPositionX = x1;
	}
	if(y1 > y2) {
		textPositionY = y2;
	} else {
		textPositionY = y1;
	}

	this.currentText = new Kiwi.Plugins.GameObjects.BitmapText(
		this, this.textures[ "NinjaGaiden" ],
		"",
		textPositionX, textPositionY);
	this.currentText.maxWidth = this.rectangle.width / 1.45;
	this.currentText.scaleX = 1.5;
	this.currentText.scaleY = 2.1;
	this.currentText.height = this.currentText.atlas.cellHeight * 8;
	this.currentText.box = new Kiwi.Components.Box(this.currentText);
	
	//Add all the children
	this.addChild(this.rectangle);
	this.addChild(this.currentText);
};
myState.editTextbox = function (textbox) {
	/**
	Edit the text that was clicked on.

	A new rectangle object gets created.

	@method editTextbox
	**/

	//Change current text to the one that was clicked on.
	this.currentText = textbox;

	this.rectangle = new Kiwi.Plugins.Primitives.Rectangle({
		state: this,
		strokeColor: [ 0, 0.59, 0.99 ],
		centerOnTransform: false,
		width: this.currentText.width * 1.5,
		height: this.currentText.height,
		drawFill: false,
		enableInput: true,
		x: this.currentText.x,
		y: this.currentText.y
	});
	if(this.currentText.align == 2) {
		this.rectangle.visible = false;
	}
	this.addChild(this.rectangle);
};

myState.checkMouse = function () {

	/**
	Check the mouse input whenever it clicks somewhere on the screen.

	Edit a textbox whenever a bitmap-object gets clicked on.
	Otherwise it creates a new one.

	@method checkMouse
	**/

	/**
    * Boolean value that determines whether we edit or create a textbox.
    * @property editCheck
    * @public
    */
    this.editCheck;

    if( this.mouse.justPressed(20) ) {
    	this.startPointX = this.mouse.x;
    	this.startPointY = this.mouse.y;
    	var amountChildren = this.getAllChildren().length;
    	//Loop through all the children and check whether mouse is on that child
    	for(var i = 0; i < amountChildren; i++) {
			//Edit textbox if clickarea was on a bitmap-object
			if(this.getChildAt(i).box.worldBounds.contains(this.mouse.x, this.mouse.y)) {
				//Remove existing rectangle
				if(this.rectangle) {
					this.removeChild(this.rectangle);
				}
				//Edit that child
				this.editTextbox(this.getChildAt(i));
				this.editCheck = true;
				break;
			} else {
				//No children were clicked on
				this.editCheck = false;
			}
		}
		
	}
	//Create a new textbox that changes while mouse is held down.
	if(this.mouse.isDown && this.editCheck === false) {
		this.endPointX = this.mouse.x;
		this.endPointY = this.mouse.y;
		this.createTextbox(this.startPointX, this.startPointY, this.endPointX, this.endPointY);
	}
};
myState.checkHeight = function() {

	/**
	Check whether textsize reaches the textbox size.
	If that is the case, the textbox size gets increased.

	@method checkHeight
	**/

	if(this.rectangle) {
		if(this.currentText._tempHeight) {
			if(this.currentText._tempHeight >= this.rectangle.height / 2.1) {
				var tempWidth = this.rectangle.width;
				var tempHeight = this.rectangle.height;

				this.removeChild(this.rectangle);

				this.rectangle = new Kiwi.Plugins.Primitives.Rectangle({
					state: this,
					strokeColor: [ 0, 0.59, 0.99 ],
					centerOnTransform: false,
					width: tempWidth,
					height: tempHeight + 8,
					drawFill: false,
					x: this.currentText.x,
					y: this.currentText.y
				});
				this.addChild(this.rectangle);
			}
		}
	}
}

myState.update = function() {
	/**
	Update function that keeps looping during the game.

	@method update
	**/

	Kiwi.State.prototype.update.call( this );
	this.checkKeyboard();
	this.checkMouse();
	this.checkHeight();
};

//If dropdown selection changes, change the font title next to it
$('#fontTitle').text($("#font option:selected").text());

//Call the loadFont function when selection changes
$('#font').change(
	function() {
		myState.loadFont($("#font option:selected").text());
		$('#fontTitle').text($("#font option:selected").text());
	}
);

//Clears initial "Start Typing" text when any key is pressed
$(document).keypress(function(e) {
	if(myState.currentText.text == 'Start Typing') {
		myState.currentText.text = '';
	}
});