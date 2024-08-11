
import AsyncStorage from '@react-native-async-storage/async-storage';
export class SignInManager {
   
    constructor() {

    }
   
    async IsAuthenticated() {
        const token = await this.GetToken();
        const e = Number(await AsyncStorage.getItem('expiry'));
        const g = await AsyncStorage.getItem('generated');
        if (token && e && g) {
            const expiry = e;
            const generated = new Date(g);
            generated.setSeconds(generated.getSeconds() + expiry);
            return generated > new Date();
        } else {
            return false;
        }
    }
    UserRole() {

    }
    async SetToken(loginModel: any) {
        //in active expire time
        const expireTime=Date.now()+300000;
        await AsyncStorage.setItem("expireTime",expireTime.toString());
        await AsyncStorage.setItem('token', loginModel.token);   
        await AsyncStorage.setItem('expiry', loginModel.expiry.toString());
        await AsyncStorage.setItem('role', loginModel.role);   
        await AsyncStorage.setItem('email', loginModel.email);
        await AsyncStorage.setItem('name', loginModel.name);
        await AsyncStorage.setItem('loginId', loginModel.id);
        await AsyncStorage.setItem('generated', new Date().toISOString());
    }
    async GetToken() {
        return JSON.parse(await AsyncStorage.getItem('token') || '') as any | null
    }

    async GetAccessToken(){
        const token = await this.GetToken();
        if (token) {
            return token;
        }
        else {
            return '';
        }
    }

    async RemoveToken() {
        
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('expiry');
        await AsyncStorage.removeItem('generated');
        await AsyncStorage.removeItem('role');   
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('loginId');
    }
    
    async GetUserRole() {
        const role = await AsyncStorage.getItem("role") || "Visitor";
        return role;
    };
}