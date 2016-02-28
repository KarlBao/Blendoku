/**
var Block = function() {
	var color;
}
**/

var level = function(options) {
	options = options || {};
	var defaults = {
		number: 5,
		first: undefined,
		last: undefined
	}
	var settings = $.extend({},defaults,options),
		blocksArr = [],
		$blockToMove = null,
		methods = {};

	methods = {
		
		// 
		init: function() {
			
			blocksArr = generateGradientBlocks(settings.number, settings.first, settings.last);

			// setup the level
			methods.setup();
			$('.block-container').on('click','.block',function(event) {
				var $container = $(event.delegateTarget),
					$temp,
					$this = $(this);

				// stop propagation if has inner block
				event.stopPropagation();

				// if no block is to move
				if($blockToMove === null) {
					$container.addClass('focus');
					$blockToMove = $(this);
				}
				else {
					// switch two blocks
					methods.switchBlock($container,$this);

				}
			})

			// if no inner block
			$('.block-container').on('click',function(event) {
				if($blockToMove != null) {
					methods.switchBlock($(this));
				}
			})
		},

		setup: function() {

			// bind each block width the order id
			blocksArr.map(function(el, index){
				el.data('id',index+1);
			});
			shuffle(blocksArr);
			methods.display();
		},

		display: function() {

			
			blocksArr.map(function(el, index) {

				// List all the blocks in waiting queue
				el.wrap('<li class="block-container"></li>');
				$('.waiting-queue .blocks').append(el.parent('.block-container'));

				// Generate empty block containers in result queue
				$('.result-queue .blocks').append($('<li class="block-container empty"></li>'))
			})

			

		},
		
		focus: function() {
			
		},

		switchBlock: function($container, $block) {

			var $containerOfBlockToMove = $blockToMove.parent('.block-container');

			// append the focused block
			$container.append($blockToMove).removeClass('empty');
			$containerOfBlockToMove.removeClass('focus');

			// switch two blocks if this container is occupied!
			if($block!=undefined && $block!=null) {
			 	$containerOfBlockToMove.append($block);
			}
			else {

				// else, mark the empty container
				$containerOfBlockToMove.addClass('empty');
			}
			
			// clear block to move
			$blockToMove = null;

			// check if the level is completed after every switch
			methods.checkComplete();
		},

		checkComplete: function() {
			var completed = true,
				sortOrder = 1;	// 1 if increment, 0 if decrement, -1 if not in order
			if($('.result-queue .block-container').hasClass('empty')) {
				completed = false;
			}
			else {
				$('.result-queue .block-container').each(function(index, el){
					var id = $('.block',el).data('id')
					// check the sorting order
					if(index == 0) {
						if(id == 1) {sortOrder = 1;}	// increment
						else if(id == settings.number) {sortOrder = 0;} 	// decrement
						else {sortOrder = -1; completed = false; }	// not in order
					}
					if(sortOrder == 1) {
						if(id != index+1) {
							completed = false;
						}
					}
					if(sortOrder == 0) {
						if(id != settings.number-index) {
							completed = false;
						}
					}
				})
			}

			if(completed) {
				methods.complete();
			}
		},

		complete: function() {
			
		}
	}

	methods.init();
}

/**
 *	Generate bunch of blocks and push them in an array
 *	@parameter totalBlocks 	: number of totalBlocks
 *	@parameter firstColor	: rgb string of first block, generated randomly if undefined
 *	@parameter lastColor	: rgb string of last block, generated randomly if undefined
 *	@return array with all blocks
 **/
function generateGradientBlocks(totalBlocks,firstColor,lastColor) {
	firstColor = firstColor || generateRandomColor();
	lastColor = lastColor || generateRandomColor();
	var firstRGB = firstColor.split(','),
		lastRGB = lastColor.split(','),
		stepRGB = [],	// array
		generateRGBFloat = firstRGB,
		generateRGBInt = [],
		generateColor = '',
		blocksArr = [];

	function generateBlock() {
		for(var i=0; i < 3; i++) {
			generateRGBFloat[i] = parseFloat(generateRGBFloat[i])+parseFloat(stepRGB[i]);
			generateRGBInt[i] = Math.floor(generateRGBFloat[i]);
		}	
		generateColor = generateRGBInt.join(',');
		blocksArr.push($('<div class="block" style="background-color:rgb('+generateColor+')"></div>'));
	}
	function generateRandomColor() {
		var randomRGB = [];
		for(var i = 0; i < 3; i++) {
			randomRGB[i] = Math.floor(Math.random()*256); 
		}
		return randomRGB.join(',');
	}

	// Generate blocks if totalBlocks are larger than 2
	if(totalBlocks>2) {	
		//Generate first block
		blocksArr.push($('<div class="block" style="background-color:rgb('+firstColor+')"></div>'));
		
		for(var i = 0; i < 3; i++) {
			//stepRGB[i] = (Math.floor(lastRGB[i]/(totalBlocks-1) - firstRGB[i]/(totalBlocks-1)));
			stepRGB[i] = lastRGB[i]/(totalBlocks-1) - firstRGB[i]/(totalBlocks-1);
		}
		
		for(var i = 0; i < totalBlocks-2; i++) {
			generateBlock();
		}
		//Generate last block
		blocksArr.push($('<div class="block" style="background-color:rgb('+lastColor+')"></div>'));
	}

	return blocksArr;
}

/**
 * Shuffle this array and return a random array
 **/
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


$(document).ready(function(){
	level({
		number: 10
	});
})
