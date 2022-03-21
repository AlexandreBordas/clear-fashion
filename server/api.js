const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

let database = null;



//connection à MongoDB
const {MongoClient} = require('mongodb');

const MONGODB_URI =  `mongodb+srv://admin:admin@clearfashion.zyc7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';


//Fonction pour se connecter à la DB
const connect = async () => {
  try{
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB')


  }catch(e){
    console.error(e)
  }
}


const getMetaData = async (page, size, q) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  const nb = q.length;

  const pageCount = parseInt(nb/size);
  return {"currentPage" : page,"pageCount":pageCount,"pageSize":size,"count":nb} 
}

app.get(`/`, (request, response) => {
  response.send({'ack': true})
})

app.get('/all', async(request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  let page = parseInt(request.query.page);
  let size = parseInt(request.query.size);
  const collection = db.collection('products');
  const whichpage= page!=0 ? page*size : 0
  let query= await collection.find({}).toArray();
  let q = await collection.find({}).skip(whichpage).limit(size).toArray();

  let meta = await getMetaData(page,size, query);
    
    let products = {
      "success" : true,
      "data" : {
      "result" : q,
      "meta": meta
        }}
  response.send(products);
});

app.get('/products/search', async (request, response)=>{

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  let brandname = request.query.brand;
  let pricereq = parseInt(request.query.price);
  let page = parseInt(request.query.page);
  let size = parseInt(request.query.size);
  const collection = db.collection('products');
  
  if(brandname!=null && pricereq!=null)
  {
  const query= await collection.find({$and : [ {"brand":brandname},{ "price": { $lte: pricereq }}]}).toArray();
  const whichpage= page!=0 ? page*size : 0

  const prod = await collection.find({$and : [ {"brand":brandname},{ "price": { $lte: pricereq }}]}).skip(whichpage).limit(size).toArray();

    
  let meta = await getMetaData(page,size, query);
    
    let products = {
      "try":"hola",
      "success" : true,
      "data" : {
      "result" : prod,
      "meta": meta
        }}
  response.send(products);
      }
  else if (brandname==null && pricereq!=null)
  {
    const query= await collection.find({ "price": { $lte: pricereq }}).toArray();
    const whichpage= page!=0 ? page*size : 0

    const prod = await collection.find({ "price": { $lte: pricereq }}).skip(whichpage).limit(size).toArray();
  
      
    let meta = await getMetaData(page,size, query);
      
      let products = {
        "success" : true,
        "data" : {
        "result" : prod,
        "meta": meta
          }}
    response.send(products);
  }
  else if (brandname!=null && pricereq==null)
  {
    const query= await collection.find({"brand":brandname}).toArray();
    const whichpage= page!=0 ? page*size : 0

    const prod = await collection.find({"brand":brandname}).skip(whichpage).limit(size).toArray();
  
      
    let meta = await getMetaData(page,size, query);
      
      let products = {
        "try":"here",
        "success" : true,
        "data" : {
        "result" : prod,
        "meta": meta
          }}
    response.send(products);
  }
  });

app.get('/products/:id', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  const id_prod = await collection.find({_id:MongoClient.ObjectId(request.params.id)}).toArray();

  let meta = await getMetaData(1,1, id_prod);
    
    let ids = {
      "success" : true,
      "data" : {
      "result" : id_prod,
      "meta": meta
        }}

  response.send(ids);

});





connect();



app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

