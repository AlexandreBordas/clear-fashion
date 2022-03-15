/* eslint-disable no-console, no-process-exit */
/* eslint-disable no-console, no-process-exit */

const fs = require('fs');
const dedicatedbrand = require('./sources/dedicatedbrand');
const adresseparisbrand = require('./sources/adresseparis');
const montlimartbrand = require('./sources/montlimart');

async function sandboxDedicated (eshop = 'https://www.dedicatedbrand.com/en/men/all-men') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);

    
    console.log('writing to json file...');
    fs.writeFileSync('./sources/items.json',JSON.stringify(products, '', 2));
    //process.exit(0);
  } catch (e) {
    console.error(e);
    //process.exit(1);
  }
}

async function sandboxAdresseParis (eshop = 'https://adresse.paris/630-toute-la-collection') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await adresseparisbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    //process.exit(0);
    const items_json = JSON.stringify(products);

    fs.writeFile('products_AdresseParis.json', items_json, (err) =>{
      if(err){
        throw err;
      }
      console.log("AdresseParis JSON data is saved");
    })
  } catch (e) {
    console.error(e);
    //process.exit(1);
  }
}

async function sandboxMontlimart (eshop = 'https://www.montlimart.com/toute-la-collection.html') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await montlimartbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    //process.exit(0);
    const items_json = JSON.stringify(products);

    fs.writeFile('products_montlimart.json', items_json, (err) =>{
      if(err){
        throw err;
      }
      console.log("Montlimart JSON data is saved");
    })


  } catch (e) {
    console.error(e);
    //process.exit(1);
  }
}

// async function getAllProducts() {
//   for (let page = 1; page <= 10; page++){
//     url = `https://www.dedicatedbrand.com/en/men/all-men#page=${page}`;
//     await sandbox1(url);
//   }
// }

//const [,, eshop1] = process.argv;

async function multipleSandbox(URLList){
  var url = URLList[0];
  await sandboxDedicated(url);
  url = URLList[1];
  await sandboxAdresseParis(url);
  url = URLList[2];
  await sandboxMontlimart(url);
}

const URLLIst = ['https://www.dedicatedbrand.com/en/men/all-men','https://adresse.paris/630-toute-la-collection','https://www.montlimart.com/toute-la-collection.html']
multipleSandbox(URLLIst);
