var DEFAULTS = {
    ICON_IMAGE: "/star.png",
    ICON_SIZE: Ti.Platform.displayCaps.platformWidth > 600 ? 80 : 40,
    ICON_NUMBER: 6,
    ICON_ROTATION: 720,
    BUTTON_IMAGE: "/add.png",
    BUTTON_SIZE: Ti.Platform.displayCaps.platformWidth > 600 ? 80 : 40,
    MENU_DURATION: 500,
    FADE_DURATION: 500,
    BOUNCE_DISTANCE: 25,
    STAGGER: 50
};

var isAndroid = "android" === Ti.Platform.osname;

var isIOS = "iphone" === Ti.Platform.osname || "ipad" === Ti.Platform.osname;

if (isIOS) var pathAnimator = require("path.animator");

var settings = {}, isAnimating = false, menu, menuButton, menuIcons, fadeOut, fadeIn;

exports.EVENT_ICONCLICK = "iconClick";

exports.EVENT_MENUCLICK = "menuClick";

exports.createMenu = function(o) {
    Ti.API.info("::::createMenu::::");
    settings.iconList = o.iconList || createDefaultIconList();
    settings.iconRotation = o.iconRotation || DEFAULTS.ICON_ROTATION;
    settings.iconSize = o.iconSize || DEFAULTS.ICON_SIZE;
    settings.buttonImage = o.buttonImage || DEFAULTS.BUTTON_IMAGE;
    settings.buttonSize = o.buttonSize || DEFAULTS.BUTTON_SIZE;
    settings.menuDuration = o.menuDuration || DEFAULTS.MENU_DURATION;
    settings.fadeDuration = o.fadeDuration || DEFAULTS.FADE_DURATION;
    settings.radius = o.radius || Ti.Platform.displayCaps.platformWidth / 2 - settings.iconSize / 2;
    settings.bounceDistance = o.bounceDistance || DEFAULTS.BOUNCE_DISTANCE;
    settings.stagger = o.stagger || DEFAULTS.STAGGER;
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
    menu = Ti.UI.createView({
        height: settings.buttonSize,
        width: settings.buttonSize,
        bottom: 5,
        right: 5
    });
    menuButton = createMenuButton();
    menuIcons = [];
    menuButton.addEventListener("click", handleMenuButtonClick);
    for (var i = 0; o.iconList.length > i; i++) {
        var menuIcon = createMenuIcon(i);
        menuIcon.addEventListener("click", handleMenuIconClick);
        menuIcons.push(menuIcon);
        menu.add(menuIcon);
    }
    menu.add(menuButton);
    menu.initMenu = initMenu;
    return menu;
};

var resetIconVisibility = function(icon) {
    Ti.API.info("::::resetIconVisibility::::");
    setTimeout(function() {
        icon.opacity = 1;
        icon.transform = Ti.UI.create2DMatrix().scale(1, 1);
        isAndroid && icon.show();
    }, 100);
};

var initMenu = function() {
    Ti.API.info("::::initMenu::::");
    menuButton.isOpen = false;
    menuButton.right = 0;
    menuButton.bottom = 0;
    menuButton.opacity = 1;
    menuButton.transform = Ti.UI.create2DMatrix().rotate(0);
    menuButton.show();
    for (var i = 0; menuIcons.length > i; i++) {
        var icon = menuIcons[i];
        icon.right = 0;
        icon.bottom = 0;
        resetIconVisibility(icon);
    }
    isAnimating = false;
};

Titanium.App.addEventListener("MenuButtonClick", function() {
    handleMenuButtonClick();
});

var handleMenuButtonClick = function() {
    Ti.API.info("::::handleMenuButtonClick::::");
    if (isAndroid && true === isAnimating) return;
    isAnimating = true;
    var i, icon;
    var anim = menuButton.isOpen ? "close" : "open";
    menuButton.isOpen = !menuButton.isOpen;
    menuButton.animate(menuButton.animations[anim]);
    if ("open" === anim) {
        menu.opacity = 1;
        menu.height = settings.radius + settings.bounceDistance + settings.iconSize + 50;
        menu.width = settings.radius + settings.bounceDistance + settings.iconSize;
    } else setTimeout(function() {
        Ti.API.info("::::handleMenuButtonClick--close::::" + (settings.menuDuration + settings.stagger * settings.iconList.length + 100));
        menu.height = settings.buttonSize;
        menu.width = settings.buttonSize;
        menu.opacity = 0;
    }, settings.menuDuration + settings.stagger * settings.iconList.length - 100);
    for (i = 0; menuIcons.length > i; i++) {
        icon = menuIcons[i];
        icon.animations[anim + "Bounce"].addEventListener("complete", "open" === anim ? doCompleteOpen : doCompleteClose);
        icon.animate(icon.animations[anim + "Bounce"]);
        isIOS && icon.rotate({
            angle: settings.iconRotation,
            duration: settings.menuDuration + settings.menuDuration / 3.5
        });
    }
};

var handleMenuIconClick = function(e) {
    Ti.API.info("::::handleMenuIconClick::::");
    var i, icon;
    if (isAndroid && true === isAnimating) return;
    isAnimating = true;
    menu.fireEvent(exports.EVENT_ICONCLICK, {
        source: menu,
        icon: e.source,
        index: e.source.index,
        id: e.source.id
    });
    if (isAndroid && true === isAnimating) return;
    isAnimating = true;
    var i, icon;
    var anim = menuButton.isOpen ? "close" : "open";
    menuButton.isOpen = !menuButton.isOpen;
    menuButton.animate(menuButton.animations[anim]);
    if ("open" === anim) {
        menu.height = settings.radius + settings.bounceDistance + settings.iconSize + 50;
        menu.width = settings.radius + settings.bounceDistance + settings.iconSize;
    } else setTimeout(function() {
        Ti.API.info("::::handleMenuIconClick--close::::");
        menu.height = settings.buttonSize;
        menu.width = settings.buttonSize;
        menu.opacity = 0;
    }, settings.menuDuration + settings.stagger * settings.iconList.length + 100);
    for (i = 0; menuIcons.length > i; i++) {
        icon = menuIcons[i];
        icon.animations[anim + "Bounce"].addEventListener("complete", "open" === anim ? doCompleteOpen : doCompleteClose);
        icon.animate(icon.animations[anim + "Bounce"]);
        isIOS && icon.rotate({
            angle: settings.iconRotation,
            duration: settings.menuDuration + settings.menuDuration / 3.5
        });
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
    animations.open.addEventListener("complete", function() {
        isAnimating = false;
    });
    animations.close.transform = isAndroid ? Ti.UI.create2DMatrix().rotate(45, 0) : Ti.UI.create2DMatrix().rotate(0);
    animations.close.addEventListener("complete", function() {
        isAnimating = false;
    });
    var menuButton = Ti.UI.createImageView({
        image: settings.buttonImage,
        height: settings.buttonSize,
        width: settings.buttonSize,
        right: 5,
        bottom: 5,
        isOpen: false,
        animations: animations
    });
    return menuButton;
};

var createMenuIcon = function(index) {
    Ti.API.info("::::createMenuIcon::::");
    var length = settings.iconList.length;
    var id = settings.iconList[index].id;
    var radians = 90 / (length - 1) * index * Math.PI / 180;
    Math.sin(radians) * (settings.radius + settings.bounceDistance);
    var bounceBottom = Math.cos(radians) * (settings.radius + settings.bounceDistance);
    Math.sin(radians) * settings.radius;
    var finalBottom = Math.cos(radians) * settings.radius;
    if (0 == index) {
        bounceBottom += 50;
        finalBottom += 50;
    }
    if (1 == index) {
        bounceBottom += 15;
        finalBottom += 15;
    }
    var animations = {
        openBounce: Ti.UI.createAnimation({
            duration: settings.menuDuration,
            bottom: bounceBottom,
            right: 5,
            delay: index * settings.stagger
        }),
        openFinal: Ti.UI.createAnimation({
            duration: settings.menuDuration / 3.5,
            bottom: finalBottom,
            right: 5
        }),
        closeBounce: Ti.UI.createAnimation({
            duration: settings.menuDuration / 3.5,
            bottom: bounceBottom,
            right: 5,
            delay: (length - (index + 1)) * settings.stagger
        }),
        closeFinal: Ti.UI.createAnimation({
            duration: settings.menuDuration,
            bottom: 5,
            right: 5
        })
    };
    if (!isIOS) {
        animations.openBounce.transform = Ti.UI.create2DMatrix().rotate(settings.iconRotation);
        animations.closeFinal.transform = Ti.UI.create2DMatrix().rotate(-1 * settings.iconRotation);
    }
    var icon;
    icon = isIOS ? pathAnimator.createView({
        backgroundImage: settings.iconList[index].image,
        height: settings.iconSize,
        width: settings.iconSize,
        right: 5,
        bottom: 5,
        animations: animations,
        index: index,
        id: id
    }) : Ti.UI.createImageView({
        image: settings.iconList[index].image,
        height: settings.iconSize,
        width: settings.iconSize,
        right: 5,
        bottom: 5,
        animations: animations,
        index: index,
        id: id
    });
    icon.animations.openBounce.icon = icon;
    icon.animations.closeBounce.icon = icon;
    return icon;
};

var doCompleteOpen = function(e) {
    e.source.removeEventListener("complete", doCompleteOpen);
    e.source.icon.animate(e.source.icon.animations.openFinal);
    Ti.API.info("::::doCompleteOpen::::");
};

var doCompleteClose = function(e) {
    e.source.removeEventListener("complete", doCompleteClose);
    e.source.icon.animate(e.source.icon.animations.closeFinal);
    Ti.API.info("::::doCompleteClose::::");
};

var createDefaultIconList = function() {
    Ti.API.info("::::createDefaultIconList::::");
    var icons = [];
    for (var i = 0; DEFAULTS.ICON_NUMBER > i; i++) icons.push({
        image: DEFAULTS.ICON_IMAGE,
        id: void 0
    });
    return icons;
};