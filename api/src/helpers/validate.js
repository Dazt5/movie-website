//default email comprobation.
const validateEmail = (email) =>{

    const rexExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rexExp.test(String(email).toLowerCase());
}

/*
Minimo 1 Mayuscula,
Minimo 1 Minuscula,
Minimo 1 Numero,
De 8 a 20 caracteres,
*/
const validatePassword = (password) =>{

    var rexExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/;
    return rexExp.test(String(password));
}

/*
Solo letras, y solo un espacio entre el texto. 
*/ 
const validateNames = (fullname) =>{

    var rexExp = /^[a-zA-Z]{3,35}(?: [a-zA-Z]+){0,3}$/;
    return rexExp.test(String(fullname));
}

export{

    validateEmail,
    validatePassword,
    validateNames

}



