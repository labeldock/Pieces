#target photoshop
/* author : HO-JUNG AHN (labeldock@me.com) */
/* license : MIT */
var pieces = "0.9.6.1";
/*
 #usage
 named photoshop folder(layerSet)

 @name                  => name.png
 name[png|jpeg|jpg|gif|svg|ai] => name.[png|jpeg|jpg|gif|svg|ai]
 @name-01 ... && $name  => "executeEqualStyle!"
 {!@}                   => "no render target of all children"
 {help}                 => "only render :help"
 <10x10>                => "out canvas size"
 <10x10>                => "canvas size"
 <:mac_icon>

 #photoshop script simple reference
 1. console.log ()=> $.writeln()
*/

// #######################
// localization string kit

//l10n propertys
var l10nSupported  = ["en_US","ko_KR","ja_JP"];
var l10nLocaleCode = 0;
//l10nLocaleCode Set
for(var i=0,l=l10nSupported.length;i<l;i++) if(app.locale == l10nSupported[i]) l10nLocaleCode = i;
// debug devel selected lang
// l10nLocaleCode = 0;

//locale db
var l10nLocaleData = {
    "error#10":["Worng in '<>' sign.","<> 사인에 문제가 있습니다.","<>の表示に問題があります。"],
	"error#20":["Worng expression.","정규식에 문제가 있습니다.","正規表現に問題があります。"],
	"error#30":["Not found the PSD document.","PSD 파일을 찾을 수 없습니다.","PSDファイルを見つけることができません。"],
	"error#40":["Please save document after execute this script.","파일을 디스크에 저장한 후 다시 시작해주세요.","ファイルをディスクに保存した後、再度実行してください。"],
	"error#50":["Don't analyse in <> of %@.","<> 안에 사이즈 표현식이 올바르지 않음 => @%","<>の中にサイズの式が正しくありません。 => %@"],
	"error#60":["Can't find an extract targets","추출할 대상이 없습니다.","抽出対象がありません。"],
	"error#70":["error :: worng <> sign :: type error ","에러::<>사인을 처리하려 하였으나 type 오류가 있음","エラー::<>サインを処理しようとしたが、typeエラーがあります。"],
	"error#80":["unsupported extention %@","%@은 지원하지 않는 확장자 명입니다.","はサポートしていない拡張子です。"],
	"error#90":["unknown que process => [%@] => %@","알수없는 큐 프로세스가 존재합니다. => [%@] => %@","わからないキュー·プロセスが存在します。 => [%@] => %@"],
	"progress#10-h":["initilize pieces","pieces를 초기화 하는중","piecesの初期化中"],
	"progress#10-d":["read configuration of document","도큐먼트 설정을 읽고 있습니다.","ドキュメントの設定を読んでいます。"],
	"progress#20-d":["Read compleate the document configuration.","도큐먼트 설정을 성공적으로 읽어들였습니다.","ドキュメントの設定を正常に読み込みました。"],
	"progress#30-h":["Analyse document","도큐먼트 레이어셋 분석","ドキュメントのレイヤーセットの分析"],
	"progress#30-d":["Ready to analyse...","분석을 준비합니다...","分析を準備します..."],
	"progress#40-d":["Search for %@","%@ 를 찾는중...","％@を検索中..."],
	"progress#50-d":["Don't Search the %@ layer. becouse this prefix is {!@}.","%@ 레이어는 {!@}가 붙어 하위이름을 검색하지 않습니다.","％@レイヤーは{！@}がついて、サブの名前を検索しません。"],
	"progress#50-t":["Search for fx","fx 스타일 검색","fxスタイル検索"],
	"progress#50-d":["ready for search fx","스타일을 검색을 준비중입니다.","スタイルを検索を準備中です。"],
	"progress#60-d":["apply fx for %@","%@ 의 fx 등록중.","％@のfx登録中。"],
	"progress#70-t":["Make que","큐 생성","キューの作成"],
	"progress#70-d":["Ready for make the que.","큐 생성을 준비하고 있습니다.","キューの作成を準備しています。"],
	"progress#80-d":["progress the %@..","%@ 의 적합성 판정중...","％@の適合性判定中..."],
	"progress#90-d":["progress the %@...","%@ 을 작업내역으로 등록중...","％@をヒストリに登録中..."],
	"progress#100-t":["analyse complete","도큐먼트 분석 완료","ドキュメントの分析を完了"],
	"progress#100-d":["Waiting for next works...","다음 작업 기다리는중...","次の作業を待っています..."],
	"progress#110-d":["hiding the %@..","%@ 을 숨기는 중...","％@を隠す中..."],
	"progress#120-t":["Work of extract directory","출력 디렉토리 작업","出力ディレクトリの操作"],
	"progress#120-d":["touch folder of extracts","출력 폴더 확보중...","出力フォルダの確保中..."],
	"progress#130-t":["layerset extract","레이어셋 추출","レイヤーセットの抽出"],
	"progress#130-d":["ready for extract layerset","레이어셋 추출을 준비하는 중...","レイヤーセットの抽出を準備中..."],
	"progress#140-d":["extract the %@","%@ 을 추출 중","％@を抽出中"],
	"progress#150-t":["Finish!","모든 작업 완료!","すべての作業を完了！"],
	"progress#150-d":["layer extrect working have done","모든 작업이 완료되었습니다.","すべての作業が完了しました。"],
	"messege#10":["do you extract %@ layer? \n\n%@","%@ 개의 파일 추출을 실행하시겠습니까 ? \n\n%@","％@のファイル抽出を実行しますか？ \n\n％@"],
	"messege#20":["size the %@ x %@.\n\nwidth:%@;\nheight:%@;","%@ x %@ 사이즈 입니다.\n\nwidth:%@;\nheight:%@;","%@ x %@ サイズです.\n\nwidth:%@;\nheight:%@;"],
	"messege#30":["Process has been finished!\ndo you want to watch the css info?","모든 작업이 완료 되었습니다. CSS정보를 보시겠습니까?","すべての作業が完了しました。CSSの情報を表示しますか。"],
	"dialog#10":["no layer active","선택되지 않음","未選択"],
	"dialog#20":["%@ doument file","%@ 파일의 작업","％@のファイルの操作"],
	"dialog#30":["All","모두 추출","すべての抽出"],
	"dialog#40":["Selected layerset","선택 레이어 추출","選択レイヤー抽出"],
	"dialog#50":["Inspect size","선택 사이즈 확인","選択レイヤーのサイズを確認"],
	"dialog#60":["Close","닫기","終了する"],
	"dialog#70":["Please use before selected folder","폴더를 선택하신 후 사용해주세요","フォルダを選択して使用してください"]	
}
//l10n method
var l10n = function(code,alt){
    if(code in l10nLocaleData) if(l10nLocaleData[code][l10nLocaleCode].indexOf("%@") > -1) {
		var args = Array.prototype.slice.call(arguments),i=0;
        args.shift();
        var i = 0;
		return l10nLocaleData[code][l10nLocaleCode].replace(/(%@)/g,function(s){ return args[i++]; });
	} else {
		return l10nLocaleData[code][l10nLocaleCode];
	}
	if(alt) return "(i10n/alt/"+code+") => "+alt;
	return "undefined l10n code =>"+code;
}

// localization string kit - end
// #############################

// ##########
// helpr kit

function puts(text) {
       $.writeln (text);
       return text;
}
function traceObject (target, name){
	var description = [];
	name  = name ? "##" + name : "::traceObject";
	for(var key in target) description.push(key + " : " + target[key] );
	alert((name ? name : "description") + "\n\n" + description.join("\n"));
}

function traceArray (target, name){
	var description = [];
	name  = name ? "##" + name : "::traceArray";
	for(var i = 0, l = target.length; i < l; i ++) description.push("["+i+"] : " + target[i]);
	alert("description" + "\n\n" + description.join("\n"));
}

function mvObject (obj){
	var mvobject = {};
	for(var key in obj) mvobject[key] = obj[key];
	return mvobject;
}
// helpr kit -- end
// #################

function fileNameInfo(fileName){
	try {
		var regexp       = /(\$|@|<[\w\:]*>|)([\w$-]+)(@2x|)(\..+|)/i;
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
				alert(l10n("error#10"));
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
		//traceObject({
		//	"fileName"   : fileName
		//},"fileNameInfo::"+l10n("error#20"));
		//alert(e);
		return {error:"error"}
	}
}
var queMakerFilter = {
	extention:function(name){
		//shortcut
		if(/\.p[\w]*$/.test(name)) return "png";
		if(/\.j[\w]*$/.test(name)) return "jpeg";
		if(/\.g[\w]*$/.test(name)) return "gif";
		if(/\.s[\w]*$/.test(name)) return "svg";	
		if(/\.a[\w]*$/.test(name)) return "ai";	
		return /(png|jpg|jpeg|gif|svg|ai)/i.test(name) ? /(png|jpg|jpeg|gif|svg|ai)/i.exec(name)[1] : "png";
	},
	wirteOutBlock:function(baseObject,fileName,pathExtend,outSize){
		var resultInfo = mvObject(baseObject);
		resultInfo.outOfName            = fileName ? fileName : baseInfo.fileName;
		resultInfo.outOfFileExtention   = queMakerFilter.extention(baseObject.fileNameExtention);
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
	globalProgress = new ProgressController(l10n("progress#10-h"),l10n("progress#10-d"),true);
	globalProgress.percent(10);
	try {
		Base.document     = activeDocument;
	} catch (e){
		alert(l10n("error#30"));
		return false;
	}
	Base.documentName = /([^.]+)/.exec(activeDocument.name)[1];
	try {
		Base.documentPath = activeDocument.path + "/";
		Base.piecesPath    = Base.documentPath + Base.documentName + "~/";
	} catch(e){
		alert(l10n("error#40"));
		return false;
	}
	globalProgress.setDescription(l10n("progress#20-d"));
}

var executeScript = function (executeRoot){
	// 레이어 셋트 찾기
	// !@ 하위 레이어들은 검사하지 않습니다.
	globalProgress.setText(l10n("progress#30-t"),l10n("progress#30-d"));
	function getLayerSets(root,basket,layerSetsFilter) {
		if(!root)   root   = Base.document;
		if(!basket) basket = [];
		globalProgress.setDescription(l10n("progress#40-d",root.name));
		if(root.name.indexOf("{!@}") == 0){
			
			globalProgress.setDescription(l10n("progress#50-d",root.name));
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
	globalProgress.setText(l10n("progress#50-t"),l10n("progress#50-d"));

	//fx Que Maker
	Base.fxQue = [];
	globalProgress.each(Base.allLayerSets,function(targetLayerSet){
		var info = fileNameInfo(targetLayerSet.name);
		if(info.functional) if(info.functionalSign == "$") {
			globalProgress.visualProgressing(l10n("progress#60-d",info.fileName));
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
	
	globalProgress.setText(l10n("progress#70-t"),l10n("progress#70-d"));
	function makeQueByLayerSet(layer){
		var result = [];
		var baseInfo = fileNameInfo(layer.name);
	
		// [3] finalResult
		function insertToResult (baseInfo,additionSuffixName,additionPath){
			var ASN   = additionSuffixName ? additionSuffixName : "";
			var APath = additionPath ? additionPath : "";
			if(baseInfo.retinal){
				result.push( queMakerFilter.wirteOutBlock(baseInfo, baseInfo.fileName + ASN + "@2x", APath ? "retina/"  + APath : "retina"       ) );
				result.push( queMakerFilter.wirteOutBlock(baseInfo, baseInfo.fileName + ASN        , APath ? "regular/" + APath : "regular", 0.5 ) );
			} else {
				result.push( queMakerFilter.wirteOutBlock(baseInfo, baseInfo.fileName + ASN, APath ? APath : "") );
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
			case "mac_icon":
				var logoSizes = {
					"_icon_16pt":16,
					"_icon_16pt@2x":32,
					"_icon_32pt":32,
					"_icon_32pt@2x":64,
					"_icon_128pt":128,
					"_icon_128pt@2x":256,
					"_icon_256pt":256,
					"_icon_256pt@2x":512,
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
				alert(l10n("error#50",baseInfo.outOfSizableCaret.option));
				break;
			}
		} else {
			pushBaseInfo(baseInfo);
		}
		return result;
	}
	
	globalProgress.each(Base.allLayerSets,function(targetLayerSet,index,callout){
		callout(l10n("progress#80-d",targetLayerSet.name));
		// makeQueByLayerSet
		// 파일이름에서 작업목록을 불러들임
		globalProgress.each(makeQueByLayerSet(targetLayerSet),function(makedQue){
			callout(l10n("progress#90-d",makedQue.outOfName));
			
			if(makedQue.functional){
				globalProgress.visualProgressing();
				Base.que.push(makedQue);
				confirmQueList.push(makedQue.outOfFileName);
			} 
			
		});
	});

	// 작업큐 확인
	globalProgress.percent(100);
	globalProgress.setText(l10n("progress#100-t"),l10n("progress#100-d"));
	
	//works시작
	if(confirmQueList.length < 1){
		var errText = l10n("error#60");
		globalProgress.setDescription(errText);
		alert(errText);
	} else {
		if(confirm(l10n("messege#10",confirmQueList.length,confirmQueList.join(", ")))) fireWorks();
	}
}

// KIT
var touchNativeFolder = function(path){
	var outFolder = new Folder(path);
	if(!outFolder.exists) outFolder.create();
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

var SaveToAI = function(document,path){
	alert("Not support yet extract artborad to *.ai");
    var saveOption = new ExportOptionsIllustrator();
	saveOption.pathName = document.activeLayer.name;
    saveOption.path = IllustratorPathType.ALLPATHS;
    document.exportDocument(new File(path), ExportType.ILLUSTRATORPATHS, saveOption);
};

var SaveToSVG = function(document,path){
	alert("Not support yet extract artborad to *.svg");
    var saveOption = new ExportOptionsIllustrator();
    saveOption.path = IllustratorPathType.ALLPATHS;
    //saveOption.pathName = document.currentLayer;
    document.exportDocument(new File(path), ExportType.ILLUSTRATORPATHS, saveOption);
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
	
    document.exportDocument(new File(path), ExportType.SAVEFORWEB, saveOption);
};
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
    //
    //
	var documentMargeAndTrim = function(document,workQue){
		switch(workQue){
			case "getSize": break;
			default:
				// {help} 렌더링 무시
				// :help일땐 {help}액션을 무시합니다.
				if("outOfSizableCaret" in workQue) if("option" in workQue.outOfSizableCaret) if(workQue.outOfSizableCaret.option.indexOf("help") !== 0){
					getLayerSets(document,[],function(currentLayerSet){
						if( currentLayerSet.name.indexOf("{help}") == 0 ){
							globalProgress.setDescription(l10n("progress#110-d",currentLayerSet.name));
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
         
		//document.mergeVisibleLayers();
		document.trim(TrimType.TRANSPARENT, true, true, true, true);
		return [document.width,document.height];
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
				alert(l10n("error#70"));
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
			case "jpg": case "jpeg":
				SaveToJPEG(copyDocument,workQue.outOfFileExtractPath);
				break;
			case "gif":
				SaveToGIF(copyDocument,workQue.outOfFileExtractPath);
				break;
			case "ai":
				SaveToAI(copyDocument,workQue.outOfFileExtractPath);
			case "svg":
				SaveToSVG(copyDocument,workQue.outOfFileExtractPath);
                  break;
			default :
				return l10n("error#80",workQue.outOfFileExtention);
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
			alert(l10n("messege#20",copySize[0],copySize[1],((copySize[0]+"").replace(" ","")),((copySize[1]+"").replace(" ",""))));
			break;
		default :
			// 출력할 폴더를 만들어냄
			globalProgress.percent(0);
			
			globalProgress.setText(l10n("progress#120-t"),l10n("progress#120-d"));
			touchNativeFolder(Base.piecesPath);
			globalProgress.percent(1);

			// 파일 출력 준비
			globalProgress.setText(l10n("progress#130-t"),l10n("progress#130-d"));
			var queLength = Base.que.length;
			var queSize = 100 / queLength;

			// 파일 출력
			var worksResult = [];
			globalProgress.each(Base.que,function(workQue,index,callout){
				globalProgress.percent( parseInt(queSize * index) );
				globalProgress.setText("[" + (index + 1) + "/" + queLength + "]", l10n("progress#140-d",workQue.outOfFileName));
				switch(workQue.functionalType){
					case "WriteOut":
						//다른 레이어 내에서 저장 값을 지정 후 종료
						worksResult.push( SaveToImageByQue(Base.document, workQue) );
						break;
					default :
						var errText = l10n("error#90",workQue.outOfFileName,workQue.functionalType);
						callout(errText);
						alert(errText);
						break;
				}
			});
			
			//Finish visual
			globalProgress.percent(100);
			
			globalProgress.setText(l10n("progress#150-t"),l10n("progress#150-d"));
			if(confirm(l10n("messege#30"))){
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


var secondInit = function() {
	var currentActiveLayer       = activeDocument.activeLayer;
	var currentActiveLayerIsSets = currentActiveLayer.typename.toLowerCase() == "layerset" ? true : false ;
	var currentActiveLayerName   = currentActiveLayerIsSets ? activeDocument.activeLayer.name : l10n("dialog#10");

	// first run
	var dialogInfo= "dialog{text:'Script Interface',bounds:[100,100,500,260],"+
	//dialog text
	"text01:StaticText{bounds:[10,10,240,20] , text:'"+l10n("dialog#20",activeDocument.name)+"' ,properties:{scrolling:undefined,multiline:undefined}},"+
	"text02:StaticText{bounds:[10,30,240,20] , text:'"+ currentActiveLayerName + "' ,properties:{scrolling:undefined,multiline:undefined}},"+
	// all
	"procAll:Button{bounds:[205,60,380,110] , text:'"+l10n("dialog#30")+"' },"+
	// selected layerset
	"procSelect:Button{bounds:[10,60,200,85] , text:'"+l10n("dialog#40")+"' },"+
	// inspect size
	"procBound:Button{bounds:[10,90,200,110] , text:'"+l10n("dialog#50")+"' },"+
	// close
	"procExit:Button{bounds:[10,120,380,140] , text:'"+l10n("dialog#60")+"' }"+"};";

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

			alert(l10n("dialog#70"));
			firstWindow.close();
		}
	}
	firstWindow.procExit.onClick = function() { 
		firstWindow.close();
	}
	firstWindow.show();
};

var firstInit = function(){
	
	var firstWindow = new Window('dialog','Pieces');
	firstWindow.orientation = 'column';
	firstWindow.alignChildren = 'fill';
	
	var g,startRowGroup = function(){
		g = firstWindow.add("group");
		g.orientation = 'row';
		g.alignChildren = 'fill';
		return g;
	}
	
	startRowGroup();
	g.add('statictext',undefined,'Actions');
	
	
	//startRowGroup();
	//g.add('statictext',undefined,"Optimization");
	//var psdOpt   = g.add('button',undefined,'Select PSD Directory');
	//psdOpt.onClick = function(){
	//	var selFolder = Folder.selectDialog();
	//	if(selFolder) {
	//		var targetPath = selFolder.fsName.toString();
	//		if(confirm(targetPath+' selected.. countinue?')){
	//			var files = selFolder.getFiles('*.psd');
	//			
	//			for(var i=0,l=files.length;i<l;i++){
	//				open(files[i]);
	//				psdSaveOpt = new PhotoshopSaveOptions();
	//				with(psdSaveOpt){
	//					alphaChannels     = true;
	//					annotations       = true;
	//					embedColorProfile = true;
	//					layers            = true;
	//					spotColors        = true;
	//				}
	//				app.activeDocument.save(psdSaveOpt);
	//				app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	//			};
	//			
	//			firstWindow.close();         
	//			alert("Optimization Finish!");
	//		}
	//	}
	//};
	startRowGroup();
	g.add('statictext',undefined,"File's export");
	var psdToPNG   = g.add('button',undefined,'PSD to PNG');
	var jpegToPNG   = g.add('button',undefined,'JPEG to PNG');
	
	startRowGroup();
	g.add('statictext',undefined,"Inspect");
	var layerSize = g.add('button',undefined,"Active layer Size");
	layerSize.onClick = function(){ fireWorks("activeLayerSize"); firstWindow.close(); }
	
	
	startRowGroup();
	g.add('statictext',undefined,"PSD Pieces");
	var oneAction = g.add('button',undefined,"Sel layer");
	var allAction = g.add('button',undefined,"All layer");
	startRowGroup();
	var closeAction = g.add('button',undefined,'Close');
	
	firstWindow.center();
	
	psdToPNG.onClick = function(){
		var selFolder = Folder.selectDialog();
		if(selFolder) {
			var targetPath = selFolder.fsName.toString();
			if(confirm(targetPath+' selected.. countinue?')){
				var files = selFolder.getFiles('*.psd');
				
				for(var i=0,l=files.length;i<l;i++){
					open(files[i]);
					SaveToPNG( app.activeDocument, files[i] + ".png");
					app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
				};
				
				alert("PSD to PNG Finish!");
				firstWindow.close();         
			}
		}
	};
	jpegToPNG.onClick = function(){
		var selFolder = Folder.selectDialog();
		if(selFolder) {
			var targetPath = selFolder.fsName.toString();
			if(confirm(targetPath+' selected.. countinue?')){
				var files = [];
				files = files.concat( selFolder.getFiles('*.jpg') );
				files = files.concat( selFolder.getFiles('*.jpeg') );
				
				for(var i=0,l=files.length;i<l;i++){
					open(files[i]);
					SaveToPNG( app.activeDocument, files[i] + ".png");
					app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
				};
				
				alert("JPEG to PNG Finish!");
				firstWindow.close();         
				
			}
		}
	};
	
	oneAction.onClick = function(){
		firstWindow.close();
		BaseSetup ();
		executeScript(activeDocument.activeLayer);
	};
	
	allAction.onClick = function(){
		firstWindow.close();
		BaseSetup ();
		executeScript(activeDocument);
	};
	
	closeAction.onClick = function(){
		firstWindow.close();
	};
	
	firstWindow.show();
};

firstInit();

