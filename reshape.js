function ring(){
  //场景
  var scr,scrWidth,scrHeight,scrScene;
  function initScrScene(){
    scr=document.getElementById("scr");
    scrWidth= scr.clientWidth;
    scrHeight= scr.clientHeight;
    
    scrScene=new THREE.Scene();//场景
  }

  //材料
  var geometrys;
  function initScrGeometry(){
    geometrys = new THREE.Mesh(
      new THREE.TorusGeometry( 10, 3, 16, 100 ),
      new THREE.MeshPhongMaterial({ 
        color: 0x4499ff,
        transparent:true,
        opacity:1,
        shininess:20,
        specular:0x4499ff,
        lights:true
      })
    );//材质对象
    geometrys.position.set(0, 0, 0);
    geometrys.receiveShadow = true;
    //geometry.castShadow = true;
    scrScene.add(geometrys);
  }

  function initOBJ(){
    //   // instantiate a loader
    // var loader = new THREE.OBJLoader();
    // // load a resource
    // loader.load(
    // 	// resource URL
    // 	'C:\Users\piang\Desktop\1-Nate Robins’ OpenGL TUTORS\data\f-16.obj',
    // 	// called when resource is loaded
    // 	function ( object ) {
    // 		scrScene.add( object );
    // 	},
    // 	// called when loading is in progresses
    // 	function ( xhr ) {
    // 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    // 	},
    // 	// called when loading has errors
    // 	function ( error ) {
    // 		console.log( 'An error happened' );
    // 	}
    // );
  }

  //照相机
  var k,scrCamera;
  function initScrCamera(){
    k=13;
    scrCamera=new THREE.OrthographicCamera(-scrWidth/k,scrWidth/k,scrHeight/k,-scrHeight/k,1,1000);
                                          //正投影(left,right,top,bottom,near,far)
    scrCamera.position.set(0,0,400);
    scrCamera.lookAt(scrScene.position);
  }
  
  //渲染器设置
  var scrRenderer;
  function initScrRender(){
    scrRenderer=new THREE.WebGLRenderer();
    scrRenderer.setSize(scrWidth, scrHeight);
    scrRenderer.setClearColor(0x3d3d3d,1);//背景色，深灰
    scr.appendChild(scrRenderer.domElement);
  }
  
  //灯光
  var light,point,point1,ambient;
  function initScrLight(){
    light = new THREE.SpotLight( 0x3d3d3d, 1);
    light.position.set( 100, 200, 50 );
    light.castShadow = true;		
    scrScene.add( light );
    
    //点灯光
    point=new THREE.PointLight(0xffffff);
    point.position.set(400,200,300);
    scrScene.add(point);
    
    point1=new THREE.PointLight(0xffffff);
    point1.position.set(-400,200,300);
    scrScene.add(point1);
    //环境灯光
    ambient=new THREE.AmbientLight(0x888888);
    scrScene.add(ambient);
  }

  //设置渲染函数，执行渲染器
  function scrRender(){
    //requestAnimationFrame(scrRender);
    //controls.update();
    scrRenderer.render(scrScene,scrCamera);
    scrRenderer.setSize(scrWidth, scrHeight );
  }

  //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放,轨道控制器OrbitControls
  var controls;
  function initScrControls(){
    controls=new THREE.OrbitControls(scrCamera);
    controls.addEventListener('change', scrRender);
    controls.enablePan = true;
  }

  initScrScene();
  initScrRender();
  initScrCamera();
  initScrLight();
  initScrGeometry();
  scrRender();
  //initScrControls();
}





function draw(){
  //场景
  var wor,worHeight,worWidth,worScene;
  function initWorScene(){
    wor=document.getElementById("wor");
    worWidth= wor.clientWidth;
    worHeight= wor.clientHeight;
    
    worScene=new THREE.Scene();//创建场景
  }

  //初始化dat.GUI简化试验流程
  var gui,geometryGui,add_pointlight=true,add_spotlight=true,add_ambientlight=true;
  const PI=3.1415926;
  function initGui(){
    //声明一个保存需求修改的相关数据的对象
    gui = {
      light_pos_x:-20, //点光源向量x轴的位置
      light_pos_y:20, //点光源向量y轴的位置
      light_pos_z:20, //点光源向量z轴的位置
      //light_pos_d:0, //点光源向量(0)或(1)的位置

      spot_pos_x:40, //聚光灯向量x轴的位置
      spot_pos_y:40, //聚光灯向量y轴的位置
      spot_pos_z:40, //聚光灯向量z轴的位置

      ambientred_intensity:0, //环境红光强度
      ambientgreen_intensity:0, //环境绿光强度
      ambientblue_intensity:0, //环境蓝光强度

      //material_color:0x000000,

      PointLight:true,//点光源是否开启
      SpotLight:true,//聚光灯是否开启
      AmbientLight:true,//环境光是否开启
    }
    geometryGui = {
      geometry_shininess:100,
      material_color:0x000000,
      material_specular:0x4499ff,
      material_wireframe:false,
      geometry_radius:10,
      geometry_tube:3,
      geometry_radialSegments:16,
      geometry_tubularSegments:100,
      geometry_arc:2*PI,

    };

    var datGui = new dat.GUI();
    //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
    var poi = datGui.addFolder( 'PointLight' );
    poi.add(gui,"PointLight").onChange(
      function(){
        if(add_pointlight==false){
          point = new THREE.PointLight( 0xffffff, 1, 100);//第三个衰减距离
          point.position.set(  gui.light_pos_x,  gui.light_pos_y,  gui.light_pos_z );
          worScene.add( point );
          add_pointlight=true;
        }else{
          worScene.remove( point );
          add_pointlight=false;
        }
      }
    );
    poi.add(gui,"light_pos_x",-100,100);
    poi.add(gui,"light_pos_y",-100,100);
    poi.add(gui,"light_pos_z",-100,100);
    
    var spo = datGui.addFolder( 'SpotLight' );
    spo.add(gui,"SpotLight").onChange(
      function(){
        if(add_spotlight==false){
          spot = new THREE.SpotLight( 0xffffff, 1, 200);
          spot.position.set( gui.spot_pos_x, gui.spot_pos_y, gui.spot_pos_z);
          spot.castShadow = true;		
          worScene.add(spot);
          add_spotlight=true;
        }else{
          worScene.remove( spot );
          add_spotlight=false;
        }
      }
    );
    spo.add(gui,"spot_pos_x",-100,100);
    spo.add(gui,"spot_pos_y",-100,100);
    spo.add(gui,"spot_pos_z",-100,100);
   
    var amb = datGui.addFolder( 'AmbientLight' );
    amb.add(gui,"AmbientLight").onChange(
      function(){
        if(add_ambientlight==false){
          ambientRed=new THREE.AmbientLight( 0xff0000 );
          ambientRed.intensity=0;
          worScene.add(ambientRed);
          ambientGreen=new THREE.AmbientLight( 0x00ff00 );
          ambientGreen.intensity=0;
          worScene.add(ambientGreen);
          ambientBlue=new THREE.AmbientLight( 0x0000ff );
          ambientBlue.intensity=0;
          worScene.add(ambientBlue);
          add_ambientlight=true;
        }else{
          worScene.remove(ambientRed);
          worScene.remove(ambientGreen);
          worScene.remove(ambientBlue);
          add_ambientlight=false;
        }
      }
    );
    amb.add(gui,"ambientred_intensity",0,1);
    amb.add(gui,"ambientgreen_intensity",0,1);
    amb.add(gui,"ambientblue_intensity",0,1);
   
    
    var  mat= datGui.addFolder( 'Material' );
    mat.add(geometryGui,"geometry_shininess",0,200);
    mat.addColor(geometryGui,"material_color").onChange(
      function(){
        material.emissive.set(geometryGui.material_color);
      }
    );
    mat.addColor(geometryGui,"material_specular").onChange(
      function(){
        material.specular.set(geometryGui.material_specular);
      }
    );

    //开启线框模式
    mat.add(geometryGui,"material_wireframe").onChange(
      function(){
        material.wireframe=geometryGui.material_wireframe;
      }
    );
    mat.add(geometryGui,"geometry_radius",1,15).onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          worScene.remove(geometry);
          radius = geometryGui.geometry_radius;
          initWorGeometry();
          material.wireframe=true;
          material.emissive.set(geometryGui.material_color);
        }
      }
    );
    mat.add(geometryGui,"geometry_tube",0.1,8).onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          worScene.remove(geometry);      
          tube = geometryGui.geometry_tube;
          initWorGeometry();
          material.wireframe=true;
          material.emissive.set(geometryGui.material_color);
        }
      }
    );
    mat.add(geometryGui,"geometry_radialSegments",2,50).onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          worScene.remove(geometry);
          radialSegments = geometryGui.geometry_radialSegments;
          initWorGeometry();
          material.wireframe=true;
          material.emissive.set(geometryGui.material_color);
        }
      }
    );
    mat.add(geometryGui,"geometry_tubularSegments",3,300).onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          worScene.remove(geometry);
          tubularSegments = geometryGui.geometry_tubularSegments;
          initWorGeometry();
          material.wireframe=true;
          material.emissive.set(geometryGui.material_color);
        }
      }
    );
    mat.add(geometryGui,"geometry_arc",0.1,2*PI).onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          worScene.remove(geometry);
          arc = geometryGui.geometry_arc;
          initWorGeometry();
          material.wireframe=true;
          material.emissive.set(geometryGui.material_color);
        }
      }
    );
  }

  //材料
  var geometry,material;
  var radius=10,tube=3,radialSegments=16,tubularSegments=100,arc=2*PI;
  function initWorGeometry(){
    geometry = new THREE.Mesh(
      new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments, arc ),
      material = new THREE.MeshPhongMaterial({ 
      color: 0x4499ff,
      transparent:true,
      opacity:1,
      shininess:100,
      specular:0x4499ff,
      reflectivity:0,
      emissive:0x000000,//发出的光,默认为黑色
      //wireframe:true,//线框模式
      emissiveIntensity:1,
      lights:true,
      })
    );//材质对象
    geometry.position.set(0, 0, 0);
    geometry.castShadow = true;
    worScene.add(geometry);
  }

  //照相机
  var k,worCamera;
  function initWorCamera(){
    k=7;
    worCamera=new THREE.PerspectiveCamera(60,worWidth/worHeight,1,1000);
                                          //透视投影(fov,aspect,near,far)
    worCamera.position.set(50,0,50);
    worCamera.lookAt(worScene.position);
  }
  
  //渲染器设置
  var worRenderer;
  function initWorRender(){
    worRenderer=new THREE.WebGLRenderer();
    worRenderer.setSize(worWidth, worHeight);
    worRenderer.setClearColor(0x000000,1);//背景色，黑色
    //worRenderer.shadowMapEnabled = true;
    wor.appendChild(worRenderer.domElement);//插入canvas对象
  }
 
  //灯光
  var spot,point,ambientRed,ambientGreen,ambientBlue;
  function initWorLight(){
    point = new THREE.PointLight( 0xffffff, 1, 100);//第三个衰减距离
    point.position.set( -20, 20, 20 );
    worScene.add( point );
    
    //点灯光
    spot = new THREE.SpotLight( 0xffffff, 1, 200);
    spot.position.set(40,20,30);
    spot.castShadow = true;		
    worScene.add(spot);
    
    // //环境灯光
    ambientRed=new THREE.AmbientLight( 0xff0000 );
    ambientRed.intensity=0;
    worScene.add(ambientRed);
    ambientGreen=new THREE.AmbientLight( 0x00ff00 );
    ambientGreen.intensity=0;
    worScene.add(ambientGreen);
    ambientBlue=new THREE.AmbientLight( 0x0000ff );
    ambientBlue.intensity=0;
    worScene.add(ambientBlue);
  }

  //设置渲染函数，执行渲染器
  function worRender(){
    //requestAnimationFrame(worRender);
    //controls.update();
  
    worRenderer.render(worScene,worCamera);
    worRenderer.setSize( worWidth, worHeight );
  }

  //生成一个前平面一个后平面
  var behindPlaneGeometry,behindPlaneMaterial,behindPlane;
  var frontPlaneGeometry,frontPlaneMaterial,frontPlane;
  function initPlane(){
    //生成一个后平面
    behindPlaneGeometry=new THREE.PlaneGeometry(70,70);//后平面
    //生成一个材质
    behindPlaneMaterial=new THREE.MeshLambertMaterial({color:0x3d3d3d});//背面面板深灰
    //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
    behindPlane=new THREE.Mesh(behindPlaneGeometry,behindPlaneMaterial);
    behindPlane.position.x=0;
    behindPlane.position.y=0;
    behindPlane.position.z=-30;
    behindPlane.receiveShadow=true;//平面进行接受阴影

    //生成一个前平面
    frontPlaneGeometry=new THREE.PlaneGeometry(8,8);//前平面
    //生成一个材质
    frontPlaneMaterial=new THREE.MeshPhongMaterial({
      color:0x0033ff,
      //aoMapIntensity:0.5,
      opacity:0.5,
      transparent:true
    });//前面面板透明深蓝
    //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
    frontPlane=new THREE.Mesh(frontPlaneGeometry,frontPlaneMaterial);
    //plane.rotation.x=-0.5*Math.PI;//将平面沿着x轴进行旋转
    frontPlane.position.x=0;
    frontPlane.position.y=0;
    frontPlane.position.z=25;
    frontPlane.receiveShadow=true;//平面进行接受阴影
    worScene.add(frontPlane);
    worScene.add(behindPlane);
  }

  //添加线
  function initLine(){
    //四条前平面与后平面的连线
    var lineMaterial=new THREE.LineBasicMaterial( { color: 0x33ff00 } );

    var lineOneGeometry=new THREE.Geometry();
    lineOneGeometry.vertices.push(new THREE.Vector3( 4, 4, 25) );
    lineOneGeometry.vertices.push(new THREE.Vector3(35,35,-30) );
    var lineOne = new THREE.Line(lineOneGeometry,lineMaterial);
    worScene.add(lineOne);
    
    var lineTwoGeometry=new THREE.Geometry();
    lineTwoGeometry.vertices.push(new THREE.Vector3( 4, -4, 25) );
    lineTwoGeometry.vertices.push(new THREE.Vector3(35,-35,-30) );
    var lineTwo = new THREE.Line(lineTwoGeometry,lineMaterial);
    worScene.add(lineTwo);

    var lineThreeGeometry=new THREE.Geometry();
    lineThreeGeometry.vertices.push(new THREE.Vector3( -4, 4, 25) );
    lineThreeGeometry.vertices.push(new THREE.Vector3(-35,35,-30) );
    var lineThree = new THREE.Line(lineThreeGeometry,lineMaterial);
    worScene.add(lineThree);

    var lineFourGeometry=new THREE.Geometry();
    lineFourGeometry.vertices.push(new THREE.Vector3( -4, -4, 25) );
    lineFourGeometry.vertices.push(new THREE.Vector3(-35,-35,-30) );
    var lineFour = new THREE.Line(lineFourGeometry,lineMaterial);
    worScene.add(lineFour);

    //中心线
    var lineCenterMaterial=new THREE.LineBasicMaterial( { color: 0x0000ff } );

    var lineCenterGeometry=new THREE.Geometry();
    lineCenterGeometry.vertices.push(new THREE.Vector3( 0, 0,30) );
    lineCenterGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    var lineCenter = new THREE.Line(lineCenterGeometry,lineCenterMaterial);
    worScene.add(lineCenter);

    var lineCenterarrowGeometry=new THREE.Geometry();
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 2, 0, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3(-2, 0, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 2, 0, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0,-2, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0, 2, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    var lineCenterarrow = new THREE.Line(lineCenterarrowGeometry,lineCenterMaterial);
    worScene.add(lineCenterarrow);

    //生成一个坐标轴，辅助线
    var lineXMaterial=new THREE.LineBasicMaterial( { color: 0xff0000 } );
    var lineXGeometry=new THREE.Geometry();
    lineXGeometry.vertices.push(new THREE.Vector3( 0, 0,30) );
    lineXGeometry.vertices.push(new THREE.Vector3( 7, 0,30) );//
    lineXGeometry.vertices.push(new THREE.Vector3( 6, 1,30) );
    lineXGeometry.vertices.push(new THREE.Vector3( 6,-1,30) );
    lineXGeometry.vertices.push(new THREE.Vector3( 7, 0,30) );//
    lineXGeometry.vertices.push(new THREE.Vector3( 6, 0,29) );
    lineXGeometry.vertices.push(new THREE.Vector3( 6, 0,31) );
    lineXGeometry.vertices.push(new THREE.Vector3( 7, 0,30) );//
    var lineX = new THREE.Line(lineXGeometry,lineXMaterial);
    worScene.add(lineX);

    var lineYMaterial=new THREE.LineBasicMaterial( { color: 0xffff00 } );
    var lineYGeometry=new THREE.Geometry();
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 0,30) );
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 7,30) );//
    lineYGeometry.vertices.push(new THREE.Vector3( 1, 6,30) );
    lineYGeometry.vertices.push(new THREE.Vector3(-1, 6,30) );
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 7,30) );//
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 6,29) );
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 6,31) );
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 7,30) );//
    var lineY = new THREE.Line(lineYGeometry,lineYMaterial);
    worScene.add(lineY);

    var lineZMaterial=new THREE.LineBasicMaterial( { color: 0x0000ff } );
    var lineZGeometry=new THREE.Geometry();
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 0,30) );
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 0,37) );//
    lineZGeometry.vertices.push(new THREE.Vector3( 1, 0,36) );
    lineZGeometry.vertices.push(new THREE.Vector3(-1, 0,36) );
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 0,37) );//
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 1,36) );
    lineZGeometry.vertices.push(new THREE.Vector3( 0,-1,36) );
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 0,37) );//
    var lineZ = new THREE.Line(lineZGeometry,lineZMaterial);
    worScene.add(lineZ);
  }

  //添加光照法线
  var linelight;
  function initnormalLine(){
    var linelightMaterial=new THREE.LineBasicMaterial( { color: 0xffffff } );
    var linelightGeometry=new THREE.Geometry();
    linelightGeometry.vertices.push(new THREE.Vector3(  0, 0, 0) );
    linelightGeometry.vertices.push(new THREE.Vector3( point.position.x, point.position.y, point.position.z) );
    linelight = new THREE.Line(linelightGeometry,linelightMaterial);
    worScene.add(linelight);
  }

  //初始化性能插件
  var stats;
  function initStats() {
    stats = new Stats();
    wor.appendChild(stats.dom);
  }

  //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放,轨道控制器OrbitControls
  var controlss;
  function initWorControls(){
    controlss=new THREE.OrbitControls(worCamera);
    controlss.addEventListener('change', worRender);
    controlss.enablePan = true;
  }

  //窗口变动触发的函数
  function onWindowResize() {
    worCamera.aspect = worWidth / worHeight;
    worCamera.updateProjectionMatrix();
    worRender();
    worRenderer.setSize( worWidth, worHeight );
  }

  function animate(){
    //更新控制器
    worRender();

    //更新性能插件
    stats.update();

    //更新相关位置
    point.position.x = gui.light_pos_x;
    point.position.y = gui.light_pos_y;
    point.position.z = gui.light_pos_z;
    //light.position.d = gui.light_pos_d;

    spot.position.x = gui.spot_pos_x;
    spot.position.y = gui.spot_pos_y;
    spot.position.z = gui.spot_pos_z;

    ambientRed.intensity = gui.ambientred_intensity;
    ambientGreen.intensity = gui.ambientgreen_intensity;
    ambientBlue.intensity = gui.ambientblue_intensity;

    material.shininess = geometryGui.geometry_shininess;
   
    
    //更新光照法线
    worScene.remove(linelight);
    initnormalLine();


    controlss.update();
    
    requestAnimationFrame(animate);
  }

  initGui();
  initWorScene();
  initWorRender();
  initWorCamera();
  initWorLight();
  initWorGeometry();
  initPlane();
  initLine();
  initnormalLine();
  initWorControls();
  initStats();
  animate();
  //window.onresize = onWindowResize;
}

function main(){
  //ring();
  draw();
}

