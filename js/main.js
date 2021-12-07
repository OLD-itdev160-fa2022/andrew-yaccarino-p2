let game_globals = {
    "cash": 100,
    "generators": []
};

// generators that can be called to autocreate custom entitieس
function createGenerator(name, value, output) {
    let id = game_globals.generators.length;
    game_globals.generators.push({
        "name":name,
        "value":value,
        "id":id,
        "stock":0,
        "output":output
    });
}

/**
 * @summary This function updates the stock count for items based off of the number of generators
 */
function updateGenerators() {
    for (let gen of game_globals.generators) {
        game_globals.cash += gen.stock * gen.output;
    }
}

/**
 * @summary This function gets an element by it's id
 * @param {String} id
 * @returns {Element}
 */
function get(id) {
    return document.getElementById(id);
}

/**
 * 
 */
function updateDisplay() {
    let elem = get('cash-money');
    elem.innerText = `$${fixs(game_globals.cash)}`;
    for (let gen of game_globals.generators) {
        get(`gen-buy-${gen.id}`).innerText = `${gen.name}: $${fixs(gen.value)}`;
    }
}

/**
 * @summary This function will generate the buttons used to buy items
 */
function generateDisplay() {
    let elem = get('cash-main');
    let cash = document.createElement('span');
    cash.innerText = `$${fixs(game_globals.cash)}`;
    cash.setAttribute('id','cash-money');
    elem.appendChild(cash);
    elem = get('auto-gen-buy-area');
    for (let gen of game_globals.generators) {
        let buyer = document.createElement('li');
        buyer.setAttribute('class','gen-buyer');
        buyer.setAttribute('id',`gen-buy-${gen.id}`);
        buyer.innerText = `${gen.name}: $${fixs(gen.value)}`;
        elem.appendChild(buyer);
    }
}

/**
 * @summary basically this function is the setup
 */
document.body.onload = function() {
    createGenerator("Coal Mine", 100, 10);
    createGenerator("Oil Derrick", 200, 20);
    createGenerator("Off Shore Oil Derrick", 400, 40);
    createGenerator("Reactor", 800, 80);
    createGenerator("Army of Hamsters", 1600, 160);

    generateDisplay();

    get('auto-gen-buy-area').onclick = genhandler;

    window.setInterval(updateDisplay, 1); // update display every milisecond
    window.setInterval(updateGenerators, 1000); // update stats every second
};

/**
 * @summary generator click handler
 */
function genhandler(e) {
    let target = e.target;
    let id = target.id;

    for (let g of game_globals.generators) {
        let gid = `gen-buy-${g.id}`;
        if (gid == id) {
            if (game_globals.cash < game_globals.generators[g.id].value) break;
            game_globals.generators[g.id].stock++;
            game_globals.cash -= game_globals.generators[g.id].value;
            game_globals.generators[g.id].value = fix(game_globals.generators[g.id].value * 1.5);
            game_globals.cash = fix(game_globals.cash);
            break; // no need to keep looking if we found it
        }
    }
}

/**
 * @summary contrain all numbers to currency
 * @param {Number} value
 * @returns {Number}
 */
function fix(value) {
    return Number(value.toFixed(2));
}
/**
 * @summary same as fix just returns a string
 * @param {Number} value
 * @returns {String}
 */
function fixs(value) {
    return value.toFixed(2);
}