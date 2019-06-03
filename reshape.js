function main(){

  var information=document.getElementById("p");
  //var ctx=information.getContext("2d");
  //ctx.font="30px Arial";
  //ctx.fillStyle="0xffffff";
  //ctx.fillRect(100,350,150,100); 
  //ctx.fillText("abcdefghijklmnopqrstuvwxyzcvzx",10,10);
  information.innerHTML="<h3>拖动鼠标左键/右键/中键可以旋转/移动/缩放模型，通过右侧控制面板点击参数类型滑动改变模型参数，<br>模型样式改变需要加载一定的时间</h3>";
  



  //场景
  var scene;
  function initWorScene(){
    // wor=document.getElementById("wor");
    // worWidth= wor.clientWidth;
    // worHeight= wor.clientHeight;
    scene=new THREE.Scene();//创建场景
  }

  //初始化dat.GUI简化试验流程
  var gui,geometryGui,add_pointlight=true,add_spotlight=true,add_ambientlight=true;
  const PI=3.1415926;
  //var tag=true; //解决显示信息（innerHTML）所带来的的性能问题
  function initGui(){
    //声明一个保存需求修改的相关数据的对象
    gui = {
      point_color:0xffffff, //点光源颜色白色
      light_pos_x:-20, //点光源向量x轴的位置
      light_pos_y:20, //点光源向量y轴的位置
      light_pos_z:20, //点光源向量z轴的位置

      spot_pos_x:40, //聚光灯向量x轴的位置
      spot_pos_y:40, //聚光灯向量y轴的位置
      spot_pos_z:40, //聚光灯向量z轴的位置
      spot_intensity:1, //聚光灯光照强度
      spot_angle:PI/4, //聚光灯散射角度，最大值为90度
      spot_penumbra:0, //聚光灯的半影衰减百分比，在0和1之间
      spot_decay:0, //聚光灯沿着光照距离的衰减量

      ambientred_intensity:0, //环境红光强度
      ambientgreen_intensity:0, //环境绿光强度
      ambientblue_intensity:0, //环境蓝光强度

      PointLight:true, //点光源是否开启
      SpotLight:true, //聚光灯是否开启
      AmbientLight:true, //环境光是否开启
    };

    geometryGui = {
      geometry_shininess:100, //高亮程度
      material_color:0x000000, //放射光颜色
      material_specular:0x4499ff, //高光颜色
      material_wireframe:false, //线框模式是否开启
      geometry_radius:10, //圆环半径
      geometry_tube:3, //管道半径
      geometry_radialSegments:16, //圆环分段数
      geometry_tubularSegments:100, //管道分段数
      geometry_arc:2*PI, //圆环中心角
      geometry_pos_x:0, //模型x轴坐标
      geometry_pos_y:0, //模型y轴坐标
      geometry_pos_z:0, //模型z轴坐标
      geometry_rotation_x:0, //沿x轴旋转角度
      geometry_rotation_y:0, //沿y轴旋转角度
      geometry_rotation_z:0, //沿z轴旋转角度
      geometry_size:1, //模型缩放倍数大小
      torus:function(){

      },
      f:function(){},
      al:function(){},
      dolphins:function(){},
      flowers:function(){},
      porsche:function(){},
      rose:function(){},
      soccerball:function(){},
      
    };

    var datGui = new dat.GUI();
    //将设置属性添加到gui当中
    var poi = datGui.addFolder( '点光源' );
    poi.add(gui,"PointLight").name('开启点光源').onChange(
      function(){
          if(add_pointlight==false){
            //initPointlight();
            scene.add( point );
            pointMat.emissive.set(gui.point_color);
            point.color.set(gui.point_color);
            add_pointlight=true;
            point.position.set(  gui.light_pos_x,  gui.light_pos_y,  gui.light_pos_z );
          }else{
            scene.remove( point );
            add_pointlight=false;
          }
          information.innerHTML="<h3>if(add_pointlight==false){<br>scene.add( point ); add_pointlight=true;<br>}else{<br>scene.remove( point ); add_pointlight=false;}</h3>";
    });
    poi.addColor(gui,"point_color").name('点光源颜色').onChange(
      function(){
        point.color.set(gui.point_color);
        pointMat.emissive.set(gui.point_color);
          information.innerHTML="<h3>point.color.set( gui.point_color );<br>pointMat.emissive.set( gui.point_color );</h3>";
      });
    poi.add(gui,"light_pos_x",-20,20).name('x轴坐标').onChange(
      function(){
        point.position.x = gui.light_pos_x;
        information.innerHTML="<h3>point.position.x = gui.light_pos_x;</h3>";
      }
    );
    poi.add(gui,"light_pos_y",-20,20).name('y轴坐标').onChange(
      function(){
        point.position.y = gui.light_pos_y;
          information.innerHTML="<h3>point.position.y = gui.light_pos_y;</h3>";
      }
    );
    poi.add(gui,"light_pos_z",-20,20).name('z轴坐标').onChange(
      function(){
        point.position.z = gui.light_pos_z;
        information.innerHTML="<h3>point.position.z = gui.light_pos_z;</h3>";
      }
    );
    
    var spo = datGui.addFolder( '聚光灯' );
    spo.add(gui,"SpotLight").name('开启聚光灯').onChange(
      function(){
        if(add_spotlight==false){
          spot = new THREE.SpotLight( 0xffffff, 1, 100);
          spot.position.set( gui.spot_pos_x, gui.spot_pos_y, gui.spot_pos_z);
          spot.castShadow = true;	
          spot.intensity=gui.spot_intensity;
          spot.angle=gui.spot_angle;
          spot.penumbra=gui.spot_penumbra;
          spot.decay=gui.spot_decay;

          scene.add(spot);
          add_spotlight=true;
        }else{
          scene.remove( spot );
          add_spotlight=false;
        }
        information.innerHTML="<h3>if(add_spotlight==false){<br>scene.add(spot); add_spotlight=true;<br>}else{<br>scene.remove( spot ); add_spotlight=false;}</h3>";
      }
    );
    spo.add(gui,"spot_pos_x",-100,100).name('x轴坐标').onChange(
      function(){
        spot.position.x = gui.spot_pos_x;
        information.innerHTML="<h3>spot.position.x = gui.spot_pos_x;</h3>";
      }
    );
    spo.add(gui,"spot_pos_y",-100,100).name('y轴坐标').onChange(
      function(){
        spot.position.y = gui.spot_pos_y;
        information.innerHTML="<h3>spot.position.y = gui.spot_pos_y;</h3>";
      }
    );
    spo.add(gui,"spot_pos_z",-100,100).name('z轴坐标').onChange(
      function(){
        spot.position.z = gui.spot_pos_z;
        information.innerHTML="<h3>spot.position.z = gui.spot_pos_z;</h3>";
      }
    );
    spo.add(gui,"spot_intensity",0,3).name('光照强度').onChange(
      function(){
        spot.intensity = gui.spot_intensity;
        information.innerHTML="<h3>spot.intensity = gui.spot_intensity;</h3>";
      }
    );
    spo.add(gui,"spot_decay",0,5).name('距离衰减量').onChange(
      function(){
        spot.decay = gui.spot_decay;
        information.innerHTML="<h3>spot.decay = gui.spot_decay;</h3>";
      }
    );
    spo.add(gui,"spot_angle",0,0.8).name('光线散射角度').onChange(
      function(){
        spot.angle = gui.spot_angle;
        information.innerHTML="<h3>spot.angle = gui.spot_angle;</h3>";
      }
    );
    spo.add(gui,"spot_penumbra",0,1).name('半影衰减百分比').onChange(
      function(){
        spot.penumbra = gui.spot_penumbra;
        information.innerHTML="<h3>spot.penumbra = gui.spot_penumbra;</h3>";
      }
    );
   
    var amb = datGui.addFolder( '环境光' );
    amb.add(gui,"AmbientLight").name('开启环境光').onChange(
      function(){
        if(add_ambientlight==false){
          ambientRed=new THREE.AmbientLight( 0xff0000 );
          ambientRed.intensity=gui.ambientred_intensity;
          scene.add(ambientRed);
          ambientGreen=new THREE.AmbientLight( 0x00ff00 );
          ambientGreen.intensity=gui.ambientgreen_intensity;
          scene.add(ambientGreen);
          ambientBlue=new THREE.AmbientLight( 0x0000ff );
          ambientBlue.intensity=gui.ambientblue_intensity;
          scene.add(ambientBlue);
          add_ambientlight=true;
        }else{
          scene.remove(ambientRed);
          scene.remove(ambientGreen);
          scene.remove(ambientBlue);
          add_ambientlight=false;
        }
        information.innerHTML="<h3>if(add_ambientlight==false){<br>scene.add(ambientRed);scene.add(ambientGreen);scene.add(ambientBlue);<br>add_ambientlight=true;<br>}else{<br>scene.remove(ambientRed);scene.remove(ambientGreen);scene.remove(ambientBlue);<br>add_ambientlight=false;}</h3>";
      }
    );
    amb.add(gui,"ambientred_intensity",0,1).name('红光强度').onChange(
      function(){
        ambientRed.intensity = gui.ambientred_intensity;
        information.innerHTML="<h3>ambientRed.intensity = gui.ambientred_intensity;</h3>";
      }
    );
    amb.add(gui,"ambientgreen_intensity",0,1).name('绿光强度').onChange(
      function(){
        ambientGreen.intensity = gui.ambientgreen_intensity;
        information.innerHTML="<h3>ambientGreen.intensity = gui.ambientgreen_intensity;</h3>";
      }
    );
    amb.add(gui,"ambientblue_intensity",0,1).name('蓝光强度').onChange(
      function(){
        ambientBlue.intensity = gui.ambientblue_intensity;
        information.innerHTML="<h3>ambientBlue.intensity = gui.ambientblue_intensity;</h3>";
      }
    );
   

    var  mat= datGui.addFolder( '材料属性' );
    mat.add(geometryGui,"geometry_shininess",0,200).name('高亮程度').onChange(
      function(){
        material.shininess = geometryGui.geometry_shininess;
        information.innerHTML="<h3>material.shininess = geometryGui.geometry_shininess;</h3>";
      }
    );
    mat.addColor(geometryGui,"material_specular").name('高光颜色').onChange(
      function(){
        material.specular.set( geometryGui.material_specular );
        information.innerHTML="<h3>material.specular.set( geometryGui.material_specular );</h3>";
      }
    );
    mat.addColor(geometryGui,"material_color").name('放射光颜色').onChange(
      function(){
        material.emissive.set( geometryGui.material_color );
        information.innerHTML="<h3>material.emissive.set( geometryGui.material_color );</h3>";
      }
    );

    var geo = datGui.addFolder('模型变化');
    geo.add(geometryGui,"geometry_pos_x",-5,5).name('沿x轴平移').onChange(
      function(){
        geometry.position.x = geometryGui.geometry_pos_x;   
        information.innerHTML="<h3>Tx = geometryGui.geometry_pos_x;<br>var u_Translation = gl.getUniformLocation( gl.program, 'u_Translation' );<br>gl.uniform4f( u_Translation, Tx, Ty, Tz, 0.0 );</h3>";
      }
    );
    geo.add(geometryGui,"geometry_pos_y",-5,5).name('沿y轴平移').onChange(
      function(){
        geometry.position.y = geometryGui.geometry_pos_y;   
        information.innerHTML="<h3>Ty = geometryGui.geometry_pos_y;<br>var u_Translation = gl.getUniformLocation( gl.program, 'u_Translation' );<br>gl.uniform4f( u_Translation, Tx, Ty, Tz, 0.0 );</h3>";
      }
    );
    geo.add(geometryGui,"geometry_pos_z",-5,5).name('沿z轴平移').onChange(
      function(){
        geometry.position.z = geometryGui.geometry_pos_z;   
        information.innerHTML="<h3>Tz = geometryGui.geometry_pos_z;<br>var u_Translation = gl.getUniformLocation( gl.program, 'u_Translation' );<br>gl.uniform4f( u_Translation, Tx, Ty, Tz, 0.0 );</h3>";
      }
    );
    geo.add(geometryGui,"geometry_rotation_x",-2*PI,2*PI).name('沿x轴旋转').onChange(
      function(){
        geometry.rotation.x=geometryGui.geometry_rotation_x;   
        information.innerHTML="<h3>var ANGLE = geometry_rotation_x; var radian = Math.PI*ANGLE / 180.0;<br>var cosB = Math.cos(radian); var sinB = Math.sin(radian);<br>var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');<br>var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');<br>gl.uniformlf(u_CosB,cosB); gl.uniformlf(u_SinB, sinB);</h3>";
      }
    );
    geo.add(geometryGui,"geometry_rotation_y",-2*PI,2*PI).name('沿y轴旋转').onChange(
      function(){
        geometry.rotation.y=geometryGui.geometry_rotation_y;    
        information.innerHTML="<h3>var ANGLE = geometry_rotation_y; var radian = Math.PI*ANGLE / 180.0;<br>var cosB = Math.cos(radian); var sinB = Math.sin(radian);<br>var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');<br>var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');<br>gl.uniformlf(u_CosB,cosB); gl.uniformlf(u_SinB, sinB);</h3>";
      }
    );
    geo.add(geometryGui,"geometry_rotation_z",-2*PI,2*PI).name('沿z轴旋转').onChange(
      function(){
        geometry.rotation.z=geometryGui.geometry_rotation_z;   
        information.innerHTML="<h3>var ANGLE = geometry_rotation_z; var radian = Math.PI*ANGLE / 180.0;<br>var cosB = Math.cos(radian); var sinB = Math.sin(radian);<br>var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');<br>var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');<br>gl.uniformlf(u_CosB,cosB); gl.uniformlf(u_SinB, sinB);</h3>";
      }
    );
    geo.add(geometryGui,"geometry_size",0.1,1.8).name('缩放').onChange(
      function(){
        scene.remove(geometry);
        radius=geometryGui.geometry_size*10;
        tube=geometryGui.geometry_size*3;
        initGeometry();
        material.emissive.set(geometryGui.material_color);
        information.innerHTML="<h3>var xformMatrix = new Float32Array([<br> Sx, 0.0, 0.0, 0.0,<br>0.0, Sy, 0.0, 0.0<br>0.0, 0.0, Sz, 0.0,<br>0.0, 0.0, 0.0, 1.0])</h3>";
      }
    );

    var  wir= geo.addFolder( '线框模式' );
    wir.add(geometryGui,"material_wireframe").name('开启线框模式').onChange(
      function(){
        scene.remove( geometry );
        radius = geometryGui.geometry_radius;
        tube = geometryGui.geometry_tube;
        radialSegments = geometryGui.geometry_radialSegments;
        tubularSegments = geometryGui.geometry_tubularSegments;
        arc = geometryGui.geometry_arc;
        initGeometry();
        material.wireframe = geometryGui.material_wireframe;
        material.shininess = geometryGui.geometry_shininess;
        material.specular.set( geometryGui.material_specular );
        material.emissive.set( geometryGui.material_color );
        information.innerHTML="<h3>scene.remove( geometry );<br>radius = geometryGui.geometry_radius; tube = geometryGui.geometry_tube;<br>radialSegments = geometryGui.geometry_radialSegments;<br>tubularSegments = geometryGui.geometry_tubularSegments;<br>arc = geometryGui.geometry_arc; initGeometry();<br>material.wireframe = geometryGui.material_wireframe;<br>material.shininess = geometryGui.geometry_shininess;<br>material.specular.set( geometryGui.material_specular );<br>material.emissive.set( geometryGui.material_color );</h3>";
      }
    );
    wir.add(geometryGui,"geometry_radius",1,15).name('圆环半径').onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          scene.remove( geometry );
          radius = geometryGui.geometry_radius;
          initGeometry();
          material.wireframe=true;
          material.emissive.set(geometryGui.material_color);
          information.innerHTML="<h3>scene.remove( geometry );<br>radius = geometryGui.geometry_radius;<br>initGeometry();<br>material.wireframe = true;<br>material.emissive.set( geometryGui.material_color );</h3>";
        }
      }
    );
    wir.add(geometryGui,"geometry_tube",0.1,7).name('管道半径').onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          scene.remove( geometry );      
          tube = geometryGui.geometry_tube;
          initGeometry();
          material.wireframe = true;
          material.emissive.set( geometryGui.material_color );
          information.innerHTML="<h3>scene.remove( geometry );<br>tube = geometryGui.geometry_tube;<br>initGeometry();<br>material.wireframe = true;<br>material.emissive.set( geometryGui.material_color );</h3>";
        }
      }
    );
    wir.add(geometryGui,"geometry_radialSegments",2,50).name('圆环分段数').onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          scene.remove( geometry );
          radialSegments = geometryGui.geometry_radialSegments;
          initGeometry();
          material.wireframe=true;
          material.emissive.set( geometryGui.material_color );
          information.innerHTML="<h3>scene.remove( geometry );<br>radialSegments = geometryGui.geometry_radialSegments;<br>initGeometry();<br>material.wireframe = true;<br>material.emissive.set( geometryGui.material_color );</h3>";
        }
      }
    );
    wir.add(geometryGui,"geometry_tubularSegments",3,300).name('管道分段数').onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          scene.remove( geometry );
          tubularSegments = geometryGui.geometry_tubularSegments;
          initGeometry();
          material.wireframe = true;
          material.emissive.set( geometryGui.material_color );
          information.innerHTML="<h3>scene.remove( geometry );<br>tubularSegments = geometryGui.geometry_tubularSegments;<br>initGeometry();<br>material.wireframe = true;<br>material.emissive.set( geometryGui.material_color );</h3>";
        }
      }
    );
    wir.add(geometryGui,"geometry_arc",0.1,2*PI).name('圆环中心角').onChange(
      function(){
        if(geometryGui.material_wireframe==true){
          scene.remove( geometry );
          arc = geometryGui.geometry_arc;
          initGeometry();
          material.wireframe = true;
          material.emissive.set( geometryGui.material_color );
          information.innerHTML="<h3>scene.remove( geometry );<br>arc = geometryGui.geometry_arc;<br>initGeometry();<br>material.wireframe = true;<br>material.emissive.set( geometryGui.material_color );</h3>";
        }
      }
    );


    
    var sty = datGui.addFolder('模型样式');
    sty.add(geometryGui,"torus").name("圆环体").onChange(
      function(){
        //scene.remove(geometry);
        clearScene();
        initGeometry();
        myObjects[0]=geometry;
      }
    );
    sty.add(geometryGui,"f").name("f-16").onChange(
      function(){
        //scene.remove(geometry);
        clearScene();
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('data/');
        mtlLoader.load('f-16.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('data/');
            objLoader.load('f-16.obj', function (geometry) {
            geometry.scale.set(3, 3, 3);
            geometry.position.set(5,-8,0);
            geometry.castShadow = true;
            scene.add(geometry);
            myObjects[0]=geometry;
            })
        });
      }
    );
    sty.add(geometryGui,"al").name("人物").onChange(
      function(){
        //scene.remove(geometry);
        clearScene();
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('data/');
        mtlLoader.load('al.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('data/');
            objLoader.load('al.obj', function (geometry) {
            geometry.scale.set(3, 3, 3);
            geometry.position.set( 0, 0, 0);
            geometry.castShadow = true;
            scene.add(geometry);
            myObjects[0]=geometry;
            })
        });
      }
    );
    sty.add(geometryGui,"dolphins").name("海豚").onChange(
      function(){
        scene.remove(geometry);
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('data/');
        mtlLoader.load('dolphins.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('data/');
            objLoader.load('dolphins.obj', function (geometry) {
            geometry.scale.set(3, 3, 3);
            geometry.position.set(0,0,0);
            geometry.castShadow = true;
            scene.add(geometry);
            })
        });
      }
    );
    sty.add(geometryGui,"flowers").name("鲜花").onChange(
      function(){
        scene.remove(geometry);
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('data/');
        mtlLoader.load('flowers.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('data/');
            objLoader.load('flowers.obj', function (geometry) {
            geometry.scale.set(3, 3, 3);
            geometry.position.set(0,0,0);
            geometry.castShadow = true;
            scene.add(geometry);
            })
        });
      }
    );
    sty.add(geometryGui,"porsche").name("跑车").onChange(
      function(){
        scene.remove(geometry);
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('data/');
        mtlLoader.load('porsche.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('data/');
            objLoader.load('porsche.obj', function (geometry) {
            geometry.scale.set(3, 3, 3);
            geometry.position.set(0,0,0);
            geometry.castShadow = true;
            scene.add(geometry);
            })
        });
      }
    );
    sty.add(geometryGui,"rose").name("玫瑰").onChange(
      function(){
        scene.remove(geometry);
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('data/');
        mtlLoader.load('rose+vase.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('data/');
            objLoader.load('rose+vase.obj', function (geometry) {
            geometry.scale.set(3, 3, 3);
            geometry.position.set(0,0,0);
            geometry.castShadow = true;
            scene.add(geometry);
            })
        });
      }
    );
    sty.add(geometryGui,"soccerball").name("足球").onChange(
      function(){
        scene.remove(geometry);
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('data/');
        mtlLoader.load('soccerball.mtl', function (material) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(material);
            objLoader.setPath('data/');
            objLoader.load('soccerball.obj', function (geometry) {
            geometry.scale.set(3, 3, 3);
            geometry.position.set(0,0,0);
            geometry.castShadow = true;
            scene.add(geometry);
            })
        });
      }
    );

    }

    /**
 * 清除模型，模型中有 group 和 scene,需要进行判断
 * @param scene
 * @returns
 */
var myObjects = new Array();;
function clearScene(){
	// 从scene中删除模型并释放内存
	if(myObjects.length > 0){		
		for(var i = 0; i< myObjects.length; i++){
			var currObj = myObjects[i];
			
			// 判断类型
			if(currObj instanceof THREE.Scene){
				var children = currObj.children;
				for(var i = 0; i< children.length; i++){
					deleteGroup(children[i]);
				}	
			}else{				
				deleteGroup(currObj);
			}
			scene.remove(currObj);
		}
	}
}

// 删除group，释放内存
function deleteGroup(group) {
	//console.log(group);
    if (!group) return;
    // 删除掉所有的模型组内的mesh
    group.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.geometry.dispose(); // 删除几何体
            item.material.dispose(); // 删除材质
        }
    });
}


  //添加模型
  var geometry,material;
  var radius=10,tube=3,radialSegments=16,tubularSegments=100,arc=2*PI;
  function initGeometry(){
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
      emissiveIntensity:1,
      lights:true,
      })
    );//材质对象
    geometry.position.set(geometryGui.geometry_pos_x, geometryGui.geometry_pos_y, geometryGui.geometry_pos_z);
    geometry.rotation.set(geometryGui.geometry_rotation_x,geometryGui.geometry_rotation_y,geometryGui.geometry_rotation_z);  
    geometry.castShadow = true;
    scene.add(geometry);
    myObjects[0]=geometry;
  }


  // function initOBJ(){
  //   //   // instantiate a loader
  //   // var loader = new THREE.OBJLoader();
  //   // // load a resource
  //   // loader.load(
  //   // 	// resource URL
  //   // 	'data/f-16.obj',
  //   // 	// called when resource is loaded
  //   // 	function ( object ) {
  //   // 		scene.add( object );
  //   // 	},
  //   // 	// called when loading is in progresses
  //   // 	function ( xhr ) {
  //   // 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  //   // 	},
  //   // 	// called when loading has errors
  //   // 	function ( error ) {
  //   // 		console.log( 'An error happened :'+error );
  //   // 	}
  //   // );

    // var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setPath('data/');
    // //加载mtl文件
    // mtlLoader.load('f-16.mtl', function (material) {
    //     var objLoader = new THREE.OBJLoader();
    //     //设置当前加载的纹理
    //     objLoader.setMaterials(material);
    //     objLoader.setPath('data/');
    //     objLoader.load('f-16.obj', function (object) {

    //         // //获取两个翅膀的位置
    //         // var wing2 = object.children[5];
    //         // var wing1 = object.children[4];

    //         // //设置两个翅膀的透明度
    //         // wing1.material.opacity = 0.6;
    //         // wing1.material.transparent = true;
    //         // wing1.material.depthTest = false;
    //         // wing1.material.side = THREE.DoubleSide;

    //         // wing2.material.opacity = 0.6;
    //         // wing2.material.depthTest = false;
    //         // wing2.material.transparent = true;
    //         // wing2.material.side = THREE.DoubleSide;

    //         //将模型缩放并添加到场景当中
    //         object.scale.set(5, 5, 5);
    //         object.position.set(0,0,0);
    //         scene.add(object);
    //     })
    // });
  // }

  //照相机
  var camera;
  function initCamera(){
    camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1000);
                                          //透视投影(fov,aspect,near,far)
    camera.position.set(50,0,50);

    cameraTwo = new THREE.PerspectiveCamera( 60, 1, 1, 1000 );
		cameraTwo.position.set( 0,0,5 );
  }
  
  //渲染器设置
  var renderer;
  function initRender(){
    renderer=new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor(0x000000,1); //背景色，黑色
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMapEnabled = true; //开启阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);//插入canvas对象
  }
 
  //添加点光源
  var point,pointMat;
  function initPointlight(){
    point = new THREE.PointLight( 0xffffff, 1, 200);//第三个衰减距离
    point.add( new THREE.Mesh(
      new THREE.SphereBufferGeometry( 0.5, 32, 32 ),
      pointMat = new THREE.MeshPhongMaterial( {
        emissive: 0xffffff,
        emissiveIntensity: 1,
      }) 
    ));
    point.position.set( -20, 20, 20 );
    point.receiveShadow=false;
    point.castShadow = true;
    point.shadow.mapSize.width = 2048;
    point.shadow.mapSize.height = 2048;	
    scene.add( point );
  }

  var spot,ambientRed,ambientGreen,ambientBlue;
  function initLight(){
    //添加聚光灯
    spot = new THREE.SpotLight( 0xffffff, 1, 100);
    spot.position.set( 40, 40, 40);
    spot.angle=PI/4;
    spot.penumbra=0;
    spot.decay=0;
    spot.castShadow = true;		
    spot.shadow.mapSize.width = 2048;
    spot.shadow.mapSize.height = 2048;
    scene.add(spot);
    
    //添加环境三色光
    ambientRed=new THREE.AmbientLight( 0xff0000 );
    ambientRed.intensity=0;
    scene.add(ambientRed);
    ambientGreen=new THREE.AmbientLight( 0x00ff00 );
    ambientGreen.intensity=0;
    scene.add(ambientGreen);
    ambientBlue=new THREE.AmbientLight( 0x0000ff );
    ambientBlue.intensity=0;
    scene.add(ambientBlue);
  }

  // //设置渲染函数，执行渲染器
  // function worRender(){
  //   //requestAnimationFrame(worRender);
  //   //controls.update();
  //   renderer.render(scene,camera);
  //   renderer.setSize( window.innerWidth, window.innerHeight );
  // }

  //生成一个前平面一个后平面
  var behindPlaneGeometry,behindPlaneMaterial,behindPlane;
  var frontPlaneGeometry,frontPlaneMaterial,frontPlane;
  function initPlane(){
    //生成一个后平面
    behindPlaneGeometry=new THREE.PlaneGeometry(70,70);
    behindPlaneMaterial=new THREE.MeshLambertMaterial({color:0x3d3d3d});//背面面板深灰
    //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
    behindPlane=new THREE.Mesh(behindPlaneGeometry,behindPlaneMaterial);
    behindPlane.position.x=0;
    behindPlane.position.y=0;
    behindPlane.position.z=-30;
    behindPlane.receiveShadow=true;//平面进行接受阴影
    scene.add(behindPlane);

    //生成一个前平面
    frontPlaneGeometry=new THREE.PlaneGeometry(8,8);
    frontPlaneMaterial=new THREE.MeshPhongMaterial({
      color:0x0033ff,
      opacity:0.5,
      transparent:true
    });//前面面板透明深蓝
    frontPlane=new THREE.Mesh(frontPlaneGeometry,frontPlaneMaterial);
    //plane.rotation.x=-0.5*Math.PI;//将平面沿着x轴进行旋转
    frontPlane.position.x=0;
    frontPlane.position.y=0;
    frontPlane.position.z=25;
    frontPlane.receiveShadow=true;//平面进行接受阴影
    scene.add(frontPlane);
  }

  //添加线
  var lineMaterial;
  var lineOneGeometry,lineOne;
  var lineTwoGeometry,lineTwo;
  var lineThreeGeometry,lineThree;
  var lineFourGeometry,lineFour;
  var lineCenterMaterial,lineCenterGeometry,lineCenter;
  var lineXMaterial,lineXGeometry,lineX;
  var lineYMaterial,lineYGeometry,lineY;
  var lineZMaterial,lineZGeometry,lineZ;
  function initLine(){
    //四条前平面与后平面的连线
    lineMaterial=new THREE.LineBasicMaterial( { color: 0x33ff00 } );

    lineOneGeometry=new THREE.Geometry();
    lineOneGeometry.vertices.push(new THREE.Vector3( 4, 4, 25) );
    lineOneGeometry.vertices.push(new THREE.Vector3(35,35,-30) );
    lineOne = new THREE.Line(lineOneGeometry,lineMaterial);
    scene.add(lineOne);
    
    lineTwoGeometry=new THREE.Geometry();
    lineTwoGeometry.vertices.push(new THREE.Vector3( 4, -4, 25) );
    lineTwoGeometry.vertices.push(new THREE.Vector3(35,-35,-30) );
    lineTwo = new THREE.Line(lineTwoGeometry,lineMaterial);
    scene.add(lineTwo);

    lineThreeGeometry=new THREE.Geometry();
    lineThreeGeometry.vertices.push(new THREE.Vector3( -4, 4, 25) );
    lineThreeGeometry.vertices.push(new THREE.Vector3(-35,35,-30) );
    lineThree = new THREE.Line(lineThreeGeometry,lineMaterial);
    scene.add(lineThree);

    lineFourGeometry=new THREE.Geometry();
    lineFourGeometry.vertices.push(new THREE.Vector3( -4, -4, 25) );
    lineFourGeometry.vertices.push(new THREE.Vector3(-35,-35,-30) );
    lineFour = new THREE.Line(lineFourGeometry,lineMaterial);
    scene.add(lineFour);

    //中心线
    lineCenterMaterial=new THREE.LineBasicMaterial( { color: 0x0000ff } );

    lineCenterGeometry=new THREE.Geometry();
    lineCenterGeometry.vertices.push(new THREE.Vector3( 0, 0,30) );
    lineCenterGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    lineCenter = new THREE.Line(lineCenterGeometry,lineCenterMaterial);
    scene.add(lineCenter);

    lineCenterarrowGeometry=new THREE.Geometry();
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 2, 0, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3(-2, 0, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 2, 0, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0,-2, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0, 2, 3) );
    lineCenterarrowGeometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    lineCenterarrow = new THREE.Line(lineCenterarrowGeometry,lineCenterMaterial);
    scene.add(lineCenterarrow);

    //生成一个坐标轴，辅助线
    lineXMaterial=new THREE.LineBasicMaterial( { color: 0xff0000 } );
    lineXGeometry=new THREE.Geometry();
    lineXGeometry.vertices.push(new THREE.Vector3( 0, 0,30) );
    lineXGeometry.vertices.push(new THREE.Vector3( 7, 0,30) );//中心点
    lineXGeometry.vertices.push(new THREE.Vector3( 6, 1,30) );
    lineXGeometry.vertices.push(new THREE.Vector3( 6,-1,30) );
    lineXGeometry.vertices.push(new THREE.Vector3( 7, 0,30) );//
    lineXGeometry.vertices.push(new THREE.Vector3( 6, 0,29) );
    lineXGeometry.vertices.push(new THREE.Vector3( 6, 0,31) );
    lineXGeometry.vertices.push(new THREE.Vector3( 7, 0,30) );//
    lineX = new THREE.Line(lineXGeometry,lineXMaterial);
    scene.add(lineX);

    lineYMaterial=new THREE.LineBasicMaterial( { color: 0xffff00 } );
    lineYGeometry=new THREE.Geometry();
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 0,30) );
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 7,30) );//中心点
    lineYGeometry.vertices.push(new THREE.Vector3( 1, 6,30) );
    lineYGeometry.vertices.push(new THREE.Vector3(-1, 6,30) );
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 7,30) );//
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 6,29) );
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 6,31) );
    lineYGeometry.vertices.push(new THREE.Vector3( 0, 7,30) );//
    lineY = new THREE.Line(lineYGeometry,lineYMaterial);
    scene.add(lineY);

    lineZMaterial=new THREE.LineBasicMaterial( { color: 0x0000ff } );
    lineZGeometry=new THREE.Geometry();
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 0,30) );
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 0,37) );//中心点
    lineZGeometry.vertices.push(new THREE.Vector3( 1, 0,36) );
    lineZGeometry.vertices.push(new THREE.Vector3(-1, 0,36) );
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 0,37) );//
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 1,36) );
    lineZGeometry.vertices.push(new THREE.Vector3( 0,-1,36) );
    lineZGeometry.vertices.push(new THREE.Vector3( 0, 0,37) );//
    lineZ = new THREE.Line(lineZGeometry,lineZMaterial);
    scene.add(lineZ);
  }

  // //添加光照法线
  // var linelight;
  // function initnormalLine(){
  //   var linelightMaterial=new THREE.LineBasicMaterial( { color: 0xffffff } );
  //   var linelightGeometry=new THREE.Geometry();
  //   linelightGeometry.vertices.push(new THREE.Vector3(  0, 0, 0) );
  //   linelightGeometry.vertices.push(new THREE.Vector3( point.position.x, point.position.y, point.position.z) );
  //   linelight = new THREE.Line(linelightGeometry,linelightMaterial);
  //   scene.add(linelight);
  // }

  //初始化性能插件
  var stats;
  function initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放,轨道控制器OrbitControls
  var controls;
  function initControls(){
    controls=new THREE.OrbitControls(camera);
    window.addEventListener('resize', onWindowResize,false);
    onWindowResize();
    controls.enablePan = true;
  }

  //窗口变动触发的函数
  var insetWidth,insetHeight;
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth , window.innerHeight);

    insetWidth = window.innerHeight / 4; //小窗口
		insetHeight = window.innerHeight / 4;
		cameraTwo.aspect = insetWidth / insetHeight;
	  cameraTwo.updateProjectionMatrix();
  }

  //更新控制器
  function animate(){
    requestAnimationFrame(animate);
    // //更新光照法线
    // scene.remove(linelight);
    scene.remove(lineOne);
    scene.remove(lineTwo);
    scene.remove(lineThree);
    scene.remove(lineFour);
    scene.remove(lineCenter);
    scene.remove(lineCenterarrow);
    scene.remove(lineX);
    scene.remove(lineY);
    scene.remove(lineZ);
    scene.remove(frontPlane);
    scene.remove(behindPlane);
    //initnormalLine();
    initPlane();
    initLine();

    controls.update();
    stats.update();
    //worRender();
    renderer.setClearColor( 0x000000, 0 );
    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    // renderer will set this eventually
    renderer.render( scene, camera );

    renderer.setClearColor( 0x3d3d3d, 1 );//小窗口
		renderer.clearDepth(); // important!
		renderer.setScissorTest( true );
		renderer.setScissor( 20, window.innerHeight - insetHeight - 20, insetWidth, insetHeight );
		renderer.setViewport( 20, window.innerHeight - insetHeight - 20, insetWidth, insetHeight );

		cameraTwo.position.set( 0,0,40 );
		//cameraTwo.quaternion.copy( camera.quaternion );//跟随转动
		//scene.remove(linelight);
    scene.remove(lineOne);
    scene.remove(lineTwo);
    scene.remove(lineThree);
    scene.remove(lineFour);
    scene.remove(lineCenter);
    scene.remove(lineCenterarrow);
    scene.remove(lineX);
    scene.remove(lineY);
    scene.remove(lineZ);
    scene.remove(frontPlane);
    scene.remove(behindPlane);

    renderer.render( scene, cameraTwo );
		renderer.setScissorTest( false );
  }
  initGui();
  initRender();
  initWorScene();
  initCamera();
  initControls();
  initPointlight();
  initLight();
  initGeometry();
  //initOBJ();
  initPlane();
  initLine();
  //initnormalLine();
  initStats();
  animate();
  
  window.onresize = onWindowResize;
}

