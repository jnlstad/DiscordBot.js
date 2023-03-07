// const { math} = require('mathjs')
// function randomHello(){
//     return math.pickRandom([
//         "Hiya Cowboy!",
//         "Heya Weirdo",
//         "Whassup Bro?",
//     ])  
// } 

class randomHello {
    constructor() {
        let replies = [
            "Hiya Cowboy!",
            "Heya Weirdo",
            "Whassup Bro?",
        ]

        this.reply = replies[Math.floor(Math.random()*replies.length)];
    }
}

exports.randomHello = randomHello
