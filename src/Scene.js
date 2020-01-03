var THREE = require('three');
const axios = require('axios');

export default class Scene {
    constructor(baseUrl, apiKey) {
        this.baseUrl     = baseUrl;
        this.apiKey      = apiKey;

        this.geometries = {};  // here we map scene geometry uuid <==> backend geometry resource
        this.materials = {};   // here we map scene material uuid <==> backend material resource
        this.nodes = {};       // here we map scene nodes         <==> backend nodes
    }

    async post(sessionGuid, threejsSceneObj, threejsCameraObj) {
        this.sessionGuid = sessionGuid;

        var sceneJson = threejsSceneObj.toJSON();
        var geometriesJson = sceneJson.geometries;
        var materialsJson = sceneJson.materials;

        if (sceneJson.materials) {
            delete sceneJson.materials;
        }
        if (sceneJson.geometries) {
            delete sceneJson.geometries;
        }

        var p0 = __postGeometries.call(this, geometriesJson);
        var p1 = __postMaterials.call(this, materialsJson);

        await Promise.all([p0, p1]);

        var s0 = await __postScene.call(this, sceneJson);

        return new Promise(async function(resolve, reject){
            try {
                resolve(this);
            } catch (err) {
                this.error = err;
                reject(err);
            }
        }.bind(this))
    }
}

// node constructor, maps threejs node ref to 3ds max node name
function __rfarmNode(threeNodeRef, maxNodeName) {
    return {
        threeNodeRef: threeNodeRef,
        maxNodeName: maxNodeName
    };
}

function __postGeometries(geometriesJson) {

    for (const i in geometriesJson) {
        // not exactly "BufferGeometry"? ,for example "BoxBufferGeometry"
        if (geometriesJson[i].type.indexOf("BufferGeometry") > 0) {
              var g = geometriesJson[i];
              var geometries = THREE.ObjectLoader.prototype.parseGeometries([g]);
              delete geometries[g.uuid].parameters;
              var ni = geometries[g.uuid].toNonIndexed();
              var bufferGeometryJson = THREE.BufferGeometry.prototype.toJSON.call(ni);
              bufferGeometryJson.uuid = g.uuid;
              bufferGeometryJson.type = "BufferGeometry";
              geometriesJson[i] = bufferGeometryJson;
        }
    }

    console.log("Posting geometries: ", geometriesJson);

    var geometryText = JSON.stringify(geometriesJson);
    if (!LZString) {
        throw new Error('LZString is not found');
    }
    var compressedGeometryData = LZString.compressToBase64(geometryText);

    return axios.post(this.baseUrl  + '/three/geometry', {
        session_guid: this.sessionGuid,
        compressed_json: compressedGeometryData,
        generate_uv2: false,
    });
}

function __postMaterials(materialsJson) {
    console.log("Posting materials: ", materialsJson);

    var materialText = JSON.stringify(materialsJson);
    if (!LZString) {
        throw new Error('LZString is not found');
    }
    var compressedMaterialData = LZString.compressToBase64(materialText);

    return axios.post(this.baseUrl  + '/three/material', {
        session_guid: this.sessionGuid,
        compressed_json: compressedMaterialData,
    });
}

function __postScene(sceneJson) {
    console.log("Posting scene: ", sceneJson);

    var sceneText = JSON.stringify(sceneJson);
    if (!LZString) {
        throw new Error('LZString is not found');
    }
    var compressedSceneData = LZString.compressToBase64(sceneText);

    return axios.post(this.baseUrl  + '/three', {
        session_guid: this.sessionGuid,
        compressed_json: compressedSceneData,
    });
}

/*
// public
rfarm.createMesh = function(obj, onComplete) {
    if (obj.type === "Mesh") {
        this._postGeometry( obj.geometry, function(geometryName) {
            this._postMaterial( obj.material, function(materialName) {
                this._getMaxNodeName( obj.parent, function(parentName) {
                    obj.updateMatrixWorld (true);
                    this._postMesh(parentName, geometryName, materialName, obj.matrixWorld.elements, function(nodeName) {
                        // 3ds max object may be renamed when it was added to scene
                        this.geometries[ obj.geometry.uuid ].maxNodeName = nodeName;

                        this.nodes[ obj.uuid ] = new rfarm._rfarmNode(obj, nodeName);
                        console.log("client nodes: ", this.nodes);
                        onComplete(nodeName);
                    }.bind(this));
                }.bind(this) )
            }.bind(this) );
        }.bind(this) );
    }
}.bind(rfarm);

//public
rfarm.createCamera = function(camera, onCameraReady) {
    console.log("Creating new camera...");

    camera.updateMatrix();
    camera.updateMatrixWorld (true);
    camera.updateProjectionMatrix();

    var cameraJson = camera.toJSON();
    console.log("CAMERA: ", cameraJson);
    var cameraText = JSON.stringify(cameraJson);
    var compressedCameraData = LZString144.compressToBase64(cameraText);

    $.ajax({
        url: this.baseUrl  + "/scene/0/camera",
        data: { 
            session: this.sessionId,
            camera: compressedCameraData 
        },
        type: 'POST',
        success: function(result) {
            console.log(result);
            onCameraReady(result.id);
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });

}.bind(rfarm);

//public
rfarm.createSkylight = function(onCreated) {
    console.log("Creating new skylight...");

    $.ajax({
        url: this.baseUrl  + "/scene/0/skylight",
        data: { 
            session: this.sessionId, 
        },
        type: 'POST',
        success: function(result) {
            console.log(result);
            if (onCreated) onCreated();
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });
}.bind(rfarm);

//public
rfarm.createSpotlight = function(spotlight, spotlightTarget, onCreated) {
    console.log("Creating new spotlight...");

    spotlight.updateMatrix();
    spotlight.updateMatrixWorld (true);

    spotlightTarget.updateMatrix();
    spotlightTarget.updateMatrixWorld (true);

    var spotlightJson = spotlight.toJSON();
    spotlightJson.object.target = spotlightTarget.matrixWorld.elements;
    var spotlightText = JSON.stringify(spotlightJson.object);
    var compressedSpotlightData = LZString144.compressToBase64(spotlightText);

    $.ajax({
        url: this.baseUrl  + "/scene/0/spotlight",
        data: { 
            session: this.sessionId,
            spotlight: compressedSpotlightData
        },
        type: 'POST',
        success: function(result) {
            console.log(result);
            if (onCreated) onCreated();
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });
}.bind(rfarm);

//public
rfarm.createJob = function(sessionGuid, cameraName, bakeMeshUuid, width, height, renderSettings, onStarted) {
    console.log("Creating new render job...");

    $.ajax({
        url: rfarm.baseUrl  + "/v1/job",
        data: { 
            session_guid: sessionGuid,
            camera_name: cameraName,
            // bake_mesh_uuid: bakeMeshUuid,
            render_width: width,
            render_height: height,
            render_settings: renderSettings,
        },
        type: 'POST',
        success: function(result) {
            console.log(result);
            onStarted(result.data);
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });
}

//public
rfarm.getJob = function(jobGuid, callback) {
    $.ajax({
        url: rfarm.baseUrl  + "/v1/job/" + jobGuid,
        data: { },
        type: 'GET',
        success: function(result) {
            console.log(result);
            callback(result.data);
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });
}

//public
rfarm.render = function(cameraName, width, height, onStarted, onProgress, onImageReady) {
    console.log("Creating new render job...");

    var checkJobStatus = function(guid) {
        $.ajax({
            url: this.baseUrl  + "/job/" + guid,
            type: 'GET',
            success: function(result) {
                console.log(result);
                if (result.status === "rendering") {
                    if (result.elapsed > 0) {
                        onProgress(result.vrayProgress, result.elapsed);
                    }

                    setTimeout(function() {
                        checkJobStatus(guid);
                    }, 1000);

                } else if (result.status === "succeeded") {
                    onImageReady(result.url);
                }
            }.bind(this),
            error: function(err) {
                console.error(err.responseJSON);
            }.bind(this)
        });
    }.bind(this);

    $.ajax({
        url: this.baseUrl  + "/job",
        data: { 
            session: this.sessionId,
            width: width, 
            height: height, 
            camera: cameraName,
            progressiveMaxRenderTime: 2.5,
            progressiveNoiseThreshold: 0.001
        },
        type: 'POST',
        success: function(result) {
            console.log(result);
            onStarted(result.guid);
            checkJobStatus(result.guid);
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });
}.bind(rfarm);

//public
rfarm.cancelRender = function(jobGuid, onCanceled) {
    console.log("Cancelling job...");

    $.ajax({
        url: this.baseUrl  + "/job/" + jobGuid,
        data: { 
            status: "canceled"
        },
        type: 'PUT',
        success: function(result) {
            console.log(result);
            onCanceled(result);
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });
}.bind(rfarm);

rfarm.postScene = function(sessionGuid, sceneJson, onComplete) {
    var sceneText = JSON.stringify(sceneJson);
    var compressedSceneData = LZString.compressToBase64(sceneText);

    $.ajax({
        url: this.baseUrl  + "/v1/three",
        data: { 
            session_guid: sessionGuid,
            compressed_json: compressedSceneData
        },
        type: 'POST',
        success: function(result) {
            onComplete(result);
        },
        error: function(err) {
            console.error(err.responseJSON);
        }
    });

}.bind(rfarm);

rfarm.putCamera = function(sessionGuid, cameraJson, onComplete) {
    var cameraText = JSON.stringify(cameraJson);
    var compressedCameraData = LZString.compressToBase64(cameraText);

    $.ajax({
        url: this.baseUrl  + "/v1/three/" + cameraJson.object.uuid,
        data: { 
            session_guid: sessionGuid,
            compressed_json: compressedCameraData
        },
        type: 'PUT',
        success: function(result) {
            onComplete(result);
        },
        error: function(err) {
            console.error(err.responseJSON);
        }
    });

}.bind(rfarm);

rfarm.postGeometries = function(sessionGuid, geometryJson, onComplete) {
    console.log("Posting geometries: " + geometryJson);

    var geometryText = JSON.stringify(geometryJson);
    var compressedGeometryData = LZString.compressToBase64(geometryText);

    $.ajax({
        url: this.baseUrl  + "/v1/three/geometry",
        data: { 
            session_guid: sessionGuid,
            compressed_json: compressedGeometryData,
            generate_uv2: false
        },
        type: 'POST',
        success: function(result) {
            console.log(result);
            if (onComplete) onComplete();
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });

}.bind(rfarm);

rfarm.postMaterials = function(sessionGuid, materialJson, onComplete) {
    console.log("Posting materials: " + materialJson);

    var materialText = JSON.stringify(materialJson);
    var compressedMaterialData = LZString.compressToBase64(materialText);

    $.ajax({
        url: this.baseUrl  + "/v1/three/material",
        data: {
            session_guid: sessionGuid,
            compressed_json: compressedMaterialData,
        },
        type: 'POST',
        success: function(result) {
            console.log(result);
            if (onComplete) onComplete();
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });
}.bind(rfarm);

rfarm._getMaxNodeName = function(threeNodeRef, onComplete) {
    // returns node name in 3ds max by given threejs node ref
    if (this.nodes[ threeNodeRef.uuid ] !== undefined) {
        onComplete( this.nodes[ threeNodeRef.uuid ].maxNodeName );
    }
}.bind(rfarm);

rfarm._postMesh = function(parentName, geometryName, materialName, matrixWorldArray, onComplete) {
    console.log("Creating new node...");

    var matrixText = JSON.stringify(matrixWorldArray);
    var compressedMatrixData = LZString144.compressToBase64(matrixText);

    $.ajax({
        url: this.baseUrl  + "/scene/0/mesh",
        data: { 
            session: this.sessionId,
            parentName: parentName,
            geometryName: geometryName,
            materialName: materialName,
            matrixWorld: compressedMatrixData
        },
        type: 'POST',
        success: function(result) {
            console.log(result);
            if (onComplete) onComplete(result.id);
        }.bind(this),
        error: function(err) {
            console.error(err.responseJSON);
        }.bind(this)
    });
}.bind(rfarm);
 
*/

