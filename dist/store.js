import {t} from './i18n.js';
// Purchase layer.
// - In a browser (development) purchases run in clearly labeled TEST mode: nothing is charged.
// - Inside the iOS app (Capacitor + @capgo/native-purchases, StoreKit 2) they are real App Store consumables.
// Product IDs must match the consumable In-App Purchases created in App Store Connect.
export const PRODUCTS={
 revive:{id:'tomorrowcity.revive',name:'城市复活'},
 supply:{id:'tomorrowcity.supply',name:'紧急补给'},
};
const plugin=()=>window.Capacitor?.isNativePlatform?.()?window.Capacitor.Plugins?.NativePurchases:null;
export const isTestStore=()=>!plugin();
const prices={};let ready=null,busy=false;
export function initStore(){
 const p=plugin();if(!p)return Promise.resolve();
 ready??=p.getProducts({productIdentifiers:Object.values(PRODUCTS).map(x=>x.id)})
  .then(({products})=>{for(const x of products)prices[x.identifier]=x.priceString;})
  .catch(()=>{ready=null;});
 return ready;
}
export const priceLabel=key=>isTestStore()?'测试':(prices[PRODUCTS[key].id]||'…');
export async function buy(key){
 const p=plugin();if(!p)return {ok:true,test:true};
 if(busy)return {ok:false,error:t('busy')};
 busy=true;
 try{
  // Consumable: the plugin finishes the StoreKit transaction after Apple approves it.
  // Before launch add server-side receipt validation to block tampered purchases.
  await p.purchaseProduct({productIdentifier:PRODUCTS[key].id,quantity:1,isConsumable:true});
  return {ok:true};
 }catch(e){
  return {ok:false,error:/cancel/i.test(String(e?.message||e))?t('cancelled'):t('failed')};
 }finally{busy=false;}
}
