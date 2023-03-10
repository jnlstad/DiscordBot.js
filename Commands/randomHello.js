// Defines the class randomHello and assigns .reply to a random string from the array

class randomHello {
    constructor(username) {
        let replies = [
            "Hiya Cowboy!",
            "Heya Weirdo",
            "Whassup Bro?",
            "What's Up "+ username + "!",
            "Two",
            "Three",
            "Four",
            "Five",
            "Six",
        ]
        this.reply = replies[Math.floor(Math.random()*replies.length)];
    }
}

exports.randomHello = randomHello
