// I had used this example to build my Strategy Snippet: https://gist.github.com/Integralist/5736427

class LegoMan {
    // This is the constructor
    constructor(hair) {
        this.style = hair.style
    }
    // Function that assigns the hair
    assignHair = () => {
        return this.style()
    }
    // Function that says who they are with their hair style
    identifyYourself = () => {
        console.log(`I am a Lego man with ${ this.assignHair() }`)
    }
}

// Here are the different hair style strategies
Mohawk = () => {
    return "a mohawk"
}

Bald = () => {
    return "no hair"
}

Ponytail = () => {
    return "a ponytail"
}


// Here are where the lego men are given their hair styles
let MohawkLegoMan = new LegoMan({ style: Mohawk })
let BaldLegoMan = new LegoMan({ style: Bald })
let PonyTailLegoMan = new LegoMan({ style: Ponytail })


MohawkLegoMan.identifyYourself()
BaldLegoMan.identifyYourself()
PonyTailLegoMan.identifyYourself()





