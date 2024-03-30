
const plantillaRolAdmin = {
    "name": "plantilla administrador",
    "type": "admin",
    "defaulUser": false,
    "defalultAdmin": true,
    "authorizations": {
        "moduleApp": {
            "accessModule": {
                "showModule": true
            },
            "users": {
                "accessModule": {
                    "showModule": true
                },
                "access": {
                    "c": true,
                    "r": true,
                    "u": true,
                    "d": true
                },
                "personalInformation": {
                    "access": {
                        "c": true,
                        "r": true,
                        "u": true,
                        "d": true
                    }
                }
            }
        }
    },
    "accessTo": []
}

export default plantillaRolAdmin;