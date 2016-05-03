function print(){
    
    var testString = $('#txt1').val() 
    
    var lines = testString.split("(\n|\r)");
   
    for (var i = 0; i< testString.length; i++){
        console.log(lines[i] + +"  -------  " + i);
    }
    
 console.log($('#txt1').val());
}