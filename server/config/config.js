//===================
//puerto
//===================

process.env.PORT = process.env.PORT || 3000;

// ===========================
// ENTORNO 
// ===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// VENCIMIENTO DEL TOKET
// ===========================
// 60 = 1 minuto
// 60 * 60 = una hora
// 60 * 60 * 24 * 60  = 30 dias

process.env.CADUCIDAD_TOKEN ='48h';


// ===========================
// SEED DE AUTENTICACION
// ===========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ===========================
// ENTORNO 
// ===========================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ===========================
// GOOGLE CLIENT ID 
// ===========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '930373108948-rpah8h7nsen73u8hkf81kdma1msf2381.apps.googleusercontent.com';