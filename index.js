function render(client,
                workspaceGuid,
                threejsSceneObj,
                threejsCameraObj,
                renderSettings,
                renderCallbacks,
) {
    async function main() {
        var workgroup = "dev";
        var additionalParams = {};
        var session = await client.openSession(workgroup, workspaceGuid, "empty.max");
        renderCallbacks['sessionOpen'] ? renderCallbacks['sessionOpen'](session) : null;
        await session.refresh();

        var scene = await client.createScene(threejsSceneObj, threejsCameraObj);
        renderCallbacks['sceneCreated'] ? renderCallbacks['sceneCreated'](scene) : null;

        var job = await client.createJob(
            threejsCameraObj,
            renderSettings,
            null, // onStarted
            null, // onProgress
            renderCallbacks['renderComplete'], // onImageReady
            null, // onError
        );
        renderCallbacks['jobCreated'] ? renderCallbacks['jobCreated'](job) : null;
    }

    main().then(function(){
    }).catch(function(err){
        console.error(err);
        renderCallbacks['error'] ? renderCallbacks['error'](err) : null;
    });
}
