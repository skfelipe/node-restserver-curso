

//===================
//puerto
//===================

process.env.PORT = process.env.PORT || 3000;

// ===========================
// ENTORNO 
// ===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// ENTORNO 
// ===========================

let urlDB;
if(process.env.NODE_ENV  === 'dev'){
    urlDB =  'mongodb://localhost:27017/cafe';
}else{
    urlDB =  MONGO_URI;
}

process.env.URLDB = urlDB;

