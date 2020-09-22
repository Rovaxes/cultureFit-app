import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

class UserPermissions {
    getCameraPermissions = async () => {
        console.log("user persmissions")
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if(status != "granted"){
                alert ("We need permission to use your camera roll")
            }
        }

        if(Constants.platform.android){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if(status != "granted"){
                alert ("We need permission to use your camera roll")
            }
        }
    }
}

export default new UserPermissions();