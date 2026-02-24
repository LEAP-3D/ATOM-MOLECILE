// export function assertSafeSelect(sql: string, tableName: string) {
//   const s = sql.trim().toLowerCase();

//   // Үндсэн шалгалт
//   if (!/^(select|with)\b/.test(s))
//     throw new Error("Зөвхөн SELECT/WITH SELECT зөвшөөрөгдөнө");
//   if (!/\bselect\b/.test(s))
//     throw new Error("Зөвхөн SELECT query зөвшөөрөгдөнө");

//   // Аюултай үгс
//   const forbidden = [
//     "insert",
//     "update",
//     "delete",
//     "drop",
//     "alter",
//     "create",
//     "truncate",
//     "grant",
//     "revoke",
//   ];
//   if (forbidden.some((word) => new RegExp(`\\b${word}\\b`).test(s))) {
//     throw new Error("Аюултай SQL илэрлээ");
//   }

//   // Тэмдэгтүүд
//   if (s.includes(";") || s.includes("--") || s.includes("/*")) {
//     throw new Error("Олон үйлдэлт query эсвэл comment зөвшөөрөхгүй");
//   }

//   // Хүснэгт болон эрхийн шалгалт
//   const fromRe = new RegExp(`\\bfrom\\s+${tableName}\\b`, "i");
//   if (!fromRe.test(sql))
//     throw new Error(`SQL нь ${tableName} хүснэгтээс өгөгдөл авах ёстой`);

//   if (!/where[\s\S]*file_name/i.test(sql))
//     throw new Error("SQL нь file_name-ээр шүүсэн байх ёстой");
//   if (!/where[\s\S]*user_id/i.test(sql))
//     throw new Error("SQL нь user_id-аар шүүсэн байх ёстой");
// }
