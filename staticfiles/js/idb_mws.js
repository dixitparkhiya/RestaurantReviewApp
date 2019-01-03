
var dbPromise = idb.open('JSONdb', 1, function (upgradeDb) {
   var keyvalStore = upgradeDb.createObjectStore('keyval',{keyPath:'id'});
});


const xmlRe = new XMLHttpRequest();
xmlRe.open('GET','http://localhost:8000',false);
xmlRe.onload = ReSuccess;
xmlRe.send();
function ReSuccess()
{
    const res = JSON.parse(this.responseText);
    let employeeData = [];
                            for(let i=0;i<10;i++){
                                employeeData.push(res[i]);
                            }
                            dbPromise.then(function(db){
                            var keyvalStore = db.transaction('keyval','readwrite');
                            for(let i in employeeData){
                                keyvalStore.objectStore('keyval').put(employeeData[i]);
                            }
                            return keyvalStore.complete;
                            }).then(function(){ 
                            });
}
/*dbPromise.then(function(tx){
    var some =tx.transaction('keyval');
    var le = some.objectStore('keyval');
    return le.openCursor();
}).then(function(cursor){
    if(!cursor) return;
    return cursor.advance(2);
})
  .then(function cursorfun(cursor){
    if(!cursor) return;
    console.log(cursor.value.name);
    return cursor.continue().then(cursorfun) ;
});*/
         