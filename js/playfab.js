import * as PlayFab from 'playfab-sdk';

export async function loginAnon(titleId){
  PlayFab.settings.titleId = titleId;
  return new Promise((resolve,reject)=>{
    PlayFab.ClientApi.LoginWithCustomID({
      CustomId: crypto.randomUUID(), CreateAccount: true
    }, (res,err)=> err ? reject(err) : resolve(res));
  });
}
