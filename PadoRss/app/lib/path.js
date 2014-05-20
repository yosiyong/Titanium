// Path menu for Titanium
// Tony Lukasavage - @tonylukasavage

// There MUST be more than 1 icon or the math breaks
var DEFAULTS = {
	ICON_IMAGE: '/clear.png',
	ICON_SIZE: Ti.Platform.displayCaps.platformWidth > 600 ? 90 : 60,
	ICON_NUMBER: 6,
	ICON_ROTATION: 720,
	BUTTON_IMAGE: '/clear.png',
	BUTTON_SIZE: Ti.Platform.displayCaps.platformWidth > 600 ? 90 : 60,
	MENU_DURATION: 500,
	FADE_DURATION: 500,
	BOUNCE_DISTANCE: 25,
	STAGGER: 50
};
var isAndroid = Ti.Platform.osname === 'android';
var isIOS = Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad';

/////////////////////////////////////////
////////// Module dependencies //////////
/////////////////////////////////////////
if (isIOS) {
	var pathAnimator = require('path.animator');
}

/////////////////////////////////////////
////////// "Private" variables //////////
/////////////////////////////////////////
var settings = {},
	isAnimating = false,
	menu, 
    menuButton,
    menuIcons,
    fadeOut,
    fadeIn;

//////////////////////////////////////
////////// "Public" members //////////
//////////////////////////////////////
exports.EVENT_ICONCLICK = 'iconClick';
exports.EVENT_MENUCLICK = 'menuClick';
exports.createMenu = function(o) {
	Ti.API.info("::::createMenu::::");
	// Configure the settings for the menu
	settings.iconList = o.iconList || createDefaultIconList();
	settings.iconRotation = o.iconRotation || DEFAULTS.ICON_ROTATION;
	settings.iconSize = o.iconSize || DEFAULTS.ICON_SIZE;
	settings.buttonImage = o.buttonImage || DEFAULTS.BUTTON_IMAGE;
	settings.buttonSize = o.buttonSize || DEFAULTS.BUTTON_SIZE;
	settings.menuDuration = o.menuDuration || DEFAULTS.MENU_DURATION;
	settings.fadeDuration = o.fadeDuration || DEFAULTS.FADE_DURATION;
	settings.radius = o.radius || (Ti.Platform.displayCaps.platformWidth/2 - settings.iconSize/2)+20;
	settings.bounceDistance = o.bounceDistance || DEFAULTS.BOUNCE_DISTANCE;
	settings.stagger = o.stagger || DEFAULTS.STAGGER;
	
	Ti.API.info("::::createMenu buttonSize::::" + settings.radius);
	// Create reusable fade & scale animations. Need to declare
	// the transforms outside of the animation. See notes at the beginning
	// of this file.
	fadeOut = Ti.UI.createAnimation({
		duration: settings.fadeDuration,
		opacity: 0
	});
	fadeOut.transform = Ti.UI.create2DMatrix().scale(0, 0);
	fadeLarge = Ti.UI.createAnimation({
		duration: settings.fadeDuration,
		opacity: 0 
	});
	fadeLarge.transform = Ti.UI.create2DMatrix().scale(4, 4);
	
	// Construct menu UI components and establish view hierarchy
	menu = Ti.UI.createView({
		height: settings.buttonSize,
		width: settings.buttonSize,
		bottom: 7,
		right: 7
	});
	menuButton = createMenuButton();
	menuIcons = [];
	
	menuButton.addEventListener('click', handleMenuButtonClick);
	
	for (var i = 0; i < o.iconList.length; i++) {
		var menuIcon = createMenuIcon(i);
		menuIcon.addEventListener('click', handleMenuIconClick);
		menuIcons.push(menuIcon);
		menu.add(menuIcon);
	}
	menu.add(menuButton);
	menu.initMenu = initMenu;
	
	return menu;
};

/////////////////////////////////////////
////////// "Private" functions //////////
/////////////////////////////////////////
var resetIconVisibility = function(icon) {
	Ti.API.info("::::resetIconVisibility::::");
	// use a short timeout to prevent flicker
	setTimeout(function() {
		icon.opacity = 1;
		icon.transform = Ti.UI.create2DMatrix().scale(1,1);
		if (isAndroid) {
			icon.show();
		}
	}, 100);
};

var initMenu = function(flag) {
	Ti.API.info("::::initMenu::::");
	menuButton.isOpen = false;
	//menuButton.left = 0;
	menuButton.right = 10;
	menuButton.bottom = 10;
	menuButton.opacity = 1;
	menuButton.transform = Ti.UI.create2DMatrix().rotate(0);
	menuButton.show();
	
	for (var i = 0; i < menuIcons.length; i++) {
		var icon = menuIcons[i];
		//icon.left = 0;
		icon.right = 0;
		icon.bottom = 0;
		if (flag){
			Ti.API.info('---path.js---initMenu icon hide:');
			icon.hide();
		}else{
			Ti.API.info('---path.js---initMenu icon show:');
			resetIconVisibility(icon);
		}
	}
	
	isAnimating = false;
};

Titanium.App.addEventListener('MenuButtonClick', function(e){
	Ti.API.info("::::MenuButtonClick::::");
 	handleMenuButtonClick();
});

var handleMenuButtonClick = function(e) {
	Ti.API.info("::::handleMenuButtonClick::::");
	// Make sure we don't have other menu animations running
	if (isAndroid && isAnimating === true) {
	//if (isAnimating === true) {
		return;	
	}
	isAnimating = true;
	
	var i, icon;
	var anim = menuButton.isOpen ? 'close' : 'open';
	
	// change the menu button state
	menuButton.isOpen = !menuButton.isOpen;
	menuButton.animate(menuButton.animations[anim]);
	
	// quick and dirty fix for making the containing view "fit"
	if (anim === 'open') {
		menu.opacity = 1;
		menu.height = settings.radius + settings.bounceDistance + settings.iconSize + 50;
		menu.width = settings.radius + settings.bounceDistance + settings.iconSize;
		for (var i = 0; i < menuIcons.length; i++) {
			var icon = menuIcons[i];
			
			icon.show();
		}
		setTimeout(
			function() {
				Ti.API.info("::::handleMenuButtonClick--openopen::::");
			}, 
			settings.menuDuration + (settings.stagger * settings.iconList.length) + 100
		);
	} else {
		setTimeout(
			function() {
				Ti.API.info("::::handleMenuButtonClick--close::::" + (settings.menuDuration + (settings.stagger * settings.iconList.length)+100));
				menu.height = settings.buttonSize;
				menu.width = settings.buttonSize;
				menu.opacity = 0;
			}, 
			settings.menuDuration + (settings.stagger * settings.iconList.length)-100
		);	
	}
	
	// Open/close all the icons with animation
	for (i = 0; i < menuIcons.length; i++) {
		
		icon = menuIcons[i];
		icon.animations[anim + 'Bounce'].addEventListener(
			'complete', 
			anim === 'open' ? doCompleteOpen : doCompleteClose
		);
		icon.animate(icon.animations[anim + 'Bounce']);
		
		// ios uses the path.animator module for iOS rotations so that they can be
		// greater than 180 degrees
		if (isIOS) {
			
			//alert(settings.menuDuration + (settings.menuDuration / 3.5)	);
			icon.rotate({
				angle: settings.iconRotation,
				duration: settings.menuDuration + (settings.menuDuration / 3.5)	
			});
		}
		
	}
};

var handleMenuIconClick = function(e) {
	Ti.API.info("1.handleMenuIconClick");
	var i, radians, icon;
	
	// Make sure we don't have other menu animations running
	if (isAndroid && isAnimating === true) {
	//if (isAnimating === true) {
		return;	
	}
	isAnimating = true;
	
	menu.fireEvent(exports.EVENT_ICONCLICK, {
		source: menu,
		icon: e.source,
		index: e.source.index,
		id: e.source.id
	});
	Ti.API.info("2.fireEvent iconClick");
	
	/*
	//----------
	// メニュー閉じる
	// Make sure we don't have other menu animations running
	if (isAndroid && isAnimating === true) {
	//if (isAnimating === true) {
		return;	
	}
	isAnimating = true;
	
	var i, icon;
	var anim = menuButton.isOpen ? 'close' : 'open';
	
	// change the menu button state
	menuButton.isOpen = !menuButton.isOpen;
	menuButton.animate(menuButton.animations[anim]);
	
	// quick and dirty fix for making the containing view "fit"
	if (anim === 'open') {
		menu.height = settings.radius + settings.bounceDistance + settings.iconSize + 50;
		menu.width = settings.radius + settings.bounceDistance + settings.iconSize;
	} else {
		setTimeout(
			function() {
				Ti.API.info("::::handleMenuIconClick--close::::");
				menu.height = settings.buttonSize;
				menu.width = settings.buttonSize;
				menu.opacity = 0;
			}, 
			settings.menuDuration + (settings.stagger * settings.iconList.length) + 100
		);	
	}
	
	// Open/close all the icons with animation
	for (i = 0; i < menuIcons.length; i++) {
		
		icon = menuIcons[i];
		icon.animations[anim + 'Bounce'].addEventListener(
			'complete', 
			anim === 'open' ? doCompleteOpen : doCompleteClose
		);
		icon.animate(icon.animations[anim + 'Bounce']);
		
		// ios uses the path.animator module for iOS rotations so that they can be
		// greater than 180 degrees
		if (isIOS) {
			
			//alert(settings.menuDuration + (settings.menuDuration / 3.5)	);
			icon.rotate({
				angle: settings.iconRotation,
				duration: settings.menuDuration + (settings.menuDuration / 3.5)	
			});
		}
		
	}
	//----------------------
	
*/
	// fade and scale out the menuButton
	if (isAndroid) {
		//fadeOut.left = (menuButton.width * 0.5);
		fadeOut.right = (menuButton.width * 0.5);
		fadeOut.bottom = -1 * (menuButton.height * 0.5);		
	}	
	fadeOut.addEventListener('complete', function(e) {
		Ti.API.info("3.fadeOut event complete");
		menu.height = settings.buttonSize;
		menu.width = settings.buttonSize;
	});
	menuButton.animate(fadeOut);
	
	// iterate through icons, fade and scale down the ones that weren't clicked,
	// fade and scale up the one that was.
	for (i = 0; i < menuIcons.length; i++) {
		
		radians = (90 / (menuIcons.length - 1)) * i * Math.PI / 180;
		icon = menuIcons[i];
		
		// android scales from the top left, not the center like ios,
		// hence the extra left/bottom animations
		if (i !== e.source.index) {
			if (isAndroid) {
				//fadeOut.left = Math.sin(radians) * settings.radius + (icon.width * 0.5);
				fadeOut.right = Math.sin(radians) * settings.radius + (icon.width * 0.5);
				fadeOut.bottom = Math.cos(radians) * settings.radius - (icon.height * 0.5);		
			}	
			icon.animate(fadeOut);
		} else {
			if (isAndroid) {
				//fadeLarge.left = Math.sin(radians) * settings.radius - (icon.width * 1.5);
				fadeLarge.right = Math.sin(radians) * settings.radius - (icon.width * 1.5);
				fadeLarge.bottom = Math.cos(radians) * settings.radius + (icon.height * 1.5);
			}
			icon.animate(fadeLarge);
		}
			
	}
	
	
};

var createMenuButton = function() {
	Ti.API.info("::::createMenuButton::::");
	var animations = {
		open: Ti.UI.createAnimation({
			duration: settings.menuDuration	
		}),
		close: Ti.UI.createAnimation({
			duration: settings.menuDuration
		})
	};
	
	animations.open.transform = Ti.UI.create2DMatrix().rotate(45);
	animations.open.addEventListener('complete', function() {
		Ti.API.info("::::createMenuButton animations.open::::");
		isAnimating = false;
	});
	
	
	// In Titanium, Android rotations always start at zero, regardless of last position.
	// In Android Titanium apps you can pass two arguments to the rotate() function,
	// the first being the starting rotation, the second being the final rotation.
	// This is not a cross-platform method, so you need to make sure you are on Android
	// before using 2 arguments.
	// Jira Issue: http://jira.appcelerator.org/browse/TIMOB-6843
	if (isAndroid) {
		animations.close.transform = Ti.UI.create2DMatrix().rotate(45, 0);
	} else {
		animations.close.transform = Ti.UI.create2DMatrix().rotate(0);	
	}
	animations.close.addEventListener('complete', function() {
		Ti.API.info("::::createMenuButton animations.close::::");
		isAnimating = false;
	});
	
	var menuButton = Ti.UI.createImageView({
		image: settings.buttonImage,
		height: settings.buttonSize,
		width: settings.buttonSize,
		right: 7,
		bottom: 7,
		isOpen: false,
		animations: animations
	});
	
	return menuButton;
};

var createMenuIcon = function(index) {
	Ti.API.info("::::createMenuIcon::::");
	var length = settings.iconList.length;
	var id = settings.iconList[index].id;
	var radians = (90 / (length - 1)) * index * Math.PI / 180;
	var bounceLeft = Math.sin(radians) * (settings.radius + settings.bounceDistance);
	var bounceBottom = Math.cos(radians) * (settings.radius + settings.bounceDistance);
	var finalLeft = Math.sin(radians) * settings.radius;
	var finalBottom = Math.cos(radians) * settings.radius;
	
	if (index == 0) {
		bounceBottom = bounceBottom + 75;
		finalBottom = finalBottom + 75;
	}
	
	if (index == 1) {
		bounceBottom = bounceBottom + 25;
		finalBottom = finalBottom + 25;
	}
	/*
	if (index == 2) {
		bounceBottom = bounceBottom + 25;
		finalBottom = finalBottom + 25;
	}
	
	if (index == 3) {
		bounceBottom = bounceBottom + 35;
		finalBottom = finalBottom + 35;
	}
	
	//alert(index + ' : ' + bounceBottom + ' : ' + bounceLeft);
	//alert(finalBottom + ':' + finalLeft);
	Ti.API.info("::index:"+ index);
	Ti.API.info("::bounceBottom:"+ bounceBottom);
	
	Ti.API.info("::finalBottom:"+ finalBottom);

	Ti.API.info("::length:"+ length);
	Ti.API.info("::radians:"+ radians);
	Ti.API.info("::settings.radius:"+ settings.radius);
	Ti.API.info("::settings.bounceDistance:"+ settings.bounceDistance);

	*/
	var animations = {
		openBounce: Ti.UI.createAnimation({
			duration: settings.menuDuration,
			bottom: bounceBottom,
			right: 5,
			//bottom: bounceBottom,
			//right: bounceLeft,
			delay: index * settings.stagger
		}),
		openFinal: Ti.UI.createAnimation({
			duration: settings.menuDuration / 3.5,
			bottom: finalBottom,
			right: 5
			//bottom: finalBottom,
			//right: finalLeft
		}),
		closeBounce: Ti.UI.createAnimation({
			duration: settings.menuDuration / 3.5,
			bottom: bounceBottom,
			right: 5,
			//bottom: bounceBottom,
			//right: bounceLeft,
			delay: (length - (index+1)) * settings.stagger,
		}),
		closeFinal: Ti.UI.createAnimation({
			duration: settings.menuDuration,
			bottom: 5,
			right: 5
		})
	};
	
	// iOS uses path.animator module for rotations
	if (!isIOS) {
		animations.openBounce.transform = Ti.UI.create2DMatrix().rotate(settings.iconRotation);
		animations.closeFinal.transform = Ti.UI.create2DMatrix().rotate(-1 * settings.iconRotation);
	}
	
	// Use path.animator view for iOS, which can be rotated more than 180 degrees, 
	// by default 720 degrees
	var icon;
	if (isIOS) {
		icon = pathAnimator.createView({
			backgroundImage: settings.iconList[index].image,
			height: settings.iconSize,
			width: settings.iconSize,
			right: 5,
			bottom: 5,
			animations: animations,
			index: index,
			id: id
		});
	} else {
		icon = Ti.UI.createImageView({
			image: settings.iconList[index].image,
			height: settings.iconSize,
			width: settings.iconSize,
			right: 5,
			bottom: 5,
			animations: animations,
			index: index,
			id: id
		});
	}
	
	icon.animations.openBounce.icon = icon;
	icon.animations.closeBounce.icon = icon;
	
	return icon;
};

var doCompleteOpen = function(e) {
	
	e.source.removeEventListener('complete', doCompleteOpen);
	e.source.icon.animate(e.source.icon.animations.openFinal);
	Ti.API.info("::::doCompleteOpen::::");
};

var doCompleteClose = function(e) {
	e.source.removeEventListener('complete', doCompleteClose);
	e.source.icon.animate(e.source.icon.animations.closeFinal);
	Ti.API.info("::::doCompleteClose::::");
};

var createDefaultIconList = function() {
	Ti.API.info("::::createDefaultIconList::::");
	var icons = [];
	for (var i = 0; i < DEFAULTS.ICON_NUMBER; i++) {
		icons.push({
			image: DEFAULTS.ICON_IMAGE,
			id: undefined
		});	
	}
	return icons;	
};