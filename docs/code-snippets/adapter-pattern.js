// I'm gonna need a Client, Adapter, and Adaptee

// old interface
function fullnameLogin() {
   this.credentials = (fullName, password) => {
        if ( fullName === "Jonno Arcus" && password === "password" )
            console.log(`Welcome ${fullName}, you have been logged with the old way`)
        else
            console.log("You don't have access")
    }
}

// new interface
function separateNameLogin () {
    this.credentials = (firstName, lastName, password) => {
        if ( firstName === "Jonno" && lastName === "Arcus" && password === "password" )
            console.log(`Welcome ${firstName} ${lastName}, you have been logged with the new way`)
        else
            console.log("You don't have access")
    }
}

// adapter
function adapterLogin() {
    this.credentials = (fullName, password) => {
        const name = fullName.split(' ')
        const firstName = name[0]
        const lastName = name[1]

        let login = new separateNameLogin()
        login.credentials(firstName, lastName, password)
    }
}

// old client interface
let oldLogin = new fullnameLogin()
returnMessage = oldLogin.credentials ("Jonno Arcus", "password")

// new client interface
let adapter = new adapterLogin()
returnMessage = adapter.credentials("Jonno Arcus", "password")
