// var THREE = require('three');
var JSZip = require("jszip");
const axios = require('axios');

export default class Scene {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;

        this.geometries = {};  // here we map scene geometry uuid <==> backend geometry resource
        this.materials = {};   // here we map scene material uuid <==> backend material resource
        this.nodes = {};       // here we map scene nodes         <==> backend nodes
    }

    async post(sessionGuid, threejsSceneObj, threejsCameraObj) {
        this.sessionGuid = sessionGuid;

        const userDataBackup = {};
        // first remove userData objects that may cause circular references
        threejsSceneObj.traverse(function (child) {
            if (child.userData) {
                const userDataKeys = Object.keys(child.userData);
                if (userDataKeys.length > 0) {
                    const newUserData = { ...child.userData };
                    userDataBackup[child.uuid] = {
                        ref: child,
                        userData: child.userData,
                    }
                    child.userData = newUserData;
                    const allKeys = Object.keys(child.userData);
                    for (const key of allKeys) {
                        if (child.userData[key].serializable === false) {
                            delete child.userData[key];
                        }
                    }
                }
            }
        });

        // serialize scene
        var sceneJson = threejsSceneObj.toJSON();

        // now can recover original userData
        for (const key of Object.keys(userDataBackup)) {
            const backup = userDataBackup[key];
            backup.ref.userData = backup.userData;
        }

        // add camera to scene
        if (threejsCameraObj) {
            if (!sceneJson.object.children) {
                sceneJson.object.children = [];
            }
            const camIdx = sceneJson.object.children.findIndex(el => el.uuid === threejsCameraObj.uuid);
            if (camIdx === -1) {
                sceneJson.object.children.unshift(threejsCameraObj.toJSON().object);
            }
        }

        var geometriesJson = sceneJson.geometries || [];
        var materialsJson = sceneJson.materials || [];

        if (sceneJson.materials) {
            delete sceneJson.materials;
        }
        if (sceneJson.geometries) {
            delete sceneJson.geometries;
        }

        var texturesJson = sceneJson.textures || [];
        if (sceneJson.textures) {
            delete sceneJson.textures;
        }
        var imagesJson = sceneJson.images || [];
        if (sceneJson.images) {
            delete sceneJson.images;
        }

        function __collectGeometries(node, target) {
            if (!node) return;
            if (node.geometry && !target[node.geometry.uuid] && node.geometry.type && node.geometry.type.indexOf("BufferGeometry") !== -1) {
                if (node.geometry && node.geometry.renderable === false
                    || node.userData && node.userData.renderable === false
                ) {
                    // don't collect it
                } else {
                    const parameters = node.geometry.parameters;
                    if (node.geometry.parameters) {
                        delete node.geometry.parameters;
                    }
                    try {
                        const json = THREE.BufferGeometry.prototype.toJSON.call(node.geometry);
                        json.type = "BufferGeometry";
                        target[node.geometry.uuid] = json;
                    } catch (err) {
                        console.warn(err);
                    }
                    node.geometry.parameters = parameters;
                }
            }
            if (node.children) {
                if (node.userData && node.userData.childrenRenderable === false) {
                    // ignore children
                } else {
                    for (const child of node.children) {
                        __collectGeometries(child, target);
                    }
                }
            }
        }
        // now collect geometries
        var sceneGeometries = {};
        __collectGeometries(threejsSceneObj, sceneGeometries);

        function __removeNotRenderable(node) {
            if (!node) return;

            if (node.geometry && node.geometry.renderable === false
                || node.userData && node.userData.renderable === false
            ) {
                // not renderable => convert to Object3D and drop geometry and material links
                node.type = "Object3D";
                delete node.geometry;
                delete node.material;
            }

            if (node.children) {
                if (node.userData && node.userData.childrenRenderable === false) {
                    node.children = [];
                } else {
                    for (const child of node.children) {
                        __removeNotRenderable(child);
                    }
                }
            }
        }

        // now remove from scene not renderable objects
        __removeNotRenderable(sceneJson.object);

        // ==
        await __postGeometries.call(this, Object.values(sceneGeometries));

        // var p1 = __postImages.call(this, imagesJson);
        // var p2 = __postTextures.call(this, texturesJson);
        // await Promise.all([p0, /*p1, p2*/]);

        var p3 = __postMaterials.call(this, materialsJson);
        await Promise.all([p3]);

        await __postScene.call(this, sceneJson);

        return Promise.resolve(this);
    }
}

// node constructor, maps threejs node ref to 3ds max node name
function __rfarmNode(threeNodeRef, maxNodeName) {
    return {
        threeNodeRef: threeNodeRef,
        maxNodeName: maxNodeName
    };
}

async function __postGeometries(geometriesJson) {

    for (const i in geometriesJson) {
        if (!geometriesJson[i].type) {
            continue;
        }
        // not exactly "BufferGeometry"? ,for example "BoxBufferGeometry"
        if (geometriesJson[i].type.indexOf("BufferGeometry") > 0) {
            var g = geometriesJson[i];
            var geometries = THREE.ObjectLoader.prototype.parseGeometries([g]);
            if (geometries[g.uuid].parameters) {
                delete geometries[g.uuid].parameters;
            }
            var ni = geometries[g.uuid].toNonIndexed();
            var bufferGeometryJson = THREE.BufferGeometry.prototype.toJSON.call(ni);
            bufferGeometryJson.uuid = g.uuid;
            bufferGeometryJson.type = "BufferGeometry";
            geometriesJson[i] = bufferGeometryJson;
        }
    }

    console.log("Posting geometries: ", geometriesJson);

    const promises = [];
    const postQueue = geometriesJson.slice();

    while (postQueue.length > 0) {
        const geometryJson = postQueue.pop();
        const geometryText = JSON.stringify(geometryJson);

        var pr = new Promise(function (resolve, reject) {
            var zip = new JSZip();
            zip.file("BufferGeometry.json", geometryText);
            zip.generateAsync({ type: "base64", compression: "DEFLATE", compressionOptions: { level: 9 } }, function updateCallback(metadata) {
                if (metadata.currentFile) {
                    //console.log(" >> progress: ", metadata.currentFile, metadata.percent.toFixed(2) + " %");
                }
            }).then(function (content) {
                // see FileSaver.js
                console.log(` >> compressed: `, geometryJson.uuid, content.length, geometryText.length, content.length / geometryText.length);
                resolve(content);
            });

        }.bind(this)).then(function (content) {
            const url = this.baseUrl + '/three/geometry';
            const compressedGeometryData = content;
            console.log(` >> POST: `, url, content.length);
            return axios.post(url, {
                session_guid: this.sessionGuid,
                uuid: geometryJson.uuid,
                compressed_json: compressedGeometryData,
                // json: geometryText, // in case you prefer traffic over time
                generate_uv2: false,
            });
        }.bind(this));

        promises.push(pr);

        if (promises.length > 16) {
            await Promise.all(promises);
            promises.splice(0, promises.length);
        }
    }

    await Promise.all(promises);
}

function __postImages(imagesJson) {
    console.log("Posting images: ", imagesJson);

    const promises = [];
    for (const json of imagesJson) {
        const p = axios.post(this.baseUrl + '/three/image', {
            session_guid: this.sessionGuid,
            json,
        });
        promises.push(p);
    }

    return Promise.all(promises);
}

function __postTextures(texturesJson) {
    console.log("Posting textures: ", texturesJson);

    const promises = [];
    for (const json of texturesJson) {
        const p = axios.post(this.baseUrl + '/three/texture', {
            session_guid: this.sessionGuid,
            json,
        });
        promises.push(p);
    }

    return Promise.all(promises);
}

function __postMaterials(materialsJson) {
    console.log("Posting materials: ", materialsJson);

    var materialText = JSON.stringify(materialsJson);
    if (!LZString) {
        throw new Error('LZString is not found');
    }
    var compressedMaterialData = LZString.compressToBase64(materialText);

    return axios.post(this.baseUrl + '/three/material', {
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

    return axios.post(this.baseUrl + '/three', {
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

