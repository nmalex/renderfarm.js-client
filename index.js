var client = new RFJS.Client({
    apiKey: "75f5-4d53-b0f4",
    protocol: "https",
    host: "alengo3d.renderfarmjs.com",
    port: 8000,
});

var workspaceGuid = "55a0bd33-9f15-4bc0-a482-17899eb67af3";

async function main() {
    var session = await client.openSession(workspaceGuid);
    console.log(` >> session open: `, session);

    var closedSession = await session.close();
    console.log(` >> session closed: `, closedSession);
}

main().then(function(){
}).catch(function(err){
    console.error(err);
});
