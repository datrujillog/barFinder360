

const plantillaRolSuperUser = {
    "name": "plantilla administrador",
    "type": "SuperAdmin",
    "defaulUser": false,
    "defalultAdmin": true,
    "authorizations": {
        "moduleApp": {
            "accessModule": {
                "showModule": true
            }
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
        },
        "roles": {
            "accessModule": {
                "showModule": true
            },
            "access": {
                "c": true,
                "r": true,
                "u": true,
                "d": true
            }
        },
        "table": {
            "accessModule": {
                "showModule": true
            },
            "access": {
                "c": true,
                "r": true,
                "u": true,
                "d": true
            }
        },
    },
    "accessTo": []
}

export default plantillaRolSuperUser;