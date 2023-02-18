import mysql from "mysql2/promise"; // mysql2でasync/awaitを使うためのモジュール

export async function dbSetting () {
  const db_setting = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    port : 3306,
    database : 'hoge-db',
    // namedPlaceholders: true,
  };

  const connection = await mysql.createConnection(db_setting);
  await connection.connect();
  return connection;
}