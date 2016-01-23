window.addEventListener('load', (function() {
    var cnv, ctx, size = 500, tileSize = 50,
        COS30 = Math.cos(30 * Math.PI / 180),
        imageNames = 'yellow red player', images = {},
        drawQueue = [],
        map;

    var player = {
        x: 0, y: 0, img: 'player',
        move: function(dx, dy) {
            if (!map[player.y + dy][player.x + dx]) return;
            drawHexes([[player.x, player.y]]);
            player.x += dx;
            player.y += dy;
            drawQueue.push(player);
        }
    };

    var loadMap = function(mapStr) {
        map = mapStr.split('/').map(function(mapRow) {
            return mapRow.split('').map(function(mapTile) {
                return ({
                    'y': 'yellow',
                    'r': 'red'
                })[mapTile];
            });
        });
    };

    var imagesLoaded = 0, loadImages = function(callback) {
        imageNames = imageNames.split(' ');
        imageNames.forEach(function(name) {
            var img = document.createElement('img');
            img.onload = function() {
                if (++imagesLoaded >= imageNames.length) callback();
            };
            img.src = './' + name + '.png';
            images[name] = img;
        });
    };

    var drawHexes = function(coords) {
        if (coords !== undefined) {
            coords.forEach(function(coord) {
                drawAt(images[map[coord[1]][coord[0]]], coord[0], coord[1]);
            });
        } else {
            for (var y = 0; y < map.length; ++y) {
                for (var x = 0; x < map[y].length; ++x) {
                    drawAt(images[map[y][x]], x, y);
                }
            }
        }
    };

    var drawSprites = function() {
        drawQueue.forEach(function(sprite) {
            drawAt(images[sprite.img], sprite.x, sprite.y);
        });
        drawQueue = [];
    };

    var drawAt = function(img, x, y) {
        ctx.drawImage(img,
                x * tileSize * 0.75,
                (x % 2 === 1 ? y + 0.5 : y) * tileSize * COS30,
                tileSize, tileSize * COS30);
    };

    var tick = function(e) {
        var k = e.keyCode || e.which || 0;
        switch (k) {
        case 81: // q
            player.move(-1, -!(player.x % 2));
            break;
        case 87: // w
            player.move(0, -1);
            break;
        case 69: // e
            player.move(1, -!(player.x % 2));
            break;
        case 65: // a
            player.move(-1, player.x % 2);
            break;
        case 83: // s
            player.move(0, 1);
            break;
        case 68: // d
            player.move(1, player.x % 2);
            break;
        }
        drawSprites();
    };
    window.addEventListener('keydown', tick);

    // onload
    return function() {
        cnv = document.getElementById('cnv');
        ctx = cnv.getContext('2d');

        cnv.width = cnv.height = size;

        loadImages(function() {
            loadMap('yryryrrryry/yryryryryry/yrrryrrryry/yryryryryry/yyyyyyyyyyy');
            drawHexes();
            drawQueue = [player];
            drawSprites();
        });
    };
})());
