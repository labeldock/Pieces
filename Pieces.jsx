#target photoshop

/* author : HO-JUNG AHN (labeldock@me.com) */
/* license : MIT */
var pieces = "0.9";

//\
//\ #usage
//\ named photoshop folder(layerSet)
//\
//\ @name                  => name.png
//\ name[png|jpeg|jpg|gif] => name.[png|jpeg|jpg|gif]
//\ @name-01 ... && $name  => "executeEqualStyle!"
//\ {!@}                   => "no render target of all children"
//\ {help}                 => "only render :help"
//\ <10x10>                => "out canvas size"
//\ <10x10>                => "canvas size"

function traceObject (target, name){
	var description = [];
	name  = name ? "##" + name : "::traceObject"
	for(var key in target) description.push(key + " : " + target[key] );
	alert((name ? name : "description") + "\n\n" + description.join("\n"));
}

function traceArray (target, name){
	var description = [];
	name  = name ? "##" + name : "::traceArray"
	for(var i = 0, l = target.length; i < l; i ++) description.push("["+i+"] : " + target[i]);
	alert("description" + "\n\n" + description.join("\n"));
}

function mvObject (obj){
	var mvobject = {};
	for(var key in obj) mvobject[key] = obj[key];
	
	return mvobject;
}

function fileNameInfo(fileName){
	try {
		var regexp       = /(\$|@|<[\w\:]*>|)([\w$-]+)(@2x|)(\..+|)/i ;
		var regexpResult = regexp.exec(fileName);
		
		var result = {
			"original"   : regexpResult[0],
			
			"functional"     : regexpResult[1].length > 0 ? true : false,
			"functionalSign" : regexpResult[1],
			
			"fileName"   : regexpResult[2],
			"retinal"    : regexpResult[3].length > 0 ? true : false,
			"fileNameExtention" : regexpResult[4]
		};
		
		// sizeableCaret
		if(/<[\w\:]*>/i.test(result.functionalSign)){
			
			var currentSign = result.functionalSign.replace(/(^\s*)|(\s*$)/gi, "");
			result.functionalSign = "@";
			result.outOfSizableCaret = {};
			
			var canvasSizeExp = /<(\d+|)(x)(\d+|)(:|)>/i;
			var imageSizeExp = /<(w\d+|)(h\d+|)>/i;
			var extraExp = /<:(\w+)>/i;
			
			if(canvasSizeExp.test(currentSign)){
				result.outOfSizableCaret.type = "canvasSizable";
				var regresult = canvasSizeExp.exec(currentSign);
				if(regresult[1].length > 0) result.outOfSizableCaret.width  = parseInt(regresult[1]);
				if(regresult[3].length > 0) result.outOfSizableCaret.height = parseInt(regresult[3]);
				if(regresult[4].length > 0) result.outOfSizableCaret.option = regresult[5];
			} else if(imageSizeExp.test(currentSign)) {
				result.outOfSizableCaret.type = "imageSizable";
				var regresult = imageSizeExp.exec(currentSign);
				if(regresult[1].length > 0) result.outOfSizableCaret.width  = parseInt(regresult[1]);
				if(regresult[2].length > 0) result.outOfSizableCaret.height = parseInt(regresult[3]);
			} else if(extraExp.test(currentSign)){
				result.outOfSizableCaret.type = "optionalSizable";
				var regresult = extraExp.exec(currentSign);
				if(regresult[1].length > 0) result.outOfSizableCaret.option = regresult[1];
			} else {
				result.outOfSizableCaret.type = "error";
				result.functionalSign = "error";
				alert("<>사인에 문제가 있습니다");
			}
		}
		// fx sets
		if(result.functionalSign == "$"){
			var fxRegexp = /\$([\w\-]+)(\$|)(.+|)/i;
			var fxRegResult = fxRegexp.exec("$" + fileName);
			if(fxRegResult) {
				result.fxName   = fxRegResult[1];
				result.fxSuffix = fxRegResult[3];
			} else {
				result.functional = false;
				result.functionalSign = "";
			}
		}
		return result;
	} catch (e) {
		traceObject({
			"fileName"   : fileName
		},"fileNameInfo:: 다음의 정규식에 문제가 있습니다.");
		alert(e);
		return {error:"error"}
	}
}
var quemakerFilter = {
	extention:function(name){
		return /(png|jpg|jpeg|gif)/i.test(name) ? /(png|jpg|jpeg|gif)/i.exec(name)[1] : "png";
	},
	wirteOutBlock:function(baseObject,fileName,pathExtend,outSize){
		var resultInfo = mvObject(baseObject);
		resultInfo.outOfName            = fileName ? fileName : baseInfo.fileName;
		resultInfo.outOfFileExtention   = quemakerFilter.extention(baseObject.fileNameExtention);
		resultInfo.outOfFileName        = resultInfo.outOfName + "." + resultInfo.outOfFileExtention;
		resultInfo.outOfFilePath        = Base.piecesPath + ( pathExtend ? pathExtend + "/" : "" );
		resultInfo.outOfFileSize        = outSize ? outSize : 1;
		resultInfo.outOfFileExtractPath = resultInfo.outOfFilePath + resultInfo.outOfFileName;
		resultInfo.functionalType = "WriteOut";
		//alert(resultInfo.outOfName + "::" + resultInfo.outOfFilePath);
		return resultInfo;
	}
}

// window controller
function ProgressController (title,description,firstView) {
	var self = this;
	this.progressWindow = new Window("palette{text:'"+ ("pieces v" + pieces) +"',bounds:[0,0,340,120],progress:Progressbar{bounds:[20,20,320,40] , minvalue:0,maxvalue:100,value:0}};");
	this.progressTextOfTitle        = this.progressWindow.add("statictext", [20,50,320,20], "");
	this.progressTextOfDescription  = this.progressWindow.add("statictext", [20,70,320,20], "");
	this.progressTextOfTitle.graphics.font       = ScriptUI.newFont(this.progressWindow.graphics.font.family,"BOLD",12);
	this.progressTextOfDescription.graphics.font = ScriptUI.newFont(this.progressWindow.graphics.font.family,"",10);
	
	//prototype
	this.setTitle = function(value){
		self.progressTextOfTitle.text = value;
	};
	this.setDescription = function(value){
		self.progressTextOfDescription.text = value;
		//딜레이
		self.progressWindow.update();
	};
	this.show = function(){
		self.progressWindow.center();
		self.progressWindow.show();
	};
	this.percent = function(value) {
		self.progressWindow.progress.value = value;
		self.progressWindow.update();
	};
	//프로그래스가 작동하고 있는 모양을 시각적으로 보여 줌
	this.visualProgressing = function(messege) {
		if(self.progressWindow.progress.value > 98) {
			self.progressWindow.progress.value = 74;
		} else {
			self.progressWindow.progress.value = self.progressWindow.progress.value + 3 ;
		}
		if(messege) self.progressTextOfDescription.text = messege;
		self.progressWindow.update();
	};
	this.setText = function (titleText,descriptionText,sleep){
		if(titleText)       self.setTitle(titleText);
		if(descriptionText) self.setDescription(descriptionText,sleep);
	};
	var selfCallout = function(descriptionText){
		if(descriptionText) self.setDescription(descriptionText);
	};
	this.each = function (arrObj,method){
		for(var i = 0, l = arrObj.length; i < l; i++ ) method(arrObj[i],i,selfCallout);
	}
	
	//initilizer
	this.setText(title,description);
	if(firstView == true) this.show();
}

// Base Preference setup
var Base = {};
var globalProgress;
function BaseSetup () {
	globalProgress = new ProgressController("pieces를 초기화 하는중","도큐먼트 설정을 읽고 있습니다.",true);
	globalProgress.percent(10);
	try {
		Base.document     = activeDocument;
	} catch (e){
		alert("활성화된 [activeDocument]가 없습니다");
		return false;
	}
	Base.documentName = /([^.]+)/.exec(activeDocument.name)[1];
	try {
		Base.documentPath = activeDocument.path + "/";
		Base.piecesPath    = Base.documentPath + Base.documentName + "~/";
	} catch(e){
		alert("[activeDocument]를 디스크상에 저장하고 실행해주세요.");
		return false;
	}
	globalProgress.setDescription("도큐먼트 설정을 성공적으로 읽어왔습니다.");
}

var executeScript = function (executeRoot){
	// 레이어 셋트 찾기
	// !@ 하위 레이어들은 검사하지 않습니다.
	globalProgress.setText("도큐먼트 레이어셋 분석","분석으로 준비합니다...");
	function getLayerSets(root,basket,layerSetsFilter) {
		if(!root)   root   = Base.document;
		if(!basket) basket = [];
		globalProgress.setDescription(root.name + "를 바라보는 중...");
		if(root.name.indexOf("{!@}") == 0){
			globalProgress.setDescription(root.name + " => {!@}가 붙은 이름의 하위는 검색하지 않습니다.");
		} else {
			//document Inspect
			var rootIsDocument = root.typename.toLowerCase() == "document" ? true : false ;
		
			//filter
			var filterIsBreakable = false;
			if(rootIsDocument == false && typeof layerSetsFilter == "function") if(layerSetsFilter(root) == false) filterIsBreakable = true ;
		
			//push root
			if(rootIsDocument == false && filterIsBreakable == false){
				basket.push(root);
			}
			//find children
			if(filterIsBreakable == false){
				for (var i = 0, l = root.layerSets.length; i < l; i++) {
					var foundLayerSets = root.layerSets[i];
					getLayerSets(foundLayerSets, basket, layerSetsFilter)
				}
			}
		}
		if (!layerSetsFilter) globalProgress.visualProgressing();
		return basket;
	}
	Base.allLayerSets = getLayerSets(executeRoot);


	// 작업큐를 생성 & 작업큐 확인
	globalProgress.setText("fx 스타일 검색","스타일을 검색을 준비중입니다.");

	//fx Que Maker
	Base.fxQue = [];
	globalProgress.each(Base.allLayerSets,function(targetLayerSet){
		var info = fileNameInfo(targetLayerSet.name);
		if(info.functional) if(info.functionalSign == "$") {
			globalProgress.visualProgressing(info.fileName + " fx 등록중");
			Base.fxQue.push({
				"source" : targetLayerSet,
				"prefix" : info.fxName,
				"suffix" : info.fxSuffix
			});
		}
	});

	//LayerSets Que Maker
	Base.que = [];
	var confirmQueList = [];
	globalProgress.setText("큐 생성","큐 생성을 준비하고 있습니다.");
	function makeQueByLayerSet(layer){
		var result = [];
		var baseInfo = fileNameInfo(layer.name);
	
		// [3] finalResult
		function insertToResult (baseInfo,additionSuffixName,additionPath){
			var ASN = additionSuffixName ? additionSuffixName : "";
			var APath = additionPath ? additionPath : "";
			if(baseInfo.retinal){
				result.push( quemakerFilter.wirteOutBlock(baseInfo, baseInfo.fileName + ASN + "@2x", APath ? "retina/"  + APath : "retina"       ) );
				result.push( quemakerFilter.wirteOutBlock(baseInfo, baseInfo.fileName + ASN        , APath ? "regular/" + APath : "regular", 0.5 ) );
			} else {
				result.push( quemakerFilter.wirteOutBlock(baseInfo, baseInfo.fileName + ASN, APath ? APath : "") );
			}
		}
	
		// [2] pushBaseInfo
		function pushBaseInfo (getBaseInfo,additionSuffixName,additionPath){
			if(getBaseInfo.functional) if(getBaseInfo.functionalSign == "@") {
				getBaseInfo.source = layer;
		
				//fx 타겟 적용
				var fxs = [];
				for(var i = 0, l = Base.fxQue.length; i < l; i++ ) if(getBaseInfo.fileName.indexOf(Base.fxQue[i].prefix) == 0) fxs.push(Base.fxQue[i]);
		
				//fx타겟이 없다면
				if(fxs.length == 0){
					insertToResult(getBaseInfo,additionSuffixName,additionPath);
				} else {
					//fx타겟이 있다면
					for ( var i = 0, l = fxs.length; i < l; i ++ ) {
						var fxObject = mvObject(getBaseInfo);
						fxObject.outOfFxSet = fxs[i].source;
						fxObject.fileName   = fxObject.fileName + fxs[i].suffix;
						insertToResult(fxObject,additionSuffixName,additionPath);
					}
				}
				delete fxs;
			}
		}
	
		// [1] base option progress
		if(baseInfo.outOfSizableCaret && baseInfo.outOfSizableCaret.type == "optionalSizable"){
			switch(baseInfo.outOfSizableCaret.option){
			case "ios_icon":
				var logoSizes = {
					"_icon_itunes":1024,
					"_icon_iphone4":120,
					"_icon_iphone3":60
				};
				for(var key in logoSizes){
					var scObject = mvObject(baseInfo);
					scObject.outOfSizableCaret = mvObject(scObject.outOfSizableCaret);
					scObject.outOfSizableCaret.type    = "fusionSizable";
					scObject.outOfSizableCaret.width   = logoSizes[key];
					scObject.outOfSizableCaret.height  = logoSizes[key];
					pushBaseInfo(scObject,key);
				}
				break;
			case "android_icon":
				var logoSizes = {
					"_icon_xxhdpi":144,
					"_icon_xhdpi":96,
					"_icon_hdpi":72,
					"_icon_mdpi":48
				};
				for(var key in logoSizes){
					var scObject = mvObject(baseInfo);
					scObject.outOfSizableCaret = mvObject(scObject.outOfSizableCaret);
					scObject.outOfSizableCaret.type    = "fusionSizable";
					scObject.outOfSizableCaret.width   = logoSizes[key];
					scObject.outOfSizableCaret.height  = logoSizes[key];
					pushBaseInfo(scObject,key);
				}
				break;
				/*
			case "ios_lounch":
				var frameSize = {
					"_4in@2x":[640,1136],
					"_3in@2x":[640,960],
					"_3in":[320,480]
				};
				for(var key in frameSize){
					var frameWidth  = frameSize[key][0];
					var frameHeight = frameSize[key][1];
					var scObject = mvObject(baseInfo);
					scObject.outOfSizableCaret = mvObject(scObject.outOfSizableCaret);
					scObject.outOfSizableCaret.type = "fusionSizable";
					scObject.outOfSizableCaret.width   = frameWidth;
					scObject.outOfSizableCaret.height  = frameHeight;
					pushBaseInfo(scObject,key);
				}
				break;
				*/
			case "logo": case "wlogo":
				var logoSizes = [1024,512,256];
				for(var i = 0,l = logoSizes.length; i < l; i ++){
					var scObject = mvObject(baseInfo);
					scObject.outOfSizableCaret = mvObject(scObject.outOfSizableCaret);
					scObject.outOfSizableCaret.type = "fusionSizable";
					scObject.outOfSizableCaret.width  = logoSizes[i];
					//wlogo option
					if(baseInfo.outOfSizableCaret.option !== "wlogo") scObject.outOfSizableCaret.height = logoSizes[i];
					pushBaseInfo(scObject,"_"+logoSizes[i]);
				}
				break;
			case "help":
				pushBaseInfo(baseInfo,undefined,"help");
				break;
			default:
				alert("optionalSizable 에러 <>안의 flag가 알수 없음 => " + baseInfo.outOfSizableCaret.option);
				break;
			}
		} else {
			pushBaseInfo(baseInfo);
		}
		return result;
	}
	
	globalProgress.each(Base.allLayerSets,function(targetLayerSet,index,callout){
		callout(targetLayerSet.name  + "적합성 판정중...");
		globalProgress.each(makeQueByLayerSet(targetLayerSet),function(makedQue){
			callout(makedQue.outOfName + "으로 작업 이벤트 등록중...");
			if(makedQue.functional){
				globalProgress.visualProgressing();
				Base.que.push(makedQue);
				confirmQueList.push(makedQue.outOfFileName);
			} 
		});
	});

	// 작업큐 확인
	globalProgress.percent(100);
	globalProgress.setText("도큐먼트 분석 완료","다음 작업 기다리는중...");

	//works시작
	if(confirmQueList.length < 1){
		globalProgress.setDescription("추출할 대상이 없습니다.");
		alert("추출할 대상이 없습니다.");
	} else {
		if(confirm(confirmQueList.length + " 개의 파일 추출을 실행하시겠습니까 ? \n\n" + confirmQueList.join(", "))) fireWorks();
	}
}

//작업시작
var fireWorks = function(specialCommand) {
	//fireWorksMethods
	var duplicateByActiveLayer = function(document, activeLayer){
		//선택함
		var _activeDocument = document;
		var _activeLayer    = activeLayer;
		app.activeDocument             = _activeDocument;
		app.activeDocument.activeLayer = _activeLayer;
		//저레벨 프로세싱
		var actionDescriptor = new ActionDescriptor();
		var actionReference  = new ActionReference();
		actionReference.putClass(charIDToTypeID('Dcmn'));
		actionDescriptor.putReference(charIDToTypeID('null'), actionReference);
		actionDescriptor.putString(charIDToTypeID('Nm  '), _activeLayer.name);
		
		var actionReference_2 = new ActionReference();
		actionReference_2.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        actionDescriptor.putReference(charIDToTypeID('Usng'), actionReference_2);
        executeAction(charIDToTypeID('Mk  '), actionDescriptor, DialogModes.NO);

		return app.activeDocument;
	};
	var documentMargeAndTrim = function(document,workQue){
		switch(workQue){
			case "getSize": break;
			default:
				// {help} 렌더링 무시
				// :help일땐 {help}액션을 무시합니다.
				if("outOfSizableCaret" in workQue) if("option" in workQue.outOfSizableCaret) if(workQue.outOfSizableCaret.option.indexOf("help") !== 0){
					getLayerSets(document,[],function(currentLayerSet){
						if( currentLayerSet.name.indexOf("{help}") == 0 ){
							globalProgress.setDescription(currentLayerSet.name+" 을 가리는 중..");
							currentLayerSet.visible = 0;
							return false;
						} 
						return true;
					});
				}
				break;
		}
		document.changeMode(ChangeMode.RGB);
		preferences.rulerUnits = Units.PIXELS;
		document.mergeVisibleLayers();
		document.trim(TrimType.TRANSPARENT, true, true, true, true);
		return [document.width,document.height];
	};
	var touchNativeFolder = function(path){
		var outFolder = new Folder(path);
		if(!outFolder.exists) outFolder.create();
	};

	function useFX(aDocument, aLayer) {
		aDocument.activeLayer = aLayer;
		var hasLayerStyle = false;
		try {
			var ref = new ActionReference();
			var keyLayerEffects = app.charIDToTypeID( 'Lefx' );
			ref.putProperty( app.charIDToTypeID( 'Prpr' ), keyLayerEffects );
			ref.putEnumerated( app.charIDToTypeID( 'Lyr ' ), app.charIDToTypeID( 'Ordn' ), app.charIDToTypeID( 'Trgt' ) );
			var desc = executeActionGet( ref );
			if ( desc.hasKey( keyLayerEffects ) ) { hasLayerStyle = true; }
		} catch(e) {
			hasLayerStyle = false;
		}
		return hasLayerStyle;
	}
	var copyFXAction = function(aDocument, aLayer) {
		if( useFX(aDocument, aLayer) ){
			executeAction(charIDToTypeID("CpFX"), undefined, DialogModes.ALL);
			return true;
		} else {
			return false;
		}
	};
	var removeFXAction = function(aDocument, aLayer) {
		if( useFX(aDocument, aLayer) ){
			executeAction(charIDToTypeID('dlfx'), undefined, DialogModes.ALL);
		}
	};
	var pasteFXAction = function(aDocument, aLayer) {
	    removeFXAction(aDocument, aLayer);
	    executeAction(charIDToTypeID("PaFX"), undefined, DialogModes.ALL);
	};

	var documentActionByQueOfReferenceDocument = function(document,workQue){
		//fxSet적용
		if(workQue.outOfFxSet){
			for(var i = 0, l = workQue.outOfFxSet.artLayers.length; i < l; i ++ ){
			
				var fxLayer     = workQue.outOfFxSet.artLayers[i];
				var sourceLayer = workQue.source.artLayers[i];
			
			
				if( sourceLayer ){
					if( useFX(document, fxLayer) ){
						copyFXAction(document,  fxLayer);	
						pasteFXAction(document, sourceLayer);
					} else {
						removeFXAction(document, sourceLayer);
					}
				}
			}
		}
	
	}


	var documentActionByQueOfCopyDocument = function(document,workQue){
		
		function canvasResizeHandle(cWidth,cHeight,cOption){
			//불러오기
			var canvasWidth  = cWidth  ? cWidth  : 0;
			var canvasHeight = cHeight ? cHeight : 0;
			var canvasOption = cOption ? cOption : "s" ;
	
			//정리
			if (canvasWidth  < 1) canvasWidth  = document.width ;
			if (canvasHeight < 1) canvasHeight = document.height;
			switch( canvasOption.toLowerCase() ){
				case "q": case "tl": case "topleft":
					canvasOption = AnchorPosition.TOPLEFT;
					break;
				case "w": case "tc": case "topcenter":
					canvasOption = AnchorPosition.TOPCENTER;
					break;
				case "e": case "tr": case "topright":
					canvasOption = AnchorPosition.TOPRIGHT;
					break;
				case "a": case "ml": case "middleleft":
					canvasOption = AnchorPosition.MIDDLELEFT;
					break;
				case "d": case "mr": case "middleright":
					canvasOption = AnchorPosition.MIDDLERIGHT;
					break;
				case "z": case "bl": case "bottomleft":
					canvasOption = AnchorPosition.BOTTOMLEFT;
					break;
				case "x": case "bc": case "bottomcenter":
					canvasOption = AnchorPosition.BOTTOMCENTER;
					break;
				case "c": case "br": case "bottomright":
					canvasOption = AnchorPosition.BOTTOMRIGHT;
					break;
				case "s": case "mc": case "middlecenter":
				default :
					canvasOption = AnchorPosition.MIDDLECENTER;
					break;
			}
			document.resizeCanvas(canvasWidth,canvasHeight,canvasOption);
		}
		
		function imageResizeHandle(fWidth,fHeight,balance){
			if(balance == true){
				if (document.height > document.width) {
				    document.resizeImage(null,UnitValue(fHeight,"px"),null,ResampleMethod.BICUBIC);
				} else {
				    document.resizeImage(UnitValue(fWidth,"px"),null,null,ResampleMethod.BICUBIC);
				}
			} else {
				document.resizeImage(fWidth ? UnitValue(fWidth,"px") : null,fHeight ? UnitValue(fHeight,"px") : null);
			}
		}
		// 캔버스 리사이징
		if(workQue.outOfSizableCaret){
			switch(workQue.outOfSizableCaret.type){
			case "canvasSizable":
				canvasResizeHandle(workQue.outOfSizableCaret.width,workQue.outOfSizableCaret.height,workQue.outOfSizableCaret.option);
				break;
			case "imageSizable":
				imageResizeHandle(workQue.outOfSizableCaret.width,workQue.outOfSizableCaret.height);
				break;
			case "fusionSizable":
				imageResizeHandle(workQue.outOfSizableCaret.width,undefined,true);
				canvasResizeHandle(workQue.outOfSizableCaret.width,workQue.outOfSizableCaret.height,workQue.outOfSizableCaret.option);
				break;
			defalt : 
				alert("에러::<>사인을 처리하려 하였으나 type 오류가 있음");
				break;
			}
		}
		// 파일 리사이징
		if (workQue.outOfFileSize) if (workQue.outOfFileSize != 1){
			// these are our values for the END RESULT width and height (in pixels) of our image
			var fWidth  = document.width * workQue.outOfFileSize;
			var fHeight = document.height * workQue.outOfFileSize;
			imageResizeHandle(fWidth,fHeight,true);
		}
	
	};

	var SaveToPNG = function(document,path){
        var saveOption = new ExportOptionsSaveForWeb();
        saveOption.format = SaveDocumentType.PNG
        saveOption.PNG8 = false;
        saveOption.transparency = true;
        saveOption.interlaced = false;
        saveOption.quality = 100;
        document.exportDocument(new File(path), ExportType.SAVEFORWEB, saveOption);
	};

	var SaveToJPEG = function(document,path){
        var saveOption     = new ExportOptionsSaveForWeb();
        saveOption.format  = SaveDocumentType.JPEG;
        saveOption.quality = 100;
        document.exportDocument(new File(path), ExportType.SAVEFORWEB, saveOption);
	};

	var SaveToGIF = function(document,path){
		var saveOption = new ExportOptionsSaveForWeb();

		saveOption.format = SaveDocumentType.COMPUSERVEGIF;
		saveOption.colorReduction = ColorReductionType.ADAPTIVE;
		saveOption.includeProfile = true;
		saveOption.transparency = true;
		saveOption.lossy = 0;
		saveOption.colors = 256;
		saveOption.dither = Dither.NONE;
		saveOption.palette = Palette.LOCALADAPTIVE;
		saveOption.matteColor = new RGBColor();
		
		//saveOption.ditherAmount = 0;
		//saveOption.dither = Dither.NOISE; 
		//saveOption.palette = Palette.LOCALADAPTIVE;
				
		//saveOption.format = SaveDocumentType.COMPUSERVEGIF;
		//saveOption.colorReduction = ColorReductionType.ADAPTIVE;
		//saveOption.colorReduction = ColorReductionType.SELECTIVE;
		//saveOption.dither = Dither.NONE;
		//saveOption.quality = 100;
		
		//saveOption.matteColor = new RGBColor();
		//saveOption.matteColor.red = 255;
		//saveOption.matteColor.green = 255;
		//saveOption.matteColor.blue = 255;
		
		
        document.exportDocument(new File(path), ExportType.SAVEFORWEB, saveOption);
	
	};

	var SaveToImageByQue = function(document, workQue){
		var resultImageInfo  = {};
		// 큐에서 정의한 액션을 실행한다.
		documentActionByQueOfReferenceDocument(Base.document, workQue);
		// 소스를 새로운 도큐먼트로 옮김
		var copyDocument = duplicateByActiveLayer(document, workQue.source);
		// 새 도큐먼트에서 하위 적합성 판정 및 모든 그림을 결합
		var resultImagebound = documentMargeAndTrim(copyDocument, workQue);
		// 큐에서 정의한 액션을 실행한다.
		documentActionByQueOfCopyDocument(copyDocument, workQue);
		// 새 폴더를 만든다.
		touchNativeFolder(workQue.outOfFilePath);
		// 올바른 이미지 포멧으로 저장
		switch(workQue.outOfFileExtention){
			case "png":
				SaveToPNG(copyDocument,workQue.outOfFileExtractPath);
				break;
			case "jpg":
			case "jpeg":
				SaveToJPEG(copyDocument,workQue.outOfFileExtractPath);
				break;
			case "gif":
				SaveToGIF(copyDocument,workQue.outOfFileExtractPath);
				break;
			default :
				return "지원하지 않는 도큐먼트 확장자입니다";
			break;
		}
		// 새 도큐먼트를 닫는다
		copyDocument.close(SaveOptions.DONOTSAVECHANGES);
		
		resultImageInfo.name     = workQue.outOfName;
		resultImageInfo.fileName = workQue.outOfFileName;
		resultImageInfo.width    = (resultImagebound[0]+"").replace(" ","");
		resultImageInfo.height   = (resultImagebound[1]+"").replace(" ","");
		return resultImageInfo;
	}
	switch(specialCommand){
		case "activeLayerSize":
			var copyDocument = duplicateByActiveLayer(activeDocument, activeDocument.activeLayer);
			var copySize     = documentMargeAndTrim(copyDocument, "getSize");
			copyDocument.close(SaveOptions.DONOTSAVECHANGES);
			alert(copySize[0]+" x "+copySize[1]+ "입니다.\n\nwidth:"+((copySize[0]+"").replace(" ",""))+";\nheight:"+((copySize[1]+"").replace(" ",""))+";");
			break;
		default :
			// 출력할 폴더를 만들어냄
			globalProgress.percent(0);
			globalProgress.setText("출력 디렉토리 프로세스","출력 폴더 확보중...");
			touchNativeFolder(Base.piecesPath);
			globalProgress.percent(1);

			// 파일 출력 준비
			globalProgress.setText("레이어셋 추출","레이어셋 추출을 준비하는 중...");
			var queLength = Base.que.length;
			var queSize = 100 / queLength;

			// 파일 출력
			var worksResult = [];
			globalProgress.each(Base.que,function(workQue,index,callout){
				globalProgress.percent( parseInt(queSize * index) );
				globalProgress.setText("레이어셋 추출 중.. " + "[" + (index + 1) + "/" + queLength + "]", workQue.outOfFileName + "을 추출 중");
				switch(workQue.functionalType){
					case "WriteOut":
						//다른 레이어 내에서 저장 값을 지정 후 종료
						worksResult.push( SaveToImageByQue(Base.document, workQue) );
						break;
					default :
						callout("알수없는 큐 프로세스가 존재합니다. => [" + workQue.outOfFileName + "] =>" + workQue.functionalType);
						alert("알수없는 큐 프로세스가 존재합니다. => [" + workQue.outOfFileName + "] =>" + workQue.functionalType );
						break;
				}
			});
	
			//Finish visual
			globalProgress.percent(100);
			globalProgress.setText("Finish!","모든 작업이 완료되었습니다.");
			if(confirm("Process has been finished!\ndo you want to watch the css info?")){
				var displayResult = [];
				for(var i=0,l=worksResult.length;i<l;i++){
					var wr = worksResult[i];
					displayResult.push( "#"+ wr.name + "{\n\tbackground:url(\"" + wr.fileName + "\");\n\twidth:" + wr.width + ";\n\theight:" + wr.height + ";\n}" );
				}
				alert("/* "+ Base.document.name + " CSS Helper */\n"+ displayResult.join("\n"));
				
			}
			Folder(Base.piecesPath).execute();
			break;
	}
}

var currentActiveLayer       = activeDocument.activeLayer;
var currentActiveLayerIsSets = currentActiveLayer.typename.toLowerCase() == "layerset" ? true : false ;
var currentActiveLayerName   = currentActiveLayerIsSets ? activeDocument.activeLayer.name : "선택되지 않음";
/*
var JDialog = function(title,width,height,uihash,eventhash){
	var uiinfo = [];
	for(key in uihash){
		uiinfo.push(key+":")
	}
	
	
	new Window("dialog{text:'"+title+"',bounds:[" uiinfo.join(",") + "};",title);
};
var JLabel = function(){
	
};
var JText = function(){
	
};
var JButton = function(){
	
};

var winodow = JDialog("title",40,50,{
	"text01":JLabel("Process has been finished!",0,0,20,30),
	"Button01":JButton("Process has been finished!",0,0,20,30)
},{
	"Button01":function(){
		
	}
});
*/
var dialogInfo= "dialog{text:'Script Interface',bounds:[100,100,500,260],"+
"text01:StaticText{bounds:[10,10,240,20] , text:'"+activeDocument.name+"의 작업' ,properties:{scrolling:undefined,multiline:undefined}},"+
"text02:StaticText{bounds:[10,30,240,20] , text:'"+ currentActiveLayerName + "' ,properties:{scrolling:undefined,multiline:undefined}},"+
"procAll:Button{bounds:[205,60,380,110] , text:'all' },"+
"procSelect:Button{bounds:[10,60,200,85] , text:'selected layerset' },"+
"procBound:Button{bounds:[10,90,200,110] , text:'inspect size' },"+
"procExit:Button{bounds:[10,120,380,140] , text:'end' }"+"};";

var firstWindow = new Window(dialogInfo,("pieces v" + pieces));
firstWindow.center();
firstWindow.procAll.onClick = function() { 
	firstWindow.close();
	BaseSetup ();
	executeScript(activeDocument);
}
firstWindow.procSelect.onClick = function() {
	firstWindow.close();
	BaseSetup ();
	executeScript(currentActiveLayer);
}
firstWindow.procBound.onClick = function(){
	if("layerSets" in currentActiveLayer){
		firstWindow.close();
		fireWorks("activeLayerSize");
	} else {
		alert("폴더를 선택하신후 사용해주세요");
		firstWindow.close();
	}
}
firstWindow.procExit.onClick = function() { 
	firstWindow.close();
}
firstWindow.show();