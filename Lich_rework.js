// THIS HERE MONSTROSITY IS THE CODE FOR AN INTERACTIVE DEMONSTRATION OF MY IDEAS FOR IMPROVING WARFRAME'S KUVA LICH SYSTEM
// IT WILL BE HOSTED ON GITHUB AND POSTED ON REDDIT R/WARFRAME, WHERE YOU WILL LIKELY FIND A LONG LONG RANT OF ME EXPLAINING EVERYTHING ABOUT IT
// ON THE OFF CHANCE THAT SOMEONE FROM [DE] READS THIS, HI, I LOVE YOUR GAME. FEEL FREE TO TAKE ALL OF THE INSPIRATION.
// IF YOU HAVE QUESTIONS OR BUG REPORTS, YOU CAN CONTACT ME ON REDDIT AS U/KAIAN-A-COEL.

// ++
// VARIABLES AND CONSTANTS
// ++

// This here is the lich itself. No need to instanciate because you can only have one at a time. And we're not keeping track of dead liches in this program.
var Lich = {
    alive: false,
    name: "Jonn Doh",
    gender: "male",
    weapon: "unarmed",
    element: "none",
    bonusDamage: 0,
    lockStrength: 800,
    rank: 1,
    experience: 0,
    anger: 0,
    requiem: ["Fass", "Fass", "Fass"],
    treasury: { credits: 0, common_resources: 0, rare_resources: 0, mods: 0, relics: 0, blueprints: 0 },
    assets: [],
    territory_edges: [],
    territory_locked: []
};

const NO_EQUIPPED_REQUIEM = "(none)";

//tracking equipped mods, attempted combinations, etc.
var Parazon = {
    requiemEquipped: [NO_EQUIPPED_REQUIEM, NO_EQUIPPED_REQUIEM, NO_EQUIPPED_REQUIEM], //currently equipped mods
    requiemHistory: [], //push parazon code there after each encounter, with the number of valid mods.
    requiemModsStatus: { Fass: "?", Jahu: "?", Khra: "?", Lohk: "?", Netra: "?", Ris: "?", Vome: "?", Xata: "?" }, //unknown, valid, invalid.
    lastStandKnown: 0
}

//gotta keep track of that
var intel = 0;
var dayCounter = 0;
var weaponBiometricsBroken = false;
var trackedDown = false;

//Lists of possible results for stuff.
const weaponList = ["Drakgoon", "Karak", "Kohm", "Ogris", "Quartakk", "Tonkor", "Brakk", "Kraken", "Seer", "Dubba Stubbas", "Chakkhur", "Shildeg", "Ayanga"];
const requiemModsList = ["Fass", "Jahu", "Khra", "Lohk", "Netra", "Ris", "Vome", "Xata"];
const elementsList = ["Impact", "Heat", "Cold", "Electricity", "Toxin", "Magnetic", "Radiation"];
//thanks to u/Anal_L1beration on reddit for compiling a list of lich names
const firstNames = ["Abahela", "Abuhbik", "Adihk", "Aditt", "Aff", "Afteve", "Agigrbav", "Agizr", "Agopp", "Ahbah", "Ahili", "Ahkt", "Aiksitt", "Amukir", "Andigi", "Anurel", "Aoditekk", "App", "Arahidd", "Arolov", "Asedd", "Astemm", "Auhbiktu", "Aurr", "Autonut", "Avirb", "Avukk", "Axugg", "Azorgg", "Barr", "Bedd", "Bess", "Bhigg", "Bhkinmogg", "Bidd", "Bopp", "Bukk", "Burvuhil", "Buvudd", "Cakk", "Cebb", "Chkk", "Ciksopo", "Cilba", "Cirech", "Cixx", "Cogrg", "Colh", "Colivo", "Colnd", "Colokk", "Colonoo", "Comorgo", "Conakk", "Conana", "Condig", "Condipp", "Conn", "Conpo", "Copurr", "Corduv", "Corgmor", "Corr", "Cortekk", "Cubb", "Cugal", "Cugrobev", "Cunvon", "Cuvidd", "Cuzokk", "Dahkk", "Dand", "Dore", "Drgg", "Febitt", "Femm", "Fepipp", "Fetzk", "Gigg", "Gilil", "Gogrog", "Habilop", "Hokk", "Hoktahokk", "Jebud", "Jeghh", "Jiff", "Jigugg", "Jolokk", "Jon'k", "Jubb", "Juliff", "Jurgg", "Jurghuzz", "Jusogg", "Juzz", "Kalilh", "Kedi", "Kibudekk", "Kilordi", "Kirdi", "Kirr", "Kixahin", "Koli", "Kundibb", "Lagiks", "Lekk", "Leliki", "Less", "Lidd", "Ligg", "Liliff", "Lithelonn", "Lizr", "Logg", "Loss", "Ludd", "Lukk", "Lurr", "Madd", "Magudd", "Migg", "Migrghb", "Mirdiln", "Mirili", "Miskigg", "Mizrbiku", "Molik", "Munuki", "Murdagg", "Naburirb", "Nakk", "Nandi", "Nili", "Nogo", "Nohba", "Nohid", "Obb", "Obuk", "Odordukk", "Ogemagg", "Ogg", "Ongrushk", "Onuvuk", "Orgadd", "Ory", "Ovixali", "Ovizo", "Pavodd", "Purvrp", "Putrebb", "Ranukk", "Roo", "Rorbukk", "Rorenv", "Rukk", "Rukuvr", "Sadajj", "Sardi", "Sikibu", "Sikud", "Songu", "Sonn", "Sovopp", "Sury", "Tee", "Tigg", "Tilokk", "Torr", "Tortaho", "Tosunn", "Turr", "Ukk", "Uvutt", "Vargg", "Varr", "Vegidd", "Vemm", "Vodd", "Wiksh", "Wirihi", "Xidd", "Xigba", "Xigit", "Ximukk", "Yajj", "Yigg", "Yitt", "Yolilik", "Yugg", "Yuxx", "Zegubb", "Zikekk", "Zoo", "Zopiketu", "Zuu", "Zy"];
const lastNames = ["Abekk", "Abrnia", "Aff", "Agekan", "Agg", "Aikr", "Airg", "Aizogg", "Ajiror", "Ak'duhovo", "Akan", "Akiben", "Akipu", "Amokk", "App", "Arikk", "Arott", "Aruvt", "Ashg", "Asuduko", "Asugg", "Asuhibi", "Asul", "Asutikk", "Axulo", "Bekakk", "Bidd", "Bikk", "Bivtiss", "Crbenn", "Crbiss", "Crgdbrb", "Crirr", "Cromm", "Crosygg", "Cruhod", "Crur", "Dediga", "Delo", "Diss", "Divi", "Dora'fibb", "Dorzoff", "Duu", "Edudz", "Egg", "Ek'agg", "Ek'k", "Ekarboif", "Enukk", "Faba", "Fahobur", "Fanenirr", "Fangg", "Fann", "Fegaboabb", "Fegi", "Feglibo", "Fenurr", "Fetomm", "Fikk", "Firr", "Fishobe", "Fiss", "Fitt", "Fudu", "Furgang", "Fuzbam", "Gaa", "Gabb", "Gagelp", "Gahkk", "Gahl", "Gakk", "Ganabrzz", "Ganikk", "Gapp", "Grgik", "Grpesu", "Ha'he", "Hak", "Haka", "Harb", "Haree", "Hatanar", "Hekk", "Heloo", "Herah", "Hevo", "Hiji", "Hikrzz", "Hitt", "Imm", "Imuho", "Jann", "Jed", "Jelipta", "Jobevta", "Jokh", "Jorr", "Kaa", "Kakann", "Karkakan", "Khdifngrg", "Kodz'fu", "Koff", "Kombavv", "Kranedij", "Ledd", "Likk", "Lilo", "Lipp", "Loree", "Lorr", "Lorz'hl", "Lorzz", "Lushokh", "Mabed'di", "Magodd", "Mane", "Mekk", "Melikoff", "Menn", "Meviss", "Migg", "Miji", "Mobil", "Mobonik", "Morgiss", "Mosygg", "Movupt", "Norr", "Nott", "Obb", "Ogekev", "Ogg", "Ogudilv", "Omoib", "Rapp", "Rekk", "Roo", "Rul'f", "Sangebo", "Sann", "Sipp", "Siss", "Soig", "Sokk", "Sorr", "Sostukk", "Sozonge", "Stakk", "Stanika", "Stath", "Sthorr", "Stij", "Straho", "Strn", "Stsuhli", "Tabb", "Tagr", "Tamobeko", "Tapp", "Tebikk", "Tett", "Tiduhdu", "Tijorvokk", "Tili", "Tuloo", "Turidi", "Tygg", "Udabel", "Udd", "Udiaba", "Udigg", "Udrbra", "Ududiss", "Udzbo", "Ul'fngg", "Uligg", "Vach", "Vakk", "Varorngg", "Vataba", "Vavenn", "Vobakk", "Vorr", "Votanul", "Yosykk", "Zachg", "Zevil"];
const genders = ["male", "female"];
const pronouns = {male:["he", "him", "his"], female:["she", "her", "her"]};
const solarSystemNodeStatus = {free: "free",occupied: "occupied"};

//SOLAR SYSTEM
//Solar system. Contains all the nodes, their neighbours, and whether they are free or occupied.
const SolarSystem = {
    addNode: function(name,planet,neighbours) {
        SolarSystem[name] = {
            planet: planet,
            status: solarSystemNodeStatus.free,
            neighbours: neighbours
        };
    }
};
const Planets = {
    Mercury: {
        Appolodorus: ["Boethius"],
        Boethius: ["Appolodorus", "M_prime"],
        Caloris: ["Elion", "Pantheon"],
        Elion: ["Caloris", "Suisei"],
        Lares: ["Terminus"],
        M_prime: ["Boethius", "Terminus", "Pantheon", "Aphrodite"], //Venus junction: Pantheon and Aphrodite.
        Odin: ["Suisei"],
        Pantheon: ["Caloris", "M_prime", "Aphrodite"], //Venus junction: M_prime and Aphrodite
        Suisei: ["Elion", "Odin", "Tolstoj"],
        Terminus: ["Lares", "M_prime"],
        Tolstoj: ["Suisei"],
    },
    Venus: {
        Aphrodite: ["Fossa", "Kiliken", "Venera", "M_prime", "Pantheon"], //mercury junction: M_prime and Pantheon
        Cytherean: ["Kiliken"],
        E_gate: ["Tessera", "Unda", "V_prime", "Cambria"], //Earth junction: Cambria
        Ishtar: ["Linea", "Montes", "Malva"],
        Kiliken: ["Aphrodite", "Cytherean", "Unda"],
        Linea: ["Ishtar", "Tessera"],
        Malva: ["Ishtar"],
        Montes: ["Ishtar"],
        Romula: ["V_prime"],
        Tessera: ["Linea", "Venera", "E_gate"],
        Unda: ["Kiliken", "Venera", "E_gate", "Fortuna"],
        Venera: ["Aphrodite", "Unda", "Tessera"],
        V_prime: ["E_gate", "Romula"],
        Fossa: ["Aphrodite"],
        Fortuna: ["Unda"],
    },
    Earth: {
        Cambria: ["Gaia", "Lith", "E_gate"], //Venus junction: E_gate
        Cervantes: ["Everest", "Erpo"],
        E_prime: ["Mariana"],
        Erpo: ["Cervantes", "Oro"],
        Eurasia: ["Plains_of_eidolon"], //Mars junction: [NOT INCLUDED]
        Everest: ["Coba", "Plains_of_eidolon", "Cervantes"],
        Gaia: ["Pacific", "Mantle", "Cambria"],
        Lith: ["Mantle", "Cambria"],
        Mantle: ["Mariana", "Plains_of_eidolon", "Lith", "Gaia"],
        Mariana: ["E_prime", "Mantle"],
        Pacific: ["Gaia"],
        Coba: ["Everest"],
        Tikal: ["Oro"],
        Oro: ["Erpo","Tikal"],
        Plains_of_eidolon: ["Eurasia", "Everest", "Mantle"],
    }

}
//Populate SolarSystem with Planets data
Object.entries(Planets).forEach(planet => {
    const planetName = planet[0];
    const planetData = planet[1];
    Object.entries(planetData).forEach(node => {
        const nodeName = node[0];
        const nodeNeighbors = node[1];
        SolarSystem.addNode(nodeName,planetName,nodeNeighbors);
    })
})

//This is necessary for selecting random nodes from scratch (lich spawn) and for eventual foreach(node) on (planet).
const planetsCatalogue = { Mercury: 0, Venus: 1, Earth: 2 }; //this is jank, CHANGE IT.

const getPlanetNodeNames = planet => Object.keys(planet);
const SolarSystemCatalogue = [
    getPlanetNodeNames(Planets.Mercury),
    getPlanetNodeNames(Planets.Venus),
    getPlanetNodeNames(Planets.Earth)
] ;

//ASSETS
//model:{tier:0, owned:false, type:"", effects:"", rewards:""}, //intelCost is 100*tier. Subject to balance.
//possible types: equipment (destroyed by sabotage), personnel (exterminate/sabotage), specialist (capture/assassination).
//Empyrean/Railjack stuff can be slotted into this system relatively easily. A galleon could be a tier 5 equipment for example.
var Assets = {
    Crate_of_grattlers: { tier: 1, type: "equipment", effects: "Replace heavy gunner thralls and all heavy gunners in Lich missions with Tusk heavy gunners.", rewards: "Grattler blueprint, Gravimag." },
    Indiscriminate_security_system: { tier: 1, type: "equipment", effects: "Lich missions are susceptible to have environmental hazards. Type depends on Lich element (fire, cold, magnetic, radiation...)", rewards: "Something elemental related. Mods probably." },
    Trap_master: { tier: 1, type: "specialist", effects: "Shock traps, fragmentation mines (from kuva fortress), turret rollers (from rathuum), and magnetic door fields, appear in lich missions.", rewards: "A chat ban." },
    Ghoul_pack: { tier: 1, type: "personnel", effects: "Ghouls in lich missions.", rewards: "ghoul drops." },
    Warframe_helmet_trophy: {tier:1, type:"trophy", effects:"The Lich has your helmet on their shoulder and calls you a loser. Also some ability theft.", rewards:"Lich loses the stolen ability, recovering your honor."}, //This is not obtainable randomly, but by the lich defeating you.

    Kuva_guardians_bodyguards: { tier: 2, type: "personnel", effects: "Lich spawns accompanied by two Kuva Guardians. Guardians occasionally appear in lich missions.", rewards: "Kesheg blueprint, kuva and kuva associated paraphernalia." },
    Beastmaster: { tier: 2, type: "specialist", effects: "Hyekka and Drakk masters are a lot more common, and their beasts are more dangerous.", rewards: "Companion mods, those hyekka/Drakk imprints that the cetus guy sells..." },

    Cybersecurity_expert: { tier: 3, type: "specialist", effects: "Makes hacking in lich missions more difficult (e.g. more pips). Shortens hacking time. Disable the use of ciphers.", rewards: "Parazon mods, spy rewards, a bunch of ciphers." },
    Manics_cloning_tubes: { tier: 3, type: "personnel", effects: "Manics spawn frequently in Lich missions.", rewards: "Ash alt helmets, dagger blueprints and mods..." },
    Lone_smuggler: { tier: 3, type: "specialist", effects: "More mission rewards stolen. Destroying it is an Archwing mission.", rewards: "Archwing mods and stuff." },
    Disruptor_pulse_backpacks: { tier: 3, type: "equipment", effects: "Some elite thralls may carry disruptor packs, emitting red nullifier pulses.", rewards: "I don't know" },

    Secret_bunkers_network: { tier: 4, type: "equipment", effects: "Intel costs increased by 50% due to the difficulty to track thrall cells.", rewards: "Not having to deal with the increased costs?" },
    Fast_response_strike_squad: { tier: 4, type: "personnel", effects: "An elite eximus thrall death squad may teleport onto the offending tenno with little warning during lich missions.", rewards: "spectre blueprints" },
    Demented_doctor: { tier: 4, type: "specialist", effects: "Low ranking thralls may turn into heavy infested units when the battle turn against the lich's forces. Possibility of mission-wide hazardous atmosphere.", rewards: "Infested/defection related stuff." },

    Nightwatch_support: { tier: 5, type: "personnel", effects: "Regular grineer thralls and some Lich mission units replaced by Nightwatch elites.", rewards: "Whatever nightwatch alerts rewarded." },
    Rathuum_executioner: { tier: 5, type: "specialist", effects: "An elite rathuum executioner may appear in lich missions (always the same).", rewards: "Endo, rathuum/Kela mods." },
}

//needed for random selection, since that can't be done as easily on associative arrays.
const assetsList = [];

Object.entries(Assets).forEach(asset => {
    //populate assetsList dynamically and provide the default value for 'owned' property
    const assetName = asset[0];
    const assetData = asset[1];
    assetData.owned = false;
    const index = assetData.tier - 1;
    if(!assetsList[index]) {
        assetsList[index] = [];
    }
    assetsList[index].push(assetName);
});

// ++
//END VARIABLES AND CONSTANT
// ++

// ++
//LICH GENERATION/GESTION
// ++

//Basic lich creation/regeneration
function createLich() {
    Lich.alive = true;
    Lich.name = firstNames[getRndInteger(0, firstNames.length - 1)] + " " + lastNames[getRndInteger(0, lastNames.length - 1)];
    Lich.gender = genders[getRndInteger(0, 1)];
    generateWeapon(Lich.weapon, false); //new lich new weapon obviously.
    generateRequiem(); //separate function for clarity and just in case we wanna new requiems while keeping the lich.
    Lich.rank = 1;
    Lich.experience = 0;
    Lich.treasury = { credits: 0, common_resources: 0, rare_resources: 0, mods: 0, relics: 0, blueprints: 0 };
    Lich.assets = [];
    //territory must have been cleaned up previously, maybe ensure it's cleaned up again?
    lichLanding(); //Function grabs one random node somewhere and a number of conquer() based on rank. Initial landing.

    intel = 0; //new lich, old intel doesn't apply. Better to set that to 0 at lich death though.

    document.getElementById("lichCreate").hidden = true;
    document.getElementById("lichInfo").hidden = false;

    updateLichInfo();
}

//separate function because we want to be able to get new weapons without killing the lich
function generateWeapon(previousWeapon, isReroll) {
    var newWeapon;
    var newElement;
    var newBonusDamage;
    do {
        newWeapon = weaponList[getRndInteger(0, 12)]; //random weapon
        newElement = elementsList[getRndInteger(0, 6)]; //random new element
    }
    while (newWeapon == previousWeapon); //Bad luck protection: can't get same weapon twice in a row.

    newBonusDamage = Math.max(25, getRndInteger(1, 10) + getRndInteger(1, 10) + getRndInteger(1, 10) + 5 + 5 * Lich.rank); //Made the bonus damage depend on lich rank.
    //This is 3d10+5+(5*rank), so 3d10+10 to 3d10+30. Averages per rank are 28, 32, 36.5, 41.5, 46.5 before correction. So they'll be higher.

    if (isReroll && newBonusDamage < Lich.bonusDamage) //Make the bonus damage at least a little bit better if it's not a new lich. This means a very old lich will consistently put out +60% weapons.
    {
        newBonusDamage = Math.min(Lich.bonusDamage + 1, 60);
    };

    Lich.weapon = newWeapon;
    Lich.element = newElement;
    Lich.bonusDamage = newBonusDamage;
    weaponBiometricsBroken = false;
    Lich.lockStrength = 1500; //reset the weapon intel cost
}

//Generate requiem combination. There cannot be duplicates in a combination. Also resets the true/false of requiem status, since correct/incorrectness is no longer valid.
function generateRequiem() {
    var firstRequiem;
    var secondRequiem;
    var thirdRequiem;

    firstRequiem = requiemModsList[getRndInteger(0, 7)];

    do { secondRequiem = requiemModsList[getRndInteger(0, 7)] }
    while (secondRequiem == firstRequiem)

    do { thirdRequiem = requiemModsList[getRndInteger(0, 7)] }
    while (thirdRequiem == secondRequiem || thirdRequiem == firstRequiem)

    Lich.requiem = [firstRequiem, secondRequiem, thirdRequiem];

    requiemModsList.forEach(requiemMod => {
        Parazon.requiemModsStatus[requiemMod] = "?";
    });
}

//this should only ever be called on an empty map, but shouldn't bug out if it isn't.
function lichLanding() {
    var planetSpawn = SolarSystemCatalogue[getRndInteger(0, SolarSystemCatalogue.length - 1)] //pick a random planet. Currently just mercury.
    var landing = planetSpawn[getRndInteger(0, planetSpawn.length - 1)];
    conquer(landing); //pick a random node on that planet and conquer it.
    //switchPlanet(SolarSystem[landing].planet); // change the focus to the conquered planet //on hold due to changes in switchPlanet

    //then expand a number of time from there.
    for (let i = 0; i < Lich.rank + 3; i++) //the exact number of expand() is subject to balance. This can be higher with more planets.
    {
        expand()
    }

    if (Lich.experience != 0 || Lich.rank != 1 || intel != 0) {
        postMessage(Lich.name + " has come back! Resurrected on " + landing + ", " + pronouns[Lich.gender][0] + " has re-established a base of operation on " + SolarSystem[landing].planet + ".");
    }
    else {
        postMessage(Lich.name + " has appeared! Gifted the cursed immortality of Kuva by the Grineer Queens, " + pronouns[Lich.gender][0] + " landed on " + landing + " and sent " + pronouns[Lich.gender][2] + " thralls to establish " + pronouns[Lich.gender][2] + " influence over " + SolarSystem[landing].planet + ".")
    }

}

function lichLevelUp(xp) {
    var xpThreshold = [250, 750, 1250, 1750]; //subject to balance obv. Stolen from MR requirements, with one less zero.
    Lich.experience += xp;
    if (Lich.experience >= xpThreshold[Lich.rank - 1]) {
        Lich.experience -= xpThreshold[Lich.rank - 1];
        Lich.rank++;
    }
    updateLichInfo();

}

function lichGetAsset() {
    var noInfiniteLoops = 0;
    do {
        var assetTier = getRndInteger(0, Lich.rank - 1); //What tier of asset is obtained. Limited by lich rank. This is an int.
        var assetGotten = assetsList[assetTier][getRndInteger(0, assetsList[assetTier].length - 1)]; //What asset is drawn. This is a string.
        noInfiniteLoops++;
    }
    while ((Assets[assetGotten].owned || Assets[assetGotten].type == "trophy") && noInfiniteLoops < 20);

    if (!Assets[assetGotten].owned && Lich.assets.length < Lich.rank+2) { //limit to number of assets per lich to 3-7.
        Assets[assetGotten].owned = true;
        Lich.assets.push(assetGotten);

        if(startsWithVowel(assetGotten)) {
            postMessage(Lich.name + " got " + pronouns[Lich.gender][2] + " hands on an " + assetGotten + "!");
        } else {
            postMessage(Lich.name + " got " + pronouns[Lich.gender][2] + " hands on a " + assetGotten + "!");
        }
        

        document.getElementById("assetTier" + Assets[assetGotten].tier).hidden = false;
        document.getElementById(assetGotten).hidden = false;
    }
}

// ++
//END LICH GENERATION
// ++

// ++
//TERRITORY MANAGEMENT
// ++

function conquer(node) {
    //don't do anything if node is already occupied you'll fuck up otherwise
    if (SolarSystem[node].status == solarSystemNodeStatus.free) {
        SolarSystem[node].status = solarSystemNodeStatus.occupied //set the node as occupied
        document.getElementById(node + "Expel").hidden = false;
        //put the node in lich territory list as edge or locked (depending on whether there are free nodes adjacent)
        if (checkLocked(node)) {
            Lich.territory_locked.push(node);
        }
        else {
            Lich.territory_edges.push(node);
        }

        SolarSystem[node]["neighbours"].forEach(neighbour => {
            if (SolarSystem[neighbour].status == solarSystemNodeStatus.occupied) //if neighbour is occupied
            {
                if (checkLocked(neighbour)) //check if it is newly locked
                {
                    edgeToLocked(neighbour); //if yes move it from territory edges to locked
                }
            }
        });

        //undo last Stand UI
        var lastStandButton = document.getElementById("lastStand");
        if (!lastStandButton.hidden) {
            if (Lich.territory_edges.length) {
                document.getElementById(Lich.territory_edges[0] + "Expel").hidden = false;
            }
            if (Lich.territory_locked.length) {
                document.getElementById(Lich.territory_locked[0] + "Expel").hidden = false;
            }
            lastStandButton.hidden = true;
        }
    }
}

function liberate(node) {
    //don't do anything if node is already free you'll fuck up otherwise
    if (SolarSystem[node].status == solarSystemNodeStatus.occupied) {
        SolarSystem[node].status = solarSystemNodeStatus.free //set the node as occupied
        document.getElementById(node + "Expel").hidden = true;

        //remove node from lich territory. From locked if locked, from edge otherwise.
        if (checkLocked(node)) {
            var nodeIndex = Lich.territory_locked.findIndex(findNodeIndex, node);
            if (nodeIndex >= 0) //never too careful
            {
                Lich.territory_locked.splice(nodeIndex, 1);
            }
        }
        else {
            var nodeIndex = Lich.territory_edges.findIndex(findNodeIndex, node);
            if (nodeIndex >= 0) //never too careful
            {
                Lich.territory_edges.splice(nodeIndex, 1);
            }
        }

        SolarSystem[node]["neighbours"].forEach(neighbour => {
            if (SolarSystem[neighbour].status == solarSystemNodeStatus.occupied) //if neighbour is occupied
            {
                if (Lich.territory_locked.findIndex(findNodeIndex, neighbour) >= 0)//if it is in the locked index, move it to edges (because it's no longer locked)
                {
                    lockedToEdge(neighbour);
                }
            }
        });

        //after everything else is done, check if the Lich owns only 1 node. Last node should always be an edge.
        if (!Lich.territory_locked.length && Lich.territory_edges.length == 1) {
            var lastNodeExpel = document.getElementById(Lich.territory_edges[0] + "Expel");
            var lastStandButton = document.getElementById("lastStand");
            lastNodeExpel.hidden = true; //hide the Expel button
            lastNodeExpel.parentNode.appendChild(lastStandButton);
            lastStandButton.hidden = false;
        }
    }
}

function expand() {
    if (Lich.territory_edges.length && (Lich.territory_locked.length + Lich.territory_edges.length < Lich.rank*10)) { //maximum territory size, subject to balance. Especially in a bigger solar system.
        var expansionStart = SolarSystem[Lich.territory_edges[getRndInteger(0, (Lich.territory_edges.length) - 1)]]; //pick a random start from lich territory edges
        var expansionTarget;
        var loopCounter = 0; //prevents infinite loops
        do {
            expansionTarget = expansionStart.neighbours[getRndInteger(0, (expansionStart.neighbours.length) - 1)];
            loopCounter++;
        } //try and find a target.
        while (SolarSystem[expansionTarget].status != solarSystemNodeStatus.free && loopCounter < 20);

        if (SolarSystem[expansionTarget].status == solarSystemNodeStatus.free) {
            conquer(expansionTarget);
        }
    }
    else {
        console.log("no expansion possible");
    }

}

//move occupied node from edge to locked (removing it from eligibility for expand())
function edgeToLocked(node) {
    //first remove node from territory edges
    var nodeIndex = Lich.territory_edges.findIndex(findNodeIndex, node);
    if (nodeIndex >= 0) //never too careful
    {
        Lich.territory_edges.splice(nodeIndex, 1);
    }
    //then add it to territory locked
    Lich.territory_locked.push(node);
}

//the counterpart to the above
function lockedToEdge(node) {
    var nodeIndex = Lich.territory_locked.findIndex(findNodeIndex, node);
    if (nodeIndex >= 0) //never too careful
    {
        Lich.territory_locked.splice(nodeIndex, 1);
    }
    Lich.territory_edges.push(node);
}

//the findIndex function
function findNodeIndex(checkedNode) {
    return checkedNode == this;
}

//check if all neighbours are occupied, thus making the checked node locked.
function checkLocked(node) {
    var locked = true;
    SolarSystem[node]["neighbours"].forEach(neighbour => {
        if (SolarSystem[neighbour].status == solarSystemNodeStatus.free) {
            locked = false;
        }
    });
    return locked;
}

// ++
//END TERRITORY MANAGEMENT
// ++

// ++
//TIME PASSING
// ++

function dailyTick() {
    if (!Lich.territory_edges.length && !Lich.territory_locked.length && Lich.alive && Math.random() < 0.67)//If Lich alive and no territory, then 67% chance to land.
    {
        lichLanding();
    }
    else if (Lich.alive && (Lich.territory_edges.length || Lich.territory_locked.length)) //if lich alive and has territory
    {
        lichLevelUp(getRndInteger(6, 30) + Lich.territory_locked.length + Lich.territory_edges.length); //small bit of XP every day. Like very little. Would be more with more planets.
        expand();

        if (Math.random() < 0.5) //1/2 chance to get an asset per day. Subject to balance.
        {
            lichGetAsset();
        }

        if (Lich.rank >= 3) //additional expands for higher ranks, kind of slapdash.
        {
            expand();
        }
        if (Lich.rank >= 5) {
            expand();
        }

        //maybe shuffle the XP gain so that actual expansion gains some, and daily upkeep gains some? Expanding liches would level faster in adversity.
    }
    dayCounter++;
    document.getElementById("dayCounter").innerText = "Day: " + dayCounter;
}

// ++
//END TIME PASSING
// ++

// ++
//MISSIONS
// ++

//MISSIONS THEMSELVES

//this is the basic mission. When you run a node normally. No fuss. Nothing special.
function basicMission(node) {
    if (SolarSystem[node].status == solarSystemNodeStatus.free) {
        postMessage(node + " is free of lich activity.")
    }
    else {
        var missionResults = commonMissionStuff();
        updateIntelDisplay()
        missionResults.alertContent += "<br>You gained: " + missionResults.intel + " intel";
        postMessage(missionResults.alertContent);
    }
}

//this is the mission to liberate a specific node.
function expelMission(node) {
    if (SolarSystem[node].status == solarSystemNodeStatus.free) {
        postMessage(node + " is free of lich activity.")
    }
    else {
        var intelCost = 20;
        if (intel < intelCost) {
            postMessage("Not enough intel to root out lich activity. Need: " + intelCost + " intel.<br>Acquire basic Intel through regular missions.")
        }
        else {
            intel -= intelCost; //cost subject to balance. This amount is largely neutral. (-2 on average)
            var missionResults = commonMissionStuff();
            updateIntelDisplay()
            var alertContent = "Successfully expelled " + Lich.name + "'s thralls from " + node + "!<br>" +
                missionResults.alertContent + "<br>Your net intel change is: " + (missionResults.intel - intelCost) + " intel";
            postMessage(alertContent);
            liberate(node);
        }
    }
}

function purgePlanet(purgedPlanet) {
    isLastPlanet = true; //cant purge the last remaining planet
    nodesOnPlanet = 0;

    Lich.territory_edges.forEach(node => {
        if (SolarSystem[node].planet != purgedPlanet) {
            isLastPlanet = false;
        }
        else {
            nodesOnPlanet++;
        }
    });
    Lich.territory_locked.forEach(node => {
        if (SolarSystem[node].planet != purgedPlanet) {
            isLastPlanet = false;
        }
        else {
            nodesOnPlanet++;
        }
    });

    if (!isLastPlanet && nodesOnPlanet) {
        var intelCost = Math.floor(20 * (nodesOnPlanet ** 1.5)); //cost scales up with number of occupied nodes
        if (intel < intelCost) {
            postMessage("Not enough intel to find a critical HQ on " + purgedPlanet + ". You need " + intelCost + " to purge that many nodes at once.");
        }
        else {
            intel -= intelCost;
            Lich.anger += 5 * nodesOnPlanet;
            var missionResults = commonMissionStuff();

            SolarSystemCatalogue[planetsCatalogue[purgedPlanet]].forEach(node => {
                liberate(node); //calling liberate on a free node shouldn't do anything
            });

            updateIntelDisplay();
            missionResults.alertContent += "<br>Your net intel change is: " + (missionResults.intel + intelGain - intelCost) + " intel<br>";

            missionResults.alertContent += purgedPlanet + " has been purged of all Lich presence. Nodes freed: " + nodesOnPlanet + "<br>";

            postMessage(missionResults.alertContent);
        }

    }
    else if (!nodesOnPlanet) {
        postMessage("No lich activity on that planet.");
    }
    else if (isLastPlanet) {
        postMessage("Cannot purge a lich's last remaining planet.");
    }
}

//this is the mission that gets a lot of intel at once.
function reconMission() {
    var intelCost = 35
    if (intel < intelCost) {
        postMessage("Not enough intel to find an appropriate target. Need: " + intelCost + " intel.")
    }
    else {
        intel -= intelCost; //about two missions worth of intel
        var missionResults = commonMissionStuff();

        var intelGain = getRndInteger(150, 250); //grab large amount of intel
        intel += intelGain;

        updateIntelDisplay()
        missionResults.alertContent += "<br>Your net intel change is: " + (missionResults.intel + intelGain - intelCost) + " intel";

        postMessage(missionResults.alertContent);
    }

}

function recoverLoot() {
    var intelCost = 50
    if (intel < intelCost) {
        postMessage("Not enough intel to find a treasury cache. Need: " + intelCost + " intel.")
    }
    else {
        intel -= intelCost;
        updateIntelDisplay()
        var missionResults = commonMissionStuff();

        var recoveredLoot = {
            credits: Math.min(Math.max(getRndInteger(2000, 3000), Math.floor(Lich.treasury.credits * Math.random())), Lich.treasury.credits),
            common_resources: Math.min(getRndInteger(500, 1200), Lich.treasury.common_resources),
            rare_resources: Math.min(getRndInteger(6, 20), Lich.treasury.rare_resources),
            mods: Math.min(getRndInteger(0, 10), Lich.treasury.mods),
            relics: Math.min(getRndInteger(0, 3), Lich.treasury.relics),
            blueprints: Math.min(getRndInteger(0, 2), Lich.treasury.blueprints),
        }

        //removing the recovered loot from the lich's treasury
        Lich.treasury.credits -= recoveredLoot.credits;
        Lich.treasury.common_resources -= recoveredLoot.common_resources;
        Lich.treasury.rare_resources -= recoveredLoot.rare_resources;
        Lich.treasury.mods -= recoveredLoot.mods;
        Lich.treasury.relics -= recoveredLoot.relics;
        Lich.treasury.blueprints -= recoveredLoot.blueprints;

        updateTreasuryDisplay();

        missionResults.alertContent += "Recovered the following from " + Lich.name + "'s treasury:<br>" + recoveredLoot.credits + " credits<br>" + recoveredLoot.common_resources + " common resources<br>";
        if (recoveredLoot.rare_resources) {
            missionResults.alertContent += recoveredLoot.rare_resources + " rare resources<br>";
        }
        if (recoveredLoot.mods) {
            missionResults.alertContent += recoveredLoot.mods + " mods<br>";
        }
        if (recoveredLoot.relics) {
            missionResults.alertContent += recoveredLoot.relics + " relics<br>";
        }
        if (recoveredLoot.blueprints) {
            missionResults.alertContent += recoveredLoot.blueprints + " blueprint<br>"
        }

        missionResults.alertContent += "<br>Your net intel change is: " + (missionResults.intel - intelCost) + " intel";

        postMessage(missionResults.alertContent);
    }
}

function trackDownLich() {
    var intelCost = 70;
    if (intel < intelCost) {
        postMessage("Not enough intel to track down " + Lich.name + ". Need: " + intelCost + " intel.")
    }
    else {
        intel -= intelCost;
        trackedDown = true;
        var missionResults = commonMissionStuff();
        updateIntelDisplay();

        var node;
        var nodeNumber = getRndInteger(0, (Lich.territory_edges.length + Lich.territory_locked.length - 1));
        if (nodeNumber < Lich.territory_edges.length) {
            node = Lich.territory_edges[nodeNumber];
        }
        else {
            node = Lich.territory_locked[nodeNumber - Lich.territory_edges.length];
        }

        var alertContent = "Tracked down and confronted " + Lich.name + " on " + node + ", " + SolarSystem[node].planet + ".<br>" + missionResults.alertContent;
        alertContent += "<br>Your net intel change is: " + (missionResults.intel - intelCost) + " intel";

        postMessage(alertContent);
    }

}

function breakWeaponLock() {
    if (!weaponBiometricsBroken && intel >= Lich.lockStrength) {
        weaponBiometricsBroken = true;
        postMessage("Biometric lock on " + Lich.name + "'s kuva " + Lich.weapon + " broken!<br>You will steal it on your next victorious encounter.");
        intel -= Lich.lockStrength;
        updateIntelDisplay()
    }
    else if (weaponBiometricsBroken) {
        postMessage("Biometric lock already broken");
    }
    else if (intel < Lich.lockStrength) {
        postMessage("Not enough intel to crack the lock.");
    }
}

function destroyAsset(asset) //where asset is a string name
{
    if (Assets[asset].owned) {
        var intelCost = Assets[asset].tier * 100; //subject to balance
        if (intel < intelCost) {
            postMessage("Not enough intel to locate " + Lich.name + "'s " + asset + ". Need " + intelCost + " intel to destroy a tier " + Assets[asset].tier + " asset.")
        }
        else {
            intel -= intelCost;
            var missionResults = commonMissionStuff();

            Assets[asset].owned = false;
            
            var assetIndex = Lich.assets.findIndex(findNodeIndex, asset);
            if (assetIndex >= 0) //never too careful
            {
                Lich.assets.splice(assetIndex, 1);
            }

            document.getElementById(asset).hidden = true;

            var alertContent = Lich.name + "'s " + asset + " successfully destroyed!<br>" + missionResults.alertContent
                + "<br>Your net intel change is: " + (missionResults.intel - intelCost) + " intel";

            postMessage(alertContent);

        }
    }
    else {
        console.log("ERROR: can't destroy an asset that doesn't exist");
    }
}


// LAST STAND HERE
//this mission doesn't have a permanent button, it is generated when the program detects that the lich only has one node left
//after a liberate(). And it's removed on successful conquer().
function lastStand() {
    var lastStandResults = "Fought " + Lich.name + " in a climactic battle on " + Lich.territory_edges[0] + ", " + SolarSystem[Lich.territory_edges[0]].planet + ".<br>";

    if (Math.random() >= 0.1) {
        lastStandResults += "And were victorious!<br>"
        var finalVictory = false;

        //victory
        //check combination, with order this time.
        if (Parazon.requiemEquipped[0] == Lich.requiem[0]) {
            //good first requiem
            lastStandResults += Parazon.requiemEquipped[0] + " was the correct first requiem!<br>"

            if (Parazon.requiemEquipped[1] == Lich.requiem[1]) {
                //good second requiem
                lastStandResults += "and " + Parazon.requiemEquipped[1] + " was the correct second requiem!<br>"

                if (Parazon.requiemEquipped[2] == Lich.requiem[2]) {
                    //good third requiem
                    lastStandResults += "and " + Parazon.requiemEquipped[2] + " was the correct last requiem!<br>"
                    //correct combination
                    finalVictory = true;
                }
                else {
                    //incorrect third requiem
                    if (Parazon.requiemEquipped[2] == NO_EQUIPPED_REQUIEM) {
                        lastStandResults += "but you did not have a third requiem mod equipped...<br>"
                    }
                    else {
                        lastStandResults += "but " + Parazon.requiemEquipped[2] + " was not the correct last requiem...<br>"
                        Parazon.lastStandKnown = 2;
                    }
                }
            }
            else {
                //incorrect second requiem
                if (Parazon.requiemEquipped[1] == NO_EQUIPPED_REQUIEM) {
                    lastStandResults += "but you did not have a second requiem mod equipped...<br>"
                }
                else {
                    lastStandResults += "but " + Parazon.requiemEquipped[1] + " was not the correct second requiem...<br>"
                    if (Parazon.lastStandKnown < 1) {
                        Parazon.lastStandKnown = 1;
                    }
                }
            }
        }
        else {
            //incorrect first requiem
            if (Parazon.requiemEquipped[0] == NO_EQUIPPED_REQUIEM) {
                lastStandResults += "but you did not have a first requiem mod equipped...<br>"
            }
            else {
                lastStandResults += "but " + Parazon.requiemEquipped[0] + " was not the correct first requiem...<br>"
            }
        }

        if (finalVictory) {
            lastStandResults += "You finally defeated " + Lich.name + " for good! The system is now free from this particular threat.<br>"
            document.getElementById("lichCreate").hidden = false;
            document.getElementById("lichInfo").hidden = true;
            Lich.assets.forEach(asset => {
                Assets[asset].owned = false;
                document.getElementById(asset).hidden = true;
            });
            Lich.assets = [];
            intel = 0;
            updateIntelDisplay();
            Lich.alive = false;
        }
        else {
            lastStandResults += "Though " + Lich.name + " lies dead, the parazon failed to undo the kuva's curse of immortality. They will be back...<br>"
            if (Parazon.lastStandKnown >= 0) {
                var lastStandHistoric = "Known requiem mod order: "
                for (let i = 0; i < Parazon.lastStandKnown; i++) {
                    lastStandHistoric += Lich.requiem[i] + " ";
                }
                lastStandHistoric += "<br>";
                document.getElementById("lastStandAttemptsHistory").innerHTML = lastStandHistoric;
            }

        }

        liberate(Lich.territory_edges[0]); //this should be the only liberate() to do. If not, there is a problem.
        document.getElementById("lastStand").hidden = true;

        //this is weaksauce but whatever
        if (Lich.territory_edges.length || Lich.territory_locked.length) {
            console.log("ERROR: PREMATURE LAST STAND");
        }

        //weapon acquisition, whether final victory or not.
        lastStandResults += "Acquired: +" + Lich.bonusDamage + "% " + Lich.element + " Kuva " + Lich.weapon + ".<br>";
        if (!finalVictory) {
            generateWeapon(Lich.weapon, true);
        }

        lastStandResults += "Recovered the entirety of " + Lich.name + "'s treasury:<br>"
            + Lich.treasury.credits + " credits<br>"
            + Lich.treasury.common_resources + " common resources<br>"
        + Lich.treasury.rare_resources + " rare resources<br>"
        + Lich.treasury.mods + " mods<br>"
        + Lich.treasury.relics + " relics<br>"
        + Lich.treasury.blueprints + " blueprint<br>";

        //removing the recovered loot from the lich's treasury
        Lich.treasury.credits = 0;
        Lich.treasury.common_resources = 0;
        Lich.treasury.rare_resources = 0;
        Lich.treasury.mods = 0;
        Lich.treasury.relics = 0;
        Lich.treasury.blueprints = 0;

        document.getElementById("treasuryDisplay").innerHTML = "(nothing)";

        updateLichInfo();
        postMessage(lastStandResults);
    }
    else {
        //defeat
        lastStandResults += "And were defeated... (1/10 chance)<br>" + Lich.name + " rallied grineer to " + pronouns[Lich.gender][2] + " banner thanks to " + pronouns[Lich.gender][2] + " unlikely comeback, and regained territory on " + SolarSystem[Lich.territory_edges[0]].planet + ".<br>";
        //expand() a few times, lich gains a ton of XP.

        //acquire a trophy
        if(!Assets["Warframe_helmet_trophy"].owned)
        {
        Assets["Warframe_helmet_trophy"].owned = true;
        Lich.assets.push("Warframe_helmet_trophy");
        document.getElementById("assetTier" + Assets["Warframe_helmet_trophy"].tier).hidden = false;
        document.getElementById("Warframe_helmet_trophy").hidden = false;
        lastStandResults += pronouns[Lich.gender][0] + " also tore the helmet from your destroyed frame, and wears it as a trophy!<br>"
        }

        for (let i = 0; i <= Lich.rank; i++) {
            expand();
        }
        postMessage(lastStandResults);
        lichLevelUp(240, 360);
    }
}

//END LAST STAND

//OTHER MISSION STUFF

//Misc things that all missions have: intel from thrall kills, chance of lich encounter, plunder, lich anger.
function commonMissionStuff() {
    var plunder = lichPlunder();
    var intelGain = getRndInteger(6, 30); //same amount as traces, subject to balance.
    intel += intelGain;
    var alertContent = "";
    var encounterResults = lichEncounter();

    if (encounterResults) {
        alertContent += "You encountered " + Lich.name + "!<br>" + encounterResults;
    }
    else {
        var angerGain = getRndInteger(4, 20); //anger is 0-100
        Lich.anger = Math.min(Lich.anger + angerGain, 100);
    }


    alertContent += Lich.name + " stole the following:<br>" + plunder.credits + " credits<br>" + plunder.common_resources + " common resources<br>";
    if (plunder.rare_resources) {
        alertContent += plunder.rare_resources + " rare resources<br>";
    }
    if (plunder.mods) {
        alertContent += plunder.mods + " mods<br>";
    }
    if (plunder.relics) {
        alertContent += plunder.relics + " relics<br>";
    }
    if (plunder.blueprints) {
        alertContent += plunder.blueprints + " blueprint<br>"
    }

    var missionResults = { intel: intelGain, alertContent: alertContent }

    updateLichInfo();

    return missionResults
}

//This is the lich stealing from the player's end mission rewards. Run this for every mission in occupied nodes
function lichPlunder() {
    var plunder = {
        credits: getRndInteger(200, 1000) * Lich.rank,
        common_resources: getRndInteger(50, 200) * Lich.rank,
        rare_resources: getRndInteger(0, 5),
        mods: 0,
        relics: 0,
        blueprints: 0,
    }

    if (Math.random() < 0.5) {
        plunder.mods = getRndInteger(1, 3);
    }
    if (Math.random() < 0.25) {
        plunder.relics = 1;
    }
    if (Math.random() < 0.05) {
        plunder.blueprints = 1;
    }

    //adding the generated loot to the lich's treasury
    Lich.treasury.credits += plunder.credits;
    Lich.treasury.common_resources += plunder.common_resources;
    Lich.treasury.rare_resources += plunder.rare_resources;
    Lich.treasury.mods += plunder.mods;
    Lich.treasury.relics += plunder.relics;
    Lich.treasury.blueprints += plunder.blueprints;

    updateTreasuryDisplay();

    //returning the variable with what was looted so it can be displayed in the mission outcome popup
    return plunder;
}

function lichEncounter() {
    if (getRndInteger(0, 100) < Lich.anger || trackedDown) //random chance of encountering the lich
    {
        var encounterResults = "";

        //either way: reduce cost of steal weapon. Minimum of 10% of max cost as of writing this
        Lich.lockStrength = Math.max(Math.floor(0.9 * Lich.lockStrength), 150);

        //win/lose, random chance
        if (Math.random() < 0.9) //90% chance to win
        {
            //win
            encounterResults += "...and won!<br>";
            lichLevelUp(getRndInteger(80, 120)); //still a nice chunk of XP if the lich loses.
            murmurResults = murmurs();
            if (!isNaN(murmurResults)) //need three mods on the parazon to test the combination
            {
                encounterResults += "The requiem combination " + Parazon.requiemEquipped[0] + ", " + Parazon.requiemEquipped[1] + ", " + Parazon.requiemEquipped[2] + " contains " + murmurResults + " correct mods.<br>";
            }
            else {
                encounterResults += "You did not have three requiem mods equipped, no combination was tested.<br>";
            }
            if (weaponBiometricsBroken) {
                encounterResults += "Acquired: +" + Lich.bonusDamage + "% " + Lich.element + " Kuva " + Lich.weapon + ".<br>";
                generateWeapon(Lich.weapon, true);
            }
        }
        else //10% chance to lose
        {
            //lose
            encounterResults += "...and lost! (1/10 chance in this demo)<br>";
            lichLevelUp(getRndInteger(200, 300)); // a LOT of XP to the Lich if you lose.

            //acquire a trophy sometimes
            if(!Assets["Warframe_helmet_trophy"].owned && Math.random()<0.5)
            {
            Assets["Warframe_helmet_trophy"].owned = true;
            Lich.assets.push("Warframe_helmet_trophy");
            document.getElementById("assetTier" + Assets["Warframe_helmet_trophy"].tier).hidden = false;
            document.getElementById("Warframe_helmet_trophy").hidden = false;
            encounterResults += pronouns[Lich.gender][0] + " also tore the helmet from your destroyed frame, and wears it as a trophy!<br>"
            }
        }
        Lich.anger = 0;
        trackedDown = false;
        return encounterResults;
    }
    else {
        return false;
    }
}

// ++
//END MISSIONS
// ++

// ++
//PARAZON AND REQUIEM
// ++

function updateParazon(node, number) {
    if (node.selectedIndex != 0) //0 is no mod
    {
        node.classList.add('selected')
        if (number != 0 && document.getElementById("firstParazonMod").selectedIndex == node.selectedIndex) {
            document.getElementById("firstParazonMod").selectedIndex = 0;
            Parazon.requiemEquipped[0] = NO_EQUIPPED_REQUIEM;
        }
        if (number != 1 && document.getElementById("secondParazonMod").selectedIndex == node.selectedIndex) {
            document.getElementById("secondParazonMod").selectedIndex = 0;
            Parazon.requiemEquipped[1] = NO_EQUIPPED_REQUIEM;
        }
        if (number != 2 && document.getElementById("thirdParazonMod").selectedIndex == node.selectedIndex) {
            document.getElementById("thirdParazonMod").selectedIndex = 0;
            Parazon.requiemEquipped[2] = NO_EQUIPPED_REQUIEM;
        }
    }  else {
        node.classList.remove('selected')
    }
    Parazon.requiemEquipped[number] = node.options[node.selectedIndex].value;

    //document.getElementById("debugRequiemEquipped").value = Parazon.requiemEquipped[0]+" "+Parazon.requiemEquipped[1]+" "+Parazon.requiemEquipped[2]; //Debug: remove later
}

function murmurs() //this is where the computer play Mastermind (for regular encounters);
{
    const requiemEquipped = Parazon.requiemEquipped;

    const requiem1 = requiemEquipped[0];
    const requiem2 = requiemEquipped[1];
    const requiem3 = requiemEquipped[2];

    if (requiem1 != NO_EQUIPPED_REQUIEM && requiem2 != NO_EQUIPPED_REQUIEM && requiem3 != NO_EQUIPPED_REQUIEM) {
        let numberOfCorrectGuesses = 0;
        requiemEquipped.forEach(equippedMod => {
            Lich.requiem.forEach(targetMod => {
                if (equippedMod == targetMod) {
                    numberOfCorrectGuesses++;
                }
            });
        });

        const modsStatus = Parazon.requiemModsStatus;
        
        let status1 = modsStatus[requiem1];
        let status2 = modsStatus[requiem2];
        let status3 = modsStatus[requiem3];
        
        const setModsStatus = (requiem,value) => modsStatus[requiem] = value;
        const setCorrect = requiem => setModsStatus(requiem,true);
        const setIncorrect = requiem => setModsStatus(requiem,false);
        
        if (numberOfCorrectGuesses == 0) {
            setIncorrect(requiem1);
            setIncorrect(requiem2);
            setIncorrect(requiem3);
        }
        else if(numberOfCorrectGuesses === 1 || numberOfCorrectGuesses === 2) {
            let setStatusForCorrect, setStatusForIncorrect;

            if(numberOfCorrectGuesses === 1) {
                setStatusForCorrect = setIncorrect;
                setStatusForIncorrect = setCorrect;
            } else {
                setStatusForCorrect = setCorrect;
                setStatusForIncorrect = setIncorrect;

                status1 = !status1;
                status2 = !status2;
                status3 = !status3;
            }

            if (status1) {
                setStatusForCorrect(requiem2);
                setStatusForCorrect(requiem3);
            }
            else if (status2) {
                setStatusForCorrect(requiem1);
                setStatusForCorrect(requiem3);
            }
            else if (status3) {
                setStatusForCorrect(requiem1);
                setStatusForCorrect(requiem2);
            }
        
            else if (!status1 && !status2) {
                setStatusForIncorrect(requiem3);
            }
            else if (!status2 && !status3) {
                setStatusForIncorrect(requiem1);
            }
            else if (!status1 && !status3) {
                setStatusForIncorrect(requiem2);
            };
        }
        else if (numberOfCorrectGuesses == 3) {
            setCorrect(requiem1);
            setCorrect(requiem2);
            setCorrect(requiem3);
        }
        //This whole thing detects and updates requiemModsStatus

        updateKnownRequiems();

        const attemptNote = [requiem1, requiem2, requiem3, numberOfCorrectGuesses];
        Parazon.requiemHistory.push(attemptNote);
        const newArchive = document.createElement("p");
        newArchive.innerHTML = "Attempt number " + Parazon.requiemHistory.length + ": " + attemptNote[0] + ", " + attemptNote[1] + ", " + attemptNote[2] + ". " + attemptNote[3] + " of those are correct.";
        document.getElementById("murmurAttemptsHistory").appendChild(newArchive);
        return numberOfCorrectGuesses;
    }
    else {
        return NaN;
    }
}

// ++
//END PARAZON AND REQUIEM
// ++

// ++
//UI AND MISC UTILITY STUFF
// ++

//The big messaging function to replace the alert() popups
function postMessage(message)
{
    messageBoard = document.getElementById("messages");

    var newOption = document.createElement("div");
    newOption.class = "mission";
    newOption.innerHTML = message + "<br>--------";

    messageBoard.insertBefore(newOption, messageBoard.firstElementChild);

    if(messageBoard.childElementCount > 5) //limit of 5 messages for now
    {
        messageBoard.removeChild(messageBoard.lastElementChild);
    }

}

//because rank, XP, weapon, element are gonna change often, so this here is convenient
function updateLichInfo() {
    document.getElementById("lichName").innerText = Lich.name;
    document.getElementById("lichGender").innerText = Lich.gender;
    document.getElementById("lichRank").innerText = Lich.rank;
    document.getElementById("lichXP").innerText = Lich.experience;
    document.getElementById("lichAnger").innerText = Lich.anger;
    document.getElementById("lichWeapon").innerText = Lich.weapon;
    document.getElementById("lichElement").innerText = Lich.element + " +" + Lich.bonusDamage + "%";
    document.getElementById("weaponLockStrength").innerText = Lich.lockStrength;

    if (weaponBiometricsBroken) {
        document.getElementById("isLockBroken").innerHTML = " Lock broken!";
    }
    else {
        document.getElementById("isLockBroken").innerHTML = "";
    }

    //document.getElementById("debugRequiem").value = Lich.requiem[0]+" "+Lich.requiem[1]+" "+Lich.requiem[2]; //debug: remove later (should be secret)
}

function updateTreasuryDisplay() {
    document.getElementById("treasuryDisplay").innerHTML =
        "Credits: " + Lich.treasury.credits + "<br>" +
        "Common resources: " + Lich.treasury.common_resources + "<br>" +
        "Rare resources: " + Lich.treasury.rare_resources + "<br>" +
        "Mods: " + Lich.treasury.mods + "<br>" +
        "Relics: " + Lich.treasury.relics + "<br>" +
        "Blueprints: " + Lich.treasury.blueprints;
}

function updateIntelDisplay() {
    document.getElementById("intelDisplay").innerText = "Intel: " + intel;
    console.log('Test')
}

function updateKnownRequiems() {
    var unknownReq = [];
    var incorrectReq = [];
    var correctReq = [];

    requiemModsList.forEach(requiemMod => {
        switch (Parazon.requiemModsStatus[requiemMod]) {
            case "?":
                unknownReq.push(requiemMod);
                break;
            case false:
                incorrectReq.push(requiemMod);
                break;
            case true:
                correctReq.push(requiemMod);
                break;
            default:
                break;
        }
    });

    if (correctReq.length == 3 && unknownReq.length != 0) //if we know all three correct mods, all uknown mods are incorrect.
    {
        unknownReq.forEach(requiemMod => {
            Parazon.requiemModsStatus[requiemMod] = false;
            incorrectReq.push(requiemMod);
        });
        unknownReq = [];
    }
    else if (incorrectReq.length == requiemModsList.length - 3 && unknownReq.length != 0) //conversely, if we know all but three mods to be incorrect, the remaining are correct.
    {
        unknownReq.forEach(requiemMod => {
            Parazon.requiemModsStatus[requiemMod] = true;
            correctReq.push(requiemMod);
        });
        unknownReq = [];
    }

    //now the printing
    if (unknownReq.length) {
        document.getElementById("modsUnknownDisplay").innerHTML = "The following mods' status is unknown: " + unknownReq.join(", ");
    }
    if (incorrectReq.length) {
        document.getElementById("modsIncorrectDisplay").innerHTML = "The following mods are incorrect (not in lich requiem): " + incorrectReq.join(", ");
    }
    if (correctReq.length) {
        document.getElementById("modsCorrectDisplay").innerHTML = "The following mods are correct (in the lich requiem): " + correctReq.join(", ");
    }

}

function populateParazonDropdowns(node) {
    var newOption = document.createElement("option");
    newOption.value = NO_EQUIPPED_REQUIEM;
    newOption.innerHTML = NO_EQUIPPED_REQUIEM;
    node.appendChild(newOption);

    requiemModsList.forEach(requiemMod => {
        newOption = document.createElement("option");
        newOption.value = requiemMod;
        newOption.innerHTML = requiemMod;
        node.appendChild(newOption);
    });

}

function populateAssetsDisplay() {
    var assetsDisplay = document.getElementById("assetsDisplay");
    assetsList.forEach(assetsTier => {
        var newAssetTierHeader = document.createElement("div")
        newAssetTierHeader.id = "assetTier" + Assets[assetsTier[0]].tier;
        newAssetTierHeader.classList.add("assetTier");
        newAssetTierHeader.innerHTML = "<h3>Assets tier " + Assets[assetsTier[0]].tier + ": </h3>";
        newAssetTierHeader.hidden = true;

        assetsTier.forEach(asset => {
            var newAssetEntry = document.createElement("div");
            newAssetEntry.id = asset;
            newAssetEntry.classList.add("asset");
            newAssetEntry.hidden = true;
            let htmlButton = `<button class="redEdged" value="Destroy" onclick="destroyAsset('${asset}')">Destroy</button>`;
            let htmlHeadline = `<h4>${asset}</h4>`
            let htmlTable = `
                <table>
                    <tr>
                        <td>Type:</td>
                        <td>${Assets[asset].type}</td>
                    </tr>
                    <tr>
                        <td>Effect:</td>
                        <td>${Assets[asset].effects}</td>
                    </tr>
                    <tr>
                        <td>Rewards:</td>
                        <td>${Assets[asset].rewards}</td>
                    </tr>
                </table>
            `
            newAssetEntry.innerHTML = htmlHeadline + htmlButton + htmlTable
            newAssetTierHeader.appendChild(newAssetEntry);
        });

        assetsDisplay.appendChild(newAssetTierHeader);
    });
}

window.onload = function () {
    populateParazonDropdowns(document.getElementById("firstParazonMod"));
    populateParazonDropdowns(document.getElementById("secondParazonMod"));
    populateParazonDropdowns(document.getElementById("thirdParazonMod"));

    populateAssetsDisplay();

    document.getElementById("intelDisplay").value = 0;
    document.getElementById("dayCounter").value = 0;
}

function switchTabs(tab) {
    var starmapTab = document.getElementById("starMap");
    var requiemTab = document.getElementById("requiem");
    var lichAssetsTab = document.getElementById("lichAssets");
    var intelMissionsTab = document.getElementById("intelMissions");
    var helpTab = document.getElementById("help");

    starmapTab.hidden = true;
    requiemTab.hidden = true;
    lichAssetsTab.hidden = true;
    intelMissionsTab.hidden = true;
    helpTab.hidden = true;

    document.getElementById(tab).hidden = false;
}

function switchPlanet(from, to) {
    document.getElementById(from + "Map").hidden = true;
    document.getElementById(to + "Map").hidden = false;
}

//This simplifies some bits
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ++
//END UI AND MISC UTILITY STUFF
// ++







// Vesp Stuff
function startsWithVowel(st) {
    return (st.toLowerCase().startsWith('a') || st.toLowerCase().startsWith('e') || st.toLowerCase().startsWith('i') || st.toLowerCase().startsWith('o') || st.toLowerCase().startsWith('u'))  
}


const navItems = document.getElementsByClassName('nav-tabs')
for (let i = 0; i < navItems.length; i++) {
    const element = navItems[i];
    element.addEventListener('click', function(){
        for (let i = 0; i < navItems.length; i++) {
            const element = navItems[i];
            element.classList.remove('active')
        }
        this.classList.add('active')
    })
}
