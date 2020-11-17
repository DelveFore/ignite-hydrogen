// I had used this example to build my Strategy Snippet: https://gist.github.com/Integralist/5736427
//
// This is LegoMan constructor
let LegoMan = (strategy) => {
    this.strategy = strategy
}

//
LegoMan.prototype.myHair = () => {
    return this.strategy()
}

// Here are the different hair style strategies
let HairStyleMohawk = () => {
    console.log("I have a mohawk")
}

let HairStyleBald = () => {
    console.log("I have no hair")
}

let PonytailStyleBald = () => {
    console.log("I have ponytail")
}

// Here are where the lego men are given their hair styles
let MohawkLegoMan = new LegoMan(HairStyleMohawk)
let baldLegoMan = new LegoMan(HairStyleBald)
let PonytailLegoMan = new LegoMan(PonytailStyleBald)

MohawkLegoMan.myHair()
baldLegoMan.myHair()
PonytailLegoMan.myHair()


