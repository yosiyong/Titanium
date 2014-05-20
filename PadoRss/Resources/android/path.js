var DEFAULTS = {
    ICON_IMAGE: "/clear.png",
    ICON_SIZE: Ti.Platform.displayCaps.platformWidth > 600 ? 90 : 60,
    ICON_NUMBER: 6,
    ICON_ROTATION: 720,
    BUTTON_IMAGE: "/clear.png",
    BUTTON_SIZE: Ti.Platform.displayCaps.platformWidth > 600 ? 90 : 60,
    MENU_DURATION: 500,
    FADE_DURATION: 500,
    BOUNCE_DISTANCE: 25,
    STAGGER: 50
};

var isAndroid = true;

var isIOS = false;

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
    settings.radius = o.radius || Ti.Platform.displayCaps.platformWidth / 2 - settings.iconSize / 2 + 20;
    settings.bounceDistance = o.bounceDistance || DEFAULTS.BOUNCE_DISTANCE;
    settings.stagger = o.stagger || DEFAULTS.STAGGER;
    Ti.API.info("::::createMenu buttonSize::::" + settings.radius);
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
        bottom: 7,
        right: 7
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

var initMenu = function(flag) {
    Ti.API.info("::::initMenu::::");
    menuButton.isOpen = false;
    menuButton.right = 10;
    menuButton.bottom = 10;
    menuButton.opacity = 1;
    menuButton.transform = Ti.UI.create2DMatrix().rotate(0);
    menuButton.show();
    for (var i = 0; menuIcons.length > i; i++) {
        var icon = menuIcons[i];
        icon.right = 0;
        icon.bottom = 0;
        if (flag) {
            Ti.API.info("---path.js---initMenu icon hide:");
            icon.hide();
        } else {
            Ti.API.info("---path.js---initMenu icon show:");
            resetIconVisibility(icon);
        }
    }
    isAnimating = false;
};

Titanium.App.addEventListener("MenuButtonClick", function() {
    Ti.API.info("::::MenuButtonClick::::");
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
        for (var i = 0; menuIcons.length > i; i++) {
            var icon = menuIcons[i];
            icon.show();
        }
        setTimeout(function() {
            Ti.API.info("::::handleMenuButtonClick--openopen::::");
        }, settings.menuDuration + settings.stagger * settings.iconList.length + 100);
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
    Ti.API.info("1.handleMenuIconClick");
    var i, radians, icon;
    if (isAndroid && true === isAnimating) return;
    isAnimating = true;
    menu.fireEvent(exports.EVENT_ICONCLICK, {
        source: menu,
        icon: e.source,
        index: e.source.index,
        id: e.source.id
    });
    Ti.API.info("2.fireEvent iconClick");
    if (isAndroid) {
        fadeOut.right = .5 * menuButton.width;
        fadeOut.bottom = -1 * .5 * menuButton.height;
    }
    fadeOut.addEventListener("complete", function() {
        Ti.API.info("3.fadeOut event complete");
        menu.height = settings.buttonSize;
        menu.width = settings.buttonSize;
    });
    menuButton.animate(fadeOut);
    for (i = 0; menuIcons.length > i; i++) {
        radians = 90 / (menuIcons.length - 1) * i * Math.PI / 180;
        icon = menuIcons[i];
        if (i !== e.source.index) {
            if (isAndroid) {
                fadeOut.right = Math.sin(radians) * settings.radius + .5 * icon.width;
                fadeOut.bottom = Math.cos(radians) * settings.radius - .5 * icon.height;
            }
            icon.animate(fadeOut);
        } else {
            if (isAndroid) {
                fadeLarge.right = Math.sin(radians) * settings.radius - 1.5 * icon.width;
                fadeLarge.bottom = Math.cos(radians) * settings.radius + 1.5 * icon.height;
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
    animations.open.addEventListener("complete", function() {
        Ti.API.info("::::createMenuButton animations.open::::");
        isAnimating = false;
    });
    animations.close.transform = isAndroid ? Ti.UI.create2DMatrix().rotate(45, 0) : Ti.UI.create2DMatrix().rotate(0);
    animations.close.addEventListener("complete", function() {
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
    var radians = 90 / (length - 1) * index * Math.PI / 180;
    Math.sin(radians) * (settings.radius + settings.bounceDistance);
    var bounceBottom = Math.cos(radians) * (settings.radius + settings.bounceDistance);
    Math.sin(radians) * settings.radius;
    var finalBottom = Math.cos(radians) * settings.radius;
    if (0 == index) {
        bounceBottom += 75;
        finalBottom += 75;
    }
    if (1 == index) {
        bounceBottom += 25;
        finalBottom += 25;
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