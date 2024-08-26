function testPassword(password) {
    if (password.length <= 6) 
        return { valid: false, message: "Please make sure password is longer than 6 characters." }

    if(!/[A-Z].*[A-Z]/.test(password))
        return { valid: false, message: "Please make sure password includes 2 capital letters" }

    if (!/\d/.test(password)) 
        return { valid: false, message: "Please make sure Password Includes a Digit" }

    if (/\s/.test(password)) 
        return { valid: false, message: "Please only use visible characters" }

    return { valid: true, message: "Valid Password" }
}

export default testPassword