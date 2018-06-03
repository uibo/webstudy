process.on('exit', function(){
    console.log('exit occurrence');
});

setTimeout(function(){
    console.log('2 second later occurrence');
    
    process.exit();
}, 2000);

console.log('2 second later  will occur');