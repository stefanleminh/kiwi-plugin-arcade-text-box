Kiwi.Plugins.BitmapText = {

	/**
	Plugin data for `BitmapText`.

	Use `Kiwi.Plugins.GameObjects.BitmapText` for the actual object.

	@module Kiwi
	@submodule Plugins
	@namespace Kiwi.Plugins
	@class BitmapText
	**/

	/**
	Name of this plugin

	@property name
	@type string
	@default "BitmapText"
	@public
	**/
	name: "BitmapText",

	/**
	Version of this plugin.

	@property version
	@type string
	@default "1.2.0"
	**/
	version: "1.2.0"
};

Kiwi.PluginManager.register( Kiwi.Plugins.BitmapText );


// Do Kiwi Plugin GameObjects Exist?
if ( typeof Kiwi.Plugins.GameObjects == "undefined" ) {
	Kiwi.Plugins.GameObjects = {};
}

Kiwi.Plugins.GameObjects.BitmapText = function( state, atlas, text, x, y ) {

	/**
	GameObject to display bitmap text.
	Works in a very similar fashion to the default `TextField` GameObject
	included in the core of KiwiJS, except this one uses a TextureAtlas
	instead of a font.

	You can also set the maximum width of the Text to span multiple lines.

	@class BitmapText
	@extends Entity
	@namespace Kiwi.Plugins.GameObjects
	@constructor
	@param state {Kiwi.State} State that this gameobject belongs to
	@param atlas {TextureAtlas|SpriteSheet} Spritesheet or textureatlas
		that holds the font.
	@param text {string} Text to display. Can be changed later.
	@param x {number} Horizontal coordinate
	@param y {number} Vertical coordinate
	**/

	Kiwi.Entity.call( this, state, x, y );

	if ( typeof text == "undefined" ) {
		text = null;
	}

	/**
	Which way the text should be in alignment.

	@property _align
	@type number
	@default LEFT
	@private
	**/
	this._align = Kiwi.Plugins.GameObjects.BitmapText.LEFT;

	/**
	Reference of which cell of the atlas is used for each string character.
	This isn't a robust object - it doesn't contain every character possible.
	You should add references as necessary.

	@property _alphabeticalCells
	@private
	@type array
	**/
	this._alphabeticalCells = {
		' ':0,
        "!":1,       "\"":2,
        "#":3,       "$":4,
        "%":5,       "&":6,
        "\'":7,       "(":8,
        ")":9,       "*":10,
        "+":11,       ",":12,
        "-":13,       ".":14,
        "/":15,       "0":16,
        "1":17,       "2":18,
        "3":19,       "4":20,
        "5":21,       "6":22,
        "7":23,       "8":24,
        "9":25,       ":":26,
        ";":27,       "<":28,
        "=":29,       ">":30,
        "?":31,       "@":32,
        A:33,       B:34,
        C:35,       D:36,
        E:37,       F:38,
        G:39,       H:40,
        I:41,       J:42,
        K:43,       L:44,
        M:45,       N:46,
        O:47,       P:48,
        Q:49,       R:50,
        S:51,       T:52,
        U:53,       V:54,
        W:55,       X:56,
        Y:57,       Z:58,
        "[":59,     "\\":60,
        "]":61,     "^":62,
        "_":63,      "`":64,
        a:65,       b:66,
        c:67,       d:68,
        e:69,       f:70,
        g:71,       h:72,
        i:73,       j:74,
        k:75,       l:76,
        m:77,       n:78,
        o:79,       p:80,
        q:81,       r:82,
        s:83,       t:84,
        u:85,       v:86,
        w:87,       x:88,
        y:89,       z:90,
        "{":91,     "|":92,  
        "}":93,     "~":94
	};

	/**
	Property used to decide which characters should go on which lines

	@property _lines
	@type array
	@private
	**/
	this._lines = [];

	/**
	Whether the text should be smooth; that is,
	whether CANVAS should enable image smoothing,
	or WebGL should use LINEAR or NEAREST texture blending.

	Note: CANVAS support is still experimental,
	and may default to smooth.

	@property _smooth
	@type boolean
	@default false
	@private
	**/
	this._smooth = false;

	/**
	Whether the gameobject is "dirty" and needs "re-rendering"

	@property _tempDirty
	@type boolean
	@private
	**/
	this._tempDirty = true;

	/**
	Texture atlas that the bitmapText relies on

	@property atlas
	@type Kiwi.Textures.TextureAtlas
	@public
	**/
	this.atlas = atlas;

	/**
	Default cell to be used when a cell could not be found
	for a particular character.

	Currently the default is the same as what a "space" would be.

	@property defaultCell
	@type number
	@default 67
	@public
	**/
	this.defaultCell = 67;

	/**
	The maximum width of the TextField. Set to `null` if
	no maximum width is desired, i.e. if the text is to be all on one line.

	@property maxWidth
	@type number
	@default null
	@public
	**/
	this.maxWidth = null;

	/**
	Punctation characters that are used to separate words
	but stay on at the end of word they are attached to.

	@property punctionationChars
	@type array
	@public
	**/
	this.punctionationChars = [ ".", "!", "?", ":", ";", ",", "-" ];

	/**
	Whether the atlas used is "supported"

	@property supported
	@type boolean
	@public
	**/
	this.supported = true;

	/**
	Text to be rendered

	@property text
	@type string
	@private
	**/
	this.text = text;


	// Check to see if a valid atlas was passed.
	if ( this.atlas.type == Kiwi.Textures.TextureAtlas.SINGLE_IMAGE ) {

		this.supported = false;
		if ( this.game.debugOption == Kiwi.DEBUG_ON ) {
			Kiwi.Log.warn(
				"Single Images will not work " +
				"with the Bitmap Text GameObject!" );
		}

	} else {

		if ( this.game.renderOption === Kiwi.RENDERER_WEBGL ) {
			this.glRenderer = this.game.renderer.requestSharedRenderer(
				"TextureAtlasRenderer" );

			/**
			Temporary point used to compute screen coordinates

			@property _pt1
			@type Kiwi.Geom.Point
			@private
			**/
			this._pt1 = new Kiwi.Geom.Point();

			/**
			Temporary point used to compute screen coordinates

			@property _pt2
			@type Kiwi.Geom.Point
			@private
			**/
			this._pt2 = new Kiwi.Geom.Point();

			/**
			Temporary point used to compute screen coordinates

			@property _pt3
			@type Kiwi.Geom.Point
			@private
			**/
			this._pt3 = new Kiwi.Geom.Point();

			/**
			Temporary point used to compute screen coordinates

			@property _pt4
			@type Kiwi.Geom.Point
			@private
			**/
			this._pt4 = new Kiwi.Geom.Point();

		} else {

			/**
			Canvas to which the text is rendered, and is then rendered
			to the stage.

			Only created in CANVAS rendering mode.

			@property _tempCanvas
			@type HTMLCanvasElement
			@private
			**/
			this._tempCanvas = document.createElement( "canvas" );

			// Set the inital width/height to be base2.
			// Will be overriden the first time the text is rendered.
			this._tempCanvas.width = 2;
			this._tempCanvas.height = 2;

			/**
			2d context for the temporary canvas.

			Only created in CANVAS rendering mode.

			@property _tempCtx
			@type HTMLCanvasContent
			@default undefined
			@private
			**/
			this._tempCtx = this._tempCanvas.getContext( "2d" );
		}

		/**
		Width (or what it should be) of the text.

		@property _tempWidth
		@type number
		@private
		**/
		this._tempWidth = 0;

		/**
		Height (or what it should be) of the text

		@property _tempHeight
		@type number
		@private
		**/
		this._tempHeight = 0;

		/**
		Current "word" whose individual character lines are being determined.

		@property _tempWord
		@type array
		@private
		**/
		this._tempWord = [];

	}

	this._setTextureSharpness( this._smooth );
};


Kiwi.extend( Kiwi.Plugins.GameObjects.BitmapText, Kiwi.Entity );


Object.defineProperties(
	Kiwi.Plugins.GameObjects.BitmapText.prototype,
	{
		"alphabeticalCells": {

			/**
			Reference of which cell of the atlas is used
			for each string character.
			This isn't a robust object -
			it doesn't contain every character possible.
			You should add references as necessary.

			@property alphabeticalCells
			@public
			@type array
			**/

			get: function() {
				return this._alphabeticalCells;
			},
			set: function( val ) {

				// Re-render
				this._tempDirty = true;
				this._alphabeticalCells = val;
			},
			enumerable: true,
			configurable: true
		},

		"align": {

			/**
			Which way the text should be aligned

			@property align
			@type number
			@public
			@default LEFT
			**/

			get: function() {
				return this._align;
			},
			set: function( val ) {

				// Re-render
				this._tempDirty = true;
				this._align = val;
			},
			enumerable: true,
			configurable: true
		},

		"smooth": {

			/**
			Whether the texture should be sampled with linear pixel blends,
			or should just use sharp "NEAREST" sampling.

			Support is only guaranteed for WebGL for now,
			but most browsers support the necessary functions
			for sharp CANVAS rendering.

			@property smooth
			@type boolean
			@default false
			**/

			get: function() {
				return this._smooth;
			},
			set: function( value ) {

				this._smooth = value;
				this._setTextureSharpness( value );
			}
		},

		"text": {

			/**
			Text to be rendered in the BitmapTextfield

			@property text
			@type string
			@public
			**/

			get: function() {
				return this._text;
			},
			set: function( val ) {

				// Re-render
				this._tempDirty = true;
				this._text = val;
			},
			enumerable: true,
			configurable: true
		},

		"width": {

			/**
			The actual width of the text. This property is READ ONLY,
			and does not directly affect anything.

			@property width
			@type number
			@public
			**/

			get: function() {
				return this._tempWidth;
			},
			enumerable: true,
			configurable: true
		}
	} );


Kiwi.Plugins.GameObjects.BitmapText.remap = function( list, obj ) {

	/**
	Update all the `alphabeticalCells` of bitmaptext objects passed
	to a reference object.

	Note: This just calls the remap method on the gameobjects.

	@method remap
	@static
	@param list {array} List of `BitmapText` objects
	@param obj {object} Remap object
	@public
	**/

	for ( var bgo in list ) {
		list[ bgo ].remap( obj );
	}

};


Kiwi.Plugins.GameObjects.BitmapText.prototype._addTempWord = function() {

	/**
	Start to add the `_tempWord` to the lines.

	@method _addTempWord
	@private
	**/

	var charCell, line, t;

	if (
		typeof this._tempWord[ 0 ] !== "undefined" &&
		this._tempWord[ this._tempWord.length - 1 ].line -
			this._tempWord[ 0 ].line > 1 ) {

		this._multiLineTextBreak();

	} else {

		line = this._lines[ this._lines.length - 1 ];

		// Loop through the word, and add it to the current line.
		for ( t = 0; t < this._tempWord.length; t++ ) {
			charCell = this._tempWord[ t ].cell;

			// Don't print leading spaces
			if ( line.text.length === 0 &&
				this._tempWord[ t ].char === " " ) {

				continue;
			}

			line.text.push( charCell );
			line.width += charCell.w;
		}

		// Reset the tempWord.
		this._tempWord.length = 0;

	}
};


Kiwi.Plugins.GameObjects.BitmapText.prototype._multiLineText = function() {

	/**
	Figure out which cell is to be used for each character in the text.
	Also figure out which lines the characters/words should go on.
	This method is used for BitmapText objects with a maximum width set
	(as they could span multiple lines).

	Should NOT be called by the developer/external objects.

	@method _multiLineText
	@private
	**/

	var i, cell, cw, w,
		newline = false;

	// Contains the cells/characters of the last word that is to be added.
	this._tempWord = [];

	// Calculate the height/width?...
	for ( i = 0; i < this.text.length; i++ ) {

		// Get the cell relating to the current text.
		cell = this.atlas.cells[ this.cellNumber( this.text[ i ] ) ];

		if ( typeof cell !== "undefined" && typeof cell !== null ) {

			// This is a new space?
			if (
				this.text[ i ] === " " ||
				this._tempWord.length === 1 &&
				this._tempWord[ 0 ].char === " "
				) {

				this._addTempWord();
			}

			// Get what would be the new width
			cw = this._tempWidth + parseInt( cell.w, 10 );

			// Would it extend past the maxWidth?
			if ( cw >= this.maxWidth ) {

				// Calculate the current width of the new line.
				this._tempWidth = 0;
				for ( w = 0; w < this._tempWord.length; w++ ) {
					this._tempWidth +=
						parseInt( this._tempWord[ w ].cell.w, 10 );
				}
				this._tempWidth += parseInt( cell.w, 10 );

				// Generate the new line
				this._lines.push( {
					text: [],
					height: 0,
					width: 0
				} );

			// Otherwise add the width to it
			} else {
				this._tempWidth = cw;
			}

			// Does the new height extend past the regular height?
			if ( this._lines[ this._lines.length - 1 ].height < cell.h ) {
				this._lines[ this._lines.length - 1 ].height = cell.h;
			}

			// Add the cell to the temp word storage
			this._tempWord.push( {
				"cell": cell,
				"char": this.text[ i ],
				"line": this._lines.length - 1,
				"cw": this._tempWidth
			} );

			// This is a punction character?
			if ( this.punctionationChars.indexOf( this.text[ i ] ) !== -1 ) {

				this._addTempWord();

			}
			if (this.text[i] == '\n') {
				console.log('Please implement linebreak!');
			}

		}
	}

	// Add the last `_tempWord` to the canvas.
	this._addTempWord();

	// Re-calculate the total height that the canvas should be.
	this._tempHeight = 0;
	for ( i = 0; i < this._lines.length; i++ ) {
		this._tempHeight += this._lines[ i ].height;
	}

	if ( this._lines.length > 0 ) {
		this._tempWidth = this.maxWidth;
	}
	
};


Kiwi.Plugins.GameObjects.BitmapText.prototype._multiLineTextBreak =
function() {

	/**
	Make the word stored in `_tempWord` break
	when it is wrapped over multiple lines.

	@method _multiLineTextBreak
	@private
	**/

	// Get the line difference...
	var j,
		l = this._tempWord[ this._tempWord.length - 1 ].line -
			this._tempWord[ 0 ].line;

	// Remove the lines that were generated by this word...
	this._lines.splice( this._lines.length - l, l );

	// Get the "original" width.
	this._tempWidth = this._tempWord[ 0 ].cw - this._tempWord[ 0 ].cell.w;

	// Loop through the word
	for ( j = 0; j < this._tempWord.length; j++ ) {

		// Add to the width
		this._tempWidth += this._tempWord[ j ].cell.w;

		// Would it extend past the maxWidth?
		if ( this._tempWidth >= this.maxWidth ) {

			// Reset the width
			this._tempWidth = this._tempWord[ j ].cell.w;

			// Generate the new line.
			this._lines.push( {
				text: [],
				height: 0,
				width: 0
			} );
		}

		// Does the height of this cell exceed the previous one?
		if ( this._lines[ this._lines.length - 1 ].height <
				this._tempWord[ j ].cell.h ) {

			this._lines[ this._lines.length - 1 ].height =
				this._tempWord[ j ].cell.h;
		}

		// Add the cell to the new line.
		this._lines[ this._lines.length - 1 ].text.push(
			this._tempWord[ j ].cell );
		this._lines[ this._lines.length - 1 ].width +=
			this._tempWord[ j ].cell.w;

	}

	// Reset the temp word.
	this._tempWord.length = 0;

};


Kiwi.Plugins.GameObjects.BitmapText.prototype._renderText = function() {

	/**
	Re-calculate which character goes to which cell,
	and render the text to `_tempCanvas`.

	@method _renderText
	@private
	**/

	// Reset the width/height of the temp canvas
	this._tempWidth = 0;
	this._tempHeight = 0;

	// Reset the lines.
	this._lines = [ {
		text: [],
		height: 0,
		width: 0
	} ];

	if ( this.maxWidth === null ) {

		this._singleLineText();

	// If there is a max-width
	} else {

		this._multiLineText();

	}

	// No longer dirty as we just re-rendered it
	this._tempDirty = false;
};


Kiwi.Plugins.GameObjects.BitmapText.prototype._renderToTempCanvas =
function() {

	/**
	Render the lines/text to the temporary canvas.

	@method _renderToTempCanvas
	@private
	**/

	var cell, i, j, x, y;

	// Clear the temporary canvas.
	this._tempCtx.clearRect(
		0, 0, this._tempCanvas.width, this._tempCanvas.height );

	// Set the width/height of the canvas.
	this._tempCanvas.width = this._tempWidth;
	this._tempCanvas.height = this._tempHeight;

	// Set-up the x/y.
	x = 0;  // TODO: Check left/right/center
	y = 0;

	// Loop through the lines and render them on the temporary canvas.
	for ( j = 0; j < this._lines.length; j++ ) {

		// Alignment of the lines for canvas
		if ( this.maxWidth ) {
			if ( this.align ===
				Kiwi.Plugins.GameObjects.BitmapText.RIGHT_ALIGN ) {

				x = this.maxWidth - this._lines[ j ].width;

			} else if ( this.align ===
				Kiwi.Plugins.GameObjects.BitmapText.CENTER_ALIGN ) {

				x = ( this.maxWidth - this._lines[ j ].width ) * 0.5;

			}
		}

		for ( i = 0; i < this._lines[ j ].text.length; i++ ) {

			cell = this._lines[ j ].text[ i ];

			if ( typeof cell !== "undefined" ) {
				this._tempCtx.drawImage(
					this.atlas.image,
					cell.x , cell.y, cell.w, cell.h, x, y, cell.w, cell.h );

				x += parseInt( cell.w, 10 );
			}
		}

		x = 0;
		y += this._lines[ j ].height;

	}

};


Kiwi.Plugins.GameObjects.BitmapText.prototype._setTextureSharpness =
function( sharp ) {

	/**
	Set the sharpness of the texture atlas of this object.
	This will set the filters to NEAREST or LINEAR.

	WebGL only.

	@method _setTextureSharpness
	@param sharp {boolean=true} Whether to use LINEAR, not NEAREST
	@private
	**/

	var filter,
		gl = this.game.stage.gl,
		wrapper = this.atlas.glTextureWrapper;

	if ( !gl || !wrapper ) {
		return;
	}

	filter = sharp ? gl.LINEAR : gl.NEAREST;

	gl.bindTexture( gl.TEXTURE_2D, wrapper.texture );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter );
	gl.bindTexture( gl.TEXTURE_2D, null );
};


Kiwi.Plugins.GameObjects.BitmapText.prototype._singleLineText = function() {

	/**
	Figure out which cell is to be used for each character in the text.
	Only for BitmapText objects that don't have a maximum width set,
	so the text won't be spanning multiple lines.

	Should NOT be called by the developer/external objects.

	@method _singleLineText
	@private
	**/

	var i, cell;

	for ( i = 0; i < this.text.length; i++ ) {

		cell = this.atlas.cells[ this.cellNumber( this.text[ i ] ) ];

		if ( typeof cell != null ) {

			// Calculate the height.
			if ( cell.h > this._tempHeight ) {
				this._tempHeight = cell.h;
			}

			// Calculate the width.
			this._tempWidth += parseInt( cell.w, 10 );
		}

		// Add the text to the next line.
		this._lines[ this._lines.length - 1 ].text.push( cell );
	}

	// Add the width.
	this._lines[ this._lines.length - 1 ].width = this._tempWidth;

};


Kiwi.Plugins.GameObjects.BitmapText.prototype.cellNumber =
function( character ) {

	/**
	Return the CELL number that will be used for a character that is passed.

	@method cellNumber
	@param character {string} Character to check
	@return {number} Cell number that will be used
	@public
	**/

	// Do we have a cell reference for that character?
	var alpha = this.alphabeticalCells[ character ];

	if ( typeof alpha === "undefined" ) {
		return this.defaultCell;
	} else {
		return alpha;
	}

};


Kiwi.Plugins.GameObjects.BitmapText.prototype.remap = function( obj ) {

	/**
	Update the string-cell references on `alphabeticalCells`
	based on an object that is passed.

	The object passed doesn't have to contain every character-cell reference,
	only those that are to be changed.

	@method remap
	@param obj {object} Remap object, where characters are keys and
		cell indices are properties
	@public
	**/

	for ( var i in obj ) {
		this.alphabeticalCells[ i ] = obj[ i ];
	}

};


Kiwi.Plugins.GameObjects.BitmapText.prototype.render = function( camera ) {

	/**
	Render the text to the stage.

	@method render
	@param camera {Kiwi.Camera}
	@public
	**/

	var ctx, t, m, ct;

	if ( !(
		this.supported &&
		this.text != null &&
		this.text !== "" &&
		this.alpha > 0 &&
		this.visible ) ) {

		return;
	}

	// Does the text need re-rendering?
	if ( this._tempDirty ) {
		this._renderText();
		this._renderToTempCanvas();
	}

	// Align text
	if ( this.align == Kiwi.Plugins.GameObjects.BitmapText.RIGHT_ALIGN ) {

		this.x -= this.width;

	} else if (
		this.align == Kiwi.Plugins.GameObjects.BitmapText.CENTER_ALIGN ) {

		this.x -= this.width / 2;

	}

	// Render on stage
	ctx = this.game.stage.ctx;
	ctx.save();

	if ( this.alpha > 0 && this.alpha <= 1 ) {
		ctx.globalAlpha = this.alpha;
	}

	// Experimental smooth/sharp support. May not be supported by all browsers.
	ctx.imageSmoothingEnabled = this.smooth;

	t = this.transform;
	m = t.getConcatenatedMatrix();
	ct = camera.transform;

	ctx.transform(
		m.a, m.b,
		m.c, m.d,
		m.tx, m.ty );
	ctx.drawImage(
		this._tempCanvas,
		0, 0,
		this._tempCanvas.width, this._tempCanvas.height,
		-t.rotPointX, -t.rotPointY,
		this._tempCanvas.width, this._tempCanvas.height );

	ctx.restore();

	// De-align text
	if ( this.align == Kiwi.Plugins.GameObjects.BitmapText.RIGHT_ALIGN ) {

		this.x += this.width;

	} else if (
		this.align == Kiwi.Plugins.GameObjects.BitmapText.CENTER_ALIGN ) {

		this.x += this.width / 2;

	}

};


Kiwi.Plugins.GameObjects.BitmapText.prototype.renderGL =
function( gl, camera, params ) {

	/**
	Render the text via the WebGL pipeline.

	@method renderGL
	@param gl
	@param camera
	@param params
	@public
	**/

	var cell, ct, i, j, m, pt1, pt2, pt3, pt4, t, vertexItems, x, y;

	if ( !(
		this.supported &&
		this.text != null &&
		this.text !== "" &&
		this.alpha > 0 &&
		this.visible ) ) {

		return;
	}

	// Do we need to calculate the text again?
	if ( this._tempDirty ) {
		this._renderText();
	}

	// Any alignment needed?
	if ( this.align == Kiwi.Plugins.GameObjects.BitmapText.RIGHT_ALIGN ) {

		this.x -= this.width;

	} else if (
		this.align == Kiwi.Plugins.GameObjects.BitmapText.CENTER_ALIGN ) {

		this.x -= this.width / 2;

	}

	// Set up the xyuv and alpha.
	vertexItems = [];

	// Transform/Matrix
	t = this.transform;
	m = t.getConcatenatedMatrix();
	ct = camera.transform;

	x = 0;
	y = 0;

	// Set up the Point Objects.
	pt1 = this._pt1;
	pt2 = this._pt2;
	pt3 = this._pt3;
	pt4 = this._pt4;

	// Loop through the lines and render them on the temporary canvas.
	for ( j = 0; j < this._lines.length; j++ ) {

		// Alignment of the lines for canvas
		if ( this.maxWidth ) {
			if ( this.align ===
				Kiwi.Plugins.GameObjects.BitmapText.RIGHT_ALIGN ) {

				x = this.maxWidth - this._lines[ j ].width;

			} else if ( this.align ===
				Kiwi.Plugins.GameObjects.BitmapText.CENTER_ALIGN ) {

				x = ( this.maxWidth - this._lines[ j ].width ) * 0.5;

			}
		}

		// Offset anchorpoints
		x -= this.anchorPointX;
		y -= this.anchorPointY;

		for ( i = 0; i < this._lines[ j ].text.length; i++ ) {

			cell = this._lines[ j ].text[ i ];

			if ( typeof cell !== "undefined" ) {

				pt1.setTo( x, y );
				pt2.setTo( x + cell.w, y );
				pt3.setTo( x + cell.w, y + cell.h );
				pt4.setTo( x, y + cell.h );

				pt1 = m.transformPoint( pt1 );
				pt2 = m.transformPoint( pt2 );
				pt3 = m.transformPoint( pt3 );
				pt4 = m.transformPoint( pt4 );

				vertexItems.push(

					pt1.x, pt1.y,
					cell.x, cell.y,
					this.alpha,

					pt2.x, pt2.y,
					cell.x + cell.w, cell.y,
					this.alpha,

					pt3.x, pt3.y,
					cell.x + cell.w, cell.y + cell.h,
					this.alpha,

					pt4.x, pt4.y,
					cell.x, cell.y + cell.h,
					this.alpha
				);

				x += parseInt( cell.w, 10 );

			}

		}

		x = 0;
		y += this._lines[ j ].height;
	}

	// Unalign the text
	if ( this.align ===
		Kiwi.Plugins.GameObjects.BitmapText.RIGHT_ALIGN ) {

		this.x += this.width;

	} else if ( this.align ===
		Kiwi.Plugins.GameObjects.BitmapText.CENTER_ALIGN ) {

		this.x += this.width / 2;

	}

	// Add to the batch!
	this.glRenderer.concatBatch( vertexItems );
};


/**
Constant identifying left alignment

@property LEFT_ALIGN
@static
@type number
@default 0
@public
**/

Kiwi.Plugins.GameObjects.BitmapText.LEFT_ALIGN = 0;

/**
Constant identifying right alignment

@property RIGHT_ALIGN
@static
@type number
@default 1
@public
**/

Kiwi.Plugins.GameObjects.BitmapText.RIGHT_ALIGN = 1;

/**
Constant identifying center alignment

@property CENTER_ALIGN
@static
@type number
@default 2
@public
**/

Kiwi.Plugins.GameObjects.BitmapText.CENTER_ALIGN = 2;
