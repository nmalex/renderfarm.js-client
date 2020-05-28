var client = new RFJS.Client({
    apiKey: "75f5-4d53-b0f4",
    protocol: "https",
    host: "alengo3d.renderfarmjs.com",
    port: 8000,
});

var workspaceGuid = "55a0bd33-9f15-4bc0-a482-17899eb67af3";

function handleLoad(event) {
    initScene();
}

function handleBeforeUnload(event) {
    client.close();
}

function handleRenderClick() {
    render(
        client,
        workspaceGuid,
        window.demo.scene,
        window.demo.camera, 
        {width: 640, height: 480}, 
        {
            renderComplete: handleImageReady,
        }
    )
}

function initScene() {
    window.demo = {};

    var renderer;
    var camera;
    var controls;
    var scene = new THREE.Scene();
    window.demo.scene = scene;

    let viewportElement = document.getElementById("viewport");
    { // init renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: viewportElement
        });
        renderer.setSize(viewportElement.offsetWidth, viewportElement.offsetHeight);
        renderer.setClearColor(new THREE.Color(0xaeaeae));

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    { // init camera
        camera = new THREE.PerspectiveCamera(54, 640 / 480, 0.1, 1000);
        camera.name = "Camera001";

        camera.position.x = 7.65;
        camera.position.y = 5.85;
        camera.position.z = 9.45;
        camera.lookAt(0, 0.5, 0);
        camera.updateProjectionMatrix();
        scene.add(camera);
        window.demo.camera = camera;

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.5, 0);
        window.demo.controls = controls;
    }

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.name = "SpotLight1";
    spotLight.position.set( 10, 40, 10 );
    spotLight.target.position.set( 0, 0, 0 );
    spotLight.angle = Math.PI / 10;

    spotLight.castShadow = true;
    spotLight.shadow.bias = 1e-6;
    spotLight.shadow.mapSize.width  = 512;
    spotLight.shadow.mapSize.height = 512;

    spotLight.shadow.camera.near = 15;
    spotLight.shadow.camera.far = 55;
    spotLight.shadow.camera.fov = 360 * spotLight.angle / Math.PI;

    scene.add(spotLight);
    window.demo.spotLight = spotLight;

    var helper = new THREE.CameraHelper( spotLight.shadow.camera );
    // scene.add( helper );

    var gridHelper = new THREE.GridHelper(4, 4);
    scene.add(gridHelper);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry = new THREE.BufferGeometry().fromGeometry(geometry);

    var materialWhite = new THREE.MeshPhongMaterial({ 
        name: "WhiteGlass",
        color: 0xffffff,
        transparent: false,
        opacity: 0.95,
    });

    var materialRed = new THREE.MeshPhongMaterial({ 
        name: "RedGlass",
        color: 0xff0000,
        transparent: false,
        opacity: 0.95,
    });

    var materialGreen = new THREE.MeshPhongMaterial({ 
        name: "GreenGlass",
        color: 0x00ff00,
        transparent: false,
        opacity: 0.95
    });

    var materialBlue = new THREE.MeshPhongMaterial({ 
        name: "BlueGlass",
        color: 0x0000ff,
        transparent: false,
        opacity: 0.95,
    });

    var cube = new THREE.Mesh(geometry, materialWhite);
    cube.name = "Box0";
    cube.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    cube.castShadow = true;
    cube.receiveShadow = false;
    scene.add(cube);

    var loader = new THREE.FontLoader();

    loader.load( 'http://mbnsay.com/rayys/assets/fonts/helvetiker_regular.typeface.json', function ( font ) {
    
        let textGeometry = new THREE.TextGeometry( 'Hello three.js!', {
            font: font,
            size: 1.5,
            height: 0.5,
            curveSegments: 1,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.01,
            bevelSegments: 1
        });
        textGeometry = new THREE.BufferGeometry().fromGeometry(textGeometry);

        var text = new THREE.Mesh(textGeometry, materialWhite);
        text.name = "Text";
        text.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        text.applyMatrix(new THREE.Matrix4().makeTranslation(-5.5, 0, 2.1));
        text.castShadow = true;
        text.receiveShadow = false;
        scene.add(text);
    });

    var cubex = new THREE.Mesh(geometry, materialRed);
    cubex.name = "BoxX";
    cubex.applyMatrix(new THREE.Matrix4().makeTranslation(3, 0, 0));
    cubex.castShadow = true;
    cubex.receiveShadow = false;
    cube.add(cubex);

    var cubey = new THREE.Mesh(geometry, materialGreen);
    cubey.name = "BoxY";
    cubey.applyMatrix(new THREE.Matrix4().makeTranslation(-3, 3, 0));
    cubey.castShadow = true;
    cubey.receiveShadow = false;
    cubex.add(cubey);

    var cubez = new THREE.Mesh(geometry, materialBlue);
    cubez.name = "BoxZ";
    cubez.applyMatrix(new THREE.Matrix4().makeTranslation(0, -3, 3));
    cubez.castShadow = true;
    cubez.receiveShadow = false;
    cubey.add(cubez);
    // =============

    var roomGeometry = new THREE.BoxGeometry( 100, 80, 100 );
    // invert the geometry on the x-axis so that all of the faces point inward
    roomGeometry.scale( - 1, 1, 1 );
    roomGeometry = new THREE.BufferGeometry().fromGeometry(roomGeometry);

    var roomMaterial = new THREE.MeshBasicMaterial( {
        color: 0xA9A0A2
    } );

    let roomMesh = new THREE.Mesh( roomGeometry, roomMaterial );
    roomMesh.name = "Room001";
    roomMesh.applyMatrix(new THREE.Matrix4().makeTranslation(0,39.9,0));
    roomMesh.castShadow = false;
    roomMesh.receiveShadow = true;
    // scene.add( roomMesh );

    var planeGeometry = new THREE.PlaneGeometry( 15, 15, 1 );
        planeGeometry = new THREE.BufferGeometry().fromGeometry(planeGeometry);
    var material = new THREE.MeshPhongMaterial({
        name: "Floor",
        color: 0xf0ffff, 
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

    var plane = new THREE.Mesh( planeGeometry, material );
    plane.name = "Plane0";
    plane.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    plane.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,0));
    plane.castShadow = false;
    plane.receiveShadow = true;
    scene.add(plane);

    var animate = function() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();
}

function handleImageReady(url) {
    $("#vray").attr("src", url);
}