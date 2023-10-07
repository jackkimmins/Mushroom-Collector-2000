$(document).ready(function() {
    const character = $("#character");
    const gameArea = $("#game");
    const mushroom = $("<div id='mushroom'></div>").appendTo(gameArea);
    const scoreElem = $("#score");
    
    let moving = { up: false, down: false, left: false, right: false };
    const speed = 3;
    let posX = (gameArea.width() - character.width()) / 2;
    let posY = (gameArea.height() - character.height()) / 2;
    let score = 0;

    const startModal = $("#start-modal")[0];
    const congratsModal = $("#congrats-modal")[0];
    const startButton = $("#start-game");
    const restartButton = $("#restart-game");

    // Set initial positions
    character.css('transform', `translate(${posX}px, ${posY}px)`);
    positionMushroom();
    
    // Initially show the start game dialog
    startModal.showModal();

    startButton.on("click", () => {
        startModal.close();
        requestAnimationFrame(update);
    });

    restartButton.on("click", () => {
        congratsModal.close();
        score = 0;
        posX = (gameArea.width() - character.width()) / 2;
        posY = (gameArea.height() - character.height()) / 2;
        scoreElem.text(score);
        positionMushroom();
        requestAnimationFrame(update);
    });

    const directionMapping = {
        87: { direction: 'up', imageUrl: './assets/character_up.png' },
        83: { direction: 'down', imageUrl: './assets/character_down.png' },
        65: { direction: 'left', imageUrl: './assets/character_left.png' },
        68: { direction: 'right', imageUrl: './assets/character_right.png' }
    };

    $(document).on('keydown keyup', function(e) {
        const isKeyDown = e.type === 'keydown';
        const mapping = directionMapping[e.which];

        if (mapping) {
            moving[mapping.direction] = isKeyDown;
            if (isKeyDown) {
                character.css('background-image', `url(${mapping.imageUrl})`);
            }
        }
    });

    function moveCharacter() {
        if (moving.up && posY > 0) posY -= speed;
        if (moving.down && posY + character.height() < gameArea.height()) posY += speed;
        if (moving.left && posX > 0) posX -= speed;
        if (moving.right && posX + character.width() < gameArea.width()) posX += speed;

        character.css('transform', `translate(${posX}px, ${posY}px)`);
    }

    function positionMushroom() {
        const randomX = Math.random() * (gameArea.width() - mushroom.width());
        const randomY = Math.random() * (gameArea.height() - mushroom.height());
        mushroom.css({ left: randomX + 'px', top: randomY + 'px' });
    }

    function checkCollision(rect1, rect2) {
        return (
            rect1.left < rect2.left + rect2.width &&
            rect1.left + rect1.width > rect2.left &&
            rect1.top < rect2.top + rect2.height &&
            rect1.top + rect1.height > rect2.top
        );
    }

    function checkWin() {
        if (score === 10)
        {
            congratsModal.showModal();
            new Audio('./assets/win.mp3').play();
        }
        else requestAnimationFrame(update);
    }

    function update() {
        moveCharacter();

        const charRect = {
            left: posX,
            top: posY,
            width: character.width(),
            height: character.height()
        };

        const mushroomRect = {
            left: parseFloat(mushroom.css('left')),
            top: parseFloat(mushroom.css('top')),
            width: mushroom.width(),
            height: mushroom.height()
        };

        if (checkCollision(charRect, mushroomRect)) {
            score += 1;
            new Audio('./assets/collect.mp3').play();
            scoreElem.text(score);
            positionMushroom();
        }

        checkWin();
    }
});
