
const plantillaRolUser = {
    "name": "planilla User",
    "type": "User",
    "defauldUser": true,
    "defauldAdmin": false,
    "authorization": {
        "moduleApp": {
            "accessModule": {
                "showModule": true
            },
            "personalInformation": {
                "accessModule": {
                    "showModule": true
                },
                "access": {
                    "c": true,
                    "r": true,
                    "u": true,
                    "d": true
                }

            }
        }
    },
    "accessTo": []
}



export default plantillaRolUser;